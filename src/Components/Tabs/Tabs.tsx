import React, { type ReactElement, useState } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'
import { type ITabProps } from './Types'

const triggerClass = twMerge(
  'group',
  'text-sm',
  'first:rounded-tl-lg last:rounded-tr-lg',
  'border-b',
  'border-gray-300 dark:border-gray-600',
  'radix-state-active:border-b-gray-700 focus-visible:radix-state-active:border-b-transparent radix-state-inactive:bg-gray-50 dark:radix-state-active:border-b-gray-100 dark:radix-state-active:bg-gray-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-gray-800',
  'flex-1 px-5 py-3',
  'focus:radix-state-active:border-b-red',
  'focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
)

const contentClass = 'mt-4'

const defaultTabs = [
  {
    id: 'id_required_string',
    label: 'Label required. String or react component',
    content: 'String or react component'
  }
]
export default function Tabs ({
  tabs = defaultTabs,
  selectedTab,
  className,
  onChange
}: ITabProps): ReactElement {
  selectedTab = selectedTab === undefined ? tabs[0].id : selectedTab
  const [activeTab, setActiveTab] = useState<string>(selectedTab)
  const onTabChange = (tab: string): void => {
    setActiveTab(tab)
    if (typeof onChange === 'function') {
      onChange(tab)
    }
  }
  return (
    <TabsPrimitive.Root onValueChange={onTabChange} defaultValue={selectedTab} className={className}>
      {
        <>
          <TabsPrimitive.List>
            {tabs.map(tab => (
              <TabsPrimitive.Trigger value={tab.id} className={tab.className !== undefined ? tab.className : triggerClass} key={tab.id}>
                {
                  activeTab === tab.id
                    ? <strong>{tab.label}</strong>
                    : tab.label
                }
              </TabsPrimitive.Trigger>

            ))}
          </TabsPrimitive.List>
          {tabs.map(tab => (
            <TabsPrimitive.Content value={tab.id} key={tab.id} className={tab.contentClassName !== undefined ? tab.contentClassName : contentClass}>
              {tab.content !== undefined ? tab.content : tab.children}
            </TabsPrimitive.Content>

          ))}
        </>

      }
    </TabsPrimitive.Root>

  )
}
