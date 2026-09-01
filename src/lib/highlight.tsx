/**
 * Copy in `src/data/portfolio.ts` can wrap any phrase in asterisks to paint
 * it in the accent colour, e.g. "built *real-time sync engines* that hold up".
 */

const SEGMENT = /(\*[^*]+\*)/g

const isMarked = (part: string) => part.startsWith('*') && part.endsWith('*')

/**
 * Splits copy into whole words, remembering which ones sat inside a marker.
 * Splitting on whitespace first (rather than on the markers) keeps trailing
 * punctuation attached to its word, which matters because the About section
 * lays every word out as its own inline-block.
 */
export function tokenizeWords(text: string): { word: string; accent: boolean }[] {
  let open = false
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      let accent: boolean | null = null
      let word = ''
      for (const char of raw) {
        if (char === '*') {
          open = !open
          continue
        }
        accent ??= open
        word += char
      }
      return { word, accent: accent ?? open }
    })
    .filter(({ word }) => word.length > 0)
}

/** Renders copy inline, accenting the marked phrases. */
export function Highlight({ text }: { text: string }) {
  return (
    <>
      {text
        .split(SEGMENT)
        .filter(Boolean)
        .map((part, i) =>
          isMarked(part) ? (
            <span key={i} className="text-accent">
              {part.slice(1, -1)}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
    </>
  )
}
