BandcampThief
=============
Totaly messed up the repo fixed now

# How this thing is supposed to work
The idea is that a user can give either a artist url or album url. The Node app will display the results. When the person downloads an album, the server creats a folder in a directory. Then the server then downloads all of the files. After the files are downloaded, node runs the command line id3 tagger. The album directory is then zipped and the original directory is moved to a plex server directory(optional) or deleted. While this process is runing a progress bar of the serverside download is placed on the homepage.