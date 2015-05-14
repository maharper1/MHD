Some issues with windows..................
  For Python 3, the command to create an HTTP server is python -m http.server 8080

  To run ngrok from Windows 7, I had to:
    1. Open a command prompt, and enter the Python 3 command above.
    2. Open a second command prompt, and run ngrok 8080.

Grunt
  I used grunt to minify files, optimize images, etc. I should add in processHTML so that I do not need to change the file references in index.html manually, but that will have to wait till next time :)

  Setting up grunt
    1. Open a command prompt, cd to the project folder.
    2. Run npm init
    3. Answer questions...package.json is created.
    4. run npm install grunt --save-dev
    5. run npm install grunt-contrib-jshint --save-dev
    6. run npm install grunt-contrib-nodeunit --save-dev
    7. run npm install grunt-contrib-uglify --save-dev
    8. run npm install grunt-contrib-qunit --save-dev
    9. run npm install grunt-contrib-concat --save-dev
    10. run npm install grunt-contrib-watch --save-dev
    11. run npm install grunt-contrib-imagemin --save-dev
    12. run npm install grunt-contrib-cssmin --save-dev
  // Tried both of the below, but neither helped with the jpeg optimiation problem noted below.
  //  run npm install --save imagemin-mozjpeg
  //  run npm install --save imagemin-jpegoptim
  // I did not actually use compression, either.
  // run npm install grunt-contrib-compress --save-dev
    13. run npm install grunt-contrib-htmlmin --save-dev

    Note that imagemin would not work on the jpeg image, so I compressed it manually and saved to the dist directory.