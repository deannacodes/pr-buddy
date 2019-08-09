/*
    Checks if the email is in the users.json file store
    If it is, get the acompanying userId
    If not, use the slack API with the given email and get 
    the userId.

*/

const request = require('request');
const fs = require('fs');
const slackUrl = 'https://slack.com/api/users.lookupByEmail?token=' +
    process.env.SLACK_BOT_TOKEN +
    '&email=';
const variables = require('./variables')

exports.getIdByEmail = function (email) {
    return new Promise((resolve, reject) => {
        if (variables.storeUsers) {
            getIdByEmailLocal(email)
                .then(userId => resolve(userId))
                .catch(error => console.log(error))
        } else {
            getIdByEmailNetwork(email)
                .then(userId => resolve(userId))
                .catch(error => console.log(error))
        }
    })
}

function getIdByEmailLocal(email) {
    return new Promise((resolve, reject) => {
        fs.readFile('users.json', 'utf8', (err, rawData) => {
            const data = JSON.parse(rawData)
            if (data[email] != undefined) {
                resolve(data[email])
            }
            else {
                getIdByEmailNetwork(email).then(userId => addToUserFile(email, userId))
                .then(userId => resolve(userId))
                .catch(error => console.log(error))
            }
        })
    })
}

function getIdByEmailNetwork(email) {
    return new Promise((resolve, reject) => {
        request(slackUrl + email, function (error, message, body) {
            const res = JSON.parse(body)
            if (!error && res.ok == true) {
                resolve(res.user.id);
            } else {
                reject(error)
            }
        })
    })
}

function addToUserFile(email, userId) {
    return new Promise((resolve, reject) => {
        fs.readFile('users.json', 'utf8', (err, rawData) => {
            if (err) reject(err)
            const data = JSON.parse(rawData)
            data[email] = userId
            fs.writeFile('./users.json', JSON.stringify(data), () => {
                resolve(userId)
            })
        })
    })
}
