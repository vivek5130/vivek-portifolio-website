import { Reveal } from "../ui/motion";

/** A short line between sections. Wrap words in *asterisks* to highlight them. */
export function QuoteBand({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <Reveal className="quote">
      <figure>
        <blockquote className="quote__text">
          <p>
            <span className="quote__mark" aria-hidden="true">
              &ldquo;
            </span>
            {parts.map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
          </p>
        </blockquote>
      </figure>
    </Reveal>
  );
}
