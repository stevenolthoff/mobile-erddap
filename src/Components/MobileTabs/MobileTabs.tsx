import React from 'react'
import { Tabs as AxiomTabs, ITab } from '@axdspub/axiom-ui-utilities'

interface IMobileTabsProps {
  tabs: ITab[]
}

const MobileTabs = ({ tabs }: IMobileTabsProps) => {
  const className = `
    text-xs
    w-1/2
    px-4 py-4
    text-slate-500
    data-[state=active]:text-blue-500
    data-[state=active]:border-blue-500
    data-[state=active]:font-light
    hover:bg-blue-100
    rounded-t-md
    border-solid border-b
  `
  return (
    <AxiomTabs className='mb-16' tabs={tabs.map(tab => ({ ...tab, className }))} />
  )
}

export default MobileTabs
