#!/bin/bash
set -e

echo "Installing Backend..."
cd ./server
npm install
cd ..

echo "Installing Frontend..."
cd ./server
npm install
cd ..

echo "All Dependencies installed! Client and Backend are ready."
