import React, { ReactElement } from "react"

const EmptyCard = ({ children }: { children?: ReactElement }) => {
  return <div className='w-full h-[300px] flex justify-center items-center bg-slate-200 rounded-lg text-slate-500 text-sm'>
    {children}
  </div>
}

export default EmptyCard
