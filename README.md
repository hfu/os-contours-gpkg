# os-contours-gpkg
process contour data in gpkg from ordnance survey using @ngageoint/geopackage

# source data
As in [OS Terrain 50](http://data-format-trial-osonline.opendata.arcgis.com/pages/os-terrain-50), you can download the countour data of Great Britain like:
```
$ curl -C - -v -O -# https://s3-eu-west-1.amazonaws.com/os-open-data/os-terrain-50/geopackage/OSTerrain50_Contours.gpk
```
