import { Schema, model } from "mongoose";

const noteSchema = new Schema({
    title:
    {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return !(value === value.toUpperCase())
            },
            message: 'Note should not entirely uppercase.'
        }
    },
    content:
    {
        type: String,
        required: true,
    },
    userId:
    {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
},
    {
        timestamps: true
    })

const noteModel = model("note", noteSchema)

export default noteModel