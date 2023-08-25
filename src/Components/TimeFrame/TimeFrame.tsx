import { TimeFrame as ITimeFrame } from '@/Services/TimeFrame'
import { ReactElement } from 'react'

const TimeFrame = ({ timeFrame }: { timeFrame: ITimeFrame }): ReactElement => {
  const { start, end } = timeFrame
  return (
    <div className='px-4 uppercase text-xs font-semibold text-slate-800 w-full flex pb-2'>
      {start.toLocaleDateString('en-us', { dateStyle: 'medium' })} - {end.toLocaleDateString('en-us', { dateStyle: 'medium' })}
    </div>
  )
}

export default TimeFrame
