# os-contours-gpkg
process contour data in gpkg from ordnance survey using @ngageoint/geopackage

# usage
```
$ curl -C - -v -O -# https://s3-eu-west-1.amazonaws.com/os-open-data/os-terrain-50/geopackage/OSTerrain50_Contours.gpk
$ node index.js > contours.ndjson
$ tippecanoe ...
```
# source data
As in [OS Terrain 50](http://data-format-trial-osonline.opendata.arcgis.com/pages/os-terrain-50), you can download the countour data of Great Britain like:
```
$ curl -C - -v -O -# https://s3-eu-west-1.amazonaws.com/os-open-data/os-terrain-50/geopackage/OSTerrain50_Contours.gpk
$ curl -C - -v -O -# https://s3-eu-west-1.amazonaws.com/os-open-data/os-open-map-local/geopackage/OPENMAP_LOCAL_October17.gpkg
```

# note
The output of this program needs acknowledgement "[Contains OS data © Crown copyright and database right (year)](https://www.ordnancesurvey.co.uk/business-and-government/licensing/using-creating-data-with-os-products/os-opendata.html)"
