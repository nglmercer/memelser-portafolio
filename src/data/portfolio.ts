export interface ShowcaseProject {
  repo: string;
  category: string;
  stars: number;
  icon: string;
  wordClass: string;
  description: string;
  tags: string[];
}

export interface ShowcaseContribution {
  repo: string;
  stars: number;
  text: string;
  date: string;
  pr: string;
  number: string;
}

export const codeIcon =
  '<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>';
export const videoIcon =
  '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3M8 9v6l4-3z"/>';
export const audioIcon =
  '<path d="M3 10v4M7 6v12M12 3v18M17 6v12M21 10v4"/>';
export const hookIcon =
  '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M7 5h10M6 7l5 10M18 7l-5 10"/>';

export const showcaseProjects: ShowcaseProject[] = [
  {
    repo: 'TikTools-app',
    category: 'streamCategory',
    stars: 25,
    icon: videoIcon,
    wordClass: '',
    description: 'projectTik',
    tags: ['Rust', 'streamingTag'],
  },
  {
    repo: 'freellmapiV2',
    category: 'aiCategory',
    stars: 18,
    icon: codeIcon,
    wordClass: 'api-word',
    description: 'projectAI',
    tags: ['Rust', 'API'],
  },
  {
    repo: 'qpwgraph-rs',
    category: 'audioCategory',
    stars: 3,
    icon: audioIcon,
    wordClass: 'audio-word',
    description: 'projectAudio',
    tags: ['Rust', 'PipeWire'],
  },
  {
    repo: 'wshook-extension',
    category: 'realtimeCategory',
    stars: 4,
    icon: hookIcon,
    wordClass: 'hook-word',
    description: 'projectHook',
    tags: ['TypeScript', 'WebSockets'],
  },
  {
    repo: 'tiktok-signer',
    category: '',
    stars: 7,
    icon: codeIcon,
    wordClass: '',
    description: 'projectSigner',
    tags: ['Rust'],
  },
  {
    repo: 'android-linux-desktop',
    category: '',
    stars: 6,
    icon: codeIcon,
    wordClass: '',
    description: 'projectAndroid',
    tags: ['Termux'],
  },
];

export const showcaseContributions: ShowcaseContribution[] = [
  {
    repo: 'napi-rs/napi-rs',
    stars: 7956,
    text: 'napiContribution',
    date: '2026-08-30',
    pr: 'https://github.com/napi-rs/napi-rs/pull/3463',
    number: '3463',
  },
  {
    repo: 'PerryTS/perry',
    stars: 4916,
    text: 'perryContribution',
    date: '2026-06-19',
    pr: 'https://github.com/PerryTS/perry/pull/5409',
    number: '5409',
  },
  {
    repo: 'sonorahq/sonora',
    stars: 1645,
    text: 'sonoraContribution',
    date: '2026-09-11',
    pr: 'https://github.com/sonorahq/sonora/pull/555',
    number: '555',
  },
];
