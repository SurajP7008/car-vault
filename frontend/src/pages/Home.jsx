import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchCars } from '../services/api'
import CarCard from '../components/CarCard'
import styles from './Home.module.css'

const FEATURED_IDS = [14, 1, 3, 9]
const HERO_GRADIENTS = [
  'linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #ff6b6b 100%)',
  'linear-gradient(135deg, #e67e22 0%, #f39c12 50%, #f9ca24 100%)',
  'linear-gradient(135deg, #1a6fa8 0%, #3498db 50%, #5dade2 100%)',
  'linear-gradient(135deg, #1e8449 0%, #2ecc71 50%, #58d68d 100%)',
  'linear-gradient(135deg, #6c3483 0%, #8e44ad 50%, #a569bd 100%)',
  'linear-gradient(135deg, #148f77 0%, #1abc9c 50%, #48c9b0 100%)',
]

const stats = [
  { value: '15+', label: 'Cars Listed' },
  { value: '7', label: 'Categories' },
  { value: '10+', label: 'Car Brands' },
  { value: '4.7★', label: 'Avg Rating' },
]

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([])
  const [featuredError, setFeaturedError] = useState(false)

  useEffect(() => {
    fetchCars()
      .then(all => setFeaturedCars(all.filter(c => FEATURED_IDS.includes(c.id))))
      .catch(() => setFeaturedError(true))
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCars}>
            {HERO_GRADIENTS.map((g, i) => (
              <div key={i} className={styles.heroCarDot} style={{ background: g }} />
            ))}
          </div>
          <div className={styles.heroGlow} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>World-Class Car Database</div>
          <h1 className={styles.heroTitle}>
            Discover Your
            <span className={styles.heroAccent}> Dream Car</span>
          </h1>
          <p className={styles.heroSub}>
            Explore detailed specs, performance data, and features for the world's most iconic
            and exciting automobiles — from everyday sports cars to legendary hypercars.
          </p>
          <div className={styles.heroCta}>
            <Link to="/cars" className={styles.btnPrimary}>Browse All Cars</Link>
            <Link to="/my-cars" className={styles.btnSecondary}>My Garage</Link>
          </div>
        </div>
      </section>

      <section className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Cars</h2>
              <p className={styles.sectionSub}>Handpicked highlights from our collection</p>
            </div>
            <Link to="/cars" className={styles.viewAll}>View All →</Link>
          </div>
          {featuredError ? (
            <p style={{ color: '#e74c3c', textAlign: 'center', padding: '2rem' }}>
              Could not load featured cars — make sure the backend is running:<br />
              <code>cd backend &amp;&amp; npm run dev</code>
            </p>
          ) : (
            <div className={styles.featuredGrid}>
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>Browse by Type</h2>
            <p className={styles.sectionSub}>Find cars that match your passion</p>
            <div className={styles.categoryGrid}>
              {[
                { type: 'Sports', icon: '🏎️', count: 7 },
                { type: 'Sedan', icon: '🚗', count: 2 },
                { type: 'Electric', icon: '⚡', count: 2 },
                { type: 'Muscle', icon: '💪', count: 1 },
                { type: 'SUV', icon: '🚙', count: 1 },
                { type: 'Hypercar', icon: '🚀', count: 1 },
              ].map(cat => (
                <Link
                  key={cat.type}
                  to={`/cars?type=${cat.type}`}
                  className={styles.categoryCard}
                >
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                  <span className={styles.categoryName}>{cat.type}</span>
                  <span className={styles.categoryCount}>{cat.count} {cat.count === 1 ? 'car' : 'cars'}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Build Your Dream Garage</h2>
            <p>Save your favourite cars and keep track of the vehicles you love most.</p>
            <Link to="/my-cars" className={styles.btnPrimary}>Open My Garage</Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <span className={styles.footerLogo}>⚡ Car<strong>Vault</strong></span>
            <span className={styles.footerText}>© 2024 CarVault. Built with React.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
