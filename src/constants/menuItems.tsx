import {
  Dashboard,
  CalendarMonth,
  TrackChanges,
  FormatListBulleted,
} from '@mui/icons-material';

export const menuItems = [
  { text: 'Dashboard', path: '/', icon: <Dashboard /> },
  { text: 'Calendar', path: '/calendar', icon: <CalendarMonth /> },
  { text: 'Areas and Goals', path: '/areas', icon: <TrackChanges /> },
  { text: 'Task Backlog', path: '/tasks', icon: <FormatListBulleted /> },
];