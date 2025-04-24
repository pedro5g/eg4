#!/bin/bash
cd server && npm i && npx prisma migrate dev & /
cd uis/dashboard && npm i 