#!/bin/bash

npx tsc --esModuleInterop --module commonjs --target es2019 --resolveJsonModule ./scripts/getPrice.ts
node ./scripts/getPrice.js
