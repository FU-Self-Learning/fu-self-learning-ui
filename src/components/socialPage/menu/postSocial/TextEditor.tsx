"use client"

import { useState, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const TextEditor = () => {
    const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty());
    const [convertedContent, setConvertedContent] = useState<string | null>(null);

    useEffect(() => {
        const html = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(html);
    }, [editorState]);

    function createMarkup(html: string | null) {
        return {
            __html: html ? DOMPurify.sanitize(html) : '',
        };
    }

    return (
        <div className="App">
            <header className="App-header">Rich Text Editor Example</header>
            <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                toolbar={{
                    options: [
                        'inline',
                        'blockType',
                        'fontSize',
                        'fontFamily',
                        'list',
                        'textAlign',
                        'colorPicker',
                        'link',
                        'embedded',
                        'emoji',
                        'image',
                        'remove',
                        'history',
                    ],
                    inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
                    },
                    list: {
                        options: ['unordered', 'ordered', 'indent', 'outdent'],
                    },
                    textAlign: {
                        options: ['left', 'center', 'right', 'justify'],
                    },
                    link: {
                        options: ['link', 'unlink'],
                    },
                    history: {
                        options: ['undo', 'redo'],
                    },
                }}
                hashtag={{
                    separator: ' ',
                    trigger: '#',
                }}
                mention={{
                    separator: ' ',
                    trigger: '@',
                    suggestions: [
                        { text: 'JavaScript', value: 'javascript', url: 'js' },
                        { text: 'Golang', value: 'golang', url: 'go' },
                    ],
                }}
            />
            <div className="preview" dangerouslySetInnerHTML={createMarkup(convertedContent)}></div>
        </div>
    );
};

export default TextEditor;
