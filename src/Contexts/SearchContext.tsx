import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { DateTime } from 'luxon'
import useBounds from '@/Hooks/useBounds'
import useMapCenter from '@/Hooks/useMapCenter'

const defaultState = {
  minTime: getZuluDateString(getDefaultStartDate()),
  maxTime: getZuluDateString(getDefaultEndDate()),
  maxLatitude: 0,
  minLongitude: 0,
  maxLongitude: 0,
  minLatitude: 0,
  centerLatitude: 0,
  centerLongitude: 0
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

export const SearchContext = createContext(defaultState)

export default function SearchContextProvider ({ children }: PropsWithChildren) {
  const [minTime] = useState(defaultState.minTime)
  const [maxTime] = useState(defaultState.maxTime)
  const [bounds, setBounds] = useBounds()
  const { centerLatitude, centerLongitude } = useMapCenter()
  const { minLatitude, maxLatitude, minLongitude, maxLongitude } = bounds

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
