import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import snarkdown from 'snarkdown'
// Vamos a usar nuestro Link modificado
import { Link } from '../components/Link'
import { useAuthStore } from '../store/authStore.js'
import { useFavoritesStore } from '../store/favoritesStore.js'
import styles from './Detail.module.css'

function JobSection ({ title, content }) {
  const html = snarkdown(content || '')

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {title}
      </h2>

      <div
        className={`${styles.sectionContent} prose`}
        dangerouslySetInnerHTML={{
          __html: html
        }}
      />
    </section>
  )
}

function DetailPageBreadCrumb ({ job }) {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link 
          to="/search" 
          className={styles.breadcrumbButton}
        >
          Empleos
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{job.titulo}</span>
      </nav>
    </div>
  )
}

function DetailPageHeader ({ job }) {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {job.titulo}
        </h1>
        <p className={styles.meta}>
          {job.empresa} · {job.ubicacion}
        </p>
      </header>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '2rem'
      }}>
        <DetailApplyButton />
        <DetailFavoriteButton jobId={job.id} />
      </div>
    </>
  )
}

function DetailApplyButton () {

  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  return (
    <button disabled={!isLoggedIn} className={styles.applyButton}>
      {isLoggedIn ? "Aplicar ahora" : "Inicia sesión para aplicar"}
    </button>
  )
}

function DetailFavoriteButton ({ jobId }) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  
  // La linea de abajo no se usaba y causaba re-render en cualquier cambio de favoritos
  // const favorites = useFavoritesStore(state => state.favorites)
  const isFavorite = useFavoritesStore(state => state.isFavorite)
  const isFav = isFavorite(jobId)
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite)

  return (
    <button
      disabled={!isLoggedIn}
      onClick={() => toggleFavorite(jobId)}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      style={{ marginBottom: '3rem'}}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  )
}

export default function JobDetail () {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`https://jscamp-api.vercel.app/api/jobs/${jobId}`)
      .then(response => {
        /* 
        Antes usando `navigate('/not-found')` sin return, se seguía ejecutando response.json() con la respuesta de error.
        Ahora simplemente enviamos un `throw` con el mensaje del error para que el catch lo maneje.
        */
        if (!response.ok) {
          throw new Error('Oferta no encontrada') // el catch ya renderiza el estado de error
        }

        return response.json()
      })
      .then(json => {
        setJob(json)
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [jobId, navigate])

  if (loading) {
    return <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
      <div className={styles.loading}>
        <p className={styles.loadingText}>Cargando...</p>
      </div>
    </div>
  }

  if (error || !job) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div className={styles.error}>
          <h2 className={styles.errorTitle}>
            Oferta no encontrada
          </h2>
          <button
            onClick={() => navigate('/')}
            className={styles.errorButton}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
      <DetailPageBreadCrumb job={job} />
      
      <DetailPageHeader job={job} />

      <JobSection title="Descripción del puesto" content={job.content.description} />
      <JobSection title="Responsabilidades" content={job.content.responsibilities} />
      <JobSection title="Requisitos" content={job.content.requirements} />
      <JobSection title="Acerca de la empresa" content={job.content.about} />
    </div>
  )
}