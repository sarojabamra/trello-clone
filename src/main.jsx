import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext';
import { BoardContextProvider } from './context/BoardContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <BoardContextProvider>
        <App />
      </BoardContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
