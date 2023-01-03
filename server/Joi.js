const JOI = require('joi')

// Athenticate sign up form 
const authSignUp = JOI.object().keys({
    phone: JOI.string().trim().required(),
    email: JOI.string().trim().required(),
    password: JOI.string().trim().required()
})

// authentication login form 
const authLogin = JOI.object().keys({
    password: JOI.string().trim().required()
})

module.exports = {
    authSignUp, authLogin
}