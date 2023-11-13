#!/bin/bash
cd backend && source "env/Scripts/activate" && flask run --debug &
cd frontend && npm run start
# start cmd.exe /C "cd frontend && npm start"
# start cmd.exe /C "cd backend && pipenv run python manage.py runserver"