# CONNECT-E #

## Requirement ##

In order to test the app you must have node installed, if you don't have it follow the link to install it `https://nodejs.org/en/download/`.

## Installation ##

1. Clone this repo; 

2. Run the file:
    1. `setup_windows.bat` if you are on Windows;
    2. `setup_mac_and_linux` if you are on Mac or Linux.


If you have any problems to run the files:
    1. open the terminal and run `npm install -g nodemon`;
    2. go in the frontend folder and run `npm install`;
    3. go in the backend folder and run `npm install`;

On Mac and Linux in case of denied permission when running the commands use the word `sudo` before the command. Example `sudo npm install -g nodemon`.

3. In GitHub click on settings, then on secrets and set the four secrets keys as environment variables in your system with the same name as they are displayed on github; otherwise:

    1.go in backend/middleware/multer-config.js
    2.replace the value of 'secretAccessKey' with the value of the secret AWS_S3_SECRET_ACCESS_KEY 
    3. replace the value of 'accessKeyId' with the value of the secret AWS_S3_ACCESS_KEY_ID
    4.go in backend/dbConfig.js
    5.replace the value of 'user' with the value of the secret AWS_RDS_USER 
    6. replace the value of 'password' with the value of the secret AWS_RDS_PASSWORD

## Usage ##

Run the file: 
    1. `start_server_windows.bat` if you are on Windows:
    2. `start_server_linux_and_mac` if you are on Mac or Linux.

After running the file, the browser should automatically open on `http://localhost:8080/`, if it doesn't just open the browser and paste the link in it.

If the app gives any problems you may have to run the server manually:
    1. go in the backend folder and run `nodemon server`:
    2. go in the frontend folder and run `npm run serve`.
    3. open browser on `http://localhost:8080/` if it doesn't automatically after run the command 'npm run serve'

P.S. = 
Environment:
Windows 10 Home
Visual Studio Code
Node Version: 12.18.1

Issue: Nodemon gives error "not digitally signed" when trying to run command nodemon server.

Solution: Run the command in command prompt not powershell.


