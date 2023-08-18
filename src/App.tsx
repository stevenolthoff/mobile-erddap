import React from 'react'
import SearchContextProvider from '@/Contexts/SearchContext'
import FavoritesContextProvider from '@/Contexts/FavoritesContext'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Map from '@/Pages/Map/Map'
import Stations from '@/Pages/Stations/Stations'
import Station from '@/Pages/Station/Station'
import Favorites from '@/Pages/Favorites/Favorites'
import NavBar from '@/Components/NavBar/NavBar'
import '@/App.css'

function App () {
  console.log('ENV', process.env)
  return (
    <div className='grid grid-rows-[1fr_auto] h-screen overflow-y-hidden divide-y'>
      <BrowserRouter basename='/'>
        <div className='max-h-full overflow-hidden'>       
          <SearchContextProvider>
            <FavoritesContextProvider>
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
                <Route
                  path='/favorites'
                  element={<Favorites />}
                />
                <Route path="*" element={<Navigate to='/map' replace />} />
              </Routes>
            </FavoritesContextProvider>
          </SearchContextProvider>
        </div>
        <div className='z-10'>
          <NavBar />
        </div>
      </BrowserRouter >
    </div>
  )
}

export default App
