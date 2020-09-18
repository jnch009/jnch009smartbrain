***IMPORTANT: Currently having an issue on Chrome where cookies are not being sent and therefore login/registration is broken too, please use on firefox or edge for the time being. Thank you!***

Smartbrain Application Final Project in the Complete Web Developer 2020 ZTM taught by Andrei Neagoie
The main attraction of this application is utilizing Clarifai's API for facial recognition and incrementing a 
score counter for logged in users.

I have already made some tweaks to the original repo found here (https://github.com/aneagoie/smart-brain), by converting bcrypt hashing and comparing into an asynchronous function rather than synchronous like he shows in the video, updating the UX with the ability to hit enter on the password field to submit instead of always having to click the submit button, the ability to persist a logged in session and adding some backend endpoints for the profile page in the future.

I have plans to improve this app by:

~~More descriptive error handling shown in the app rather than console.log (DONE)~~

  * follow up: success messages (WIP)
  
* Adequate testing (WIP, Endpoint testing with mocha/chai/chai-http. Planning to use jest for front-end testing)
* Validation of Forms on Front-End and Back-end

~~Creating a profile page (DONE)~~ 

* Incrementing score based on how many faces are in the picture rather than incrementing by 1
  * as a follow up, the ability to increment your score ONLY when you successfully identify faces (by pointer).
* Leaderboard
 
Thank you for giving my repo a look!
