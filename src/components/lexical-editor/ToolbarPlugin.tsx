/* eslint-disable arrow-body-style */

"use client";

import type { HeadingTagType } from '@lexical/rich-text';

import React from 'react';
import { $createCodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import { $createQuoteNode, $createHeadingNode } from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { 
  UNDO_COMMAND, 
  REDO_COMMAND, 
  $getSelection,
  $isElementNode,
  $createTextNode,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  SELECTION_CHANGE_COMMAND
} from 'lexical';

import {
  Box,
  Select,
  Tooltip,
  Divider,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Code,
  Link,
  Undo,
  Redo,
  Image,
  Clear,
  FormatBold,
  TableChart,
  FormatQuote,
  FormatItalic,
  HorizontalRule,
  FormatAlignLeft,
  FormatUnderlined,
  FormatAlignRight,
  FormatAlignCenter,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignJustify,
} from '@mui/icons-material';

interface ToolbarPluginProps {
  readOnly?: boolean;
}

const LowPriority = 1;

export function ToolbarPlugin({ readOnly = false }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [blockType, setBlockType] = React.useState('paragraph');

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if (elementDOM.tagName === 'H1') {
          setBlockType('h1');
        } else if (elementDOM.tagName === 'H2') {
          setBlockType('h2');
        } else if (elementDOM.tagName === 'H3') {
          setBlockType('h3');
        } else if (elementDOM.tagName === 'H4') {
          setBlockType('h4');
        } else if (elementDOM.tagName === 'H5') {
          setBlockType('h5');
        } else if (elementDOM.tagName === 'H6') {
          setBlockType('h6');
        } else if (elementDOM.tagName === 'BLOCKQUOTE') {
          setBlockType('quote');
        } else if (elementDOM.tagName === 'PRE') {
          setBlockType('code');
        } else {
          setBlockType('paragraph');
        }
      }
    }
  }, [editor]);

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  React.useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        return false;
      },
      LowPriority,
    );
  }, [editor, updateToolbar]);

  React.useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      LowPriority,
    );
  }, [editor]);

  React.useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      LowPriority,
    );
  }, [editor]);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
  };

  const insertHorizontalRule = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const horizontalRuleNode = $createHorizontalRuleNode();
        selection.insertNodes([horizontalRuleNode]);
      }
    });
  };

  if (readOnly) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        p: 1,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap',
      }}
    >
      {/* Undo/Redo */}
      <Tooltip title="Annuler">
        <IconButton
          size="small"
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        >
          <Undo />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Refaire">
        <IconButton
          size="small"
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        >
          <Redo />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Block Type Selector */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={blockType}
          label="Type"
          onChange={(e) => {
            const value = e.target.value;
            switch (value) {
              case 'paragraph':
                formatParagraph();
                break;
              case 'h1':
                formatHeading('h1');
                break;
              case 'h2':
                formatHeading('h2');
                break;
              case 'h3':
                formatHeading('h3');
                break;
              case 'h4':
                formatHeading('h4');
                break;
              case 'h5':
                formatHeading('h5');
                break;
              case 'h6':
                formatHeading('h6');
                break;
              case 'quote':
                formatQuote();
                break;
              case 'code':
                formatCode();
                break;
              default:
                break;
            }
          }}
        >
          <MenuItem value="paragraph">Paragraphe</MenuItem>
          <MenuItem value="h1">Titre 1</MenuItem>
          <MenuItem value="h2">Titre 2</MenuItem>
          <MenuItem value="h3">Titre 3</MenuItem>
          <MenuItem value="h4">Titre 4</MenuItem>
          <MenuItem value="h5">Titre 5</MenuItem>
          <MenuItem value="h6">Titre 6</MenuItem>
          <MenuItem value="quote">Citation</MenuItem>
          <MenuItem value="code">Code</MenuItem>
        </Select>
      </FormControl>

      <Divider orientation="vertical" flexItem />

      {/* Text Formatting */}
      <Tooltip title="Gras">
        <IconButton
          size="small"
          color={isBold ? 'primary' : 'default'}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}
        >
          <FormatBold />
        </IconButton>
      </Tooltip>

      <Tooltip title="Italique">
        <IconButton
          size="small"
          color={isItalic ? 'primary' : 'default'}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
        >
          <FormatItalic />
        </IconButton>
      </Tooltip>

      <Tooltip title="Souligné">
        <IconButton
          size="small"
          color={isUnderline ? 'primary' : 'default'}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          }}
        >
          <FormatUnderlined />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Lists */}
      <Tooltip title="Liste à puces">
        <IconButton
          size="small"
          onClick={() => {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }}
        >
          <FormatListBulleted />
        </IconButton>
      </Tooltip>

      <Tooltip title="Liste numérotée">
        <IconButton
          size="small"
          onClick={() => {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }}
        >
          <FormatListNumbered />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Alignment */}
      <Tooltip title="Aligner à gauche">
        <IconButton
          size="small"
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.getNodes().forEach(node => {
                  if ($isElementNode(node)) {
                    node.setFormat('left');
                  }
                });
              }
            });
          }}
        >
          <FormatAlignLeft />
        </IconButton>
      </Tooltip>

      <Tooltip title="Centrer">
        <IconButton
          size="small"
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.getNodes().forEach(node => {
                  if ($isElementNode(node)) {
                    node.setFormat('center');
                  }
                });
              }
            });
          }}
        >
          <FormatAlignCenter />
        </IconButton>
      </Tooltip>

      <Tooltip title="Aligner à droite">
        <IconButton
          size="small"
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.getNodes().forEach(node => {
                  if ($isElementNode(node)) {
                    node.setFormat('right');
                  }
                });
              }
            });
          }}
        >
          <FormatAlignRight />
        </IconButton>
      </Tooltip>

      <Tooltip title="Justifier">
        <IconButton
          size="small"
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.getNodes().forEach(node => {
                  if ($isElementNode(node)) {
                    node.setFormat('justify');
                  }
                });
              }
            });
          }}
        >
          <FormatAlignJustify />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Special Elements */}
      <Tooltip title="Citation">
        <IconButton
          size="small"
          onClick={formatQuote}
        >
          <FormatQuote />
        </IconButton>
      </Tooltip>

      <Tooltip title="Code">
        <IconButton
          size="small"
          onClick={formatCode}
        >
          <Code />
        </IconButton>
      </Tooltip>

      <Tooltip title="Ligne horizontale">
        <IconButton
          size="small"
          onClick={insertHorizontalRule}
        >
          <HorizontalRule />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Links and Media */}
      <Tooltip title="Lien">
        <IconButton 
          size="small"
          onClick={() => {
            const url = prompt('Entrez l\'URL du lien:');
            if (url) {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  const selectedText = selection.getTextContent();
                  const linkText = selectedText || url;
                  
                  // Créer un nœud de texte avec le style de lien
                  const linkNode = $createTextNode(linkText);
                  linkNode.setStyle('color: #1976d2; text-decoration: underline; cursor: pointer;');
                  
                  // Remplacer la sélection par le lien
                  selection.removeText();
                  selection.insertNodes([linkNode]);
                }
              });
            }
          }}
        >
          <Link />
        </IconButton>
      </Tooltip>

      <Tooltip title="Supprimer le formatage">
        <IconButton 
          size="small"
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const selectedText = selection.getTextContent();
                if (selectedText) {
                  // Supprimer le formatage et garder seulement le texte
                  const plainTextNode = $createTextNode(selectedText);
                  selection.removeText();
                  selection.insertNodes([plainTextNode]);
                }
              }
            });
          }}
        >
          <Clear />
        </IconButton>
      </Tooltip>

      <Tooltip title="Image">
        <IconButton size="small">
          <Image />
        </IconButton>
      </Tooltip>

      <Tooltip title="Tableau">
        <IconButton size="small">
          <TableChart />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
