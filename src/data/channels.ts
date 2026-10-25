export type ChannelId = 'image' | 'video' | 'installation';

export type Channel = {
  id: ChannelId | 'about';
  num: string;
  label: string;
  path: string;
  /** Keyboard shortcut, like a TV remote. */
  key: string;
  blurb: string;
  /** CSS colour for this channel (a token from tokens.css). */
  color: string;
};

export const channels: Channel[] = [
  { id: 'image', num: '01', label: 'Image', path: '/image', key: '1', blurb: 'Frames pulled from analog video, filmed off a CRT.', color: 'var(--ch-image)' },
  { id: 'video', num: '02', label: 'Video', path: '/video', key: '2', blurb: 'Video broken through mixers and effect modules, filmed off a CRT.', color: 'var(--ch-video)' },
  { id: 'installation', num: '03', label: 'Interactive', path: '/installations', key: '3', blurb: 'Installations that respond to the people in front of them.', color: 'var(--ch-installation)' },
  { id: 'about', num: '04', label: 'About', path: '/about', key: '4', blurb: 'Operator profile.', color: 'var(--ch-about)' },
];

export const channelFor = (id: string) => channels.find((c) => c.id === id)!;
