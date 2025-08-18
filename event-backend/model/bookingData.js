const mongoose=require('mongoose')
const bookingschema=mongoose.Schema({
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true

    },
    eventId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Event',
      required:true
    },
    seats: {
      type: Number,
      required: true
    },
    status:{
      type:String,
      enum:['booked','check-in','cancelled'],
      default:'booked'
    },
    paymentStatus: { type: String, 
    enum: ['paid', 'pending', 'failed'],
    default: 'paid' 
  },

    calendarEventId:{
      type:String
    },
    bookedAt:{
      type:Date,
      default:Date.now
    },
    qrcode: {             // <--- ADD THIS
      type: String
    },
    amountPaid: { type: Number, } 
},{timestamps:true})
const bookingData=mongoose.model('booking',bookingschema)
module.exports=bookingData