import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookmarkSimple,
  GithubLogo,
  House,
  InstagramLogo,
  LinkedinLogo,
  MagnifyingGlass,
  Moon,
  Sun,
  XLogo,
} from '@phosphor-icons/react';
import { optionsForLevel } from './content/navigation';
import { projects } from './content/projects';
import { resources } from './content/resources';
import { aboutText, profileLinks } from './content/site';
import type { NavigationLevel, NavigationState, PrimarySection, Resource } from './types';

type Theme = 'dark' | 'light';

const categoryNames: Record<string, string> = {
  systems: 'Systems',
  frontend: 'Frontend',
  git: 'Git',
  devops: 'DevOps',
  others: 'Others',
  'learn:ai': 'AI',
  'learn:backend': 'Backend',
  'learn:ai:modern-ml': 'Modern AI/ML',
  'learn:ai:genai': 'GenAI',
  'learn:ai:agentic-ai': 'Agentic AI',
  'learn:ai:tools': 'AI Tools',
  'learn:ai:others': 'AI Others',
  'learn:backend:0.1-percent': '0.1%',
  'learn:backend:relational': 'Relational',
  'learn:backend:non-relational': 'Non-Relational',
  'learn:backend:tools': 'Backend Tools',
};

const sceneData = [
  { id: 'grow', title: 'Grow', kind: 'intro' },
  { id: 'grow-public', title: 'Grow in Public.', kind: 'statement' },
  { id: 'linkedin', title: 'Grow your LinkedIn Profile', kind: 'linkedin', href: profileLinks.linkedin },
  { id: 'open-source', title: 'Contribute in Open-Source.', kind: 'github', href: profileLinks.github },
  { id: 'instagram', title: 'Instagram is the Key.', kind: 'instagram', href: profileLinks.instagram },
  { id: 'x', title: '"Build in Public" Hub', kind: 'x', href: profileLinks.x },
  { id: 'portfolio', title: 'Portfolio.', kind: 'portfolio', href: profileLinks.portfolio },
] as const;

const socialIcon = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
  instagram: InstagramLogo,
  x: XLogo,
} as const;

function primaryForDestination(destination: string): PrimarySection {
  if (destination === 'home') return 'home';
  if (destination.startsWith('learn:')) return 'learn';
  if (destination.startsWith('vault:')) return 'vault';
  if (destination.startsWith('queue:')) return 'queue';
  return destination as PrimarySection;
}

function levelForDestination(destination: string): NavigationLevel {
  if (destination === 'learn:ai' || destination.startsWith('learn:ai:') || destination === 'vault:ai' || destination === 'queue:ai') return 'ai';
  if (destination === 'learn:backend' || destination.startsWith('learn:backend:') || destination === 'vault:backend' || destination === 'queue:backend') return 'backend';
  if (destination.startsWith('learn:')) return 'learn';
  return 'primary';
}

function categoryForDestination(destination: string): string | undefined {
  if (destination.includes(':ai')) return 'ai';
  if (destination.includes(':backend')) return 'backend';
  if (destination.startsWith('learn:')) return destination.split(':')[1];
  if (destination.endsWith(':ai')) return 'ai';
  if (destination.endsWith(':backend')) return 'backend';
  return undefined;
}

function navOptions(level: NavigationLevel) {
  return optionsForLevel(level);
}

function App() {
  const [navigation, setNavigation] = useState<NavigationState>({
    primary: 'home',
    level: 'primary',
    destination: 'home',
  });
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return window.localStorage.getItem('knowledge-hub-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [activeScene, setActiveScene] = useState(0);
  const [query, setQuery] = useState('');
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);
  const portfolioTriggerRef = useRef<HTMLButtonElement>(null);
  const portfolioCloseRef = useRef<HTMLButtonElement>(null);
  const portfolioFocusCycle = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    themeColor?.setAttribute('content', theme === 'dark' ? '#111211' : '#e9e8e2');
    try {
      window.localStorage.setItem('knowledge-hub-theme', theme);
    } catch {
      // Theme still works for this session when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    const targets = sceneRefs.current.filter((item): item is HTMLElement => Boolean(item));
    if (!targets.length) return;
    document.documentElement.dataset.sceneObserver = 'ready';
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.sceneIndex);
        if (Number.isFinite(index)) {
          setActiveScene(index);
          document.documentElement.dataset.activeScene = String(index);
        }
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: '-12% 0px -12% 0px' },
    );
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.sceneObserver;
      delete document.documentElement.dataset.activeScene;
    };
  }, [navigation.destination]);

  useEffect(() => {
    if (portfolioOpen) {
      portfolioFocusCycle.current = true;
      portfolioCloseRef.current?.focus();
    } else if (portfolioFocusCycle.current) {
      if (navigation.destination === 'home' && activeScene === sceneData.length - 1) portfolioTriggerRef.current?.focus();
      portfolioFocusCycle.current = false;
    }
  }, [portfolioOpen, navigation.destination, activeScene]);

  useEffect(() => {
    if (portfolioOpen && activeScene !== sceneData.length - 1) setPortfolioOpen(false);
  }, [activeScene, portfolioOpen]);

  const changeDestination = (destination: string) => {
    const primary = primaryForDestination(destination);
    setNavigation({
      primary,
      level: levelForDestination(destination),
      category: categoryForDestination(destination),
      destination,
    });
    setQuery('');
    setPortfolioOpen(false);
    if (destination === 'home') {
      setActiveScene(0);
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const onNavigate = (id: string) => {
    if (id === 'back') {
      if (navigation.destination === 'vault:ai' || navigation.destination === 'queue:ai') {
        changeDestination('learn:ai');
        return;
      }
      if (navigation.destination === 'vault:backend' || navigation.destination === 'queue:backend') {
        changeDestination('learn:backend');
        return;
      }
      if (navigation.level === 'ai' || navigation.level === 'backend') {
        setNavigation({ primary: 'learn', level: 'learn', destination: 'learn:index' });
      } else {
        setNavigation({ primary: 'home', level: 'primary', destination: 'home' });
        setActiveScene(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setQuery('');
      return;
    }
    if (id === 'home') {
      changeDestination('home');
      return;
    }
    if (id === 'learn') {
      changeDestination('learn:index');
      return;
    }
    if (id === 'ai') {
      changeDestination('learn:ai');
      return;
    }
    if (id === 'backend') {
      changeDestination('learn:backend');
      return;
    }
    const option = navOptions(navigation.level).find((item) => item.id === id);
    if (option?.destination) changeDestination(option.destination);
    else if (id === 'build' || id === 'about') changeDestination(id);
    else if (id === 'vault:global' || id === 'queue:global') changeDestination(id);
  };

  const currentOptions = navOptions(navigation.level);
  const isHome = navigation.destination === 'home';
  const viewTitle = titleForDestination(navigation.destination);
  const visibleResources = useMemo(() => {
    const destination = navigation.destination;
    let filtered = resources;
    if (destination.startsWith('learn:')) {
      if (destination === 'learn:index') filtered = resources;
      else if (destination === 'learn:ai') filtered = resources.filter((resource) => resource.category.startsWith('ai'));
      else if (destination === 'learn:backend') filtered = resources.filter((resource) => resource.category.startsWith('backend'));
      else filtered = resources.filter((resource) => resource.category === categoryForResource(destination));
    } else if (destination.startsWith('vault:')) {
      filtered = resources.filter((resource) => resource.saved && belongsToContext(resource, destination));
    } else if (destination.startsWith('queue:')) {
      filtered = resources.filter((resource) => Boolean(resource.queueStatus) && belongsToContext(resource, destination));
    }
    const search = query.trim().toLowerCase();
    if (!search) return filtered;
    return filtered.filter((resource) => [resource.title, resource.description, resource.body, resource.category, ...resource.tags].join(' ').toLowerCase().includes(search));
  }, [navigation.destination, query]);

  const showResourceView = navigation.destination.startsWith('learn:') || navigation.destination.startsWith('vault:') || navigation.destination.startsWith('queue:');

  return (
    <div className="app-shell" data-active-scene={activeScene}>
      <div className="canvas-texture" aria-hidden="true" />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <nav className="floating-nav" aria-label="Primary navigation">
          <div className="nav-control">
            {navigation.level === 'primary' ? (
              <button className={`home-control ${isHome ? 'is-current' : ''}`} aria-label="Home" aria-current={isHome ? 'page' : undefined} onClick={() => onNavigate('home')}>
                <House size={19} weight={isHome ? 'fill' : 'regular'} aria-hidden="true" />
              </button>
            ) : (
              <button className="back-control" aria-label="Go back to the previous navigation level" onClick={() => onNavigate('back')}>
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="nav-scroll" key={navigation.level}>
            <div className="nav-items">
              {currentOptions.filter((option) => option.id !== 'home' && option.id !== 'back').map((option) => {
                const selected = option.destination === navigation.destination || (option.id === navigation.primary && (navigation.level === 'primary' || (option.id === 'learn' && navigation.primary === 'learn'))) || (option.id === 'ai' && navigation.level === 'ai') || (option.id === 'backend' && navigation.level === 'backend');
                return (
                  <button
                    type="button"
                    key={option.id}
                    className={`nav-item ${selected ? 'is-selected' : ''}`}
                    aria-current={selected ? 'page' : undefined}
                    onClick={() => onNavigate(option.id)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
        <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </header>

      {isHome && (
        <a
          className={`hero-art ${activeScene > 0 ? 'is-docked' : ''}`}
          href="#main-content"
          aria-label="Knowledge Hub home"
          aria-hidden={activeScene === 0}
          tabIndex={activeScene === 0 ? -1 : 0}
          onClick={(event) => { event.preventDefault(); changeDestination('home'); }}
        >
          <img src="/assets/smoke-mark.png" alt="" fetchPriority="high" />
        </a>
      )}

      <main id="main-content" tabIndex={-1}>
        {isHome ? (
          <div className="scenes" aria-label="Home">
            {sceneData.map((scene, index) => {
              const Icon = scene.kind in socialIcon ? socialIcon[scene.kind as keyof typeof socialIcon] : null;
              const SceneHeading = index === 0 ? 'h1' : 'h2';
              return (
                <section
                  className={`scene scene-${scene.kind} ${activeScene === index ? 'is-active' : ''} ${scene.kind === 'portfolio' && portfolioOpen ? 'is-preview-open' : ''}`}
                  key={scene.id}
                  ref={(element) => { sceneRefs.current[index] = element; }}
                  data-scene-index={index}
                  aria-labelledby={`scene-title-${scene.id}`}
                >
                  <div className="scene-frame">
                    <div className="scene-content">
                      <SceneHeading id={`scene-title-${scene.id}`} className="scene-title">{scene.title}</SceneHeading>
                      {Icon && scene.kind !== 'portfolio' && (
                        <a className={`scene-brand-link brand-${scene.kind}`} href={'href' in scene ? scene.href : undefined} target="_blank" rel="noreferrer" aria-label={`Open ${scene.kind === 'x' ? 'X' : scene.kind} in a new tab`}>
                          <Icon size={72} weight="regular" aria-hidden="true" />
                          <span className="brand-link-label">Open link <ArrowUpRight size={15} aria-hidden="true" /></span>
                        </a>
                      )}
                      {scene.kind === 'portfolio' && (
                        <>
                          <span className="portfolio-orb" aria-hidden="true"><img src="/assets/smoke-mark.png" alt="" /></span>
                          <button ref={portfolioTriggerRef} className="portfolio-link" type="button" onClick={() => setPortfolioOpen(true)} aria-hidden={portfolioOpen} tabIndex={portfolioOpen ? -1 : 0}>
                            <span className="portfolio-link-copy">Visit Portfolio</span>
                            <ArrowUpRight size={22} aria-hidden="true" />
                          </button>
                          <div className={`portfolio-preview ${portfolioOpen ? 'is-open' : ''}`} aria-hidden={!portfolioOpen}>
                            <div className="portfolio-preview-bar">
                              <span className="preview-dots" aria-hidden="true"><i /><i /><i /></span>
                              <span className="preview-address">sankalp010.vercel.app</span>
                              <a href={scene.href} target="_blank" rel="noreferrer" tabIndex={portfolioOpen ? 0 : -1} aria-label="Open portfolio in a new tab">Open ↗</a>
                              <button ref={portfolioCloseRef} className="preview-close" type="button" onClick={() => setPortfolioOpen(false)} tabIndex={portfolioOpen ? 0 : -1}>Close</button>
                            </div>
                            <iframe title="Sankalp Shrivastava portfolio preview" src={portfolioOpen && activeScene === sceneData.length - 1 ? scene.href : undefined} loading="lazy" />
                            <a className="preview-fallback" href={scene.href} target="_blank" rel="noreferrer" tabIndex={portfolioOpen ? 0 : -1}>If the preview is blank, open the portfolio in a new tab</a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <section className="content-page" aria-labelledby="view-title">
            <div className="content-shell">
              <div className="content-heading">
                <button className="text-back" onClick={() => onNavigate(navigation.level === 'primary' ? 'home' : 'back')}>
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span>{navigation.level === 'primary' ? 'Home' : 'Learn'}</span>
                </button>
                <h1 id="view-title">{viewTitle}</h1>
                {showResourceView && <p className="view-description">A place to keep the useful things you find and the ideas you want to understand.</p>}
              </div>

              {navigation.destination === 'build' ? (
                <ProjectView />
              ) : showResourceView ? (
                <ResourceView
                  destination={navigation.destination}
                  resources={visibleResources}
                  query={query}
                  onQueryChange={setQuery}
                />
              ) : navigation.destination === 'about' ? (
                <AboutView />
              ) : null}
            </div>
          </section>
        )}
      </main>
      <footer className="site-footer">
        <p>© 2026 Sankalp Shrivastava. All Rights Reserved.</p>
      </footer>
      {isHome && <div className="scene-progress" role="group" aria-label={`Scene ${activeScene + 1} of ${sceneData.length}`}>
        {sceneData.map((scene, index) => <button key={scene.id} type="button" onClick={() => sceneRefs.current[index]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })} aria-label={`Go to ${scene.title}`} aria-current={activeScene === index ? 'step' : undefined} className={activeScene === index ? 'is-active' : ''} />)}
      </div>}
    </div>
  );
}

function titleForDestination(destination: string) {
  if (destination === 'learn:index') return 'Learn';
  if (destination === 'build') return 'Build';
  if (destination === 'about') return 'About';
  if (destination === 'vault:global') return 'Vault';
  if (destination.startsWith('vault:')) return `${contextTitle(destination)} Vault`;
  if (destination === 'queue:global') return 'Queue';
  if (destination.startsWith('queue:')) return `${contextTitle(destination)} Queue`;
  if (destination === 'learn:ai') return 'AI';
  if (destination === 'learn:backend') return 'Backend';
  return categoryNames[destination] ?? categoryNames[destination.split(':').slice(1).join(':')] ?? 'Learn';
}

function contextTitle(destination: string) {
  return destination.endsWith(':ai') ? 'AI' : destination.endsWith(':backend') ? 'Backend' : '';
}

function categoryForResource(destination: string) {
  if (destination.startsWith('learn:ai:')) return `ai/${destination.slice('learn:ai:'.length)}`;
  if (destination.startsWith('learn:backend:')) return `backend/${destination.slice('learn:backend:'.length)}`;
  return destination.slice('learn:'.length);
}

function belongsToContext(resource: Resource, destination: string) {
  if (destination.endsWith(':ai')) return resource.category.startsWith('ai');
  if (destination.endsWith(':backend')) return resource.category.startsWith('backend');
  return true;
}

function ResourceView({ destination, resources: items, query, onQueryChange }: { destination: string; resources: Resource[]; query: string; onQueryChange: (value: string) => void }) {
  const isQueue = destination.startsWith('queue:');
  const isVault = destination.startsWith('vault:');
  const subtitle = isQueue ? 'Learning queue' : isVault ? 'Saved resources' : 'Learning resources';
  const [filter, setFilter] = useState('All');
  const [selectedNote, setSelectedNote] = useState<Resource | null>(null);
  useEffect(() => { setFilter('All'); setSelectedNote(null); }, [destination]);
  const kinds = ['All', ...new Set(items.map((item) => item.kind))];
  const filteredItems = filter === 'All' ? items : items.filter((item) => item.kind === filter);

  if (selectedNote?.body) {
    return (
      <article className="note-reader">
        <button type="button" className="text-back note-back" onClick={() => setSelectedNote(null)}><ArrowLeft size={16} aria-hidden="true" /> Back to {subtitle.toLowerCase()}</button>
        <div className="note-reader-heading">
          <span className="resource-kind">{humanize(selectedNote.category)}</span>
          <h2>{selectedNote.title}</h2>
        </div>
        <div className="markdown-body"><ReactMarkdown>{selectedNote.body}</ReactMarkdown></div>
      </article>
    );
  }

  return (
    <div className="resource-area">
      <div className="resource-toolbar">
        <label className="search-field">
          <MagnifyingGlass size={18} aria-hidden="true" />
          <span className="sr-only">Search {subtitle.toLowerCase()}</span>
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={`Search ${subtitle.toLowerCase()}`} />
          {query && <button type="button" onClick={() => onQueryChange('')} aria-label="Clear search">×</button>}
        </label>
        <span className="result-count">{filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}</span>
      </div>
      <div className="filter-row" aria-label="Filter by resource type">
        {kinds.map((kind) => <button key={kind} type="button" onClick={() => setFilter(kind)} className={filter === kind ? 'filter-chip is-active' : 'filter-chip'} aria-pressed={filter === kind}>{kind === 'All' ? 'All' : humanize(kind)}</button>)}
      </div>
      {filteredItems.length ? (
        <ul className="resource-list">
          {filteredItems.map((resource) => (
            <li className="resource-row" key={resource.id}>
              <div className="resource-main">
                <span className="resource-kind">{humanize(resource.kind)}</span>
                <h2>{resource.kind === 'note' && resource.body ? (
                  <button className="note-title-button" type="button" onClick={() => setSelectedNote(resource)}>{resource.title}<ArrowRight size={16} aria-hidden="true" /></button>
                ) : resource.url ? (
                  <a href={resource.url} target="_blank" rel="noreferrer">{resource.title}<ArrowUpRight size={15} aria-hidden="true" /></a>
                ) : resource.title}</h2>
                {resource.description && <p>{resource.description}</p>}
                <div className="resource-meta"><span>{humanize(resource.category)}</span>{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              {resource.queueStatus && <span className={`status-label status-${resource.queueStatus}`}>{humanize(resource.queueStatus)}</span>}
              {resource.saved && <BookmarkSimple className="saved-icon" size={18} weight="fill" aria-label="Saved" />}
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <div className="empty-mark" aria-hidden="true"><BookmarkSimple size={22} /></div>
          <h2>{query ? 'No matches' : isQueue ? 'The queue is clear' : isVault ? 'Nothing saved yet' : 'No resources here yet'}</h2>
          <p>{query ? 'Try another title, category, or tag.' : 'Add an entry to the local content files when you find something worth keeping.'}</p>
        </div>
      )}
    </div>
  );
}

function ProjectView() {
  return projects.length ? (
    <ul className="project-list">
      {projects.map((project) => <li className="project-row" key={project.id}>
        <div><span className={`project-status ${project.sourceUrl ? 'status-reference' : `status-${project.status}`}`}>{project.sourceUrl ? 'Reference' : humanize(project.status)}</span><h2>{project.name}</h2><p>{project.description}</p><div className="resource-meta">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
        <div className="project-links">{project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noreferrer">Source file <ArrowUpRight size={14} /></a>}{project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer">Repository <ArrowUpRight size={14} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={14} /></a>}</div>
      </li>)}
    </ul>
  ) : (
    <div className="empty-state empty-projects">
      <div className="empty-mark" aria-hidden="true"><ArrowRight size={22} /></div>
      <h2>No projects here yet</h2>
      <p>Project details will appear here when they are added to the local project file.</p>
    </div>
  );
}

function AboutView() {
  return (
    <div className="about-layout">
      <p className="about-lede">{aboutText}</p>
    </div>
  );
}

function humanize(value: string) {
  const categoryLabels: Record<string, string> = {
    ai: 'AI',
    backend: 'Backend',
    'ai/modern-ml': 'Modern AI/ML',
    'ai/genai': 'GenAI',
    'ai/agentic-ai': 'Agentic AI',
    'backend/0.1-percent': '0.1%',
    'backend/non-relational': 'Non-Relational',
  };
  return categoryLabels[value.toLowerCase()] ?? value.replaceAll('/', ' / ').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default App;
