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
      <NavBar />
    </BrowserRouter >
  )
}

export default App
