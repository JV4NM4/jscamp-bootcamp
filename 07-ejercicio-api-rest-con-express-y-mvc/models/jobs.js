import jobs from '../jobs.json' with { type: 'json' }
import crypto from 'node:crypto'

export class JobModel {
  static async getAll({ text, title, technology, limit, offset }) {
    let filteredJobs = [...jobs]

    // Filtro por título
    if (title) {
      filteredJobs = filteredJobs.filter(job => 
        job.titulo.toLowerCase().includes(title.toLowerCase())
      )
    }

    // Filtro por text
    if (text) {
      const searchText = text.toLowerCase()
      filteredJobs = filteredJobs.filter(job => 
        job.titulo.toLowerCase().includes(searchText) ||
        job.descripcion.toLowerCase().includes(searchText)
      )
    }

    // Filtro por technology
    if (technology) {
      filteredJobs = filteredJobs.filter(job => 
        job.data.technology.some(tech => tech.toLowerCase() === technology.toLowerCase())
      )
    }

    const total = filteredJobs.length
    const paginatedJobs = filteredJobs.slice(offset, offset + limit)

    return {
      data: paginatedJobs,
      total,
      limit,
      offset
    }
  }

  static async getById(id) {
    return jobs.find(job => job.id === id)
  }

  static async create(input) {
    const newJob = {
      id: crypto.randomUUID(),
      ...input
    }
    jobs.push(newJob)
    return newJob
  }

  static async update(id, input) {
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return false

    // PUT
    jobs[jobIndex] = { id, ...input }
    return jobs[jobIndex]
  }

  static async partialUpdate(id, input) {
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return false

    // PATCH
    jobs[jobIndex] = { ...jobs[jobIndex], ...input }
    return jobs[jobIndex]
  }

  static async delete(id) {
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return false

    jobs.splice(jobIndex, 1)
    return true
  }
}