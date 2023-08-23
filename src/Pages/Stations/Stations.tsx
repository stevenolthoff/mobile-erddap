import StationsListItem from '@/Components/StationsListItem/StationsListItem'
import * as DataService from '@axdspub/axiom-ui-data-services'
import { api } from '@axdspub/erddap-service'
import { Link, useLocation } from 'react-router-dom'
import React, { type ReactElement, useState, useEffect } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { ClipLoader } from 'react-spinners'
import { useSearchContext } from '@/Contexts/SearchContext'
import SearchService from '@/Services/Search'
import SensorDropdown from '@/Components/SensorDropdown/SensorDropdown'

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
  const { search } = useLocation()

  const onSensorChange = (selected: string | undefined) => {
    setSensor(selected)
  }

  const onSearchInput = (query: string): any => {
    setQuery(query)
  }

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
      <Link
        key={`${catalogItem.Title}-${i}`}
        to={`/stations/${catalogItem['Dataset ID']}${search}`}
      >
        <StationsListItem
          title={catalogItem.Title}
          summary={catalogItem.Summary} />
      </Link>
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
      <input
        className='top-0 left-0 right-0 h-14 grow border border-slate-300 px-4 py-4 mr-4 w-full
        search-cancel:appearance-none search-cancel:w-4 search-cancel:h-4
        search-cancel:bg-[url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg)]
        search-cancel:cursor-pointer
        active:outline-blue-800 focus:outline-blue-500 bg-slate-50'
        autoFocus
        placeholder='Search for stations'
        type='search'
        onChange={event => onSearchInput(event.target.value)}
      />
      <div className='px-4 py-4 flex justify-between'>
        <SensorDropdown onChange={onSensorChange}></SensorDropdown>
        <div>Other Filters</div>
      </div>
      <div className='overflow-y-scroll no-scrollbar scrollbox'>
        <div className='flex flex-col divide-y'>{getCards()}</div>
        {loader()}
        {endOfScroll()}
      </div>
    </div>
  )
}
