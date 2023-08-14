import React, { createContext, useContext, useState } from 'react'

const defaultState = {
  minTime: '2022-07-01T00:00:00Z',
  maxTime: '2023-08-01T00:00:00Z'
}

export const SearchContext = createContext(defaultState)

export default function SearchContextProvider ({ children }: any) {
  const [minTime, setMinTime] = useState(defaultState.minTime)
  const [maxTime, setMaxTime] = useState(defaultState.maxTime)

  return (
    <SearchContext.Provider
      value={{
        minTime,
        maxTime
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
