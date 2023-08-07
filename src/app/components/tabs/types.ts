import { type ReactElement } from 'react'

interface ITab {
  id: string
  label: string
  content?: ReactElement | string
  children?: ReactElement | string
  className?: string
  contentClassName?: string
}

interface ITabProps {
  tabs?: ITab[]
  selectedTab?: string
  className?: string
  onChange?: (tab: string) => void
}

export type {
  ITab,
  ITabProps
}
