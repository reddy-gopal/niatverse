import type { ArticleCategory } from '../types';

export const CATEGORY_CONFIG: Record<
  ArticleCategory,
  { label: string; icon: string; bg: string; text: string; border: string }
> = {
  irc: {
    label: 'IRC & Skills',
    icon: '🔬',
    bg: '#fbf2f3',
    text: '#991b1b',
    border: '#991b1b',
  },
  'campus-life': {
    label: 'Campus Life',
    icon: '🏠',
    bg: '#f3f0ff',
    text: '#7678ed',
    border: '#7678ed',
  },
  experiences: {
    label: 'Experiences',
    icon: '💼',
    bg: '#fff7ed',
    text: '#f18701',
    border: '#f18701',
  },
  academics: {
    label: 'Academics',
    icon: '📚',
    bg: '#f0fdf4',
    text: '#15803d',
    border: '#15803d',
  },
  howto: {
    label: 'How-To Guides',
    icon: '📖',
    bg: '#f0f9ff',
    text: '#0369a1',
    border: '#0369a1',
  },
};

export const CATEGORY_ORDER: ArticleCategory[] = [
  'irc',
  'campus-life',
  'experiences',
  'academics',
  'howto',
];
