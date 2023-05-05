#!/bin/sh
esbuild starter-page-preact-jsx.jsx --jsx-factory=h --bundle --format=esm --outfile=build/_bundle.js
