import { createRoot } from 'react-dom/client'
import en from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AppProvider i18n={en}>
    <App />
  </AppProvider>
)
