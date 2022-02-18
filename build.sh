#!/bin/sh

rm -rf out
npx @vercel/ncc build src/index.ts -o out

cd web
rm -r public/build
yarn build
cd ..

mkdir -p out/web/public
cp -r web/public/ out/web/