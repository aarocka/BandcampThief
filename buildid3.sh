#!/bin/bash

set -e
set -x

cd id3
CWD=$(pwd)

if [ -d $CWD/tmp ]; then
  rm -rf tmp
  mkdir tmp
else
  mkdir tmp
fi

if [ -d $CWD/bin ]; then
  rm -rf bin
  mkdir bin
else
  mkdir bin
fi

cd tmp
for i in $CWD/src/*.tar.gz; do tar zxf $i; done

cd id3lib*
#for i in $CWD/patch/id3lib/*.patch; do patch -p1 < $i; done
./configure --prefix=$CWD/bin
make
make install

cd ..
cd id3v2*
make PREFIX=$CWD/bin
mkdir -p $CWD/bin/man/man1
make install PREFIX=$CWD/bin
