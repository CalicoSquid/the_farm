import { useMemo, useState } from "react";
import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const center = [42.3620564, 19.0825821];
  const [tileLayer, setTileLayer] = useState("carto");
  const customIcon = useMemo(
    () =>
      new Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    []
  );

  return (
    <main className="page-shell map-page">
      <header className="page-intro page-intro--with-actions">
        <div>
          <p className="eyebrow">Rijeka Crnojevića · Montenegro</p>
          <h1>On the map</h1>
          <p className="page-intro__copy">
            Tucked into the hills above the old royal capital, between lake, stone and a frankly unreasonable amount of vegetation.
          </p>
        </div>
        <div className="map-toggle" role="group" aria-label="Map style">
          <button onClick={() => setTileLayer("carto")} className={tileLayer === "carto" ? "active" : ""}>Map</button>
          <button onClick={() => setTileLayer("satellite")} className={tileLayer === "satellite" ? "active" : ""}>Satellite</button>
        </div>
      </header>

      <div className="map-frame">
        <MapContainer center={center} zoom={14} scrollWheelZoom className="map">
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
          <Marker position={center} icon={customIcon}>
            <Popup className="farm-popup">
              <strong>The Farm</strong>
              <span>Rijeka Crnojevića</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </main>
  );
}
