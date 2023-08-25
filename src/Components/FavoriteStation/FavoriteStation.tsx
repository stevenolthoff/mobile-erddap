import { IStation } from '@/Contexts/FavoritesContext'
import StationsListItem from '@/Components/StationsListItem/StationsListItem'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'

const FavoriteStation = ({ favorite }: { favorite: IStation }) => {
  return (
    <StationsListItem
      datasetId={favorite.datasetId}
      title={favorite.title}
      summary={favorite.summary}
    >
      <FavoriteButton
        favorite={favorite}
      />
    </StationsListItem>
  )
}

export default FavoriteStation
