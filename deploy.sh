#!/usr/bin/env sh

# abort on errors
set -e

# navigate into the build output directory
cd src

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:georgeletsos/javascript-concurrency.git master:gh-pages

cd -