~~IMPORTANT: Currently having an issue on Chrome where cookies are not being sent and therefore login/registration is broken too, please use on firefox or edge for the time being. Thank you!~~ 
## This has now been fixed!

### IMPORTANT 2: With the inclusion of docker to the project, you have to perform one extra step in order to run the containers.
1. Create a file named, docker.env, in the jnch009smartbrainapi folder
2. In this file you have to create the following environment variables:
  * DB_PASS (This can be whatever value you want it to be, **AS LONG AS** it matches POSTGRES_PASSWORD)
  * POSTGRES_PASSWORD (This can be whatever value you want it to be, **AS LONG AS** it matches DB_PASS)
     #### Important note about the passwords, you must remember it otherwise you won't be able to perform any database operations (ie. sign in, registration, etc...) because there is a volume that will persist the data. Because of this persistence, the password is also persisted. If you forget the password, you can either update the volume name or perform this hackaround https://www.postgresqltutorial.com/postgresql-reset-password/. If you know the password but want to change it, then you can simply issue an ALTER USER command.
     
  * JWT_SECRET (This can be whatever you want it to be. It is required in order to sign the JWT)
  * REACT_APP_CLARIFAI_API (You will need to create an account on clarifai as well as a new application and use that API key here. The application name/info does not matter, you just need the API key.)
3. When that is done, simply run the command *docker-compose -f docker-compose.yml up -d* from the top level folder to spin up the containers! To stop the containers, simply issue the command *docker-compose down*.

## Enjoy!

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
