#!/bin/bash

# Don't run this script manually. Use NPM on the root project (e.g. 'npm run install-tizen').
#bash ./.tizen/build.sh

skipBuild=false

while getopts ":s" option; do
  case $option in
    s) # Skip build
      skipBuild=true
      ;;
    \?) # Invalid option
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done
# remove the options from the positional parameters
shift $(( OPTIND - 1 ))

# Find existing package
package=$(find .tizen/.build -name "*.wgt" | head -n 1)

if [[ -n "$package" ]] && [[ "$skipBuild" = "true" ]]; then
  echo "Skipping build step. Installing existing package $package"
else
  echo "Building before install"
  bash ./.tizen/build.sh
fi

# Install the package
tizen install -n "Eluvio Media Wallet.wgt" -- .tizen/.build
