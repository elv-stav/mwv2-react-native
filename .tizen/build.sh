#!/bin/bash

# Don't run this script manually. Use NPM on the root project (e.g. 'npm run build-tizen').
# Make sure the 'tizen' from Tizen Studio is in your PATH. (https://docs.tizen.org/application/tizen-studio/common-tools/command-line-interface/)

# Export web app
expo export -p web

# Clean tizen build directories
rm -rf .tizen/.build
rm -rf .tizen/.buildSrc

# Copy Tizen files
cp -r .tizen/webapp .tizen/.buildSrc
# Copy web-app files
cp -r dist/ .tizen/.buildSrc

# Tizen pre-package step. I'm not actually sure what this does besides copying all the contents to a new dir.
tizen build-web -out ../.build/tizen-web-build -- ./.tizen/.buildSrc

# Actually create a wgt package
tizen package -t wgt -s Eluvio-Cert -- .tizen/.build/tizen-web-build -o .tizen/.build
