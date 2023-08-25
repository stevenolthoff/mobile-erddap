import React, { ReactElement } from 'react'
import MobileTabs from '@/Components/MobileTabs/MobileTabs'
import FavoriteStations from '@/Components/FavoriteStations/FavoriteStations'
import FavoriteSensors from '@/Components/FavoriteSensors/FavoriteSensors'
import FavoriteLatestTables from '@/Components/FavoriteLatestTables/FavoriteLatestTables'

export default function Favorites (): ReactElement {

  return (
    <div className='max-h-full max-w-full overflow-scroll no-scrollbar scrollbox'>
      <div className='px-4 pt-4 text-xl font-semibold text-slate-800'>Favorites</div>
      <MobileTabs
        className='w-1/3'
        tabs={[
          {
            id: 'stations',
            label: 'Stations',
            content: <FavoriteStations />
          },
          {
            id: 'sensors',
            label: 'Sensors',
            content: <FavoriteSensors />
          },
          {
            id: 'latest-measurements',
            label: 'Charts',
            content: <FavoriteLatestTables />
          }
        ]}
      />
    </div>
  )
}
