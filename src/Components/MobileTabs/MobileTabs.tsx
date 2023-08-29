import React from 'react'
import { Tabs as AxiomTabs, ITab } from '@axdspub/axiom-ui-utilities'
import { twMerge } from 'tailwind-merge'
import './MobileTabs.css'

interface IMobileTabsProps {
  tabs: ITab[]
  className: string
}

const MobileTabs = ({ tabs, className }: IMobileTabsProps) => {
  const baseClassName = `
    text-md
    px-4 py-4
    text-slate-500
    data-[state=active]:text-blue-500
    data-[state=active]:border-blue-500
    data-[state=active]:font-light
    hover:bg-blue-100
    hover:text-blue-500
    rounded-t-md
    border-solid border-b
  `
  return (
    <AxiomTabs className='w-full' tabs={tabs.map(tab => ({ ...tab, className: twMerge(className, baseClassName) }))} />
  )
}

export default MobileTabs
