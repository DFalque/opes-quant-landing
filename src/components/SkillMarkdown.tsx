import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Props {
  body: string;
  className?: string;
}

/**
 * Shared markdown renderer for SKILL.md bodies.
 *
 * Used in two places:
 *  - /skills/[name]        (read-only detail view)
 *  - /skills/[name]/edit   (live preview pane inside the editor)
 *
 * Features:
 *  - GitHub Flavored Markdown (tables, task lists, strikethrough, autolinks)
 *  - Syntax highlighting for fenced code blocks (rehype-highlight + highlight.js,
 *    theme imported in global.css)
 *  - Tailwind `prose prose-sm` typography (typography plugin)
 *  - Sanitized by default: react-markdown does NOT render raw HTML unless
 *    rehype-raw is added, so any `<script>` or dangerous markup in skill
 *    bodies is rendered as escaped text.
 *
 * The `className` prop is appended to the prose container so callers can
 * adjust the surrounding chrome (background, min-height, padding) without
 * overriding the typography styles.
 */
export default function SkillMarkdown({ body, className = '' }: Props) {
  if (!body || body.trim() === '') {
    return (
      <div className="text-sm text-muted italic" data-testid="skill-markdown-empty">
        (vacío)
      </div>
    );
  }
  return (
    <div
      className={`prose prose-base max-w-none ${className}`.trim()}
      data-testid="skill-markdown"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Open external links in a new tab with safe rel
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
