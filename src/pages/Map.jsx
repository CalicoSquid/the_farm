import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import logo from "../assets/logofarm.png";

const Map = () => {
  const center = [42.3620564, 19.0825821];
  const zoomLevel = 14;

  // Custom icon for the marker
  const customIcon = new Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // State to manage selected tile layer
  const [tileLayer, setTileLayer] = useState("carto");

  return (
    <div className="map-container">
      <h2 className="h2-text title">Where to Find Us</h2>

      {/* Map */}
      <div className="map-wrapper">
        <MapContainer
          center={center}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          className="map z-1"
        >
          {tileLayer === "carto" ? (
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          ) : (
            <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          />
          
          )}

          {/* Marker */}
          <Marker position={center} icon={customIcon}>
            <Popup>
              <img src={logo} alt="Location Logo" className="popup-image" />
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          onClick={() => setTileLayer("carto")}
          className={`toggle-button ${tileLayer === "carto" ? "active" : ""}`}
        >
          Street Map
        </button>
        <button
          onClick={() => setTileLayer("satellite")}
          className={`toggle-button ${tileLayer === "satellite" ? "active" : ""}`}
        >
          Satellite View
        </button>
      </div>
    </div>
  );
};

export default Map;
