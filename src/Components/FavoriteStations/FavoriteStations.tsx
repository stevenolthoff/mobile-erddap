import { IStation, useFavoritesContext } from '@/Contexts/FavoritesContext'
import { ReactElement, useState } from 'react'
import FavoriteStation from '@/Components/FavoriteStation/FavoriteStation'

const FavoriteStations = (): ReactElement => {
  const { stations } = useFavoritesContext()
  const [copied] = useState(Object.assign({}, stations))
  
  function getFavoriteStations () {
    if (Object.keys(copied).length === 0) {
      return <div className='p-4 italic text-slate-500 text-sm'>No Stations Saved</div>
    }
    return Object.keys(copied)
      .sort((a, b) => {
        if (copied[a].title < copied[b].title) {
          return -1
        } else if (copied[a].title > copied[b].title) {
          return 1
        } else {
          return 0
        }
      })
      .map(datasetId => <FavoriteStation favorite={copied[datasetId]} />)
  }

  return (
    <div className='flex flex-col h-full truncate ... divide-y'>
      {getFavoriteStations()}
    </div>
  )
}

export default FavoriteStations
