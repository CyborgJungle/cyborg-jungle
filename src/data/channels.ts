export type ChannelId = 'image' | 'video' | 'installation';

export type Channel = {
  id: ChannelId | 'about';
  num: string;
  label: string;
  path: string;
  /** Keyboard shortcut, like a TV remote. */
  key: string;
  blurb: string;
};

export const channels: Channel[] = [
  { id: 'image', num: '01', label: 'Image', path: '/image', key: '1', blurb: 'Stills captured from the signal.' },
  { id: 'video', num: '02', label: 'Video', path: '/video', key: '2', blurb: 'Moving image, synthesised and rescanned.' },
  { id: 'installation', num: '03', label: 'Interactive', path: '/installations', key: '3', blurb: 'Installations that respond to the people in front of them.' },
  { id: 'about', num: '04', label: 'About', path: '/about', key: '4', blurb: 'Operator profile.' },
];

export const channelFor = (id: string) => channels.find((c) => c.id === id)!;
