import MetadataService from '@/Services/Metadata'
import { ParsedCategory } from '@axdspub/erddap-service/lib/parser'
import React, { useEffect, useState } from 'react'
import Select from 'react-tailwindcss-select'
// import * as Dialog from '@radix-ui/react-dialog'
import { CaretDownIcon, CaretUpIcon, Cross2Icon } from '@radix-ui/react-icons'
import Dialog from '@/Components/Dialog/Dialog'

function useSensors (): [ParsedCategory[], boolean] {
  const [sensors, setSensors] = useState<ParsedCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    MetadataService.getParsedSensors().then(result => {
      setSensors(result)
      setLoading(false)
    }).catch(error => {
      console.error(error)
    })
  }, [])
  return [sensors, loading]
}

interface ISensorDropdownProps {
  onChange: (selected: string | undefined) => void
}

type Option = {
  value: string
  label: string
}

export default function SensorDropdown (props: ISensorDropdownProps) {
  const [options, setOptions] = useState<Option[]>([])
  const [selected, setSelected] = useState<Option | Option[] | null>(null)
  const [sensors, loading] = useSensors()
  const [open, setOpen] = useState(false)

  const onChange = (selected: Option | Option[] | null) => {
    setSelected(selected)
  }

  useEffect(() => {
    const selectedOption = selected as Option | null
    if (selectedOption?.value) {
      props.onChange(selectedOption.value)
    } else {
      props.onChange(undefined)
    }
  }, [selected])

  useEffect(() => {
    setOptions(sensors.map(sensor => ({ label: sensor.category, value: sensor.category })))
  }, [sensors, loading])

  const onClickTrigger = () => {
    setOpen(!open)
  }

  const onClickClose = () => {
    setOpen(false)
  }

  const trigger = (
    <div className='border px-4 py-2 rounded-md border-slate-500 text-xs flex gap-4 font-semibold hover:cursor-pointer'>
      Sensor Type
      {open ? <CaretUpIcon /> : <></>}
      {open ? <></> : <CaretDownIcon />}
    </div>
  )

  const body = (
    <div>
      Body
    </div>
  )

  return (
    <div>
      <Dialog
        open={open}
        onClickTrigger={onClickTrigger}
        onEscapeKeyDown={onClickClose}
        onClickClose={onClickClose}
        trigger={trigger}
        title='Header'
        body={body}
      />
      {/* <Dialog.Root open={open}>
        <Dialog.Trigger onClick={onClickTrigger}>
          <div className='border px-4 py-2 rounded-md border-slate-500 text-xs flex gap-4 font-semibold hover:cursor-pointer'>
            Sensor Type
            {open ? <CaretUpIcon /> : <></>}
            {open ? <></> : <CaretDownIcon />}
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='z-30 fixed top-0 right-0 bottom-0 left-0 bg-slate-200'>
            <Dialog.Content
              className='flex flex-col divide-y divide-slate-300 h-full'
              onEscapeKeyDown={onClickClose}
            >
              <div className='font-semibold uppercase text-slate-500 flex pr-4 py-2'>
                <div className='w-full text-center pl-6'>Header</div>
                <Cross2Icon
                  className='self-center w-6 h-6 hover:cursor-pointer'
                  onClick={onClickClose}
                />
              </div>
              <div>
                Body
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root> */}
      {/* <Select
        value={selected}
        onChange={onChange}
        options={options}
        primaryColor='blue'
        isSearchable
        isDisabled={loading}
        isClearable
        placeholder='Sensor Type'
        noOptionsMessage='No matching sensors'
        classNames={{
          menuButton: () => `w-48 border border-slate-800 rounded-md flex px-4
            text-xs cursor-pointer truncate ... overflow-auto`,
          menu: `z-30 border fixed bg-slate-100 top-0 right-0 bottom-0 left-0
            overflow-y-scroll`,
          list: 'text-sm no-scrollbar',
          searchBox: 'px-4 py-2 w-full',
          searchIcon: 'w-0'
        }}
      /> */}
    </div>
  )  
}
