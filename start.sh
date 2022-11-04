#!/bin/sh
date >>/tmp/crontest.txt
PROC=$(lsof -i :4000 | awk 'FNR==2{print $1}')
echo $PROC
if [ $PROC != "node" ]
then
	echo "Server not running."
	(npm --prefix /home/pi/Documents/home-app/home-app run start:prd&)
	#( ... &)
fi
pwd >>/tmp/crontest.txt
#node --noexpose_wasm build/main/index.js
