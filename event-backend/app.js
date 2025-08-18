const express=require('express')
const morgan=require('morgan')
const app=express()
const cors=require('cors')
require('dotenv').config()
require('./db/connection')
app.use(morgan('dev'))
app.use(cors());
app.use(express.json())

const userRoutes=require('./routes/userRoutes')
const eventRoutes=require('./routes/eventRoutes')
const bookingRoutes=require('./routes/bookinRoutes')
const stripeRoutes=require('./routes/stripeRoutes')
const messageRoutes=require('./routes/messageRoutes')

app.use('/api/users',userRoutes)
app.use('/api/events',eventRoutes)
app.use('/api/bookings',bookingRoutes)
app.use('/api/stripe',stripeRoutes)
app.use('/api/messages',messageRoutes)


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on PORT ${process.env.PORT}`)
});