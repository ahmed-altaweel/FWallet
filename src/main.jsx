import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import './index.css'
import App from './App.jsx'
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
 <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
