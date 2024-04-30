import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Chart from "chart.js/auto";
import axios from "axios";


import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});


L.Marker.prototype.options.icon = defaultIcon;

function Chartpage() {
  const [worldData, setWorldData] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    axios
      .get("https://disease.sh/v3/covid-19/all")
      .then((response) => setWorldData(response.data))
      .catch((error) => console.error("Error fetching global data:", error));

    axios
      .get("https://disease.sh/v3/covid-19/countries")
      .then((response) => setCountryData(response.data))
      .catch((error) => console.error("Error fetching country data:", error));

    axios
      .get("https://disease.sh/v3/covid-19/historical/all?lastdays=all")
      .then((response) => setGraphData(response.data))
      .catch((error) => console.error("Error fetching graph data:", error));
  }, []);

  useEffect(() => {
    if (graphData) {
      const ctx = document.getElementById("myChart").getContext("2d");
      const dates = Object.keys(graphData.cases);
      const cases = Object.values(graphData.cases);

      if (chart) {
        chart.destroy();
      }

      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Cases",
              data: cases,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
      });

      setChart(newChart);
    }
  }, [graphData]);

  return (
    <div style={{ height: "800px", overflowY: "scroll" }}>
      <h1 className="text-3xl font-bold mb-6 text-center p-2">Global COVID-19 Dashboard</h1>
        {worldData && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Global Statistics</h2>
            <p className="mb-2">Total Cases: {worldData.cases}</p>
            <p className="mb-2">Total Deaths: {worldData.deaths}</p>
            <p className="mb-2">Total Recovered: {worldData.recovered}</p>
        </div>
        )}


        {graphData && (
        <div className="bg-white p-4 my-2 rounded-lg">
            <h2 className="text-lg text-center py-2 font-bold">Graph Data for Cases</h2>
            <canvas id="myChart" width="600" height="200"></canvas>
        </div>
        )}


      {countryData.length > 0 && (
        <div className='m-2 p-2'>
          <h2 className="text-center p-2 text-lg font-bold">Country-wise Statistics</h2>
          <MapContainer
            style={{ height: "500px", width: "100%" }}
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {countryData.map((country) => (
              country.countryInfo.flag && country.countryInfo.flag.trim() !== "" && (
                <Marker
                  key={`${country.country}-${country.countryInfo.iso3}`}
                  position={[
                    country.countryInfo.lat + Math.random() * 0.1,
                    country.countryInfo.long + Math.random() * 0.1,
                  ]}
                >
                  <Popup>
                    <div>
                      <h3>{country.country}</h3>
                      <img
                        src={country.countryInfo.flag}
                        alt={`Flag of ${country.country}`}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.style.display = "none"; 
                        }}
                      />
                      <p>Total Active Cases: {country.active}</p>
                      <p>Total Recovered: {country.recovered}</p>
                      <p>Total Deaths: {country.deaths}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default Chartpage;
