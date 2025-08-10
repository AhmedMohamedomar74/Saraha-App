import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName:{
        type:String,
        required : true,
        trim : true,
        lowercase : true
    },
    secondName:{
        type:String,
        required : true,
        trim : true,
        lowercase : true
    },
    email:{
        type:String,
        unique : true,
        required : function () {
            if (this.phoneNumber) {
                return false
            }
            return true
        },
        trim:true,
        sparse : true
    },
    password:
    {
        type:String,
        required:true
    },
    phoneNumber : 
    {
        type : String,
        unique: true,
        required : function () {
            if (this.email) {
                return false
            }
            return true
        },
        sparse: true
    },
    DOB:
    {
        type : Date
    }
},
{
    timestamps : true
})

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} + ${this.secondName}`
})


userSchema.virtual("fullName").set(function (fullname) {
    this.firstName = fullname.split(" ")[0]
    this.secondName = fullname.split(" ")[1]
})

userSchema.virtual("age").get(function () {
    let currentDate =  new Date()
    let DOB =  new Date(this.DOB)

    return  currentDate.getFullYear()  - DOB.getFullYear()
})
const userModel = model("user",userSchema)

export default userModel