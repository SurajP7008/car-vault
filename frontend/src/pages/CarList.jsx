import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCars } from '../services/api'
import { carTypes, carMakes } from '../data/cars'
import CarCard from '../components/CarCard'
import styles from './CarList.module.css'

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'hp-desc', label: 'Most Powerful' },
  { value: 'accel-asc', label: 'Fastest 0-60' },
  { value: 'rating-desc', label: 'Top Rated' },
]

function sortCars(cars, sort) {
  const list = [...cars]
  switch (sort) {
    case 'price-asc': return list.sort((a, b) => a.price - b.price)
    case 'price-desc': return list.sort((a, b) => b.price - a.price)
    case 'hp-desc': return list.sort((a, b) => b.hp - a.hp)
    case 'accel-asc': return list.sort((a, b) => a.acceleration - b.acceleration)
    case 'rating-desc': return list.sort((a, b) => b.rating - a.rating)
    default: return list
  }
}

export default function CarList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [type, setType] = useState(searchParams.get('type') || 'All')
  const [make, setMake] = useState('All')
  const [sort, setSort] = useState('default')

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchCars({ type, make, search: query })
      .then(data => setCars(sortCars(data, sort)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [query, type, make, sort])

  const clearFilters = () => {
    setQuery(''); setType('All'); setMake('All'); setSort('default')
    setSearchParams({})
  }

  const hasFilters = query || type !== 'All' || make !== 'All' || sort !== 'default'

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Browse Cars</h1>
            <p className={styles.subtitle}>
              {loading ? 'Loading...' : `${cars.length} car${cars.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.search}
              type="text"
              placeholder="Search by make, model, type..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button className={styles.clearSearch} onClick={() => setQuery('')}>✕</button>
            )}
          </div>

          <div className={styles.filters}>
            <select className={styles.select} value={type} onChange={e => setType(e.target.value)}>
              {carTypes.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>
            <select className={styles.select} value={make} onChange={e => setMake(e.target.value)}>
              {carMakes.map(m => <option key={m} value={m}>{m === 'All' ? 'All Makes' : m}</option>)}
            </select>
            <select className={styles.select} value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {hasFilters && (
              <button className={styles.clearBtn} onClick={clearFilters}>Clear All</button>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            <span>⚠️ Could not reach the API: {error}</span>
            <p>Make sure the backend is running: <code>cd backend && npm run dev</code></p>
          </div>
        )}

        {loading && !error && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Loading cars...</span>
          </div>
        )}

        {!loading && !error && cars.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔭</span>
            <h3>No cars found</h3>
            <p>Try adjusting your search or filters</p>
            <button className={styles.clearBtn} onClick={clearFilters}>Reset Filters</button>
          </div>
        )}

        {!loading && !error && cars.length > 0 && (
          <div className={styles.grid}>
            {cars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  )
}
