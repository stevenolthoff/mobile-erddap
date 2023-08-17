import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { DateTime } from 'luxon'

const DEFAULT_BOUNDS = getDefaultBounds()

const defaultState = {
  minTime: getZuluDateString(getDefaultStartDate()),
  maxTime: getZuluDateString(getDefaultEndDate()),
  maxLatitude: DEFAULT_BOUNDS.maxLatitude,
  minLongitude: DEFAULT_BOUNDS.minLongitude,
  maxLongitude: DEFAULT_BOUNDS.maxLongitude,
  minLatitude: DEFAULT_BOUNDS.minLatitude
}

function getDefaultStartDate () {
  const ENV_DEFAULT_WEEKS: string | undefined = process.env.REACT_APP_DEFAULT_WEEKS
  let weeks: number
  if (ENV_DEFAULT_WEEKS === undefined) {
    weeks = 1
  } else {
    weeks = Number(ENV_DEFAULT_WEEKS)
  }
  return DateTime.now().endOf('day').minus({ weeks })
}

function getDefaultEndDate () {
  return DateTime.now().endOf('day')
}

function getZuluDateString (dateTime: DateTime): string {
  return dateTime.toUTC().toISO() as string
}

function getDefaultBounds () {
  const DEFAULT_MIN_LONGITUDE = -136
  const DEFAULT_MAX_LONGITUDE = -171
  const DEFAULT_MIN_LATITUDE = 42
  const DEFAULT_MAX_LATITUDE = 77
  let minLongitude = Number(process.env.REACT_APP_MIN_LONGITUDE)
  let maxLongitude = Number(process.env.REACT_APP_MAX_LONGITUDE)
  let minLatitude = Number(process.env.REACT_APP_MIN_LATITUDE)
  let maxLatitude = Number(process.env.REACT_APP_MAX_LATITUDE)
  if (!minLongitude || !maxLongitude || !minLatitude || !maxLatitude) {
    minLongitude = DEFAULT_MIN_LONGITUDE
    maxLongitude = DEFAULT_MAX_LONGITUDE
    minLatitude = DEFAULT_MIN_LATITUDE
    maxLatitude = DEFAULT_MAX_LATITUDE
  }
  return {
    minLongitude,
    maxLongitude,
    minLatitude,
    maxLatitude
  }
}

export const SearchContext = createContext(defaultState)

export default function SearchContextProvider ({ children }: PropsWithChildren) {
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
