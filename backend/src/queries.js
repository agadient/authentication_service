const Pool = require('pg').Pool
const pool = new Pool({
user: 'admin',
host: 'db',
database: 'userInfo',
password: 'admin',
port: 5432,
})
const saltSize = 16
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants')
var Crypto = require("crypto")
const { response } = require('express')

var activeSessions = []

function getSalt() {
    return Crypto.randomBytes(saltSize).toString('hex');
}

function SHA256(data) {
    return Crypto.createHmac('sha256', data)
                 .digest('hex'); 
}

function addUser(req, res) {

    const {username, password} = req.query
    if (!username || !password) {
        res.status(404).send("ERROR INVALID PARAMS")
        return
    }

    let salt =  getSalt()
    let passwordHash = SHA256(password+salt)
    pool.query('INSERT INTO userInfo (username, passwordHash, salt) VALUES ($1, $2, $3)', [username, passwordHash, salt],  (error, results) => {
        if (error) {
            res.status(503).send("Database Error")
            return
        } else {
            res.status(200).send("User Added")
        }
    })    
}

function login(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Methods', 'http://localhost:3000');
    res.setHeader("Access-Control-Allow-Headers", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    const {username, password} = req.query
    
    if (!username || !password) {
        res.status(404).send("Username or Password Invalid!")
        return
    }

    pool.query('SELECT * FROM userInfo WHERE username=$1', [username],  (error, results) => {
        if (error) {
            res.status(503).send("Database Error")
            return
        } else {
            const entry = results.rows[0]
            if (entry === undefined) {
                res.status(401).send("No user by that name!") 
                return
            }
            if (SHA256(password + entry.salt) === entry.passwordhash) {
                const UID = entry.userid
                sessionSalt = getSalt()
                let tokenVal = SHA256(UID.toString()+sessionSalt)
                
                const addSession = true
                
                for (const session of activeSessions) {
                    if (session.UID === UID) {
                        addSession = false
                        break
                    }
                }                

                if (addSession) {
                    activeSessions.push({uid: UID, token: tokenVal})
                }

                res.cookie('sessionCookie', {uid: UID, token: tokenVal});
                res.status(200).send("Okay")
            } else {
                res.status(401).send("Invalid credentials")
                return
            }
        }
    })    
}

function logout(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Methods', 'http://localhost:3000');
    res.setHeader("Access-Control-Allow-Headers", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (isValidSession(req, undefined)) {
        if (req.cookies === undefined || req.cookies.sessionCookie === undefined) {
            res.status(401).send("No cookie")
            return
        }
        const sessionCookie = req.cookies.sessionCookie
        for (let i = 0; i < activeSessions.length; i++) {
            if (activeSessions[i].token === sessionCookie.token) {
                activeSessions.splice(i, 1)
                break
            }
        }
        res.clearCookie('sessionCookie') 
        res.status(200).send("Logged Out")
    } else {
        res.status(401).send("Invalid Session Cookie")
    }
}

function isValidSession(req, res) {
    if (res !== undefined && (req.cookies === undefined || req.cookies.sessionCookie === undefined)) {
        res.status(404).send("No cookie")
        return
    }
    const sessionCookie = req.cookies.sessionCookie
    if (sessionCookie === undefined) {
        return false
    }
    for (const session of activeSessions) {
        if (session.UID === sessionCookie.UID && session.tokenVal === sessionCookie.tokenVal) {
            if (res !== undefined) {
                res.status(200).send("Valid session")
                return
            } else {
                return true
            }
        }
    }
    if (res !== undefined) {
        res.status(401).send("Invalid Session")
        return
    } else {
        return false
    }
}

module.exports = {
    addUser,
    login,
    logout,
    isValidSession
}