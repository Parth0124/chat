import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/AuthRoutes.js'

dotenv.config()

//initialize the app
const app = express()

//fetch the .env variables
const port = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URL;

//middlewares
app.use(cors({
    origin:[process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials:true,
}))

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)

//listen to server
const server = app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})

//connect db
mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
