import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillMarkdown from './SkillMarkdown';

describe('SkillMarkdown', () => {
  it('renders an empty state for empty body', () => {
    render(<SkillMarkdown body="" />);
    expect(screen.getByTestId('skill-markdown-empty')).toBeInTheDocument();
  });

  it('renders a heading and bold text (CommonMark)', () => {
    render(<SkillMarkdown body={'# Hello\n\nThis is **bold** text.'} />);
    const root = screen.getByTestId('skill-markdown');
    expect(root.querySelector('h1')?.textContent).toBe('Hello');
    expect(root.querySelector('strong')?.textContent).toBe('bold');
  });

  it('renders a GFM table', () => {
    const md = `
| Column A | Column B |
|----------|----------|
| a1       | b1       |
| a2       | b2       |
`;
    render(<SkillMarkdown body={md} />);
    const root = screen.getByTestId('skill-markdown');
    expect(root.querySelector('table')).toBeInTheDocument();
    expect(root.querySelectorAll('th').length).toBe(2);
    expect(root.querySelectorAll('td').length).toBe(4);
  });

  it('renders a GFM task list', () => {
    const md = '- [x] done\n- [ ] todo';
    render(<SkillMarkdown body={md} />);
    const root = screen.getByTestId('skill-markdown');
    expect(root.querySelector('input[type="checkbox"]:checked')).toBeInTheDocument();
    expect(root.querySelector('input[type="checkbox"]:not(:checked)')).toBeInTheDocument();
  });

  it('applies hljs classes to fenced code blocks (rehype-highlight)', () => {
    const md = '```python\nprint("hi")\n```';
    render(<SkillMarkdown body={md} />);
    const root = screen.getByTestId('skill-markdown');
    const code = root.querySelector('pre code');
    expect(code).toBeInTheDocument();
    expect(code?.className).toContain('hljs');
  });

  it('opens external links in a new tab with safe rel', () => {
    render(<SkillMarkdown body="[docs](https://example.com)" />);
    const root = screen.getByTestId('skill-markdown');
    const a = root.querySelector('a');
    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.getAttribute('rel')).toContain('noopener');
    expect(a?.getAttribute('rel')).toContain('noreferrer');
  });

  it('does NOT render raw HTML (sanitized by default)', () => {
    const md = 'Hello <script>alert(1)</script> world';
    render(<SkillMarkdown body={md} />);
    const root = screen.getByTestId('skill-markdown');
    // react-markdown escapes the script tag — no <script> element should exist
    expect(root.querySelector('script')).toBeNull();
    // The literal text "alert(1)" should still be present (escaped)
    expect(root.textContent).toContain('alert(1)');
  });

  it('appends className to the prose container', () => {
    render(<SkillMarkdown body="hi" className="bg-gray-50 p-2" />);
    const root = screen.getByTestId('skill-markdown');
    expect(root.className).toContain('prose');
    expect(root.className).toContain('bg-gray-50');
  });
});
