/*
    Gets the whole response from Bitbucket's webhook call and creates a
    message to be sent on slack.
 */

const request = require('request');
const map = require('./usermap')
const variables = require('./variables')

exports.sendMessages = function (data) {
    const title = data.title
    const author = data.author.user.displayName
    const url = data.links.self[0].href
    const reviewers = data.reviewers

    const message = variables.message
        + "\n *Name:* "
        + title
        + "\n *Author:* "
        + author
        + "\n *Reviewers:* "
        + prettyPrintReviewers(reviewers)
        + "\n\t *<" + url + " | Review Now →>*"

    for (reviewer of reviewers) {
        const email = reviewer.user.emailAddress
        map.getIdByEmail(email)
            .then(userId => sendMessageWithEmail(userId, message))
            .catch(handleError(email))
    }
    
}

function sendMessageWithEmail(userId, message) {
    console.log(message)
    request.post({
        url: "https://slack.com/api/chat.postMessage",
        form: {
            token: process.env.SLACK_BOT_TOKEN,
            as_user: true,
            channel: userId,
            blocks: JSON.stringify([
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: message
                    },
                    accessory: {
                        type: "image",
                        image_url: variables.gifUrl,
                        alt_text: "Pull Request Ready!"
                    }
                }
            ])
        }
    })
}

function prettyPrintReviewers(reviewers) {
    let reviewerNames = ""
    const len = reviewers.length

    if (len != 1) {
        for (let i = 0; i < len; i++) {
            if (i != len - 1 && len) {
                reviewerNames += (reviewers[i].user.displayName + ", ")
            } else {
                reviewerNames += "and " + reviewers[i].user.displayName
            }
        }
    } else {
        reviewerNames = reviewers[0].user.displayName
    }

    return reviewerNames
}

function handleError(email) {
    console.log("Error when searching for user with email " + email)
}