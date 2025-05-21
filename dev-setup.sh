#!/bin/bash
cd server && npm i && npx prisma migrate dev --skip-seed & /
cd uis/dashboard && npm i --force