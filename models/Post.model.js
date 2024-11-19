import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:String, 
        required:true
    },
    author:{
        type:String, 
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    description:{
        type:String
    },
    photos: {
        type: [String],
        default:[]
    },
    address: {
        type: String,
        default: ''
    },
    isHouse: {
        type: Boolean,
        default: false
    },
    numberOfRooms: {
        type: Number,
        default: 0
      },
    isDepartment: {
        type: Boolean,
        default: false
    },
    hasWaterService: {
        type: Boolean,
        default: false
    },
    hasGasService: {
        type: Boolean,
        default: false
    },
    hasInternetService: {
        type: Boolean,
        default: false
    },
    hasElectricService: {
        type: Boolean,
        default: false
    },
    hasPhone: {
        type: Boolean,
        default: false
    },
    hasParking: {
        type: Boolean,
        default: false
    }
})

const Post = mongoose.model('Post', postSchema)

export {Post}