/* Aquí irá tu código del segundo ejercicio */

import  { db } from './database';
import jobsData from '../jobs.json';

//1. Crear las tablas

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`);

//2. Vaciar las tablas

db.exec(`
    DELETE FROM job_technologies;
    DELETE FROM job_content;
    DELETE FROM jobs;
    `);

//3. Preparar las consultas

const insertJob = db.prepare(`
  INSERT INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertTech = db.prepare(`
  INSERT INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`);

const insertContent = db.prepare(`
  INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (?, ?, ?, ?, ?, ?)
`);

//4. Transacción

const runSeed = db.transaction((jobs: any[]) => {
  for (const job of jobs) {

    // 1. Insertar el trabajo 
    insertJob.run(
      job.id,
      job.title,
      job.company,
      job.location,
      job.description,
      job.modality || job.data?.modality, 
      job.level || job.data?.level
    );

    // 2. Insertar las tecnologías
    const techs = job.technologies || job.data?.technology || [];
    for (const tech of techs) {
      insertTech.run(job.id, tech);
    }

    // 3. Insertar  contenido extra si lo tiene el JSON 
    if (job.content) {
      insertContent.run(
        job.content.id,
        job.id,
        job.content.description,
        job.content.responsibilities,
        job.content.requirements,
        job.content.about
      );
    }
  }
});


console.log('Ejecutando');
runSeed(jobsData);
console.log('Base de datos iniciada con éxito');