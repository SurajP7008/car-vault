import { createContext, useContext, useState, useEffect } from 'react'

const MyCarsContext = createContext(null)

export function MyCarsProvider({ children }) {
  const [myCars, setMyCars] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('myCars') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('myCars', JSON.stringify(myCars))
  }, [myCars])

  const addCar = (car) => {
    if (!myCars.find(c => c.id === car.id)) {
      setMyCars(prev => [...prev, car])
    }
  }

  const removeCar = (carId) => {
    setMyCars(prev => prev.filter(c => c.id !== carId))
  }

  const hasCar = (carId) => myCars.some(c => c.id === carId)

  return (
    <MyCarsContext.Provider value={{ myCars, addCar, removeCar, hasCar }}>
      {children}
    </MyCarsContext.Provider>
  )
}

export function useMyCars() {
  return useContext(MyCarsContext)
}
