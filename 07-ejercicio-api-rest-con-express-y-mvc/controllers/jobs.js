/* Aquí debe ir la lógica de tu controlador */
import { JobModel } from '../models/jobs.js'
import { DEFAULTS } from '../config.js'

export class JobController {
  static async getAll(req, res) {
    const { title, text, technology } = req.query
    
    // Valores por defecto
    const limit = req.query.limit ? Number(req.query.limit) : DEFAULTS.LIMIT_PAGINATION
    const offset = req.query.offset ? Number(req.query.offset) : DEFAULTS.LIMIT_OFFSET

    // Llamada
    const result = await JobModel.getAll({ text, title, technology, limit, offset })
    
    return res.json(result)
  }

  static async getId(req, res) {
    const { id } = req.params
    const job = await JobModel.getById(id)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    return res.json(job)
  }
  static async create(req, res) {
    const newJob = await JobModel.create(req.body)
    return res.status(201).json(newJob)
  }

  static async update(req, res) {
    const { id } = req.params
    const updatedJob = await JobModel.update(id, req.body)
    if (!updatedJob) return res.status(404).json({ error: "Job not found" })
    return res.json(updatedJob)
  }

  static async partialUpdate(req, res) {
    const { id } = req.params
    const updatedJob = await JobModel.partialUpdate(id, req.body)
    if (!updatedJob) return res.status(404).json({ error: "Job not found" })
    return res.json(updatedJob)
  }

  static async delete(req, res) {
    const { id } = req.params
    const result = await JobModel.delete(id)
    if (!result) return res.status(404).json({ error: "Job not found" })
    return res.status(204).send()
  }
}