#!/bin/bash
NODE_ENV=test PORT=8081 node --env-file=.env --import tsx --test src/modules/auth/**/__test__/e2e/*e2e.test.ts & 
NODE_ENV=test PORT=8082 node --env-file=.env --import tsx --test src/modules/user/**/__test__/e2e/*e2e.test.ts