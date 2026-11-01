import express from 'express'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
const app = express()

// middlewares
app.use(express.json())

//routes
app.use('/auth/', authRoutes)
app.use('/tasks', authMiddleware,taskRoutes)

const port = process.env.PORT || 4090

app.listen(port,() => {
    console.log(`Server is running at port: ${port}`)
})