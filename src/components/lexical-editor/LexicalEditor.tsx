/* eslint-disable react/no-unknown-property */
// eslint-disable-next-line lines-around-directive
"use client";

import { TRANSFORMERS } from '@lexical/markdown';
import React, { useState, useCallback } from 'react';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { $generateHtmlFromNodes } from '@lexical/html';
import { QuoteNode, HeadingNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';

import { Box, Paper, Divider } from '@mui/material';

import { theme } from './theme';
import { ToolbarPlugin } from './ToolbarPlugin';
import { CustomLinkPlugin } from './LinkPlugin';

// Captures any errors that occur during the editor's lifecycle
function onError(error: Error) {
  console.error(error);
}

// Initial configuration for the editor
const initialConfig = {
  namespace: 'LexicalEditor',
  theme,
  onError,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

interface LexicalEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  readOnly?: boolean;
}

export default function LexicalEditor({
  initialValue = '',
  onChange,
  placeholder = 'Commencez à écrire...',
  minHeight = 300,
  maxHeight = 600,
  readOnly = false,
}: LexicalEditorProps) {
  const [htmlContent, setHtmlContent] = useState(initialValue);

  const handleChange = useCallback((editorState: any, editor: any) => {
    editorState?.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      setHtmlContent(htmlString);
      onChange?.(htmlString);
    });
  }, [onChange]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        elevation={1} 
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          minHeight,
          maxHeight,
        }}
      >
        <style jsx global>{`
          .editor-text-bold {
            font-weight: bold;
          }
          .editor-text-italic {
            font-style: italic;
          }
          .editor-text-underline {
            text-decoration: underline;
          }
          .editor-text-strikethrough {
            text-decoration: line-through;
          }
          .editor-text-underlineStrikethrough {
            text-decoration: underline line-through;
          }
          .editor-text-code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: monospace;
          }
          .editor-list-ol {
            list-style-type: decimal;
            padding-left: 20px;
          }
          .editor-list-ul {
            list-style-type: disc;
            padding-left: 20px;
          }
          .editor-listitem {
            margin: 4px 0;
          }
          .editor-heading-h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.67em 0;
          }
          .editor-heading-h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.75em 0;
          }
          .editor-heading-h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 0.83em 0;
          }
          .editor-heading-h4 {
            font-size: 1em;
            font-weight: bold;
            margin: 1.12em 0;
          }
          .editor-heading-h5 {
            font-size: 0.83em;
            font-weight: bold;
            margin: 1.5em 0;
          }
          .editor-heading-h6 {
            font-size: 0.75em;
            font-weight: bold;
            margin: 1.67em 0;
          }
          .editor-quote {
            border-left: 4px solid #ddd;
            padding-left: 16px;
            margin: 16px 0;
            font-style: italic;
          }
          .editor-code {
            background-color: #f4f4f4;
            padding: 16px;
            border-radius: 4px;
            font-family: monospace;
            white-space: pre;
            overflow-x: auto;
          }
          .editor-link {
            color: #1976d2;
            text-decoration: underline;
            cursor: pointer;
          }
          .editor-link:hover {
            color: #1565c0;
          }
        `}</style>
        <LexicalComposer initialConfig={initialConfig}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', }}>
            <ToolbarPlugin readOnly={readOnly} />
            <Divider />
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    style={{
                      minHeight: minHeight - 60,
                      maxHeight: maxHeight - 60,
                      padding: '16px',
                      outline: 'none',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      position: 'relative',
                    }}
                    placeholder={null}
                  />
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
              />
            </Box>
          </Box>
          
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <CustomLinkPlugin />
          <TabIndentationPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </LexicalComposer>
      </Paper>
    </Box>
  );
}
