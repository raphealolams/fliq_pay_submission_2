1) To use this application, clone this github repository and make sure you're using/have nodejs installed on your system
Make sure mongodb running. 
    a. clone the repository
    b. navigate to the project directory
    c. run npm install to install dependencies

2) 

To run tests 
   npm run cypress:open

To start the app 
    npm run build

3) Support ticket management system and the primary operations involves customers being able to create tickets 
    and administrators to respond and process ticket created by customers, for this to be achievable the users 
    (customer and administrators) must be registered and authenticated on the platform, whenever a ticket is being 
    created, a unique Id is generated for quick references to the tickets such that different administrators 
    can attend to several tickets or pickup the conversation where it left off with the ticket Id.

4) Edge cases not properly tested. < 15% test coverage

5) Refer to 1 and 2

6) Race against time while following best practice 

7) it can be greatly improved, role commenter can be documented to distinguished ticket comments, soft delete and hard delete functionality can be added
    application can run within containers docker


PS: to install test data run 
    npm run import:data