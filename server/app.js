const express = require('express');
const PORT = process.env.PORT || 5000;
const Path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config();

// SMS config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Email config 
const sendFrom = process.env.SEND_FROM

const store = require('store2')
const app = express()
const { authSignUp, authLogin } = require('./Joi')
const { sendMail } = require('./module')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(Path.join(__dirname, '../public')))

// Session
const expDate = 60 * 60 * 1000 * 24; // 1 hour 1 day
app.use(session({
    name: "chrisben",
    secret: '123',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: expDate,
        secure: false,
        sameSite: true // 'strict'
    }
}))




//--------- Sign up route ---------
app.get('/', (req, res) => {
    res.sendFile(Path.join(__dirname, './index.html'))
})


//------- Sign up route -------
app.post('/', (req, res) => {
    const { error, value } = authSignUp.validate(req.body)
    const { phone, email, password } = value
    const id = Math.random().toString(36).substring(2);

    const user = { // user info
        id: id,
        phone,
        email,
        password,
        otp: ''
    }

    if (error) {
        res.json(error.message)

    }else{
        var container = [], main;

        //------ Reading my json ------
        fs.readFile("myDb.json", "utf8", (err, jsonString) => {
            if (err) {
                res.json('something went wrong please try again.');
                return;
            }
            let result = JSON.parse(jsonString)

            const removeDuplicates = (arr) => [...new Set(arr)] // Remove duoble answers
            for(let i = 0; i < result.length;) {
                container.push(result[i], user)
                main = removeDuplicates(container)
                i++
            }

            // storing new user in the json file
            let newUser = JSON.stringify(main)
            fs.writeFile('myDb.json', newUser, (err) => {
                if (err) {
                    res.json('something went wrong please try again.')

                }else{
                    res.json('true')
                }
            })
        });
    }
})


//------- Login route -------
app.post('/login', (req, res) => {
    const { error, value } = authLogin.validate(req.body)

    if (error) {
        res.json(error.message)

    }else{
        fs.readFile("myDb.json", "utf8", (err, jsonString) => {
            let result = JSON.parse(jsonString)
            if (err) {
                res.json('something went wrong please try again.');
                return;

            }else{
                //---- Checking if user exists ----
                let user = result.filter(user => user.password == value.password)
                if (user[0] !== undefined) {
                    res.json('true')
                    
                }else{
                    res.json('User does not exist')
                }
            }
        })
    }
})



//------ Send Otp route ------
app.post('/verify/user', (req, res) => {
    const { method, userData } = req.body
    var user, otp = Math.floor(1000 + Math.random() * 9000);

    //------ Reading my json ------
    fs.readFile("myDb.json", "utf8", (err, jsonString) => {

        const result = JSON.parse(jsonString)
        const otpReceiver = result.filter(user => user.password == userData)
        var receiverNumber = +otpReceiver[0].phone, newOtp = otp;
        
        if (err) {
            res.json('something went wrong please try again.');
            return;
        }

        //--- Sending verification code to the user ---
        if (otpReceiver) { 
            if (method == 'sms') { //SMS otp
                client.messages.create({
                    body: newOtp,
                    from: +18316043239,
                    to: +receiverNumber,
                }).then(data => {
                    if (data) {
                        saveOtp()
                        res.json("sms sent")
                    }
                }).catch((err) => {
                    if (err) {
                        res.json({err: "SMS not sent, please try again."})
                    }
                })  
            }

            if (method == 'email') { //Email otp
                    
                let mailDetails = {
                    from: sendFrom,
                    to: otpReceiver[0].email,
                    subject: 'Verification code from prowess hub',
                    html: `OTP: <h1>${newOtp.toString()}</h1>`
                };
                    
                sendMail().sendMail(mailDetails, function(err, data) {
                    if(err) {
                        res.json({err: 'Email not sent please try again'});
                    } else {
                        saveOtp()
                        return res.json('Email sent successfully');
                    }
                });
            }
        }

        // --- Adding the verification code the users data ---
        const saveOtp = () => {
            if (otpReceiver) {
                user = {...otpReceiver[0], otp: newOtp} // Assigning otp to the user
                // Getting the position of the user that is to be updated with an otp code 
                index = result.findIndex(user => user.id === otpReceiver[0].id);
                // updating the user with a new otp code
                if (index !== -1) {
                    result[index] = user
                    //storing the user with a new otp code
                    let newUser = JSON.stringify(result)
                    fs.writeFile('myDb.json', newUser, (err) => {
                        if (err) {
                            res.json('something went wrong please try again.')
                        }
                        return userSession = user
                    })
                }  
            }
        }
    });
   

})


//----- Verify otp -----
app.post('/verifyOtp', (req, res) => {
    let response, user;
    const { code, userData } = req.body

    fs.readFile("myDb.json", "utf8", (err, jsonString) => {
        if (err) {
            res.json('Something went wrong please try again.')

        }else{
            response = JSON.parse(jsonString)
            user = response.filter(user => user.password == userData)

            if (user[0].otp == +code) { //Verifying otp before going to dashboard
                res.json('true')
            }else{
                res.json('Incorrect otp')
            }
        }
    })

})


//--- Recover password route ---
app.post('/recover/password', (req, res) => {
    let response, user;

    fs.readFile("myDb.json", "utf8", (err, jsonString) => {
        if (err) {
            res.json('Something went wrong please try again.')

        }else{
            response = JSON.parse(jsonString)
            user = response.filter(user => user.email == req.body.email)
            if (user[0] == undefined) {
                res.json('User does not exist')

            }else if(user) {

                let mailDetails = { //Send recovered password
                    from: sendFrom,
                    to: user[0].email,
                    subject: 'Password recovered from prowess hub',
                    html: `Your password: <h1>${user[0].password}</h1>`
                };
                    
                sendMail().sendMail(mailDetails, function(err, data) {
                    if(err) {
                        res.json('Password not sent try again.');
                    } else {
                        saveOtp()
                        res.json('Password sent');
                    }
                });
            }
        }
    })
})



app.listen(PORT, () => console.log(`App running on port ${PORT}`));
// email Password: mhebhgdrisoonlvl
