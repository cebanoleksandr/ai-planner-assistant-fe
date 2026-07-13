import { createBrowserRouter, redirect } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import App from '../App';
import { AUTH_TOKEN_KEY } from '../constants';
import Dashboard from '../pages/Dashboard';
import NotFoundPage from '../pages/NotFoundPage';
import { MainLayout } from '../components/layouts/MainLayout';
import CalendarPage from '../pages/CalendarPage';
import TasksPage from '../pages/TasksPage';
import { AuthLayout } from '../components/layouts/AuthLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import AreasPage from '../pages/AreasPage';
import AreaDetailsPage from '../pages/AreaDetailsPage';
import GoalDetailsPage from '../pages/GoalDetailsPage';

const loader = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return redirect("/auth/login");
  return null;
};

const authLoader = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) return redirect("/app");
  return null;
};

const rootLoader = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    return redirect("/app");
  }
  return redirect("/auth/login");
}

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true, 
        loader: rootLoader,
      },
      {
        path: 'app',
        loader,
        Component: MainLayout,
        children: [
          {
            index: true,
            Component: Dashboard,
          },
          {
            path: 'calendar',
            Component: CalendarPage,
          },
          {
            path: 'areas',
            Component: AreasPage,
          },
          {
            path: 'areas/:areaId',
            Component: AreaDetailsPage,
          },
          {
            path: 'goals/:goalId',
            Component: GoalDetailsPage,
          },
          {
            path: 'tasks',
            Component: TasksPage,
          }
        ],
      },
      {
        path: 'auth',
        Component: AuthLayout,
        loader: authLoader,
        children: [
          {
            path: 'login',
            Component: LoginPage,
          },
          {
            path: 'register',
            Component: RegisterPage,
          },
        ],
      },
      {
        path: '*',
        Component: NotFoundPage,
      }
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
