import React, { useState, type ReactElement, useEffect } from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Label from '@radix-ui/react-label'
import { GlobeIcon, MagnifyingGlassIcon, HeartIcon, HeartFilledIcon, GearIcon } from '@radix-ui/react-icons'
import { useLocation, useNavigate } from 'react-router-dom'

type ETab = 'map' | 'search' | 'favorites' | 'settings'
interface ITab {
  id: ETab
  label: string
  icon: ReactElement
  path: string
  activeIcon?: ReactElement
}

export default function NavBar (): ReactElement {
  const [activeTab, setActiveTab] = useState<ETab>()
  const location = useLocation()
  const { search } = location
  const navigate = useNavigate()

  function onPathChanged() {
    const tab = tabs.find((tab) => tab.path === location.pathname)
    if (tab === undefined) return
    setActiveTab(tab.id)
  }

  useEffect(onPathChanged, [location])

  const tabs: ITab[] = [
    {
      id: 'map',
      label: 'Map',
      icon: <GlobeIcon className='w-8 h-8' />,
      path: '/map'
    },
    {
      id: 'search',
      label: 'Search',
      icon: <MagnifyingGlassIcon className='w-8 h-8' />,
      path: '/stations'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <HeartIcon className='w-8 h-8' />,
      path: '/favorites',
      activeIcon: <HeartFilledIcon className='w-8 h-8' />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <GearIcon className='w-8 h-8' />,
      path: '/settings'
    }
  ]

  const tabElements = tabs.map(tab => {
    let color = 'text-slate-500'
    if (tab.id === activeTab) {
      color = 'text-blue-500'
    }
    return (
      <NavigationMenu.Item key={tab.id} onClick={() => { setActiveTab(tab.id) }}>
        <div
          className={`${color} flex flex-col items-center cursor-pointer`}
          onClick={() => navigate({ pathname: tab.path, search })}
        >
          {tab.id === activeTab && tab.activeIcon ? tab.activeIcon : tab.icon}
          <Label.Root className='cursor-pointer'>
            {tab.label}
          </Label.Root>
        </div>
      </NavigationMenu.Item>
    )
  })

  return (
    <NavigationMenu.Root className="bg-slate-100 px-6 py-3 text-xs h-full">
      <NavigationMenu.List className="flex justify-between h-full">
        {tabElements}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
