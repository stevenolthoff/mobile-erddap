import React, { type ReactElement } from 'react'

interface StationCardProps {
  startDate: Date
  endDate: Date
  title: string
  summary: string
}

export default function StationCard (props: StationCardProps): ReactElement {
  const { startDate, endDate, title, summary } = props
  const formatter = (date: Date) => 
    date.toLocaleDateString('en-us', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    }) 
  return (
    <div className='absolute bg-slate-100 bottom-16 mx-4 my-4 p-3 left-0 right-0 rounded-md
      shadow-md leading-4 gap-2 flex flex-col active:bg-slate-300'>
      <div className='font-semibold uppercase text-slate-800'>{title}</div>
      <div className='text-sm leading-3 text-slate-500'>{formatter(startDate)} to {formatter(endDate)}</div>
      <div className='text-sm leading-3 text-slate-500'>{summary}</div>
    </div>
  )
}
