import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.MONGODB_URI
mongoose.connect(uri, {useNewUrlParser: true})
const MeetingSchema = {
    name: String,
    location: String,
    email: String,
    date: String,
    time: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
}
const MeetingDB = mongoose.model("adoptassist", MeetingSchema, 'schedulings')
export default MeetingDB