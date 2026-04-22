import { Link } from 'react-router-dom'
import { useMyCars } from '../context/MyCarsContext'
import styles from './MyCars.module.css'

function GarageCarRow({ car }) {
  const { removeCar } = useMyCars()

  return (
    <div className={styles.carRow}>
      <div className={styles.thumb} style={{ background: car.gradient }}>
        <svg viewBox="0 0 160 80" className={styles.thumbSvg} xmlns="http://www.w3.org/2000/svg">
          <g fill="rgba(255,255,255,0.9)">
            <path d="M128 46 L120 28 Q116 20 106 18 L62 16 Q52 14 44 22 L27 46 L15 48 Q11 50 11 54 L11 59 Q11 62 14 62 L20 62 Q20 68 28 68 Q36 68 36 62 L104 62 Q104 68 112 68 Q120 68 120 62 L140 62 Q143 62 143 59 L143 54 Q143 50 139 48 Z" />
            <ellipse cx="28" cy="62" rx="10" ry="10" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="28" cy="62" rx="5" ry="5" fill="rgba(255,255,255,0.2)" />
            <ellipse cx="112" cy="62" rx="10" ry="10" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="112" cy="62" rx="5" ry="5" fill="rgba(255,255,255,0.2)" />
            <path d="M48 22 L56 16 L92 16 L102 22 Z" fill="rgba(100,180,255,0.5)" />
          </g>
        </svg>
      </div>

      <div className={styles.carInfo}>
        <div className={styles.carMeta}>
          <span className={styles.carType}>{car.type}</span>
          <span className={styles.carRating}>★ {car.rating}</span>
        </div>
        <h3 className={styles.carName}>{car.year} {car.make} {car.model}</h3>
        <div className={styles.carSpecs}>
          <span>{car.hp} hp</span>
          <span>·</span>
          <span>{car.acceleration}s 0-60</span>
          <span>·</span>
          <span>{car.topSpeed} mph top speed</span>
        </div>
      </div>

      <div className={styles.carActions}>
        <span className={styles.carPrice}>${car.price.toLocaleString()}</span>
        <div className={styles.btnGroup}>
          <Link to={`/cars/${car.id}`} className={styles.viewBtn}>View Details</Link>
          <button className={styles.removeBtn} onClick={() => removeCar(car.id)}>Remove</button>
        </div>
      </div>
    </div>
  )
}

function GarageStats({ cars }) {
  const totalValue = cars.reduce((sum, c) => sum + c.price, 0)
  const avgHp = Math.round(cars.reduce((sum, c) => sum + c.hp, 0) / cars.length)
  const fastestAccel = Math.min(...cars.map(c => c.acceleration))
  const topSpeedMax = Math.max(...cars.map(c => c.topSpeed))

  return (
    <div className={styles.statsBar}>
      <div className={styles.statCard}>
        <span className={styles.statIcon}>💰</span>
        <div>
          <div className={styles.statValue}>${totalValue.toLocaleString()}</div>
          <div className={styles.statLabel}>Total Fleet Value</div>
        </div>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statIcon}>⚡</span>
        <div>
          <div className={styles.statValue}>{avgHp} hp</div>
          <div className={styles.statLabel}>Average Power</div>
        </div>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statIcon}>🏁</span>
        <div>
          <div className={styles.statValue}>{fastestAccel}s</div>
          <div className={styles.statLabel}>Fastest 0-60</div>
        </div>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statIcon}>🚀</span>
        <div>
          <div className={styles.statValue}>{topSpeedMax} mph</div>
          <div className={styles.statLabel}>Top Speed</div>
        </div>
      </div>
    </div>
  )
}

export default function MyCars() {
  const { myCars, removeCar } = useMyCars()

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Garage</h1>
            <p className={styles.subtitle}>
              {myCars.length === 0
                ? 'Your garage is empty'
                : `${myCars.length} car${myCars.length !== 1 ? 's' : ''} in your collection`}
            </p>
          </div>
          {myCars.length > 0 && (
            <Link to="/cars" className={styles.addBtn}>+ Browse Cars</Link>
          )}
        </div>

        {myCars.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyGarage}>
              <span>🏠</span>
            </div>
            <h2>Your garage is empty</h2>
            <p>Browse our collection and add cars to build your dream garage.</p>
            <Link to="/cars" className={styles.browseBtn}>Browse Cars</Link>
          </div>
        ) : (
          <>
            <GarageStats cars={myCars} />

            <div className={styles.carList}>
              {myCars.map(car => (
                <GarageCarRow key={car.id} car={car} />
              ))}
            </div>

            <div className={styles.clearSection}>
              <button
                className={styles.clearAll}
                onClick={() => myCars.forEach(c => removeCar(c.id))}
              >
                Clear Garage
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
