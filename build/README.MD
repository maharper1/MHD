Madison Historic District	Version 0.4  06/06/2015
==================================================

This app displays a map of the Madison (Indiana) Historic District, including data on each property that was submitted with the National Historic Landmark Nomination. 

See the Installation section if you want to install it on your own web server or go to http://annetteharper.com/MHD to see it in action.

Features
--------

- Map markers with architectural style icons

Properties are marked with icons that represent the architectural style of the building. You may zoom in to better see the icons. They increase in size as you zoom in. 

- Building information

Clicking on a property marker brings up a dialog that gives the details for the property from the National Historic Landmark Nomination papers, a photo from Google StreetView, and basic property descriptions from Zillow.

- Interactive filtering

You may filter both the map and the list of addresses using the Filter Address List panel, which can be collapsed or opened by clicking on the arrow or the panel title. The entire Address list sidebar can be closed or reopened using the menu item, "Hide/Show Address List." Filtering is available on several characteristics of the properties, such as style and date built, as well as on the components of the address such as house number or street.


Installation
------------

The project files are available at github.com/maharper1/MHD.

The MHD application consists of html, javascript, and css files, plus a PHP proxy file. The web server to which the application is deployed must have PHP (with the cURL library) installed for the calls to Zillow to work.

In addition, several libraries are refenced in the project files. These are 
 - Bootstrap 3.3.4
 - Knockout 3.3.0
 - jQuery 2.1.4
And some APIs are called
 - Google Maps (including geometry library)
 - Google StreetView
 - Google Analytics
 - Zillow

The files in the build directory have been minimized for better performance. The original, easier to read, code files are in the js, css, and images directories. The proxy file has not been optimized.

Install MHD by following these steps:

- Create a folder on your web server to contain the application files. 

- Copy the contents of the /build directory (including it's subdirectories) to a folder on the web server. The php proxy file is located in the /proxy subdirectory.

- To run, open the index.html file in the parent directory.

A working version is installed at annetteharper.com/MHD.

General Usage Notes
-------------------

Zooming rapidly using the mouse scroll wheel results in the map marker icons not being appropriately resized. To work around this problem, use the Google Map zoom control or zoom only one click at a time with the mouse. If you experience this problem, and your icons are no longer the correct size, just reload the page to refresh them.

Contribute
----------

- Issue Tracker: github.com/maharper1/MHD/issues
- Source Code: github.com/maharper1/MHD

- Future Possible Additions

-- Improve data quality

Data transcribed from the Landmark Nomination may contain errors due to either my transcription or outdated documentation. I have re-catorgorized the building styles somewhat to limit the possible number of icons, and not being an expert, may have introduced errors in that way. The GPS coordinates obtained for some properties may be off a little and need manual correction.

-- Move data into MySQL.

-- Add Zillow "for Sale" data.

-- Add ability for users to update/add information to properties.

-- Add census information related to the occupants of the properties for census years that include actual addresses.


Support
-------

If you are having issues, please let me know.
E-mail: m.annette.harper@gmail.com

Acknowledgments
---------------

The XML to JSON proxy server used in this application is a very slightly modified version of Craig Buckler's (@craigbuckler, http://optimalworks.net) original files as discussed at http://www.sitepoint.com/php-xml-to-json-proxy/.

License
-------

Copyright (c) 2015 Annette Harper. 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without  restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be  included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.