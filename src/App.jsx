import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
