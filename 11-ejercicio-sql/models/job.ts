import crypto from 'node:crypto'
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'
//1. Importar base de datos
import { db } from '../db/database'

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener todos los resultados, y por cada filtro,
    // debemos agregarlo a la consulta
  let query = `
      SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
      FROM jobs j
      LEFT JOIN job_technologies jt ON j.id = jt.job_id
    `

  const conditions: string[] = []
  const params: unknown[] = []

  if (filters?.tech) {
      conditions.push(`jt.technology = ?`)
      params.push(filters.tech)
    }

  if (filters?.modality) {
      conditions.push(`j.modality = ?`)
      params.push(filters.modality)
    }

  if (filters?.level) {
      conditions.push(`j.level = ?`)
      params.push(filters.level)
    }

  if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
  }

  query += ' GROUP BY j.id'

  const rows = db.prepare(query).all(...params) as any[]

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    data: {
      technology: row.technologies ? row.technologies.split(',') : [],
      modality: row.modality,
      level: row.level
      }
    }))
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
  // TODO: Debemos hacer la consulta a la base de datos para obtener el job por ID
  const query = `
    SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
    FROM jobs j
    LEFT JOIN job_technologies jt ON j.id = jt.job_id
    WHERE j.id = ?
    GROUP BY j.id
   `
   
  const row = db.prepare(query).get(id) as any

  if (!row) return undefined

  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    data: {
      technology: row.technologies ? row.technologies.split(',') : [],
      modality: row.modality,
      level: row.level
    }
    }
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }
    //Preparar consulta sql
  const insertJob = db.prepare(`
    INSERT INTO jobs (id, title, company, location, description, modality, level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
  const insertTech = db.prepare(`
    INSERT INTO job_technologies (job_id, technology)
    VALUES (?, ?)
    `)

  const transaction = db.transaction(() => {
    insertJob.run(
      newJob.id, 
      newJob.title, 
      newJob.company, 
      newJob.location, 
      newJob.description, 
      newJob.data.modality, 
      newJob.data.level
    )
      
    for (const tech of newJob.data.technology) {
      insertTech.run(newJob.id, tech)
    }
  })

  transaction()

    // TODO: Debemos insertar el job en la base de datos
    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    // TODO: Debemos eliminar el job de la base de datos
    const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)
    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    // TODO: Debemos actualizar el job en la base de datos
    // Buscar el job actual usando método propio
    const existingJob =await this.getById(id)
    if (!existingJob) return null
    //Merge
    const updatedJob: Job = {
      ...existingJob,
      ...input,
      data: input.data
        ? { ...existingJob.data, ...input.data }
        : existingJob.data
    }
    // Preparar consultas sql
    const updateJob = db.prepare(`
      UPDATE jobs 
      SET title = ?, company = ?, location = ?, description = ?, modality = ?, level = ?
      WHERE id = ?
    `)
  const deleteTechs = db.prepare('DELETE FROM job_technologies WHERE job_id = ?')
  const insertTech = db.prepare('INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)')
    
    //Transacción
  const transaction = db.transaction(() => {
    // Actualización datos tabla principal
    updateJob.run(
      updatedJob.title,
      updatedJob.company,
      updatedJob.location,
      updatedJob.description,
      updatedJob.data.modality,
      updatedJob.data.level,
      id
    )

    // SSi el usuario modifica las tecnologías, se actualizan
    if (input.data?.technology) {
      deleteTechs.run(id) // Vaciamos las viejas
      for (const tech of updatedJob.data.technology) {
        insertTech.run(id, tech) // Metemos la lista nueva
      }
    }
  })

    transaction()
  
    return null
  }
}
