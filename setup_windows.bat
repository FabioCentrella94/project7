@ECHO OFF

START npm install -g nodemon

cd backend
START npm install

cd ../frontend
START npm install

EXIT 