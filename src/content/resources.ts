import type { Resource } from '../types';

const noteFiles = import.meta.glob<string>('./notes/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const notes: Resource[] = Object.entries(noteFiles)
  .filter(([path]) => !path.endsWith('/README.md'))
  .map(([path, body]) => {
    const relativePath = path.replace('./notes/', '');
    const parts = relativePath.split('/');
    const filename = parts.pop() ?? relativePath;
    const category = (parts.join('/') || 'others').toLowerCase();
    const firstHeading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const firstParagraph = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith('#'))
      ?.replace(/^[-*]\s+/, '')
      .slice(0, 180) ?? '';
    const title = firstHeading || filename.replace(/\.md$/i, '').replaceAll('-', ' ');
    const id = `note:${relativePath.replace(/\.md$/i, '')}`;
    const renderedBody = firstHeading ? body.replace(/^#\s+.+(?:\r?\n)?/, '').trimStart() : body;
    return {
      id,
      title,
      description: firstParagraph,
      category,
      kind: 'note' as const,
      tags: [],
      body: renderedBody,
    };
  });

// Files are shipped with the site so every source remains available after deployment.
export const resourceEntries: Resource[] = [
  { id: 'git-cheatsheet', title: 'Git Cheatsheet', description: 'A quick reference for everyday Git commands, staging, branching, syncing, and undoing changes.', category: 'git', kind: 'reference', url: '/library/git/000-git-cheatsheet.pdf', tags: ['Git', 'Reference'] },
  { id: 'git-production-scenarios', title: 'Git Production Scenarios', description: 'Scenario-based Git guidance for resolving common production and collaboration situations.', category: 'git', kind: 'reference', url: '/library/git/001-git-production-scenarios.pdf', tags: ['Git', 'Practice'] },
  { id: 'backend-top-one-percent', title: 'Backend Engineering Roadmap', description: 'A phased backend learning plan covering core engineering topics and project work.', category: 'backend/0.1-percent', kind: 'reference', url: '/library/backend/100-backend-top0.1.pdf', tags: ['Roadmap', 'Backend'] },
  { id: 'mern-roadmap', title: 'Software and MERN Roadmap', description: 'A visual roadmap for software development and the MERN stack.', category: 'frontend', kind: 'reference', url: '/library/frontend/101-software-mern-roadmap.pdf', tags: ['MERN', 'Roadmap'] },
  { id: 'sql-resources', title: 'SQL Roadmap and Resources', description: 'A staged SQL study plan with tutorial, practice, and challenge links.', category: 'backend/relational', kind: 'reference', url: '/library/backend/102-sql-resources.pdf', tags: ['SQL', 'Practice'] },
  { id: 'spring-boot-roadmap', title: 'Spring Boot Roadmap', description: 'A roadmap document for learning Spring Boot and backend development.', category: 'backend/tools', kind: 'reference', url: '/library/backend/103-springboot-rm.pdf', tags: ['Java', 'Spring Boot'] },
  { id: 'graphify-guide', title: 'Graphify Setup Guide', description: 'Setup instructions for Graphify, including platform-specific installation commands.', category: 'backend/tools', kind: 'documentation', url: '/library/backend/105-graphify.pdf', tags: ['Graphify', 'Developer tools'] },
  { id: 'ai-resources-index', title: 'AI Learning Resources: Working Index', description: 'A categorized index of videos, repositories, guides, books, papers, and courses for AI study.', category: 'ai/others', kind: 'reference', url: '/library/ai/200-ai-learning-resources-01.pdf', tags: ['AI', 'Courses', 'Reading list'] },
  { id: 'ai-learning-roadmap-divyam', title: 'AI Learning Roadmap and Resources', description: 'A curated learning roadmap spanning programming foundations, data, and AI resources.', category: 'ai/others', kind: 'reference', url: '/library/ai/201-ai-learning-resources-02.pdf', tags: ['AI', 'Roadmap'] },
  { id: 'ai-engineer-six-month-roadmap', title: 'Six-Month AI Engineer Roadmap', description: 'A free-resource roadmap from math and Python foundations through data and machine learning.', category: 'ai/modern-ml', kind: 'reference', url: '/library/ai/202-ai-learning-resources-03.pdf', tags: ['AI engineering', 'Machine learning'] },
  { id: 'free-ai-learning-resources', title: 'Free AI Learning Resources', description: 'A staged collection covering Python, machine learning fundamentals, and further AI study.', category: 'ai/others', kind: 'reference', url: '/library/ai/203-ai-learning-resources-04.pdf', tags: ['AI', 'Free resources'] },
  { id: 'campusx-ai-roadmap', title: 'AI Roadmap for 2026', description: 'CampusX AI roadmap, linked to its roadmap.sh page.', category: 'ai/modern-ml', kind: 'reference', url: 'https://roadmap.sh/r/ai-roadmap-for-2026---final-draft', tags: ['CampusX', 'Roadmap'] },
  { id: 'campusx-data-science-roadmap', title: 'CampusX Data Science Mentorship Roadmap', description: 'A week-by-week data science mentorship syllabus with session topics and learning material.', category: 'ai/modern-ml', kind: 'reference', url: '/library/ai/205-campusx-ds-roadmap.pdf', tags: ['Data science', 'CampusX'] },
  { id: 'genai-roadmap-one', title: 'Generative AI Roadmap', description: 'A visual learning roadmap for generative AI concepts and tools.', category: 'ai/genai', kind: 'reference', url: '/library/ai/206-gen-ai-roadmap-01.pdf', tags: ['Generative AI', 'Roadmap'] },
  { id: 'genai-roadmap-two', title: 'Generative AI Roadmap: Part Two', description: 'A second visual roadmap covering generative AI learning topics.', category: 'ai/genai', kind: 'reference', url: '/library/ai/207-generative-ai-roadmap-02.pdf', tags: ['Generative AI', 'Roadmap'] },
  { id: 'agentic-ai-roadmap', title: 'Agentic AI Roadmap', description: 'A staged path through AI foundations, language models, agents, and advanced agentic topics.', category: 'ai/agentic-ai', kind: 'reference', url: '/library/ai/208-agentic-ai-rm.pdf', tags: ['Agents', 'Roadmap'] },
  { id: 'ai-engineering-for-swes', title: 'AI Engineering Fast Track for Software Engineers', description: 'A two-month transition roadmap for software engineers, with technical and core-skill resources.', category: 'ai/modern-ml', kind: 'reference', url: '/library/ai/208-ai-engineering-swe-rm.pdf', tags: ['AI engineering', 'Software engineering'] },
  { id: 'dsa-pattern-questions', title: '100 DSA Questions by Pattern', description: 'Interview practice grouped by data-structure and algorithm patterns, with difficulty and problem links.', category: 'systems', kind: 'reference', url: '/library/systems/dsa-questions-paterns.pdf', tags: ['DSA', 'Interview practice'] },
  { id: 'vscode-shortcuts', title: 'VS Code Keyboard Shortcuts', description: 'A one-page reference for navigation, editing, and command shortcuts on macOS.', category: 'systems', kind: 'reference', url: '/library/systems/vs-code-keyboard-shortcuts.pdf', tags: ['VS Code', 'Shortcuts'] },
];
export const resources: Resource[] = [...notes, ...resourceEntries];
