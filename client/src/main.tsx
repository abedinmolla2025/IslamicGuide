import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered');
      
      // Check for updates every 5 minutes
      setInterval(() => {
        registration.update();
      }, 5 * 60 * 1000);
      
      // Listen for new service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              // New service worker activated, reload the page
              window.location.reload();
            }
          });
        }
      });
    })
    .catch(err => console.log('Service Worker registration failed:', err));
  
  // Listen for controller change (when new service worker takes over)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('New service worker activated, reloading...');
    window.location.reload();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
