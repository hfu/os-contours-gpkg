const config = require('config')
const gpkg = require('@ngageoint/geopackage')
const proj4 = require('proj4')

proj4.defs("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");
const local = proj4('EPSG:27700')

const inverse = (geometry) => {
  switch(geometry.type) {
    case 'Point':
      geometry.coordinates = local.inverse(geometry.coordinates)
      break
    case 'LineString':
      for (let i in geometry.coordinates) {
        geometry.coordinates[i] = local.inverse(geometry.coordinates[i])
      }
      break
    case 'Polygon':
      for (let i in geometry.coordinates) {
        for(let j in geometry.coordinates[i]) {
          geometry.coordinates[i][j] = local.inverse(geometry.coordinates[i][j])
        }
      }
      break
    case 'MultiPolygon':
      for (let i in geometry.coordinates) {
        for (let j in geometry.coordinates[i]) {
          for (let k in geometry.coordinates[i][j]) {
            geometry.coordinates[i][j][k] = 
              local.inverse(geometry.coordinates[i][j][k])
          }
        }
      }
      break
    default:
      throw `${geometry.type} not supported.`
  }
  return geometry
}

const put = (fr) => {
  if (fr.getGeometry().srsId !== 27700) throw `srid ${fr.getGeometry().srsId} unknown.`
  let geometry = fr.getGeometry().geometry.toGeoJSON()
  geometry = inverse(geometry)
  // let properties = fr.values
  let properties = {}
  for (const k of ['prop_value', 'feat_type', 'sub_type']) {
    if (fr.values[k]) properties[k] = fr.values[k]
  }
  delete properties[fr.getGeometryColumn().name]
  let minzoom = 14
  if (properties.feat_type === 'ContourLine') {
    if (properties.prop_value % 400 === 0) {
      minzoom = 10
    } else if (properties.prop_value % 100 === 0) {
      minzoom = 12
    } else {
      minzoom = 14
    }
  } else if (properties.feat_type === 'SpotHeight') {
    minzoom = 14
  } else if (properties.feat_type === 'LandWaterBoundary') {
    if (properties.sub_type === 'meanLowWater') {
      minzoom = 14
    } else {
      minzoom = 4
    }
  }
  let geojson = {
    type: 'Feature',
    geometry: geometry,
    properties: properties,
    tippecanoe: {
      layer: geometry.type.toLowerCase(), 
      minzoom: minzoom, maxzoom: 14
    }
  }
  console.log(JSON.stringify(geojson))
}

const dump = (path) => {
  gpkg.GeoPackageManager.open(path, (err, gpkg) => {
    if (err) throw err
    gpkg.getFeatureTables((err, names) => {
      if (err) throw err
      for (const name of names) {
        gpkg.getFeatureDaoWithTableName(name, (err, dao) => {
          dao.queryForEach((err, row, rowDone) => {
            put(dao.getFeatureRow(row))
            rowDone()
          })
        })
      }
    })
  })
}

for (let gpkg of config.get('gpkgs')) {
  dump(gpkg)
}
