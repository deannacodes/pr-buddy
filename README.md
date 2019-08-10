# PR Buddy
Slack bot which alerts reviewers when a new pull request is made via Bitbucket Server. This won't work on Bitbucket Cloud because the response you get is different. 

It works by getting the emails of the reviewers, then looking them up on your specified slack workspace, and sending them a DM. 

# Create a Slack App
Create an app through Slack. [Here's the docs](https://api.slack.com/#read_the_docs) for that. Install it to the workspace you're deploying it to.

# Installation
Clone the repository and run `npm install` to install required packages. Open `variables.json` in a text editor and plug in the info that you want. 

I recommend hosting the app on Heroku. [Here's a guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs) to get started with Heroku. 

Once you've pushed to heroku, you'll need to set up an environment variable. In the command line:

`heroku config:set SLACK_BOT_TOKEN=Bot User OAuth Access Token`

# Set a Webhook
In your Bitbucket Server repository that you want to notify the slackbot, go to settings -> webhooks. Paste in the webhook that you specified in `variables.json` and check the box for when pull requests are created. It'll look something like `http://my-slack-bot.heroku.com/webhook/for/pullrequest/alert`. 

Thats it! All users who are assigned to a pull request should now get a DM in Slack when a PR is created that they've been assigned to.
