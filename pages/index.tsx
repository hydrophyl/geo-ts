import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

var template = [
  '<?xml version="1.0"?>',
  '<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 svg-shadow-yellow" viewBox="0 0 20 20" fill="#facc15"> <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /> </svg>',
].join("\n");
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
        center: { lat: 51.2, lng: 10.23 },
        zoom: 8,
        fullscreenControl: false, // remove the top-right button
        mapTypeControl: false, // remove the top-left buttons
        streetViewControl: false, // remove the pegman
        zoomControl: false, // remove the bottom-right buttons
        styles: [
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#444444",
              },
            ],
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [
              {
                color: "#f2f2f2",
              },
            ],
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [
              {
                saturation: -100,
              },
              {
                lightness: 45,
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "all",
            stylers: [
              {
                visibility: "simplified",
              },
            ],
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [
              {
                color: "#e0f2fe",
              },
              {
                visibility: "on",
              },
            ],
          },
        ],
      });
      let markerOptions = {
        position: new google.maps.LatLng(53.597981, 9.957736),
        optimized: false,
      };
      var docMarker = new google.maps.Marker({
        position: new google.maps.LatLng(53.597981, 9.957736),
        map: map,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(template),
          scaledSize: new google.maps.Size(20, 20),
        },
        optimized: false,
      });
      var overlay = new google.maps.OverlayView();
      overlay.draw = function () {
        this.getPanes().markerLayer.id = "svg-glow";
      };
      overlay.setMap(map);
    });
  });
  return (
    <div style={{ height: "100vh" }}>
      <div id="map"></div>
    </div>
  );
};

export default Home;
