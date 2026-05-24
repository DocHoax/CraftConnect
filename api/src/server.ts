import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth'
import artisanRoutes from './routes/artisans'
import bookingRoutes from './routes/bookings'
import categoryRoutes from './routes/categories'
import { authLimiter } from './middleware/rate-limit'
import { errorHandler, notFoundHandler } from './middleware/error'

const app = express()
const port = Number(process.env.PORT || 4000)
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((v) => v.trim())

app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/auth/login', authLimiter)
app.use('/auth/register', authLimiter)

app.use('/auth', authRoutes)
app.use('/artisans', artisanRoutes)
app.use('/categories', categoryRoutes)
app.use('/bookings', bookingRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://localhost:${port}`)
})
