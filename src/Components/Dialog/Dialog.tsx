import * as RadixDialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import react, { ReactElement } from 'react'

interface IDialogProps {
  open: boolean
  onClickTrigger: react.MouseEventHandler<HTMLButtonElement> | undefined
  onEscapeKeyDown: ((event: KeyboardEvent) => void) | undefined
  onClickClose: react.MouseEventHandler<SVGElement> | undefined
  trigger: ReactElement
  title: string
  body: ReactElement
}

export default (props: IDialogProps) => {
  const {
    open,
    onClickTrigger,
    onEscapeKeyDown,
    onClickClose,
    trigger,
    body,
    title
  } = props
  return (
    <RadixDialog.Root open={open}>
      <RadixDialog.Trigger onClick={onClickTrigger}>
        {trigger}
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className='z-30 fixed top-0 right-0 bottom-0 left-0 bg-slate-200'>
          <RadixDialog.Content
            className='flex flex-col divide-y divide-slate-300 h-full'
            onEscapeKeyDown={onEscapeKeyDown}
          >
            <div className='font-semibold uppercase text-slate-500 flex pr-4 py-2'>
              <div className='w-full text-center pl-6'>{title}</div>
              <Cross2Icon
                className='self-center w-6 h-6 hover:cursor-pointer'
                onClick={onClickClose}
              />
            </div>
            {body}
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
