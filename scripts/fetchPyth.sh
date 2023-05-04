#!/bin/bash

npx tsc --esModuleInterop --module commonjs --target es2019 --resolveJsonModule ./scripts/pyth.ts
node ./scripts/pyth.js
