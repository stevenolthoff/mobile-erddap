import React from 'react'
import logo from './logo.svg'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Map from './Pages/Map/Map'
import Stations from './Pages/Stations/Stations'
import Station from './Pages/Station/Station'
import NavBar from './Components/NavBar/NavBar'
import './App.css'

function App () {
  return (
    <div className='grid grid-rows-[1fr_auto] h-screen overflow-y-hidden divide-y'>
      <BrowserRouter basename='/'>
        <div className='max-h-full overflow-hidden'>       
          <Routes>
            <Route
              path='/map'
              element={<Map />}
            />
            <Route
              path='/stations'
              element={<Stations />}
            />
            <Route
              path='/stations/:datasetId'
              element={<Station />}
            />
            <Route path="*" element={<Navigate to='/map' replace />} />
          </Routes>
        </div>
        <div className='z-10'>
          <NavBar />
        </div>
      </BrowserRouter >
    </div>
  )
}

export default App
