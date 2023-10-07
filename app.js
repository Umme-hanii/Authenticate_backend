import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { connectDB } from './db/connect.js'
import roleRoute from './routes/role.js'
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import { notFound } from './middleware/not-found.js'
// import { errorHandlerMiddleware } from './middleware/error-handler.js'
dotenv.config()

const app = express()
const port = process.env.PORT | 5000

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
)
app.use('/api/role', roleRoute)
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)

//Response Handler Middleware
app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500
  const message = obj.message || 'Something went wrong'
  return res.status(statusCode).json({
    success: [200, 201, 204].some((a) => a === statusCode) ? true : false,
    status: statusCode,
    message: message,
    data: obj.data,
  })
})
app.use(notFound)
// app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
