import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import schoolIcon from './sprites/school.png';
import hospitalIcon from './sprites/hospital.png';
import bankIcon from './sprites/bank.png';

const categories = ["school", "hospital", "bank"];
const icons = {
  school: schoolIcon,
  hospital: hospitalIcon,
  bank: bankIcon
};

// const categories = ["school", "hospital", "supermarket", "park", "restaurant", "bus_station", "subway_station", "bank", "pharmacy", "gym", "library", "shopping_mall", "cinema"];
const colors = ['green', 'red', 'blue', '#orange', '#yellow', '#purple', '#pink', '#brown', '#gray', '#black', '#white', '#cyan', '#magenta'];

const getNearbyPOIs = async (coordinates, category) => {
  // console.log('coordinates', coordinates);
  const coordinatesSwapped = [coordinates[1], coordinates[0]];
  const mapboxAccessToken = process.env.REACT_APP_MAP_BOX_API_KEY;
  const mapboxUrl = `https://api.mapbox.com/search/searchbox/v1/category/${category}?access_token=${mapboxAccessToken}&language=en&limit=10&proximity=${coordinates[1]}%2C${coordinates[0]}`;

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

const CategoryTable = ({ category, pois, handleRowClick }) => {
  const columns = [
    { name: 'Name', selector: row => row.properties.name, sortable: true },
    {
      name: 'Distance',
      selector: row => row.properties.distance,
      sortable: true,
      format: row => `${row.properties.distance} km`,
      right: true,
      cell: row => <div style={{ color: colors[categories.indexOf(row.properties.category)] }}>{row.properties.distance} km</div>,
    },
    { name: 'Address', selector: row => row.properties.address, sortable: true, right: true },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={pois}
        defaultSortField="properties.distance"
        highlightOnHover
        onRowClicked={row => handleRowClick(row.geometry.coordinates)}
        customStyles={{
          rows: {
            style: {
              cursor: 'pointer',
            },
          },
        }}
        pagination
        paginationPerPage={4}
      />
    </div>
  );
};

const NearbyPOIs = ({ coordinates }) => {
  const [nearbyPOIs, setNearbyPOIs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [dataFetched, setDataFetched] = useState(false);
  const mapContainer = useRef();
  const map = useRef(null);

  const handleRowClick = (coordinates) => {
    map.current.flyTo({ center: coordinates, zoom: 15 });
  };

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
            const address = e.features[0].properties.address;
            const distance = e.features[0].properties.distance;

            //popup
            const card =
              `
                  <div style="text-align: center text-small;">
                    <div>
                        <div class="card-body p-0">
                          <h5 class="card-title">${name}</h5>
                          <h6 class="card-subtitle mb-2 text-muted">${address}</h6>
                          <p class="card-text">${distance} km</p>
                        </div>
                    </div>
                  </div>
                `

            popup.setLngLat(coordinates).setHTML(card).addTo(map.current);
          });

          map.current.on('mouseleave', category, function () {
            map.current.getCanvas().style.cursor = '';
            popup.remove();
          });
        });
      });
    }
  }, [nearbyPOIs]);

  useEffect(() => {
    if (coordinates && !isNaN(coordinates[0]) && !isNaN(coordinates[1] && !dataFetched)) {
      async function fetchData() {
        const nearbyPOIs = await Promise.all(categories.map(category => getNearbyPOIs(coordinates, category)));
        setNearbyPOIs(nearbyPOIs.flat());
        setDataFetched(true);
      }
      fetchData();

      if (map.current) {
        map.current.remove();
      }

      if (mapContainer.current) {
        mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_API_KEY;
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [coordinates[1], coordinates[0]],
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
          .setLngLat([coordinates[1], coordinates[0]])
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

  // useEffect(() => {
  //   if (dataFetched && map.current) {
  //     categories.forEach(category => {
  //       if (category !== selectedCategory) {
  //         map.current.setLayoutProperty(category, 'visibility', 'none');
  //       } else {
  //         map.current.setLayoutProperty(category, 'visibility', 'visible');
  //       }
  //     });
  //   }
  // }, [selectedCategory]);

  const categorizedPOIs = categories.reduce((acc, category) => {
    acc[category] = nearbyPOIs
      .filter(poi => poi.properties.category === category)
      .sort((a, b) => a.properties.distance - b.properties.distance);
    return acc;
  }, {});

  const selectOptions = categories.map(category => ({ value: category, label: <div> <img src={icons[category]} alt={category} style={{ height: '20px', width: '20px' }} />  {`${category.charAt(0).toUpperCase() + category.slice(1)}s`} </div> }));

  if (!coordinates) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div ref={mapContainer} style={{ height: '300px', width: '100%' }}></div>
      <span>
      </span>
      <Select
        options={selectOptions}
        defaultValue={selectOptions[0]}
        onChange={(option) => setSelectedCategory(option.value)}
      />
      <CategoryTable
        category={selectedCategory}
        pois={categorizedPOIs[selectedCategory]}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};

export default NearbyPOIs;