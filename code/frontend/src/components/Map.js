import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import axios from 'axios';

const ZOOM_LEVEL = 13;
const ACCESS_TOKEN = 'pk.eyJ1IjoidG9naWFoeSIsImEiOiJjbHd3NThyeXgwdWE0MnFxNXh3MzF4YjE3In0.Ikxdlh66ijGULuZhR3QaMw';

const Map = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/locations'); // Adjust the URL as needed
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const Routing = () => {
    const map = useMap();

    useEffect(() => {
      if (!map || locations.length === 0) return;

      const waypoints = locations.map((location) =>
        L.latLng(location.Latitude, location.Longitude)
      );

      const routingControl = L.Routing.control({
        waypoints,
        router: L.Routing.mapbox(ACCESS_TOKEN),
        createMarker: function (i, wp) {
          return L.marker(wp.latLng).bindPopup(locations[i].Name);
        },
      }).addTo(map);

      routingControl.on('routesfound', function (e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        alert(
          'Total distance is ' +
            (summary.totalDistance / 1000).toFixed(2) +
            ' km and total time is ' +
            Math.round(summary.totalTime / 60) +
            ' minutes'
        );
      });

      return () => {
        map.removeControl(routingControl);
      };
    }, [map, locations]);

    return null;
  };

  return (
    <div>
      <MapContainer center={[10.69065, 106.58309]} zoom={ZOOM_LEVEL} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Routing />
      </MapContainer>
    </div>
  );
};

export default Map;
