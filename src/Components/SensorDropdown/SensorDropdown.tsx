import MetadataService from '@/Services/Metadata'
import { ParsedCategory } from '@axdspub/erddap-service/lib/parser'
import React, { useEffect, useState } from 'react'
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
import { MobileDialog as Dialog } from '@axdspub/axiom-ui-utilities'

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
    <div className='border px-4 py-2 rounded-md border-slate-500 text-xs
      gap-4 font-semibold hover:cursor-pointer active:text-blue-500
      active:border-blue-500 hover:text-blue-500 hover:border-blue-500
      flex max-w-[20rem] min-w-[20rem] justify-between'
    >
      <div className='overflow-x-hidden'>{selected ? (selected as Option).label : 'Sensor Type'}</div>
      <div>{open ? <CaretUpIcon /> : <></>}</div>
      <div>{open ? <></> : <CaretDownIcon />}</div>
    </div>
  )

  const optionsElements = filteredOptions.map((option: Option) =>
    <li
      key={option.value}
      className='px-4 py-2 active:text-blue-500 hover:text-blue-500'
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
    </div>
  )  
}
