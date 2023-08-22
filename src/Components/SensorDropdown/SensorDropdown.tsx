import MetadataService from '@/Services/Metadata'
import { ParsedCategory } from '@axdspub/erddap-service/lib/parser'
import React, { useEffect, useState } from 'react'
import Select from 'react-tailwindcss-select'

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

  return (
    <div>
      <Select
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
      />
    </div>
  )  
}
