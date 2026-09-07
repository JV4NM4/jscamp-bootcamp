export function JobCard({ job }) {
  const tagsList = Array.isArray(job.data.technology) 
    ? job.data.technology.join(', ') 
    : job.data.technology;

  return (
    <article className="job-listing-card">
      <div>
        <h3>{job.titulo}</h3>
        <small>
          {job.empresa} | 📍 {job.ubicacion} | {tagsList}
        </small>
        <p>{job.descripcion}</p>
      </div>
      <button className="button-apply-job">Aplicar</button>
    </article>
  );
}