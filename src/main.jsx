import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Preload from './Preload.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Preload />
  //</StrictMode>
)
