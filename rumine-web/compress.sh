#!/usr/local/bin/bash
#Original compression script used
#Later replaced by a more robust version in Java

dir="./img_uploads/$1"
jpegoptim -m40 $dir;
