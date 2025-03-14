import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind/index.css'
import './styles/sass/index.scss'  
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
