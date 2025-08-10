const { default: mongoose } = require("mongoose");

const SurveySchema = new mongoose.Schema({

    // Have a system/schema to add/delete the survey fields such as address option 
    
    title:{
        type: String,
        default: "Schema",
        required: true
    },
    fields: {
        type: Array,
        required: true,
        defualt: ['address', 'name', 'email', 'phoneNumber', 'feedback']
    },
    createdBy: {
        type: String,
        //ref: UserSchema,
        required: true
    }
    
},{timestamps: true})


module.exports = mongoose.model("Survey", SurveySchema)