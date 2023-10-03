import express from 'express'
import dotenv from 'dotenv'

import { connectDB } from './db/connect.js'
import { notFound } from './middleware/not-found.js'
import { errorHandlerMiddleware } from './middleware/error-handler.js'
dotenv.config()

const app = express()
const port = process.env.PORT | 5000

app.get('/', (req, res) => res.send('Here you go!'))
app.use(notFound)
app.use(errorHandlerMiddleware)

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