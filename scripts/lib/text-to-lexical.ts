type LexicalTextNode = {
  type: 'text'
  format: number
  style: ''
  mode: 'normal'
  text: string
  detail: 0
  version: 1
}

type LexicalParagraphNode = {
  type: 'paragraph'
  format: ''
  indent: 0
  version: 1
  direction: 'ltr'
  textFormat: number
  textStyle: ''
  children: LexicalTextNode[]
}

type LexicalListItemNode = {
  type: 'listitem'
  format: ''
  indent: 0
  version: 1
  direction: 'ltr'
  value: number
  checked: undefined
  children: LexicalTextNode[]
}

type LexicalListNode = {
  type: 'list'
  format: ''
  indent: 0
  version: 1
  direction: 'ltr'
  listType: 'bullet'
  start: 1
  tag: 'ul'
  children: LexicalListItemNode[]
}

export type LexicalDocument = {
  root: {
    type: 'root'
    format: ''
    indent: 0
    version: 1
    direction: 'ltr'
    children: (LexicalParagraphNode | LexicalListNode)[]
  }
}

function textNode(text: string): LexicalTextNode {
  return { type: 'text', format: 0, style: '', mode: 'normal', text, detail: 0, version: 1 }
}

function paragraph(text: string): LexicalParagraphNode {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    textFormat: 0,
    textStyle: '',
    children: [textNode(text)],
  }
}

function bulletList(items: string[]): LexicalListNode {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    children: items.map((item, index) => ({
      type: 'listitem',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      value: index + 1,
      checked: undefined,
      children: [textNode(item)],
    })),
  }
}

function document(children: (LexicalParagraphNode | LexicalListNode)[]): LexicalDocument {
  return {
    root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
  }
}

/**
 * Plain text → Lexical. Blank lines separate paragraphs; a run of lines
 * starting with "- " becomes a bullet list.
 *
 * Rich text fields reject a plain string, so every seeded prose value has to
 * go through here.
 */
export function textToLexical(text: string): LexicalDocument {
  const chunks = text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  return document(
    chunks.map((chunk) => {
      const lines = chunk.split('\n').map((line) => line.trim())
      if (lines.every((line) => line.startsWith('- '))) {
        return bulletList(lines.map((line) => line.slice(2).trim()))
      }
      // A single newline inside a paragraph is a soft wrap in the source, not
      // a line break — join rather than cramming "\n" into a text node.
      return paragraph(lines.join(' '))
    }),
  )
}
