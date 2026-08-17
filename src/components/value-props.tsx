import Image from 'next/image'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from 'lexical'

import { Icon } from '@/components/icons'
import { BodyRichText } from '@/components/rich-text'
import { Eyebrow, SectionTitle } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

type RichTextValue = DefaultTypedEditorState | SerializedEditorState | null | undefined

type ValuePropItem = {
  id?: string | null
  marker?: string | null
  title: string
  body?: RichTextValue
}

export type ValuePropsProps = {
  eyebrow?: string | null
  title?: string | null
  body?: RichTextValue
  image?: (string | Media) | null
  items?: ValuePropItem[] | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

function ImageFrame({ image }: { image: ValuePropsProps['image'] }) {
  // depth 0 leaves a bare id, which carries no url to render from — the
  // placeholder is the honest result in that case, not a broken <img>.
  const media = image && typeof image === 'object' ? image : null

  if (media?.url) {
    return (
      <div className="relative mt-8 aspect-[4/3] overflow-hidden hairline bg-graphite-800">
        <Image
          src={media.url}
          alt={media.alt ?? ''}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className="relative mt-8 grid aspect-[4/3] place-items-center hairline bg-graphite-800 text-center">
      <div className="flex flex-col items-center gap-3 px-6">
        <Icon name="image" className="size-8 text-steel-300" />
        <span className="text-[11px] uppercase tracking-[0.18em] text-steel-300">
          Image placeholder
        </span>
      </div>
    </div>
  )
}

export function ValueProps({
  eyebrow,
  title,
  body,
  image,
  items,
  background,
  topDivider,
  joinPrevious,
}: ValuePropsProps) {
  const rows = items ?? []

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          <SectionTitle>{title}</SectionTitle>
          <BodyRichText data={body} className="mt-6 max-w-md" />
          <ImageFrame image={image} />
        </div>

        {rows.length > 0 && (
          <div className="lg:col-span-7 lg:pt-2">
            <ul className="flex flex-col">
              {rows.map((item, index) => (
                <li
                  key={item.id ?? index}
                  className={cn(
                    'group flex gap-6 hairline-t px-1 py-7 transition-colors hover:bg-graphite-800/40',
                    // Only the last row closes the stack — every other row's
                    // bottom edge is the next row's top hairline.
                    index === rows.length - 1 && 'hairline-b',
                  )}
                >
                  {/* Rendered even when blank so rows stay aligned on the
                      same 4rem gutter. */}
                  <span className="w-16 shrink-0 font-display text-4xl font-extrabold leading-none text-ember">
                    {item.marker}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-steel-50">
                      {item.title}
                    </h3>
                    <BodyRichText data={item.body} className="mt-2 max-w-xl" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionShell>
  )
}
