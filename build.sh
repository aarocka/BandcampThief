#!/bin/bash
cd id3
cd id3lib
sudo ./configure
sudo make
sudo make install
cd ..
cd id3v2
sudo make
sudo make install