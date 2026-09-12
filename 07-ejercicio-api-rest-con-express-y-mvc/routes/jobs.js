import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'

export const jobsRouter = Router()

/* Aquí debe ir la lógica de tus rutas */
/* Recuerda que en tus rutas debes usar los controladores */
/* 
Deberás implementar:
- Obtener todos los jobs [GET]
- Obtener un job por id [GET]
- Crear un job [POST]
- Actualizar un job por id [PUT]
- Actualizar parcialmente un job por id [PATCH]
- Eliminar un job por id [DELETE]
*/
// GET: Leer datos
jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getId)

// POST: Crear nuevo
jobsRouter.post('/', JobController.create)

// PUT / PATCH: Actualizar
jobsRouter.put('/:id', JobController.update)
jobsRouter.patch('/:id', JobController.partialUpdate)

// DELETE: Borrar
jobsRouter.delete('/:id', JobController.delete)