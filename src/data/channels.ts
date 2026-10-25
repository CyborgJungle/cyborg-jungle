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
  /** Japanese name, set vertically and in the menu. */
  jp: string;
};

export const channels: Channel[] = [
  { id: 'image', num: '01', label: 'Image', path: '/image', key: '1', blurb: 'Frames pulled from analog video, filmed off a CRT.', color: 'var(--ch-image)', jp: '画像' },
  { id: 'video', num: '02', label: 'Video', path: '/video', key: '2', blurb: 'Video broken through mixers and effect modules, filmed off a CRT.', color: 'var(--ch-video)', jp: '映像' },
  { id: 'installation', num: '03', label: 'Interactive', path: '/installations', key: '3', blurb: 'Installations that respond to the people in front of them.', color: 'var(--ch-installation)', jp: '体験' },
  { id: 'about', num: '04', label: 'About', path: '/about', key: '4', blurb: 'Operator profile.', color: 'var(--ch-about)', jp: '紹介' },
];

export const channelFor = (id: string) => channels.find((c) => c.id === id)!;
