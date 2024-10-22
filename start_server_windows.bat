@ECHO OFF

cd backend
START /B npx nodemon server

cd ../frontend
START /B npm run serve

EXIT /B