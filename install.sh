#!/bin/bash
set -e

echo "Installing Backend..."
cd ./Backend
npm install
cd ..

echo "Installing Client..."
cd ./client
npm install
cd ..

echo "All Dependencies installed! Client and Backend are ready."
