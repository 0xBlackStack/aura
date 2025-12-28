#!/bin/bash
set -e

cd /home/user

# install deps once (cached in template)
npm install

# prebuild to warm cache (optional but 🔥)
npm run build || true

echo "Template ready"
