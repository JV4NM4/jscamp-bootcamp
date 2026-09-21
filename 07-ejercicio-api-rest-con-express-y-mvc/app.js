import express from 'express'
import { DEFAULTS } from './config.js'
import { corsMiddleware } from './middlewares/cors.js'
import { jobsRouter } from './routes/jobs.js'

const { PORT } = DEFAULTS // Ya que lo tenemos, podemos usar la variable en DEFAULTS
const app = express()

app.use(corsMiddleware())
app.use(express.json())

app.use('/jobs', jobsRouter)

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`)
})
