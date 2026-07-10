import {
  Dashboard,
  CalendarMonth,
  TrackChanges,
  FormatListBulleted,
} from '@mui/icons-material';

export const menuItems = [
  { text: 'Dashboard', path: '/app', icon: <Dashboard /> },
  { text: 'Calendar', path: '/app/calendar', icon: <CalendarMonth /> },
  { text: 'Areas and Goals', path: '/app/goals', icon: <TrackChanges /> },
  { text: 'Task Backlog', path: '/app/tasks', icon: <FormatListBulleted /> },
];
