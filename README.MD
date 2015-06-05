##Madison Historic District 

This site is viewable at annetteharper.com/MHD.

This app displays a map of the Madison (Indiana) Historic District, including data on each property that was submitted with the National Historic Landmark Nomination. 

Properties are marked with icons that represent the architectural style of the building. You may zoom in to better see the icon; they increase in size as you zoom in. Clicking on a property marker brings up a dialog that gives the details for the property from the National Historic Landmark Nomination papers and basic property descriptions from Zillow.

You may filter both the map and the list of addresses using the Filter Address List panel, which can be collapsed or opened by clicking on the arrow or the panel title. The entire Address list sidebar can be closed or reopened using the menu item, "Hide/Show Address List." Filtering is available on several characteristics of the properties such as style and date built, as well as on the components of the address such as house number or street.

##Notes

In order to gather data from Zillow, the web server where the application is deployed requires PHP. There is a PHP proxy file in the proxy directory which is used to route the call to Zillow and convert the response to JSON.

##Future Possibilities

[ ] Improve data quality
Data transcribed from the Landmark Nomination may contain errors due to either my transcription or outdated documentation. I have re-catorgorized the building styles somewhat to limit the possible number of icons, and not being an expert, may have introduced errors in that way. The GPS coordinates obtained for some properties may be off a little and need manual correction.

[ ] Move data into MySQL.
[ ] Add Zillow "for Sale" data.
[ ] Add ability for users to update/add information to properties.
[ ] Add census information related to the occupants of the properties for census years that include actual addresses.