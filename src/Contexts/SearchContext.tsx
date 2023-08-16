import React, { createContext, useContext, useState } from 'react'
import { DateTime } from 'luxon'

// TODO Load defaults through env
const defaultState = {
  minTime: '2023-01-01T00:00:00Z',
  maxTime: '2023-08-01T00:00:00Z',
  maxLatitude: 77,
  minLongitude: -171,
  maxLongitude: -136,
  minLatitude: 42,
}

function getDefaultStartDate () {
  const ENV_DEFAULT_WEEKS: string | undefined = process.env.REACT_APP_DEFAULT_WEEKS
  let weeks: number
  if (ENV_DEFAULT_WEEKS === undefined) {
    weeks = 1
  } else {
    weeks = Number(ENV_DEFAULT_WEEKS)
  }
  const dateTime = DateTime.now().endOf('day').minus({ weeks })
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
