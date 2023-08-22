import MetadataService from '@/Services/Metadata'
import { ParsedCategory } from '@axdspub/erddap-service/lib/parser'
import React, { useEffect, useState } from 'react'
import SelectSearch, { SelectSearchOption } from 'react-select-search'
import './SensorDropdown.css'

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

export default function SensorDropdown (props: ISensorDropdownProps) {
  const [selected, setSelected] = useState<string | undefined>()
  const [sensors, loading] = useSensors()
  const [options, setOptions] = useState<SelectSearchOption[]>([])

  useEffect(() => {
    setOptions(sensors.map(sensor => ({ name: sensor.category, value: sensor.category })))
  }, [sensors, loading])

  useEffect(() => {
    props.onChange(selected)
  }, [selected])

  const onChange = (selected: string) => {
    setSelected(selected)
  }

  const clear = () => {
    setSelected(undefined)
  }

  return (
    <div>
      <SelectSearch
        disabled={loading}
        search
        options={options}
        value={selected}
        autoComplete='on'
        onChange={option => onChange(String(option))}
        placeholder='Sensors'
        emptyMessage='Sensor Not Found'
      />
      <button onClick={clear}>X</button>
    </div>
  )  
}
