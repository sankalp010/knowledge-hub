export interface NavigationOption {
  id: string;
  label: string;
  kind: 'back' | 'primary' | 'level' | 'destination';
  destination?: string;
}

export const primaryOptions: NavigationOption[] = [
  { id: 'home', label: 'Home', kind: 'primary' },
  { id: 'learn', label: 'Learn', kind: 'level' },
  { id: 'build', label: 'Build', kind: 'primary' },
  { id: 'vault:global', label: 'Vault', kind: 'primary' },
  { id: 'queue:global', label: 'Queue', kind: 'primary' },
  { id: 'about', label: 'About', kind: 'primary' },
];

export const learnOptions: NavigationOption[] = [
  { id: 'back', label: 'Back', kind: 'back' },
  { id: 'ai', label: 'AI', kind: 'level' },
  { id: 'backend', label: 'Backend', kind: 'level' },
  { id: 'systems', label: 'Systems', kind: 'destination', destination: 'learn:systems' },
  { id: 'frontend', label: 'Frontend', kind: 'destination', destination: 'learn:frontend' },
  { id: 'git', label: 'Git', kind: 'destination', destination: 'learn:git' },
  { id: 'devops', label: 'DevOps', kind: 'destination', destination: 'learn:devops' },
  { id: 'others', label: 'Others', kind: 'destination', destination: 'learn:others' },
];

export const aiOptions: NavigationOption[] = [
  { id: 'back', label: 'Back', kind: 'back' },
  { id: 'modern-ml', label: 'Modern AI/ML', kind: 'destination', destination: 'learn:ai:modern-ml' },
  { id: 'genai', label: 'GenAI', kind: 'destination', destination: 'learn:ai:genai' },
  { id: 'agentic-ai', label: 'Agentic AI', kind: 'destination', destination: 'learn:ai:agentic-ai' },
  { id: 'tools', label: 'Tools', kind: 'destination', destination: 'learn:ai:tools' },
  { id: 'vault', label: 'Vault', kind: 'destination', destination: 'vault:ai' },
  { id: 'queue', label: 'Queue', kind: 'destination', destination: 'queue:ai' },
  { id: 'others', label: 'Others', kind: 'destination', destination: 'learn:ai:others' },
];

export const backendOptions: NavigationOption[] = [
  { id: 'back', label: 'Back', kind: 'back' },
  { id: '0.1-percent', label: '0.1%', kind: 'destination', destination: 'learn:backend:0.1-percent' },
  { id: 'relational', label: 'Relational', kind: 'destination', destination: 'learn:backend:relational' },
  { id: 'non-relational', label: 'Non-Relational', kind: 'destination', destination: 'learn:backend:non-relational' },
  { id: 'tools', label: 'Tools', kind: 'destination', destination: 'learn:backend:tools' },
  { id: 'vault', label: 'Vault', kind: 'destination', destination: 'vault:backend' },
  { id: 'queue', label: 'Queue', kind: 'destination', destination: 'queue:backend' },
];

export function optionsForLevel(level: string) {
  if (level === 'learn') return learnOptions;
  if (level === 'ai') return aiOptions;
  if (level === 'backend') return backendOptions;
  return primaryOptions;
}
