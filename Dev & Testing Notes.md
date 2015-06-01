##For testing locally on a Windows 7 system  

1. Assuming Python 3 is installed, create an HTTP server in the project directory using the following command at a command prompt.
```
python -m http.server 8080
```
2. Assuming ngrok is installed, to make your local server accessible via the web, open a command prompt and issue the following command.
```
ngrok 8080
```

##Build Automation
Assuming node and the grunt cli are installed
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
npm install grunt-processhtml --save-dev
npm install grunt-changed --save-dev


    Note that imagemin would not work on the jpeg image, so I compressed it manually and saved to the dist directory.

http://learn.knockoutjs.com/#/?tutorial=webmail
https://developers.google.com/maps/documentation/javascript/examples/marker-remove
http://www.convertcsv.com/csv-to-json.htm
http://stackoverflow.com/questions/3281524/resize-markers-depending-on-zoom-google-maps-v3
http://stackoverflow.com/questions/12722925/google-maps-and-knockoutjs
http://stackoverflow.com/questions/19028299/putting-content-banner-above-the-fixed-top-navbar
http://www.prepbootstrap.com/bootstrap-template/searchnavbar
http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
http://jsfiddle.net/tyrsius/67kgm/
http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
view-source:http://www.geocodezip.com/commsoft_net_maps_directionsA.html
http://gis.stackexchange.com/questions/29239/calculate-bearing-between-two-decimal-gps-coordinates
http://gis.yohman.com/up206b/tutorials/4-2-zillow-web-setting-up-a-proxy/
http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_xml2
http://wern-ancheta.com/blog/2014/03/20/getting-started-with-zillow-api/
https://developer.yahoo.com/javascript/samples/proxy/php_proxy_simple.txt
https://developer.yahoo.com/
https://lambda.uta.edu/cse5335/spring13/project2.html
http://www.the-art-of-web.com/javascript/ajax/
http://help.dottoro.com/ljomfaxv.php