import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMyCars } from '../context/MyCarsContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const location = useLocation()
  const { myCars } = useMyCars()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span>Car<strong>Vault</strong></span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>Home</Link>
          <Link to="/cars" className={`${styles.link} ${isActive('/cars') ? styles.active : ''}`}>Browse Cars</Link>
          <Link to="/my-cars" className={`${styles.link} ${styles.myCarLink} ${isActive('/my-cars') ? styles.active : ''}`}>
            My Garage
            {myCars.length > 0 && <span className={styles.badge}>{myCars.length}</span>}
          </Link>
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
