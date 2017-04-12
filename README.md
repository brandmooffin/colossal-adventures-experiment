# Colossal Adventures #



Colossal Adventures is a take on the old-school texted based adventure games. The game has been reimagined for Google Home, using voice commands to navigate and take action on your quest. 

Submission for Google I/O 2017.

Demo video:
https://youtu.be/Zi2GVUFnVzA

### Setup ###

Steps for API.AI

* Create a new agent in API.AI https://api.ai.
* Click on the project gear icon to see the project settings.
* Select "Export and Import".
* Select "Restore from zip". Follow the directions to restore.
* Select the ApiAiAgent/Colossal-Adventures.zip file in this repo.
* Deploy the nodejs app to [heroku](https://www.heroku.com/) your preferred hosting environment.
* Set the "Fulfillment" webhook URL to the hosting URL.
* Make sure all domains are turned off.
* Enable Actions on Google in the Integrations.
* Provide an invocation name for the action.
* Authorize and preview the action in the web simulator.