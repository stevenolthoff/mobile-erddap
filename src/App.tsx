import React from 'react'
import logo from './logo.svg'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'
import Stations from './Pages/Stations/Stations'
import Station from './Pages/Station/Station'
import './App.css'

function App () {
  return (
    <div className='grid grid-rows-[1fr_auto] h-screen overflow-y-hidden divide-y'>
      <div className='max-h-full overflow-hidden'>
        <BrowserRouter basename='/'>
          <Routes>
            <Route
              path='/stations'
              element={<Stations />}
            />
            <Route
              path='/stations/:datasetId'
              element={<Station />}
            />
          </Routes>
        </BrowserRouter >
      </div>
      <div className='z-10'>
        <NavBar />
      </div>
    </div>
  )
}

export default App
