import { DataService } from '@axdspub/axiom-ui-data-services'
import React, { createContext, useContext, useState } from 'react'

// TODO Load defaults through env
const defaultState = {
  minTime: '2023-07-01T00:00:00Z',
  maxTime: '2023-08-01T00:00:00Z',
  maxLatitude: 77,
  minLongitude: -171,
  maxLongitude: -136,
  minLatitude: 42,
}

export const SearchContext = createContext(defaultState)

export default function SearchContextProvider ({ children }: any) {
  const [minTime, setMinTime] = useState(defaultState.minTime)
  const [maxTime, setMaxTime] = useState(defaultState.maxTime)
  const [maxLatitude, setMaxLatitude] = useState(defaultState.maxLatitude)
  const [minLongitude, setMinLongitude] = useState(defaultState.minLongitude)
  const [maxLongitude, setMaxLongitude] = useState(defaultState.maxLongitude)
  const [minLatitude, setMinLatitude] = useState(defaultState.minLatitude)

  return (
    <SearchContext.Provider
      value={{
        minTime,
        maxTime,
        maxLatitude,
        minLongitude,
        maxLongitude,
        minLatitude
      }}
    >{children}</SearchContext.Provider>
  )
}

export function useSearchContext () {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchContextProvider')
  }
  return context
}
