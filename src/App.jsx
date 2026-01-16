import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import CurrencyCalculator from './pages/CurrencyCalculator'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/currency-calculator" element={<CurrencyCalculator />} />
        <Route path="/" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
