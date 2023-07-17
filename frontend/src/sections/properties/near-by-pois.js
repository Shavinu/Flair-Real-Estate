import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import bankIcon from '../../components/icons/sprites/bank.png';
import hospitalIcon from '../../components/icons/sprites/hospital.png';
import schoolIcon from '../../components/icons/sprites/school.png';
import { TableEmptyRows, TableHeadCustom, TablePaginationCustom, emptyRows, useTable } from "../../components/table";
import { MAPBOX_API } from "../../config-global";

const getNearbyPOIs = async (coordinates, category) => {
  if (!coordinates) {
    return [];
  }
  // console.log('coordinates', coordinates);
  const coordinatesSwapped = [coordinates?.longitude, coordinates?.latitude];
  const mapboxAccessToken = MAPBOX_API;
  const mapboxUrl = `https://api.mapbox.com/search/searchbox/v1/category/${category}?access_token=${mapboxAccessToken}&language=en&limit=10&proximity=${coordinates?.longitude}%2C${coordinates?.latitude}`;

  try {
    const response = await axios.get(mapboxUrl);
    const { features } = response.data;
    return features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        category,
        distance: getDistance(coordinatesSwapped, feature.geometry.coordinates)
      }
    }));
  } catch (error) {
    console.error('Error fetching nearby POIs:', error);
    return [];
  }
}

const getDistance = (coord1, coord2) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(2));
};

const categories = ["school", "hospital", "bank"];

const icons = {
  school: schoolIcon,
  hospital: hospitalIcon,
  bank: bankIcon
};

const NearByPOIs = ({ coordinates }) => {
  const [nearbyPOIs, setNearbyPOIs] = useState([]);

  const table = useTable();

  const map = useRef(null);
  const mapContainer = useRef();

  const fetchNearByPOIs = useCallback(
    async () => {
      const nearbyPOIs = await Promise.all(categories.map(category => getNearbyPOIs(coordinates, category)));

      setNearbyPOIs(nearbyPOIs.flat());
    },
    [coordinates],
  )

  useEffect(() => {
    if (nearbyPOIs && map.current) {
      map.current.on('load', () => {
        categories.forEach(async (category, i) => {
          const pois = nearbyPOIs.filter(poi => poi.properties.category === category);
          if (!map.current.getSource(category)) {
            map.current.addSource(category, {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: pois
              }
            });

            map.current.addLayer({
              id: category,
              type: 'symbol',
              source: category,
              layout: {
                'icon-image': category,
                'icon-size': 0.1
              }
            });
          }

          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
          });

          map.current.on('mouseenter', category, function (e) {
            map.current.getCanvas().style.cursor = 'pointer';
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.name;
            const address = e.features[0].properties.full_address;
            const distance = e.features[0].properties.distance;

            //popup
            const card =
              `
                  <div style="text-align: center text-small;">
                    <div>
                        <div class="card-body p-0">
                          <h3 class="card-title">${name}</h3>
                          <h4 class="card-subtitle mb-2 text-muted">${address}</h4>
                          <p class="card-text">${distance} km</p>
                        </div>
                    </div>
                  </div>
                `

            popup.setLngLat(coordinates).setHTML(card).addTo(map.current);
          });

          map.current.on('mouseleave', category, function () {
            map.current.getCanvas().style.cursor = '';
            popup?.remove();
          });
        });
      });
    }
  }, [nearbyPOIs]);

  useEffect(() => {
    if (coordinates && !isNaN(coordinates.longitude) && !isNaN(coordinates.latitude)) {
      async function fetchData() {
        const nearbyPOIs = await Promise.all(categories.map(category => getNearbyPOIs(coordinates, category)));
        setNearbyPOIs(nearbyPOIs.flat());
      }
      fetchData();

      if (map?.current !== undefined) {
        map?.current?.remove();
      }

      if (mapContainer.current) {
        mapboxgl.accessToken = MAPBOX_API;
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 12
        });

        // project location marker
        const marker = new mapboxgl.Marker({
          color: 'green',
          draggable: false,
          anchor: 'bottom',
          rotation: 0,
          scale: 0.7
        })
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .addTo(map.current);

        const popup = new mapboxgl.Popup({
          closeButton: false
        });

        const card = `<div style="text-align: center text-small;">
          <div>
              <div class="card-body p-0">
            <h5 class="card-title">Project Location</h5>
            </div>
          </div>
            </div>`

        popup.setHTML(card).addTo(map.current);

        marker.setPopup(popup);
        marker.togglePopup();

        marker.getElement().addEventListener('mouseenter', () => marker.togglePopup());
        marker.getElement().addEventListener('mouseleave', () => marker.togglePopup());

        // zoom
        map.current.addControl(new mapboxgl.NavigationControl());

        // geolocate
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          })
        );

        map.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right'
        );

        // add nearby POIs
        map.current.on('load', async () => {

          for (const category of categories) {
            await new Promise((resolve, reject) => {
              map.current.loadImage(icons[category], (error, image) => {
                if (error) {
                  reject(error);
                } else {
                  map.current.addImage(category, image);
                  resolve();
                }
              });
            });
          }
        }
        );
      }
    }
  }, [coordinates]);

  const handleChangeCenterCoordinates = (coordinates) => {
    map.current.flyTo({ center: coordinates, zoom: 15 });
  }

  const columns = useMemo(() => [
    { id: 'name', label: 'Name', width: 250 },
    { id: 'categoty', label: 'Category', width: 100 },
    { id: 'distance', label: 'Distance', width: 100 },
    { id: 'address', label: 'Address' },
  ], []);

  useEffect(() => {
    fetchNearByPOIs();
  }, [fetchNearByPOIs])

  return <>

    <div ref={mapContainer} style={{ height: '500px', width: '100%' }}></div>
    {/* <StyledMapContainer>
      <Map
        ref={map}
        longitude={coordinates?.longitude || 0}
        latitude={coordinates?.latitude || 0}
        initialViewState={{
          zoom: 15,
        }}

        mapboxAccessToken={MAPBOX_API}
        mapStyle={"mapbox://styles/mapbox/outdoors-v11"}
      >
        <MapControl />
        {coordinates && <MapMarker
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
        />}

        {nearbyPOIs.map((item, index) => <MapMarker
          key={`map-marker-${index}`}
          longitude={item.geometry.coordinates[0]}
          latitude={item.geometry.coordinates[1]}
          onClick={(event) => {
            event.originalEvent.stopPropagation();
            setPopupInfo(item);
          }}
          onMouseOver={() => setPopupInfo(item)}
          onMouseOut={() => setPopupInfo(null)}
        />)}

        {popupInfo && (
          <MapPopup
            longitude={popupInfo.geometry.coordinates[0]}
            latitude={popupInfo.geometry.coordinates[1]}
            onClose={() => setPopupInfo(null)}
          >
            <Box>
              <Box
                sx={{
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography variant="subtitle2">{popupInfo.properties.name}</Typography>
              </Box>
            </Box>
          </MapPopup>
        )}
      </Map>
    </StyledMapContainer> */}
    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
      <Table>
        <TableHeadCustom
          order={table.order}
          orderBy={table.orderBy}
          headLabel={columns}
          rowCount={nearbyPOIs.length}
          numSelected={table.selected.length}
        />
        <TableBody>
          {nearbyPOIs
            .slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            ).map((row, key) => (<TableRow hover key={`nearby-pois-${key}`} onClick={() => handleChangeCenterCoordinates(row.geometry.coordinates)} sx={{cursor: 'pointer'}}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.properties.name}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.properties.category}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.properties.distance} km</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.properties.full_address}</TableCell>
            </TableRow>))}

          <TableEmptyRows
            height={72}
            emptyRows={emptyRows(table.page, table.rowsPerPage, nearbyPOIs.length)}
          />
        </TableBody>
      </Table>
    </TableContainer>

    <TablePaginationCustom
      count={nearbyPOIs.length}
      page={table.page}
      rowsPerPage={table.rowsPerPage}
      onPageChange={table.onChangePage}
      onRowsPerPageChange={table.onChangeRowsPerPage}
    />
  </>

}

export default NearByPOIs;
