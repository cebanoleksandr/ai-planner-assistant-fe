import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import queryClient from './reactQuery/queryClient.ts';
import { Provider } from 'react-redux';
import { store } from './storage/store.ts';
import { RouterProvider } from 'react-router-dom';
import router from './router/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
