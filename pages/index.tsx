import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const Home = () => {
  const MAP_API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
  useEffect(() => {
    const loader = new Loader({
      apiKey: MAP_API_KEY,
      version: "weekly",
    });
    let map;
    loader.load().then(() => {
      const google = window.google;
      map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 50.88, lng: 10.23 },
        zoom: 7,
      });
    });
  });
  return (
    <div style={{ height: "100vh" }}>
      <div id="map"></div>
    </div>
  );
};

export default Home;
