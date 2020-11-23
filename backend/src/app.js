const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')

const express = require('express')
const app = express()
const port = 3000
const db = require('./queries')
database = {uid: 1, usernameHash: "", usernameSalt: "", passwordHash: "", passwordSalt: ""}
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(cookieParser())
app.get('/addUser', (req, res) => db.addUser(req, res))
app.get('/login', (req, res) => db.login(req, res))
app.get('/logout', (req, res) => db.logout(req, res))
app.get('/isValidSession', (req, res) => db.isValidSession(req, res))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))