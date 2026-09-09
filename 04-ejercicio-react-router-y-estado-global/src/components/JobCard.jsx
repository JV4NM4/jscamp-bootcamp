import { useState } from "react"
import { Link } from "react-router" 
import { useFavoritesStore } from '../store/favoritesStore.js';
import { useAuthStore } from '../store/authStore.js';
import styles from './JobCard.module.css'

function JobCardApplyButton ({ jobId }) {
  const [isApplied, setIsApplied] = useState(false)
  
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

  const handleApplyClick = (e) => {
    e.preventDefault(); 
    console.log('Aplicando al trabajo con id:', jobId)
    setIsApplied(true)
  }

  return (
    <button disabled={!isLoggedIn} className={buttonClasses} onClick={handleApplyClick}>
      {buttonText}
    </button>
  )
}

function JobCardFavoriteButton({ jobId }) { 
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  
  const favorites = useFavoritesStore(state => state.favorites)
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite)
  const isFavorite = useFavoritesStore(state => state.isFavorite)

  return (
    <button
      disabled={!isLoggedIn}
      onClick={() => toggleFavorite(jobId)}
      aria-label={isFavorite(jobId) ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite(jobId) ? '❤️' : '🤍'}
    </button>
  );
}

export function JobCard({ job }) {
  const description = job.descripcion || job.content?.description;

  return (
    <article className="job-listing-card">
      <div>
        <h3>
          <Link className={styles.title} to={`/jobs/${job.id}`}>
            {job.titulo}
          </Link>
        </h3>
        <small>{job.empresa} | {job.ubicacion}</small>
        <p>{description}</p>
      </div>
    
      <div className={styles.actions}>
        <Link to={`/jobs/${job.id}`} className={styles.details}>
          Ver detalles
        </Link>

        <JobCardApplyButton jobId={job.id} />
        <JobCardFavoriteButton jobId={job.id} />
      </div>
    </article>
  )
}