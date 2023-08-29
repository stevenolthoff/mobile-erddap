import { IStation } from '@/Contexts/FavoritesContext'
import React, { type ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface IStationListItemProps extends Omit<IStation, 'type'> {
  datasetId: string
  title: string
  summary: string
  children?: ReactElement
}

export default function StationsListItem ({ datasetId, title, summary, children }: IStationListItemProps): ReactElement {
  const { search } = useLocation()

  return (
    <Link
      to={`/stations/${datasetId}${search}`}
      className='flex'
    >
      <div className='px-4 py-2 cursor-pointer hover:bg-slate-200
        active:bg-slate-300 active:text-blue-500 select-none
        flex max-w-full w-full gap-2 justify-between
      '>
        <div className='truncate flex flex-col gap-4'>
          <div className='text-xl text-black-800 font-medium h-6 whitespace-pre-wrap leading-5'>{title}</div>
          <div className='text-md h-14 leading-tight whitespace-pre-wrap truncate ... text-slate-500'>{summary}</div>
        </div>
        {children ? children : null}
      </div>
    </Link>
  )
}
