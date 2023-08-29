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
import Settings from '@/Pages/Settings/Settings'

function App () {
  console.log('ENV', process.env)
  return (
    <div className='h-[100dvh] overflow-y-hidden divide-y'>
      <BrowserRouter basename='/'>
        <div className='h-[calc(100%-72px)] overflow-hidden'>       
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
                <Route
                  path='/settings'
                  element={<Settings />}
                />
                <Route path="*" element={<Navigate to='/stations' replace />} />
              </Routes>
            </FavoritesContextProvider>
          </SearchContextProvider>
        </div>
        <div className='z-20 h-[72px] absolute bottom-0 w-full'>
          <NavBar />
        </div>
      </BrowserRouter >
    </div>
  )
}

export default App
