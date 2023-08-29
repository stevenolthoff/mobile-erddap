import StationsListItem from '@/Components/StationsListItem/StationsListItem'
import * as DataService from '@axdspub/axiom-ui-data-services'
import { api } from '@axdspub/erddap-service'
import { useSearchParams } from 'react-router-dom'
import React, { type ReactElement, useState, useEffect } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { ClipLoader } from 'react-spinners'
import { useSearchContext } from '@/Contexts/SearchContext'
import SearchService from '@/Services/Search'
import SensorDropdown from '@/Components/SensorDropdown/SensorDropdown'
import { Cross1Icon } from '@radix-ui/react-icons'

export default function Stations (): ReactElement {
  const [results, setResults] = useState<api.IErddapIndexResponse[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const { minTime, maxTime, minLatitude, minLongitude, maxLatitude, maxLongitude } = useSearchContext()
  const ITEMS_PER_PAGE = 10
  const initialDataService = new DataService.DataService({ resultType: 'csv', url: '', type: '' })
  const [dataService, setDataService] = useState(initialDataService)
  const [sensor, setSensor] = useState<string | undefined>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [initiallyCheckedParams, setInitiallyCheckedParams] = useState(false)

  const onSensorChange = (selected: string | undefined) => {
    setSensor(selected)
  }

  const onSearchInput = (query: string): any => {
    setQuery(query)
  }

  const updateSearchParams = () => {
    if (!initiallyCheckedParams) return
    if (query) {
      searchParams.set('text', query)
    } else if (query === '') {
      searchParams.delete('text')
    }
    setSearchParams(searchParams)
  }

  useEffect(updateSearchParams, [query])

  const setQueryFromParams = () => {
    const param = searchParams.get('text')
    if (param) onSearchInput(param)
    setInitiallyCheckedParams(true)
  }

  useEffect(setQueryFromParams, [])

  const getDatasets = async (page?: number): Promise<any> => {
    let searchFor = query
    if (query === '') {
      searchFor = 'all'
    }
    if (page === null || page === undefined) {
      page = 1
    }
    const search = new SearchService()
    const dataService = search.getDataServiceForAdvancedSearch(
      searchFor,
      page,
      ITEMS_PER_PAGE,
      minTime,
      maxTime,
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      sensor
    )
    setDataService(dataService)
    return dataService.get()
  }

  const onSearch = (): void => {
    setLoading(true)
    setHasMore(true)
    getDatasets().then(dataServiceResponse => {
      setLoading(false)
      const newResults = dataServiceResponse.data as (api.IErddapIndexResponse[] | null)
      if (newResults === null) {
        setHasMore(false)
      } else if (newResults.length < ITEMS_PER_PAGE) {
        setHasMore(false)
        setResults(newResults)
      } else {
        setResults(newResults)
      }
    }).catch(error => {
      console.error(error)
    })
  }

  const onScroll = (): void => {
    setLoading(true)
    setHasMore(true)
    setPage(page + 1)
    getDatasets().then(dataServiceResponse => {
      setLoading(false)
      const newResults = dataServiceResponse.data as (api.IErddapIndexResponse[] | null)
      if (newResults === null) {
        setHasMore(false)
      } else {
        setResults(results.concat(newResults))
      }
    }).catch(error => {
      console.error(error)
    })
  }

  const onQueryChanged = (): void => {
    if (dataService !== null && dataService !== undefined) {
      dataService.destroy()
      setPage(0)
      setResults([])
      if (query.length === 0) {
        setHasMore(false)
      }
      onSearch()
    }
  }

  useEffect(onQueryChanged, [query, sensor])

  const getCards = (): ReactElement[] => {
    return results.map((catalogItem, i) => (
      <StationsListItem
        key={`station-${catalogItem['Dataset ID']}-${i}`}
        datasetId={catalogItem['Dataset ID']}
        title={catalogItem.Title}
        summary={catalogItem.Summary} />
    ))
  }

  const endOfScroll = (): JSX.Element => {
    if (!hasMore) {
      return <div className='flex justify-center py-2'>
        <i>End of Results</i>
      </div>
    } else {
      return <></>
    }
  }

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: onScroll,
  })

  const loader = (): JSX.Element => {
    if (loading || hasMore) {
      return <div className='w-full flex justify-center py-2' ref={sentryRef}>
        <ClipLoader color='#3b82f6' />
      </div>
    } else {
      return <></>
    }
  }

  return (
    <div className='flex flex-col max-h-full'>
      <div className='w-full h-full relative'>
        <input
          className='border border-slate-300 px-4 py-6 w-full
          search-cancel:appearance-none search-cancel:w-4 search-cancel:h-4
          search-cancel:cursor-pointer
          active:outline-blue-800 focus:outline-blue-500 bg-slate-50'
          autoFocus
          placeholder='Search for stations'
          onChange={event => onSearchInput(event.target.value)}
          value={query}
        />
        <div className='absolute right-0 top-1/3 mr-4 active:text-blue-500' onClick={() => onSearchInput('')}>
          <Cross1Icon className='w-6 h-6' />
        </div>
      </div>
      <div className='px-4 py-4 flex justify-between'>
        <SensorDropdown onChange={onSensorChange}></SensorDropdown>
      </div>
      <div className='overflow-y-scroll no-scrollbar scrollbox'>
        <div className='flex flex-col divide-y'>{getCards()}</div>
        {loader()}
        {endOfScroll()}
      </div>
    </div>
  )
}
