import { PropsWithChildren, createContext, useContext, useState } from 'react'

interface IFavorite {
  datasetId: string
  title: string
  summary: string
}

interface IFavoritesContext {
  favorites: IFavorite[]
  addFavorite: (favorite: IFavorite) => void
}

const FavoritesContext = createContext<IFavoritesContext | null>(null)

export default function FavoritesContextProvider ({ children }: PropsWithChildren<{}>) {
  // get from local storage
  const [favorites, setFavorites] = useState<IFavorite[]>([])

  function addFavorite (favorite: IFavorite): void {
    console.log('add')
    if (favorites) {
      setFavorites([...favorites, favorite])
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
