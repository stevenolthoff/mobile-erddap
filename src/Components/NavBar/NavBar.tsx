import React, { useState, type ReactElement, useEffect } from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Label from '@radix-ui/react-label'
import { GlobeIcon, MagnifyingGlassIcon, Crosshair2Icon, HeartIcon, GearIcon } from '@radix-ui/react-icons'
import { useLocation, useNavigate } from 'react-router-dom'

type ETab = 'map' | 'search' | 'sensors' | 'favorites' | 'settings'
interface ITab {
  id: ETab
  label: string
  icon: ReactElement
  path: string
}

export default function NavBar (): ReactElement {
  const DEFAULT_PATH: ETab = 'map'
  const [activeTab, setActiveTab] = useState<ETab>()
  const location = useLocation()
  const navigate = useNavigate()

  function onPathChanged () {
    console.log(location)
    const tab = tabs.find(tab => tab.path === location.pathname)
    if (tab === undefined) return
    setActiveTab(tab.id)
  }

  useEffect(onPathChanged, [location])

  const tabs: ITab[] = [
    {
      id: 'map',
      label: 'Map',
      icon: <GlobeIcon className='w-6 h-6' />,
      path: '/map'
    },
    {
      id: 'search',
      label: 'Search',
      icon: <MagnifyingGlassIcon className='w-6 h-6' />,
      path: '/stations'
    },
    {
      id: 'sensors',
      label: 'Sensors',
      icon: <Crosshair2Icon className='w-6 h-6' />,
      path: '/'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <HeartIcon className='w-6 h-6' />,
      path: '/favorites'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <GearIcon className='w-6 h-6' />,
      path: '/'
    }
  ]

  console.log(activeTab)

  const tabElements = tabs.map(tab => {
    let color = 'text-slate-500'
    if (tab.id === activeTab) {
      color = 'text-blue-500'
    }
    return (
      <NavigationMenu.Item key={tab.id} onClick={() => { setActiveTab(tab.id) }}>
        <div
          className={`${color} flex flex-col items-center cursor-pointer`}
          onClick={() => navigate(tab.path)}
        >
          {tab.icon}
          <Label.Root className='cursor-pointer'>
            {tab.label}
          </Label.Root>
        </div>
      </NavigationMenu.Item>
    )
  })
  console.log(activeTab)
  return (
    <NavigationMenu.Root className="bg-slate-100 px-2 py-2 text-xs">
      <NavigationMenu.List className="flex justify-between">
        {tabElements}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
