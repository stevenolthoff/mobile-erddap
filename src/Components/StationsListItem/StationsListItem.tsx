import React, { type ReactElement } from 'react'

interface IStationListItemProps {
  title: string
  summary: string
}

export default function StationsListItem ({ title: Title, summary: Summary }: IStationListItemProps): ReactElement {
  return (
    <div className='px-4 py-2 cursor-pointer hover:bg-slate-200 active:bg-slate-300 active:text-blue-500 select-none'>
      <p className='text-lg text-black-800 font-medium h-6 truncate ...'>{Title}</p>
      <p className='text-sm h-14 leading-tight whitespace-pre-wrap truncate ... text-slate-500'>{Summary}</p>
    </div>
  )
}
