

const { default: mongoose } = require("mongoose");

const SurveyEntrySchema = new mongoose.Schema({

    // Have a system/schema to add/delete the survey fields such as address option 
    
    email:{
        type: String,
        unique:true,
        required: true
    },
    fields: {
        type: Array,
        required: true,
        defualt: []
    },
    survey_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
    
},{timestamps: true})


module.exports = mongoose.model("SurveyEntry", SurveyEntrySchema)