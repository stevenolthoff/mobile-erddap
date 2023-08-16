import { PropsWithChildren, createContext, useContext, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

interface IFavorite {
  datasetId: string
  title: string
  summary: string
}

type DatasetId = string
type Favorites = Record<DatasetId, IFavorite>

interface IFavoritesContext {
  favorites: Favorites
  addFavorite: (favorite: IFavorite) => void
}

const FavoritesContext = createContext<IFavoritesContext | null>(null)

export default function FavoritesContextProvider ({ children }: PropsWithChildren<{}>) {
  const [favorites, setFavorites] = useLocalStorage<Favorites>('favorites', {})

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
        addFavorite
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
