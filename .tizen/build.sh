#!/bin/bash

# Don't run this script manually. Use NPM on the root project (e.g. 'npm run build-tizen').
# Make sure the 'tizen' from Tizen Studio is in your PATH. (https://docs.tizen.org/application/tizen-studio/common-tools/command-line-interface/)

devBuild=false

while getopts ":d" option; do
  case $option in
  d)
    devBuild=true
    ;;
  \?) # Invalid option
    echo "Invalid option: -$OPTARG" >&2
    exit 1
    ;;
  esac
done
# remove the options from the positional parameters
shift $((OPTIND - 1))

if [ "$devBuild" = "true" ]; then
  echo "Dev Build"
else
  # Export react app
  expo export -p web
fi

# Clean tizen build directories after expo exported successfully
rm -rf .tizen/.build
rm -rf .tizen/.buildSrc

if [ "$devBuild" = "true" ]; then
  # Copy Tizen files
  cp -r .tizen/webapp-dev .tizen/.buildSrc
else
  # Copy Tizen files
  cp -r .tizen/webapp .tizen/.buildSrc
  # Copy react app files
  cp -r dist/ .tizen/.buildSrc
fi

# Tizen pre-package step. I'm not actually sure what this does besides copying all the contents to a new dir.
tizen build-web -out ../.build/tizen-web-build -- ./.tizen/.buildSrc

# Actually create a wgt package
tizen package -t wgt -s Eluvio-Cert -- .tizen/.build/tizen-web-build -o .tizen/.build
