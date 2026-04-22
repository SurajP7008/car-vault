import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchCar, fetchCars } from '../services/api'
import { useMyCars } from '../context/MyCarsContext'
import styles from './CarDetail.module.css'

function CarHero({ car }) {
  return (
    <div className={styles.carHero} style={{ background: car.gradient }}>
      <svg viewBox="0 0 400 200" className={styles.carSvg} xmlns="http://www.w3.org/2000/svg">
        <g fill="rgba(255,255,255,0.9)">
          <path d="M320 115 L298 70 Q290 50 268 44 L158 40 Q130 36 110 56 L68 115 L38 120 Q28 124 28 134 L28 148 Q28 156 36 156 L52 156 Q52 175 72 175 Q92 175 92 156 L262 156 Q262 175 282 175 Q302 175 302 156 L356 156 Q364 156 364 148 L364 134 Q364 124 354 120 Z" />
          <ellipse cx="72" cy="157" rx="24" ry="24" fill="rgba(0,0,0,0.4)" />
          <ellipse cx="72" cy="157" rx="14" ry="14" fill="rgba(255,255,255,0.15)" />
          <ellipse cx="72" cy="157" rx="6" ry="6" fill="rgba(255,255,255,0.4)" />
          <ellipse cx="282" cy="157" rx="24" ry="24" fill="rgba(0,0,0,0.4)" />
          <ellipse cx="282" cy="157" rx="14" ry="14" fill="rgba(255,255,255,0.15)" />
          <ellipse cx="282" cy="157" rx="6" ry="6" fill="rgba(255,255,255,0.4)" />
          <path d="M120 56 L140 44 L228 44 L256 56 Z" fill="rgba(100,180,255,0.5)" />
          <circle cx="340" cy="100" r="4" fill="rgba(255,200,0,0.8)" />
          <circle cx="346" cy="108" r="3" fill="rgba(255,200,0,0.6)" />
        </g>
      </svg>
    </div>
  )
}

function SpecItem({ label, value, unit }) {
  return (
    <div className={styles.specItem}>
      <span className={styles.specLabel}>{label}</span>
      <span className={styles.specValue}>{value}{unit && <span className={styles.specUnit}> {unit}</span>}</span>
    </div>
  )
}

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasCar, addCar, removeCar } = useMyCars()
  const [car, setCar] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchCar(id)
      .then(data => {
        setCar(data)
        return fetchCars({ type: data.type })
      })
      .then(all => setSimilar(all.filter(c => c.id !== Number(id)).slice(0, 3)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className={styles.notFound}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className={styles.notFound}>
        <h2>{error ? `Error: ${error}` : 'Car not found'}</h2>
        <Link to="/cars" className={styles.backBtn}>← Back to Cars</Link>
      </div>
    )
  }

  const owned = hasCar(car.id)

  return (
    <div className={styles.page}>
      <div className="container">
        <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>

        <div className={styles.layout}>
          <div className={styles.leftCol}>
            <CarHero car={car} />

            <div className={styles.quickStats}>
              <div className={styles.quickStat}>
                <span className={styles.quickVal}>{car.hp}</span>
                <span className={styles.quickLabel}>Horsepower</span>
              </div>
              <div className={styles.quickStat}>
                <span className={styles.quickVal}>{car.acceleration}s</span>
                <span className={styles.quickLabel}>0-60 mph</span>
              </div>
              <div className={styles.quickStat}>
                <span className={styles.quickVal}>{car.topSpeed}</span>
                <span className={styles.quickLabel}>Top Speed mph</span>
              </div>
            </div>

            <div className={styles.descCard}>
              <h3 className={styles.cardTitle}>About</h3>
              <p className={styles.desc}>{car.description}</p>
            </div>

            <div className={styles.featuresCard}>
              <h3 className={styles.cardTitle}>Key Features</h3>
              <ul className={styles.featureList}>
                {car.features.map(f => (
                  <li key={f} className={styles.featureItem}>
                    <span className={styles.featureCheck}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.infoCard}>
              <div className={styles.typeRow}>
                <span className={styles.typeBadge}>{car.type}</span>
                <div className={styles.ratingRow}>
                  <span style={{ color: 'var(--gold)' }}>★</span>
                  <span>{car.rating}</span>
                  <span className={styles.reviewCount}>({car.reviews} reviews)</span>
                </div>
              </div>
              <h1 className={styles.carName}>{car.year} {car.make} {car.model}</h1>
              <div className={styles.price}>${car.price.toLocaleString()}</div>

              <button
                className={`${styles.garageBtn} ${owned ? styles.ownedBtn : ''}`}
                onClick={() => owned ? removeCar(car.id) : addCar(car)}
              >
                {owned ? '★ Remove from My Garage' : '+ Add to My Garage'}
              </button>
            </div>

            <div className={styles.specsCard}>
              <h3 className={styles.cardTitle}>Specifications</h3>
              <div className={styles.specGrid}>
                <SpecItem label="Engine" value={car.engine} />
                <SpecItem label="Transmission" value={car.transmission} />
                <SpecItem label="Drivetrain" value={car.drivetrain} />
                <SpecItem label="Horsepower" value={car.hp} unit="hp" />
                <SpecItem label="Torque" value={car.torque} unit="lb-ft" />
                <SpecItem label="0-60 mph" value={car.acceleration} unit="sec" />
                <SpecItem label="Top Speed" value={car.topSpeed} unit="mph" />
                <SpecItem label="Seats" value={car.seats} />
                {car.mpg > 0 && <SpecItem label="Fuel Economy" value={car.mpg} unit="mpg" />}
                {car.range && <SpecItem label="Electric Range" value={car.range} unit="mi" />}
              </div>
            </div>

            {similar.length > 0 && (
              <div className={styles.similarCard}>
                <h3 className={styles.cardTitle}>Similar Cars</h3>
                <div className={styles.similarList}>
                  {similar.map(c => (
                    <Link key={c.id} to={`/cars/${c.id}`} className={styles.similarItem}>
                      <div className={styles.similarThumb} style={{ background: c.gradient }} />
                      <div className={styles.similarInfo}>
                        <span className={styles.similarName}>{c.year} {c.make} {c.model}</span>
                        <span className={styles.similarPrice}>${c.price.toLocaleString()}</span>
                      </div>
                      <span className={styles.similarArrow}>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
