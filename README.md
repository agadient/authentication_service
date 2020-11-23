# authentication_service

# Installation
In the root of the project directory, run npm install.
To start services, run "docker-compose up --build" from the root of the project directory

# API

## login

### Expected Request: 

{username, password} inside of req.query.

### Response: 

If successful, sends status code 200 and response message "Logged in". Creates cookie called sessionCookie.

If unsuccessful, sends appropriate error code and error message.

## logout

### Expected Request: 

sessionCookie inside of request inside of request.

### Response: 

If successful, sends status code 200 and response message "Logged out". Deletes cookie called sessionCookie.

If unsuccessful, sends appropriate error code and error message.

## isValidSession

### Expected Request: 

sessionCookie inside of request.

### Response: 

If successful, sends status code 200 and response message "Valid session".

If unsuccessful, sends appropriate error code and error message.

## addUser

### Expected Request: 

{username, password} inside of req.query.

### Response: 

If successful, sends status code 200 and response message "User Valid".

If unsuccessful, sends appropriate error code and error message.
