import { useFavoritesContext } from '@/Contexts/FavoritesContext'
import { ReactElement, useState } from 'react'
import FavoriteSensor from '@/Components/FavoriteSensor/FavoriteSensor'

const FavoriteSensors = (): ReactElement => {
  const { sensors } = useFavoritesContext()
  const [copied] = useState(Object.assign({}, sensors))

  function getFavoriteSensors () {
    return Object.entries(copied).map(([id, sensor]) => <FavoriteSensor id={id} sensor={sensor} />)
  }

  return <div>
    {getFavoriteSensors()}
  </div>
}

export default FavoriteSensors
