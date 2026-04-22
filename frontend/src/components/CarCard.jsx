import { Link } from 'react-router-dom'
import { useMyCars } from '../context/MyCarsContext'
import styles from './CarCard.module.css'

function CarIcon({ gradient }) {
  return (
    <div className={styles.carVisual} style={{ background: gradient }}>
      <svg viewBox="0 0 200 100" className={styles.carSvg} xmlns="http://www.w3.org/2000/svg">
        <g fill="rgba(255,255,255,0.9)">
          <path d="M160 55 L150 35 Q145 25 130 22 L80 20 Q65 18 55 28 L35 55 L20 58 Q15 60 15 65 L15 72 Q15 76 19 76 L25 76 Q25 85 35 85 Q45 85 45 76 L130 76 Q130 85 140 85 Q150 85 150 76 L175 76 Q179 76 179 72 L179 65 Q179 60 174 58 Z" />
          <ellipse cx="35" cy="76" rx="12" ry="12" fill="rgba(0,0,0,0.3)" />
          <ellipse cx="35" cy="76" rx="7" ry="7" fill="rgba(255,255,255,0.2)" />
          <ellipse cx="140" cy="76" rx="12" ry="12" fill="rgba(0,0,0,0.3)" />
          <ellipse cx="140" cy="76" rx="7" ry="7" fill="rgba(255,255,255,0.2)" />
          <path d="M60 28 L70 22 L115 22 L128 28 Z" fill="rgba(100,180,255,0.5)" />
        </g>
      </svg>
    </div>
  )
}

export default function CarCard({ car, compact = false }) {
  const { hasCar, addCar, removeCar } = useMyCars()
  const owned = hasCar(car.id)

  const handleGarageToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    owned ? removeCar(car.id) : addCar(car)
  }

  return (
    <Link to={`/cars/${car.id}`} className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <CarIcon gradient={car.gradient} />
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.type}>{car.type}</span>
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            <span>{car.rating}</span>
          </div>
        </div>
        <h3 className={styles.name}>{car.year} {car.make} {car.model}</h3>
        <div className={styles.specs}>
          <div className={styles.spec}>
            <span className={styles.specVal}>{car.hp}</span>
            <span className={styles.specLabel}>HP</span>
          </div>
          <div className={styles.specDivider} />
          <div className={styles.spec}>
            <span className={styles.specVal}>{car.acceleration}s</span>
            <span className={styles.specLabel}>0-60</span>
          </div>
          <div className={styles.specDivider} />
          <div className={styles.spec}>
            <span className={styles.specVal}>{car.topSpeed}</span>
            <span className={styles.specLabel}>MPH Top</span>
          </div>
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>${car.price.toLocaleString()}</span>
          <button
            className={`${styles.garageBtn} ${owned ? styles.owned : ''}`}
            onClick={handleGarageToggle}
            title={owned ? 'Remove from garage' : 'Add to garage'}
          >
            {owned ? '★ In Garage' : '+ Garage'}
          </button>
        </div>
      </div>
    </Link>
  )
}
