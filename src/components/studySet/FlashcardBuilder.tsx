'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  Tag,
  Tooltip,
  Dropdown,
  message,
  Empty,
  Alert,
  Progress,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  BulbOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  FileTextOutlined,
  ImportOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import FlashcardImportModal from './FlashcardImportModal';
import { useStudySet } from '@/hooks/study-set/useStudySet';

const { TextArea } = Input;
const { Title, Text } = Typography;

export interface FlashcardData {
  id: string;
  front_text: string;
  back_text: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  notes?: string;
}

interface FlashcardBuilderProps {
  studySetId?: number;
  initialCards?: FlashcardData[];
  onSave?: (cards: FlashcardData[]) => void;
  onPreview?: (cards: FlashcardData[]) => void;
  autoSave?: boolean;
}

const FlashcardBuilder: React.FC<FlashcardBuilderProps> = ({
  studySetId,
  initialCards = [],
  onSave,
  onPreview,
  autoSave = true,
}) => {
  const { data: studySet } = useStudySet(studySetId as number);

  const [cards, setCards] = useState<FlashcardData[]>(
    initialCards.length > 0 ? initialCards : [{ id: '1', front_text: '', back_text: '' }],
  );
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [history, setHistory] = useState<FlashcardData[][]>([cards]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (studySet) {
      setCards(studySet.flashcards);
    }
  }, [studySet]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && cards.length > 0) {
      const timer = setTimeout(() => {}, 2000);
      return () => clearTimeout(timer);
    }
  }, [cards, autoSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            addNewCard();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'd':
            e.preventDefault();
            duplicateSelected();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCards]);

  const saveToHistory = (newCards: FlashcardData[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newCards]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCards([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCards([...history[historyIndex + 1]]);
    }
  };

  const addNewCard = (position?: number) => {
    const newCard: FlashcardData = {
      id: Date.now().toString(),
      front_text: '',
      back_text: '',
      difficulty: 'medium',
    };

    const newCards = [...cards];
    if (position !== undefined) {
      newCards.splice(position + 1, 0, newCard);
    } else {
      newCards.push(newCard);
    }

    setCards(newCards);
    saveToHistory(newCards);

    // Focus on the new card
    setTimeout(() => {
      const cardElement = cardRefs.current[newCard.id];
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const updateCard = (id: string, field: keyof FlashcardData, value: any) => {
    const newCards = cards.map((card) => (card.id === id ? { ...card, [field]: value } : card));
    setCards(newCards);
  };

  const deleteCard = (id: string) => {
    if (cards.length === 1) {
      message.warning('You need at least one flashcard');
      return;
    }
    const newCards = cards.filter((card) => card.id !== id);
    setCards(newCards);
    saveToHistory(newCards);
    setSelectedCards(selectedCards.filter((cardId) => cardId !== id));
  };

  const duplicateCard = (id: string) => {
    const cardToDuplicate = cards.find((card) => card.id === id);
    if (!cardToDuplicate) return;

    const newCard: FlashcardData = {
      ...cardToDuplicate,
      id: Date.now().toString(),
    };

    const cardIndex = cards.findIndex((card) => card.id === id);
    const newCards = [...cards];
    newCards.splice(cardIndex + 1, 0, newCard);

    setCards(newCards);
    saveToHistory(newCards);
  };

  const duplicateSelected = () => {
    if (selectedCards.length === 0) return;

    const cardsToAdd: FlashcardData[] = [];
    selectedCards.forEach((cardId) => {
      const card = cards.find((c) => c.id === cardId);
      if (card) {
        cardsToAdd.push({
          ...card,
          id: Date.now().toString() + Math.random(),
        });
      }
    });

    const newCards = [...cards, ...cardsToAdd];
    setCards(newCards);
    saveToHistory(newCards);
    message.success(`Duplicated ${cardsToAdd.length} cards`);
  };

  const deleteSelected = () => {
    if (selectedCards.length === 0) return;
    if (cards.length - selectedCards.length < 1) {
      message.warning('You need at least one flashcard');
      return;
    }

    const newCards = cards.filter((card) => !selectedCards.includes(card.id));
    setCards(newCards);
    saveToHistory(newCards);
    setSelectedCards([]);
    message.success(`Deleted ${selectedCards.length} cards`);
  };

  const toggleCardSelection = (id: string) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id],
    );
  };

  const selectAllCards = () => {
    setSelectedCards(cards.map((card) => card.id));
  };

  const clearSelection = () => {
    setSelectedCards([]);
  };

  const handleSave = () => {
    const validCards = cards.filter((card) => card.front_text.trim() && card.back_text.trim());

    if (validCards.length === 0) {
      message.error('Please add at least one card with both front and back text');
      return;
    }

    onSave?.(validCards);
  };

  const handlePreview = () => {
    const validCards = cards.filter((card) => card.front_text.trim() && card.back_text.trim());

    if (validCards.length === 0) {
      message.error('Please add at least one valid card to preview');
      return;
    }

    onPreview?.(validCards);
  };

  const handleImport = (importedCards: FlashcardData[]) => {
    if (importedCards.length > 0) {
      const newCards = [...cards, ...importedCards];
      setCards(newCards);
      saveToHistory(newCards);
      message.success(`Imported ${importedCards.length} cards`);
    }
  };

  const exportToText = () => {
    const text = cards
      .filter((card) => card.front_text.trim() && card.back_text.trim())
      .map((card) => `${card.front_text}\n${card.back_text}`)
      .join('\n\n');

    navigator.clipboard.writeText(text);
    message.success('Cards exported to clipboard');
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      !searchTerm ||
      card.front_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back_text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const validCards = cards.filter((card) => card.front_text.trim() && card.back_text.trim());

  const bulkActions = [
    {
      key: 'duplicate',
      label: 'Duplicate Selected',
      icon: <CopyOutlined />,
      onClick: duplicateSelected,
      disabled: selectedCards.length === 0,
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: <DeleteOutlined />,
      onClick: deleteSelected,
      disabled: selectedCards.length === 0,
      danger: true,
    },
    {
      key: 'select-all',
      label: 'Select All',
      icon: <CheckOutlined />,
      onClick: selectAllCards,
    },
    {
      key: 'clear-selection',
      label: 'Clear Selection',
      icon: <CloseOutlined />,
      onClick: clearSelection,
      disabled: selectedCards.length === 0,
    },
  ];

  const toolbarActions = [
    {
      key: 'import',
      label: 'Import Cards',
      icon: <ImportOutlined />,
      onClick: () => setShowImportModal(true),
    },
    {
      key: 'export',
      label: 'Export',
      icon: <ExportOutlined />,
      onClick: exportToText,
    },
    {
      key: 'templates',
      label: 'Templates',
      icon: <FileTextOutlined />,
      onClick: () => {
        // Show templates modal
      },
    },
  ];

  return (
    <div className='flashcard-builder space-y-6'>
      {/* Header */}
      <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm'>
        <div className='flex items-center justify-between'>
          <div>
            <Title level={4} className='mb-2 text-gray-800'>
              Flashcard Builder
            </Title>
            <div className='flex items-center gap-4 text-sm text-gray-600'>
              <span>Total: {cards.length} cards</span>
              <span>Valid: {validCards.length} cards</span>
              <span>Selected: {selectedCards.length} cards</span>
            </div>
            <Progress
              percent={Math.round((validCards.length / cards.length) * 100)}
              size='small'
              className='mt-2 max-w-xs'
              strokeColor='#3b82f6'
            />
          </div>

          <Space>
            <Tooltip title='Undo (Ctrl+Z)'>
              <Button icon={<UndoOutlined />} onClick={undo} disabled={historyIndex === 0} />
            </Tooltip>
            <Tooltip title='Redo (Ctrl+Shift+Z)'>
              <Button
                icon={<RedoOutlined />}
                onClick={redo}
                disabled={historyIndex === history.length - 1}
              />
            </Tooltip>
            <Divider type='vertical' />
            <Button
              icon={<EyeOutlined />}
              onClick={handlePreview}
              disabled={validCards.length === 0}
            >
              Preview
            </Button>
            <Button
              type='primary'
              icon={<SaveOutlined />}
              onClick={handleSave}
              disabled={validCards.length === 0}
            >
              Save Cards
            </Button>
          </Space>
        </div>
      </Card>

      {/* Toolbar */}
      <Card size='small'>
        <div className='flex items-center justify-between'>
          <Space>
            <Input
              placeholder='Search cards...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
          </Space>

          <Space>
            <Switch
              checked={bulkMode}
              onChange={setBulkMode}
              checkedChildren='Bulk'
              unCheckedChildren='Single'
            />

            {bulkMode && (
              <Dropdown menu={{ items: bulkActions }} trigger={['click']}>
                <Button icon={<BulbOutlined />}>Bulk Actions</Button>
              </Dropdown>
            )}

            <Dropdown menu={{ items: toolbarActions }} trigger={['click']}>
              <Button icon={<MoreOutlined />}>Tools</Button>
            </Dropdown>

            <Button type='primary' icon={<PlusOutlined />} onClick={() => addNewCard()}>
              Add Card
            </Button>
          </Space>
        </div>
      </Card>

      {/* Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
        <AnimatePresence>
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              ref={(el) => {
                cardRefs.current[card.id] = el;
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`relative ${selectedCards.includes(card.id) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <Card
                size='small'
                className={`h-full transition-all duration-200 hover:shadow-md ${
                  editingCard === card.id ? 'border-blue-500 shadow-md' : ''
                }`}
                title={
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>Card {index + 1}</span>
                    <Space size='small'>
                      {bulkMode && (
                        <input
                          type='checkbox'
                          checked={selectedCards.includes(card.id)}
                          onChange={() => toggleCardSelection(card.id)}
                          className='rounded'
                        />
                      )}
                    </Space>
                  </div>
                }
                extra={
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'edit',
                          label: 'Edit',
                          icon: <EditOutlined />,
                          onClick: () => setEditingCard(card.id),
                        },
                        {
                          key: 'duplicate',
                          label: 'Duplicate',
                          icon: <CopyOutlined />,
                          onClick: () => duplicateCard(card.id),
                        },
                        {
                          key: 'add-after',
                          label: 'Add After',
                          icon: <PlusOutlined />,
                          onClick: () => addNewCard(index),
                        },
                        {
                          type: 'divider',
                        },
                        {
                          key: 'delete',
                          label: 'Delete',
                          icon: <DeleteOutlined />,
                          danger: true,
                          onClick: () => deleteCard(card.id),
                        },
                      ],
                    }}
                    trigger={['click']}
                  >
                    <Button type='text' size='small' icon={<MoreOutlined />} />
                  </Dropdown>
                }
              >
                <div className='space-y-3'>
                  {/* Front */}
                  <div>
                    <Text strong className='text-xs text-gray-500 uppercase tracking-wide'>
                      Front
                    </Text>
                    <TextArea
                      value={card.front_text}
                      onChange={(e) => updateCard(card.id, 'front_text', e.target.value)}
                      placeholder='Enter term or question...'
                      autoSize={{ minRows: 2, maxRows: 4 }}
                      className='mt-1'
                      onFocus={() => setEditingCard(card.id)}
                      onBlur={() => setEditingCard(null)}
                    />
                  </div>

                  {/* Back */}
                  <div>
                    <Text strong className='text-xs text-gray-500 uppercase tracking-wide'>
                      Back
                    </Text>
                    <TextArea
                      value={card.back_text}
                      onChange={(e) => updateCard(card.id, 'back_text', e.target.value)}
                      placeholder='Enter definition or answer...'
                      autoSize={{ minRows: 2, maxRows: 4 }}
                      className='mt-1'
                      onFocus={() => setEditingCard(card.id)}
                      onBlur={() => setEditingCard(null)}
                    />
                  </div>

                  {/* Validation indicator */}
                  <div className='flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-2'>
                      {card.front_text.trim() && card.back_text.trim() ? (
                        <Tag color='green' className='text-xs'>
                          Complete
                        </Tag>
                      ) : (
                        <Tag color='orange' className='text-xs'>
                          Incomplete
                        </Tag>
                      )}
                    </div>
                    <Text type='secondary'>
                      {card.front_text.length + card.back_text.length} chars
                    </Text>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredCards.length === 0 && (
        <Card className='text-center py-12'>
          <Empty description='No cards found' image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => addNewCard()}>
              Add Your First Card
            </Button>
          </Empty>
        </Card>
      )}

      {/* Quick tips */}
      <Alert
        message='Quick Tips'
        description={
          <div className='text-sm space-y-1'>
            <div>
              • Press <kbd className='px-1 py-0.5 bg-gray-200 rounded text-xs'>Ctrl+N</kbd> to add a
              new card
            </div>
            <div>
              • Press <kbd className='px-1 py-0.5 bg-gray-200 rounded text-xs'>Ctrl+S</kbd> to save
              your cards
            </div>
            <div>
              • Press <kbd className='px-1 py-0.5 bg-gray-200 rounded text-xs'>Ctrl+D</kbd> to
              duplicate selected cards
            </div>
            <div>• Use bulk mode to select and manage multiple cards at once</div>
          </div>
        }
        type='info'
        showIcon
        closable
      />

      {/* Import Modal */}
      <FlashcardImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />
    </div>
  );
};

export default FlashcardBuilder;
