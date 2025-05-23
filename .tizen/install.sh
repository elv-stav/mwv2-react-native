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
shift $((OPTIND - 1))

# Find existing package
package=$(find .tizen/.build -name "*.wgt" -exec basename {} \; | head -n 1)

if [[ -n "$package" ]] && [[ "$skipBuild" = "true" ]]; then
  echo "Skipping build step. Installing existing package $package"
else
  echo "Building before install"
  bash ./.tizen/build.sh
  # Package name might be different after build, so find it again.
  package=$(find .tizen/.build -name "*.wgt" -exec basename {} \; | head -n 1)
fi

# Install the package
tizen install -n "$package" -- .tizen/.build
