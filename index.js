import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import db from './models/index.js'
import userRoutes from './routes/userRoutes.js'
import bodyParser from "body-parser"
 
dotenv.config()
//setting up your port
const PORT = process.env.PORT || 8080

//assigning the variable app to express
const app = express()

//middleware
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser())
app.use(helmet())

//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: true }).then(() => {
    console.log("db has been re sync")
})

//routes for the user API
app.use('/api/users', userRoutes)

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))