export interface NavItem {
  path: string;
  label: string;
  /** Inline SVG path data for a 24x24 icon. */
  icon: string;
  /** Show in the mobile bottom nav (limited slots). */
  primary: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    primary: true,
    icon: 'M12 3 2 12h3v8h6v-6h2v6h6v-8h3z',
  },
  {
    path: '/dex',
    label: 'Dex',
    primary: true,
    icon: 'M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z',
  },
  {
    path: '/games',
    label: 'Games',
    primary: true,
    icon: 'M7 7h10a4 4 0 0 1 4 4v2a4 4 0 0 1-7 2H10a4 4 0 0 1-7-2v-2a4 4 0 0 1 4-4zM7 12h2m-1-1v2',
  },
  {
    path: '/collections',
    label: 'Collection',
    primary: true,
    icon: 'M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1.5 5 3 1.5-1.5 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z',
  },
  {
    path: '/characters',
    label: 'Characters',
    primary: false,
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0',
  },
  {
    path: '/spells',
    label: 'Spells',
    primary: false,
    icon: 'M5 19 19 5M14 5h5v5',
  },
  {
    path: '/potions',
    label: 'Potions',
    primary: false,
    icon: 'M9 3h6v5l4 9a3 3 0 0 1-2.8 4H7.8A3 3 0 0 1 5 17l4-9z',
  },
  {
    path: '/books',
    label: 'Books',
    primary: false,
    icon: 'M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM18 3v18',
  },
  {
    path: '/movies',
    label: 'Movies',
    primary: false,
    icon: 'M3 5h18v14H3zM7 5v14M17 5v14M3 9h4m10 0h4M3 15h4m10 0h4',
  },
  {
    path: '/compare',
    label: 'Compare',
    primary: false,
    icon: 'M9 3v18M15 3v18M4 8h4M16 8h4M4 16h4M16 16h4',
  },
  {
    path: '/settings',
    label: 'Settings',
    primary: false,
    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.4-2.5H9.5L9 5.4a7 7 0 0 0-1.7 1l-2.3-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.5 2.5h5l.4-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.4L19 13z',
  },
];

export const PRIMARY_NAV = NAV_ITEMS.filter((i) => i.primary);
