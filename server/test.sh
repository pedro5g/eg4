#!/bin/bash
(node --env-file=.env --import tsx --test src/**/__test__/*.test.ts)