import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { DateTime } from 'luxon'
import useBounds from '@/Hooks/useBounds'

const DEFAULT_CENTER = getDefaultCenter()

const defaultState = {
  minTime: getZuluDateString(getDefaultStartDate()),
  maxTime: getZuluDateString(getDefaultEndDate()),
  maxLatitude: 0,
  minLongitude: 0,
  maxLongitude: 0,
  minLatitude: 0,
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
  const [bounds, setBounds] = useBounds()
  const { minLatitude, maxLatitude, minLongitude, maxLongitude } = bounds
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
