import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { TutorialProvider } from './context/TutorialContext'
import { TutorialOverlay } from './components/TutorialOverlay'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TutorialProvider>
      <App />
      <TutorialOverlay />
    </TutorialProvider>
  </StrictMode>,
)
