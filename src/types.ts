export type PrimarySection = 'home' | 'learn' | 'build' | 'vault' | 'queue' | 'about';
export type NavigationLevel = 'primary' | 'learn' | 'ai' | 'backend';
export type ResourceKind = 'note' | 'article' | 'documentation' | 'video' | 'tool' | 'reference';
export type QueueStatus = 'to-learn' | 'in-progress' | 'completed';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  kind: ResourceKind;
  url?: string;
  body?: string;
  tags: string[];
  saved?: boolean;
  queueStatus?: QueueStatus;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'building' | 'live' | 'planned';
  technologies: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  sourceUrl?: string;
}

export interface NavigationState {
  primary: PrimarySection;
  level: NavigationLevel;
  category?: string;
  destination: string;
}
