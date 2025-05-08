#!/bin/bash
cd server && npm run dev & /
sleep 2
cd uis/dashboard && npm run dev