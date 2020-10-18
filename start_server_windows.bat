@ECHO OFF

cd backend
START /B nodemon server

cd ../frontend
START /B npm run serve

EXIT /B