import MetadataService from '@/Services/Metadata'
import { ParsedCategory } from '@axdspub/erddap-service/lib/parser'
import React, { useEffect, useState } from 'react'
import SelectSearch, { SelectSearchOption } from 'react-select-search'
import 'react-select-search/style.css'

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

export default function SensorDropdown () {
  const [selected, setSelected] = useState('')
  const [sensors, loading] = useSensors()
  const [options, setOptions] = useState<SelectSearchOption[]>([])

  useEffect(() => {
    setOptions(sensors.map(sensor => ({ name: sensor.category, value: sensor.category })))
  }, [sensors, loading])

  return (
    <div>
      <SelectSearch
        disabled={loading}
        search
        options={options}
        value={selected}
        autoComplete='on'
        onChange={option => setSelected(String(option))}
        placeholder='Sensors'
      />
    </div>
  )  
}
