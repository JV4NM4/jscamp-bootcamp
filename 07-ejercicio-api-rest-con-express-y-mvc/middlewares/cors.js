import cors from 'cors'

/* Aquí debe ir la lógica de tu middleware */
const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:1234',
  'https://midu.dev',
  'http://jscamp.dev',
  'http://localhost:5173'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    // Permitir orígenes aceptado
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    // Permitir peticiones sin origen 
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Error: Not allowed by CORS'))
  }
})