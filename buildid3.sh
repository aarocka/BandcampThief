#!/bin/bash
cd id3
tar zxf *.tar.gz
cd id3lib
sudo ./configure
sudo make
sudo make install
cd ..
cd id3v2
sudo make
sudo make install
