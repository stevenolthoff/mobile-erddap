import MetadataService from '@/Services/Metadata'
import { ParsedCategory } from '@axdspub/erddap-service/lib/parser'
import React, { useEffect, useState } from 'react'
import Select from 'react-tailwindcss-select'
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
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
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [selected, setSelected] = useState<Option | Option[] | null>(null)
  const [sensors, loading] = useSensors()
  const [open, setOpen] = useState(false)
  const [sensorQuery, setSensorQuery] = useState<string>()

  const onChange = (selected: Option | Option[] | null) => {
    setSelected(selected)
    setOpen(false)
    setSensorQuery(undefined)
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

  useEffect(() => {
    setFilteredOptions(options)
  }, [options])

  useEffect(() => {
    if (!sensorQuery) {
      setFilteredOptions(options)
    } else {
      setFilteredOptions(options.filter(option => option.label.replace('_', ' ').includes(sensorQuery.trim())))
    }
  }, [sensorQuery])

  const onClickTrigger = () => {
    setOpen(!open)
  }

  const onClickClose = () => {
    setSensorQuery(undefined)
    setOpen(false)
  }

  const trigger = (
    <div className='border px-4 py-2 rounded-md border-slate-500 text-xs flex
      gap-4 font-semibold hover:cursor-pointer active:text-blue-500
      active:border-blue-500 max-w-[12rem]'
    >
      {selected ? (selected as Option).label : 'Sensor Type'}
      {open ? <CaretUpIcon /> : <></>}
      {open ? <></> : <CaretDownIcon />}
    </div>
  )

  const optionsElements = filteredOptions.map((option: Option) =>
    <li
      key={option.value}
      className='px-4 py-2 active:text-blue-500'
      onClick={() => onChange(option)}
    >
      {option.label}
    </li>
  )
  
  const emptyMessage = <div className='italic text-sm uppercase text-slate-500 text-center p-4'>No matching sensors found</div>

  const body = (
    <div className='max-h-full h-full flex flex-col scrollbox'>
      <input
        className='px-4 py-2 border-b'
        autoFocus
        value={sensorQuery || ''}
        onChange={event => setSensorQuery(event.target.value)}
        placeholder='Sensor Type'
      />
      {optionsElements.length === 0 ? emptyMessage : <></>}
      <ul className={`
         flex-1 overflow-y-scroll overflow-x-hidden
        no-scrollbar flex flex-col divide-y divide-slate-300
        hover:cursor-pointer scrollbox`}
      >
        {optionsElements}
      </ul>
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
        title='Filter By Sensor'
        body={body}
      />
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
