import React, { type ReactElement } from 'react'

interface IStationListItemProps {
  title: string
  summary: string
  children?: ReactElement
}

export default function StationsListItem ({ title, summary, children }: IStationListItemProps): ReactElement {
  return (
    <div className='px-4 py-2 cursor-pointer hover:bg-slate-200
      active:bg-slate-300 active:text-blue-500 select-none
      flex max-w-full w-full gap-2 justify-between
    '>
      <div className='truncate ...'>
        <p className='text-lg text-black-800 font-medium h-6 truncate ...'>{title}</p>
        <p className='text-sm h-14 leading-tight whitespace-pre-wrap truncate ... text-slate-500'>{summary}</p>
      </div>
      {children ? children : null}
    </div>
  )
}
