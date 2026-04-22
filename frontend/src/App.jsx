import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CarList from './pages/CarList'
import CarDetail from './pages/CarDetail'
import MyCars from './pages/MyCars'
import { MyCarsProvider } from './context/MyCarsContext'

export default function App() {
  return (
    <BrowserRouter>
      <MyCarsProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/my-cars" element={<MyCars />} />
        </Routes>
      </MyCarsProvider>
    </BrowserRouter>
  )
}
