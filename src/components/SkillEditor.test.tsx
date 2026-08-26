import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SkillEditor from './SkillEditor';

vi.mock('../lib/api', () => ({
  api: {
    me: vi.fn(),
    skill: vi.fn(),
    createDraft: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number;
    body: unknown;
    constructor(status: number, body: unknown, message?: string) {
      super(message ?? `API ${status}`);
      this.status = status;
      this.body = body;
    }
  },
}));

const { api } = await import('../lib/api');

const SAMPLE_SKILL = {
  name: 'test-skill',
  frontmatter: { name: 'test-skill', description: 'A test', version: '0.1.0' },
  body: '# Hello\n\nThis is **bold**.',
  raw: '---\nname: test-skill\ndescription: A test\nversion: 0.1.0\n---\n# Hello\n\nThis is **bold**.\n',
};

describe('SkillEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.me as any).mockResolvedValue({ username: 'alice', role: 'admin' });
    (api.skill as any).mockResolvedValue(SAMPLE_SKILL);
    (api.createDraft as any).mockResolvedValue({ id: 1, status: 'draft' });
  });

  it('loads the current skill and splits frontmatter / body', async () => {
    render(<SkillEditor skillName="test-skill" />);
    await waitFor(() => {
      expect(screen.getByTestId('skill-editor')).toBeInTheDocument();
    });
    const fm = screen.getByTestId('frontmatter-input') as HTMLTextAreaElement;
    const body = screen.getByTestId('body-input') as HTMLTextAreaElement;
    expect(fm.value).toContain('name: test-skill');
    expect(fm.value).toContain('version: 0.1.0');
    expect(body.value).toBe('# Hello\n\nThis is **bold**.');
  });

  it('renders the live preview with markdown → HTML', async () => {
    render(<SkillEditor skillName="test-skill" />);
    await waitFor(() => {
      expect(screen.getByTestId('preview')).toBeInTheDocument();
    });
    const preview = screen.getByTestId('preview');
    expect(preview.innerHTML).toContain('<h1');
    expect(preview.innerHTML).toContain('Hello');
    expect(preview.innerHTML).toContain('<strong>bold</strong>');
  });

  it('does not show Publish button for non-admin users', async () => {
    (api.me as any).mockResolvedValue({ username: 'eve', role: 'viewer' });
    render(<SkillEditor skillName="test-skill" />);
    await waitFor(() => {
      expect(screen.getByTestId('save-draft-btn')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('publish-btn')).not.toBeInTheDocument();
  });

  it('shows Publish button for admin users', async () => {
    render(<SkillEditor skillName="test-skill" />);
    await waitFor(() => {
      expect(screen.getByTestId('publish-btn')).toBeInTheDocument();
    });
  });

  it('saves a draft when Save Draft is clicked', async () => {
    render(<SkillEditor skillName="test-skill" />);
    await waitFor(() => screen.getByTestId('save-draft-btn'));
    fireEvent.click(screen.getByTestId('save-draft-btn'));
    await waitFor(() => {
      expect(api.createDraft).toHaveBeenCalledWith('test-skill', expect.objectContaining({
        frontmatter_yaml: expect.stringContaining('name: test-skill'),
        body_markdown: expect.stringContaining('# Hello'),
        bump_type: 'patch',
      }));
    });
    await waitFor(() => {
      expect(screen.getByTestId('editor-message')).toHaveTextContent('Borrador guardado');
    });
  });

  it('shows an error if the load fails', async () => {
    (api.skill as any).mockRejectedValue(new Error('Network down'));
    render(<SkillEditor skillName="test-skill" />);
    await waitFor(() => {
      expect(screen.getByTestId('editor-load-error')).toHaveTextContent('Network down');
    });
  });
});
