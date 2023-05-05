#!/bin/sh
esbuild starter-page-vue-v3-jsx.jsx --jsx-factory=h --bundle --format=esm --outfile=build/_bundle.js
