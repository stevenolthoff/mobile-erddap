import { PropsWithChildren, createContext, useContext, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export interface IFavorite {
  datasetId: string
  title: string
  summary: string
  startDate: string
  endDate: string
}

type DatasetId = string
type Favorites = Record<DatasetId, IFavorite>

interface IFavoritesContext {
  favorites: Favorites
  toggleFavorite: (favorite: IFavorite) => void
  isFavorited: (datasetId: DatasetId) => boolean
}

const FavoritesContext = createContext<IFavoritesContext | null>(null)

export default function FavoritesContextProvider ({ children }: PropsWithChildren<{}>) {
  const [favorites, setFavorites] = useLocalStorage<Favorites>('favorites', {})

  function isFavorited (datasetId: DatasetId) {
    return Boolean(favorites[datasetId])
  }

  function toggleFavorite (favorite: IFavorite) {
    if (favorites[favorite.datasetId]) {
      removeFavorite(favorite.datasetId)
    } else {
      addFavorite(favorite)
    }
  }

  function removeFavorite (datasetId: string) {
    const newFavorites = favorites
    delete newFavorites[datasetId]
    setFavorites(newFavorites)
  }

  function addFavorite (favorite: IFavorite): void {
    if (favorites) {
      const newFavorites = favorites
      favorites[favorite.datasetId] = favorite
      setFavorites(newFavorites)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorited
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavoritesContext () {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesContextProvider')
  }
  return context
}
