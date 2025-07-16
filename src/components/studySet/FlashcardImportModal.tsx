'use client';

import React, { useState } from 'react';
import { Modal, Input, Upload, Button, Tabs, Alert, Typography, message, Space } from 'antd';
import { UploadOutlined, FileTextOutlined, InboxOutlined } from '@ant-design/icons';
import { FlashcardData } from './FlashcardBuilder';

const { TextArea } = Input;
const { Text } = Typography;
const { Dragger } = Upload;

interface FlashcardImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (cards: FlashcardData[]) => void;
}

const FlashcardImportModal: React.FC<FlashcardImportModalProps> = ({ open, onClose, onImport }) => {
  const [importText, setImportText] = useState('');
  const [activeTab, setActiveTab] = useState('text');

  const parseTextToCards = (text: string): FlashcardData[] => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);
    const cards: FlashcardData[] = [];

    // Method 1: Line by line (even lines = front, odd lines = back)
    if (lines.length >= 2) {
      for (let i = 0; i < lines.length - 1; i += 2) {
        if (lines[i] && lines[i + 1]) {
          cards.push({
            id: Date.now().toString() + i,
            front_text: lines[i],
            back_text: lines[i + 1],
            difficulty: 'medium',
          });
        }
      }
    }

    return cards;
  };

  const parseCSVToCards = (csvContent: string): FlashcardData[] => {
    const lines = csvContent.split('\n').filter((line) => line.trim());
    const cards: FlashcardData[] = [];

    lines.forEach((line, index) => {
      // Skip header row if it exists
      if (
        index === 0 &&
        (line.toLowerCase().includes('front') || line.toLowerCase().includes('question'))
      ) {
        return;
      }

      const columns = line.split(',').map((col) => col.trim().replace(/^"|"$/g, ''));

      if (columns.length >= 2 && columns[0] && columns[1]) {
        cards.push({
          id: Date.now().toString() + index,
          front_text: columns[0],
          back_text: columns[1],
          difficulty: (columns[2] as any) || 'medium',
        });
      }
    });

    return cards;
  };

  const handleTextImport = () => {
    if (!importText.trim()) {
      message.error('Please enter some text to import');
      return;
    }

    const cards = parseTextToCards(importText);

    if (cards.length === 0) {
      message.error('No valid flashcards found. Please check your format.');
      return;
    }

    onImport(cards);
    message.success(`Successfully imported ${cards.length} flashcards`);
    setImportText('');
    onClose();
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      let cards: FlashcardData[] = [];

      if (file.name.endsWith('.csv')) {
        cards = parseCSVToCards(content);
      } else {
        cards = parseTextToCards(content);
      }

      if (cards.length === 0) {
        message.error('No valid flashcards found in the file');
        return;
      }

      onImport(cards);
      message.success(`Successfully imported ${cards.length} flashcards from ${file.name}`);
      onClose();
    };

    reader.readAsText(file);
    return false; // Prevent upload
  };

  const exampleText = `What is React?
A JavaScript library for building user interfaces

What is TypeScript?
A typed superset of JavaScript

What is Node.js?
A JavaScript runtime built on Chrome's V8 JavaScript engine`;

  const exampleCSV = `Front,Back,Difficulty
What is React?,A JavaScript library for building UIs,easy
What is TypeScript?,A typed superset of JavaScript,medium
What is Node.js?,A JavaScript runtime environment,medium`;

  const tabItems = [
    {
      key: 'text',
      label: (
        <span>
          <FileTextOutlined />
          Text Import
        </span>
      ),
      children: (
        <div className='space-y-4'>
          <Alert
            message='Text Import Format'
            description={
              <div>
                <p>Enter your flashcards in the following format:</p>
                <ul className='list-disc ml-4 mt-2'>
                  <li>Each line should contain either a front or back of a card</li>
                  <li>Alternate between front text (question) and back text (answer)</li>
                  <li>Leave empty lines to separate card pairs</li>
                </ul>
              </div>
            }
            type='info'
            showIcon
            className='mb-4'
          />

          <div>
            <Text strong>Example:</Text>
            <pre className='bg-gray-50 p-3 rounded mt-2 text-sm whitespace-pre-wrap'>
              {exampleText}
            </pre>
          </div>

          <div>
            <Text strong>Your Content:</Text>
            <TextArea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Paste your flashcard content here...'
              rows={10}
              className='mt-2'
            />
          </div>

          <div className='flex justify-between items-center'>
            <Text type='secondary'>
              {importText ? `${parseTextToCards(importText).length} cards detected` : 'No content'}
            </Text>
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button type='primary' onClick={handleTextImport}>
                Import Cards
              </Button>
            </Space>
          </div>
        </div>
      ),
    },
    {
      key: 'file',
      label: (
        <span>
          <UploadOutlined />
          File Import
        </span>
      ),
      children: (
        <div className='space-y-4'>
          <Alert
            message='File Import Formats'
            description={
              <div>
                <p>Supported file formats:</p>
                <ul className='list-disc ml-4 mt-2'>
                  <li>
                    <strong>CSV files:</strong> Front,Back,Difficulty (optional)
                  </li>
                  <li>
                    <strong>Text files:</strong> Same format as text import
                  </li>
                </ul>
              </div>
            }
            type='info'
            showIcon
            className='mb-4'
          />

          <div>
            <Text strong>CSV Example:</Text>
            <pre className='bg-gray-50 p-3 rounded mt-2 text-sm'>{exampleCSV}</pre>
          </div>

          <Dragger
            accept='.txt,.csv'
            beforeUpload={handleFileUpload}
            showUploadList={false}
            className='mb-4'
          >
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
            <p className='ant-upload-hint'>
              Support for .txt and .csv files. The file will be processed immediately.
            </p>
          </Dragger>

          <div className='flex justify-end'>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title='Import Flashcards'
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </Modal>
  );
};

export default FlashcardImportModal;
