'use client'

import StationsListItem from '@/app/components/stations-list-item/stations-list-item'
import * as DataService from '@axdspub/axiom-ui-data-services'
import { api } from '@axdspub/erddap-service'
import React, { type ReactElement, useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ClipLoader } from 'react-spinners'

const SERVER = 'https://erddap.sensors.axds.co/erddap'

export default function Stations (): ReactElement {
  const [results, setResults] = useState<api.IErddapIndexResponse[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 10
  console.log('DataService', DataService)
  console.log('api', api)
  const erddapApi = new api.ErddapApi(SERVER)
  const getCatalogSearchUrl = (page?: number): string => {
    let searchFor = query
    if (query === '') {
      searchFor = 'all'
    }
    if (page === null || page === undefined) {
      page = 1
    }
    return erddapApi.getUrl({
      request: 'search',
      // constraints: { searchFor, page, itemsPerPage: ITEMS_PER_PAGE },
      constraints: [
        {
          name: 'searchFor',
          operator: '=',
          value: searchFor
        },
        {
          name: 'itemsPerPage',
          operator: '=',
          value: ITEMS_PER_PAGE
        },
        {
          name: 'page',
          operator: '=',
          value: page
        }
      ],
      response: 'csv'
    })
  }
  const getNewDataService = (): DataService.DataService => {
    return new DataService.DataService({ type: '', resultType: 'csv', url: getCatalogSearchUrl() })
  }
  const [dataService, setNewDataService] = useState(getNewDataService())

  const onSearchInput = (query: string): any => {
    setQuery(query)
  }

  const onSearch = (): void => {
    setHasMore(true)
    const newDataService = getNewDataService()
    setNewDataService(newDataService)
    newDataService.get().then(dataServiceResponse => {
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
    console.log('scroll')
    setHasMore(true)
    setPage(page + 1)
    dataService.url = getCatalogSearchUrl(page + 1)
    dataService.get().then(dataServiceResponse => {
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
    dataService.destroy()
    setPage(0)
    setResults([])
    if (query.length === 0) {
      setHasMore(false)
    }
    onSearch()
  }

  useEffect(onQueryChanged, [query])

  const getCards = (): ReactElement[] => {
    return results.map((catalogItem, i) => (
      <StationsListItem
        key={`${catalogItem.Title}-${i}`}
        title={catalogItem.Title}
        summary={catalogItem.Summary} />
    ))
  }

  const loader = (): JSX.Element => {
    return <div className='w-full flex justify-center py-2'>
      <ClipLoader />
    </div>
  }

  const endOfScroll = (): JSX.Element => {
    return <div className='flex justify-center py-2'>
      <i>End of Results</i>
    </div>
  }

  const a = []
  for (let index = 0; index < 100; index++) {
    a.push(<div>{index}</div>)
  }

  return (
    <div className=''>
      <form className='fixed top-0 left-0 right-0 h-14 z-10'>
        <input
          className='absolute top-0 left-0 right-0 h-14 grow border border-slate-300 rounded px-4 py-4 mr-4 w-full
          search-cancel:appearance-none search-cancel:w-4 search-cancel:h-4
          search-cancel:bg-[url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg)]
          search-cancel:cursor-pointer
          active:outline-blue-800 focus:outline-blue-500'
          autoFocus
          placeholder='Search for stations'
          type='search'
          onChange={event => onSearchInput(event.target.value)}
        />
      </form>
      {/* <div className='overflow-auto'> */}
      <InfiniteScroll
        next={onScroll}
        hasMore={hasMore}
        loader={loader()}
        dataLength={results.length}
        endMessage={endOfScroll()}
        scrollThreshold={.1}
        height='100%'
        style={{ marginTop: '56px' }}
      >
        {getCards()}
      </InfiniteScroll>
    </div>
  )
}
