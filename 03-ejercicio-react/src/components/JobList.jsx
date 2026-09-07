import { JobCard } from './JobCard';

// Recibimos los datos como prop (desestructurando { jobs })
export function JobList({ jobs }) {
  return (
    <div className="jobs-container">
      <div className="jobs-listings">
        {/* Mapeamos el array recibido en lugar del JSON completo */}
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}