#!/bin/sh

cd web
rm -r public/build
yarn build
cd ..

mkdir -p out/web/public
cp -r web/public/ out/web/
echo '{ "type": "module" }' > out/package.json