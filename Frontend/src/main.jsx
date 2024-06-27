// Import componenti
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './global.scss'
import { BrowserRouter } from "react-router-dom";
import { GlobalProvider } from '../contexts/GlobalContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </BrowserRouter>

)
