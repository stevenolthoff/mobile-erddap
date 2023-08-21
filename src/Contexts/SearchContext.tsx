import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { DateTime } from 'luxon'

const DEFAULT_BOUNDS = getDefaultBounds()
const DEFAULT_CENTER = getDefaultCenter()

const defaultState = {
  minTime: getZuluDateString(getDefaultStartDate()),
  maxTime: getZuluDateString(getDefaultEndDate()),
  maxLatitude: DEFAULT_BOUNDS.maxLatitude,
  minLongitude: DEFAULT_BOUNDS.minLongitude,
  maxLongitude: DEFAULT_BOUNDS.maxLongitude,
  minLatitude: DEFAULT_BOUNDS.minLatitude,
  centerLatitude: DEFAULT_CENTER.centerLatitude,
  centerLongitude: DEFAULT_CENTER.centerLongitude
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
  const DEFAULT_MIN_LONGITUDE = -171
  const DEFAULT_MAX_LONGITUDE = -136
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

function getDefaultCenter () {
  const DEFAULT_CENTER_LATITUDE = 61.217381
  const DEFAULT_CENTER_LONGITUDE = -149.86
  let centerLatitude = Number(process.env.REACT_APP_MAP_CENTER_LATITUDE)
  let centerLongitude = Number(process.env.REACT_APP_MAP_CENTER_LONGITUDE)
  if (!centerLatitude || !centerLongitude) {
    centerLatitude = DEFAULT_CENTER_LATITUDE
    centerLongitude = DEFAULT_CENTER_LONGITUDE
  }
  return {
    centerLatitude,
    centerLongitude
  }
}

export const SearchContext = createContext(defaultState)

export default function SearchContextProvider ({ children }: PropsWithChildren) {
  const [minTime] = useState(defaultState.minTime)
  const [maxTime] = useState(defaultState.maxTime)
  const [maxLatitude] = useState(defaultState.maxLatitude)
  const [minLongitude] = useState(defaultState.minLongitude)
  const [maxLongitude] = useState(defaultState.maxLongitude)
  const [minLatitude] = useState(defaultState.minLatitude)
  const [centerLatitude] = useState(defaultState.centerLatitude)
  const [centerLongitude] = useState(defaultState.centerLongitude)

  return (
    <SearchContext.Provider
      value={{
        minTime,
        maxTime,
        maxLatitude,
        minLongitude,
        maxLongitude,
        minLatitude,
        centerLatitude,
        centerLongitude
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
