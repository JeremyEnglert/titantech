import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from 'lexical'
import { JSXConvertersFunction, LinkJSXConverter, RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { Page, Post } from '@/payload-types'
import { Hero } from '@/components/hero'
import { cn } from '@/lib/utils'

type HeroBlockType = Extract<NonNullable<Page['content']>[number], { blockType: 'hero' }>

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<HeroBlockType>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    hero: ({ node }) => {
      const { subtitle, buttons, ...rest } = node.fields;
      
      // Transform buttons to match the expected type
      const transformedButtons = buttons?.map(button => ({
        label: button.label,
        link: button.link,
        variant: (button.variant || 'default') as 'default' | 'secondary' | 'outline'
      }));
      
      // Wrap in a div that resets prose styles
      return (
        <div className="not-prose">
          <Hero
            disableInnerContainer
            {...rest}
            subtitle={subtitle || undefined}
            buttons={transformedButtons}
          />
        </div>
      );
    },
  },
})

type Props = {
  data: DefaultTypedEditorState | SerializedEditorState | Post['content']
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      data={data as SerializedEditorState}
      className={cn(
        'payload-richtext',
        {
          'container mx-auto px-4 md:px-6': enableGutter,
          'max-w-none': !enableGutter,
          'prose lg:prose-lg dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
