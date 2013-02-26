BandcampThief
=============
# TODO
- [x] Basic album download page
- [x] Remove the growndwork file. We are not using it anyway.
- [x] Made and actual readme
- [ ] Fix artist page to show disco
- [ ] Plan a way to do the progress bars
- [ ] Make the site look badass
- [ ] Maybe start using a ci solution for build testing or somethihg

# How this fucking thing is supposedly supposed to fucking work!
The idea is that a user can give either a artist url or album url. The Node app will display the results. When the person downloads an album, the server creats a folder in a directory. Then the server then downloads all of the files. After the files are downloaded, node runs the command line id3 tagger. The album directory is then zipped and the original directory is moved to a plex server directory(optional) or deleted. While this process is runing a progress bar of the serverside download is placed on the homepage.  

# News
@rainbowdash created a branch of the code before @mbilker added changes. @rainbowdas also realised that he was fucking retarded and realised he needed to run npm install before running the app from the master branch.