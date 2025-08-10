var express = require('express');
const Survey = require('../models/Survey');
const SurveyEntry = require('../models/SurveyEntry');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// CREATE SURVEY FORM
router.post('/create-survery-form', function(req,res,next){
try{
  const {title,fields} = req.body
  // check if the fields are valid
  
  const survey = Survey.create({
    title,
    fields,
    createdBy:"Admin"
  })

  if(!survey){
        res.json({msg: "Encountered a problem while creating", error: true}).status(400)
    return
  }

    res.json({msg: "Succesfully added", data: survey})

}catch(err){
  res.json({msg: err, error: true}).status(500)

}
  
})

// FETCH ALL SURVEY FORMS
router.get('/get-survey', async (req,res,next)=>{
  const surveys = await Survey.find()

  res.json({msg:"Fetching success", data: surveys})
})

// FETCH ALL SURVEY ENTRIES FOR ALL SURVEYS
router.get('/temp-get-survey-entries', async (req,res,next)=>{
  const surveys = await SurveyEntry.find()

  res.json({msg:"Fetching success", data: surveys})
})

// FETCH ALL SURVEY ENTRIES FOR ALL SURVEYS
router.get('/get-survey-entries/:id', async (req,res,next)=>{
  const {id} = req.params
  const surveys = await SurveyEntry.find({survey_id:id})

  res.json({msg:"Fetching success", data: surveys})
})

// FILL SURVEY
router.post('/fill-survey/:id', async(req,res,next)=>{
try{
  const {id} = req.params
  if(!id) {
    res.json({msg: "Survey ID not found", error: true}).status(200)
  } 
  

  const survey =  await Survey.findOne({_id: id })

  const surveyFields = survey.fields

  const {fields, email} = req.body
  // Get the fields array. Each field array would contain objects for each field present in the particular survey 
  if(!Array.isArray(fields)) {
    res.json({msg:"Incorrect body format", error: true}).status(200)
  }

  // Check if all the fields mentioned in the survey fields are also present 
  // in the fields array coming from the frontend

  // survey field ['address' 'name']
  // fields incoming ['name', 'address']
  console.log("Email incoming", email)
  const surveryEntryExistBefore = await SurveyEntry.findOne({email: email, survey_id: id})
  let entry;
  if(surveryEntryExistBefore){
    console.log("Survey entry", surveryEntryExistBefore)
    /* res.json({msg: "Entry already eists for this survey", error: true})
    return  */
     entry = surveryEntryExistBefore
    entry.fields=[]
  }else{
    entry = new SurveyEntry({
    email,
    survey_id: id
  })

  }

  for(let field of fields){
    console.log("Fields incoming", Object.keys(field))
    const doesFieldExist = surveyFields.includes(Object.keys(field)[0])
    if(!doesFieldExist){
      res.json({msg:`${Object.keys(field)[0]} does not exist in this survey`,error: true}).status(200)
    }

    //save the particular field in the survery entries schema
    
    entry.fields.push(field)

  }
  entry.save()
  res.json({msg:"Success"}).status(200)



}catch(err){
  res.json({msg: err, error: true}).status(500)
}
  

})


module.exports = router;
