/* eslint-disable consistent-return */
// eslint-disable-next-line lines-around-directive
"use client";

import { useEffect } from 'react';
import { $getSelection, $createTextNode, $isRangeSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function CustomLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.hasAttribute('data-url')) {
        event.preventDefault();
        const url = target.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank');
        }
      }
    };

    const rootElement = editor.getRootElement();
    if (rootElement) {
      rootElement.addEventListener('click', handleClick);
      return () => {
        rootElement.removeEventListener('click', handleClick);
      };
    }
  }, [editor]);

  return null;
}

export function insertLink(editor: any, url: string, text?: string) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const linkText = text || url;
      const linkNode = $createTextNode(linkText);
      linkNode.setStyle('color: #1976d2; text-decoration: underline; cursor: pointer;');
      
      selection.removeText();
      selection.insertNodes([linkNode]);
    }
  });
}
