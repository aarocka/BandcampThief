
#!/bin/bash

set -e

cd id3
CWD=$(pwd)/..

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
echo "Untarring the archives"
for i in $CWD/src/*.tar.gz; do tar zxf $i; done

cd id3lib*
echo "Patching id3lib"
for i in $CWD/patch/id3lib/*.patch; do patch -p1 < $i >/dev/null 2>&1; done
echo "Configuring id3lib"
./configure --prefix=$CWD/bin >/dev/null 2>&1
echo "Compiling id3lib"
make
make install
echo "Finished Compiling"

cd ..
cd id3v2*
echo "Patching id3v2"
for i in $CWD/patch/id3v2/*.patch; do patch -p1 < $i; done
echo "Compiling id3v2"
make PREFIX=$CWD/bin
mkdir -p $CWD/bin/man/man1
make install PREFIX=$CWD/bin
echo "Finished Compiling"

rm -rf $CWD/tmp
echo "Finished"
