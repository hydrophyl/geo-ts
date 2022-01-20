import React, { useEffect, useState } from "react";
import { cities } from "../mocks/cities";
import { Loader } from "@googlemaps/js-api-loader";

var svg = [
  '<?xml version="1.0"?>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="{{ color }}"> <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /> </svg>',
].join("\n");
var svg_yellow = svg.replace("{{ color }}", "#facc15");
var svg_red = svg.replace("{{ color }}", "#f87171");
var svg_lime = svg.replace("{{ color }}", "#a3e635");
const mapStyleLight = [
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
];
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
        zoom: 7,
        fullscreenControl: false, // remove the top-right button
        mapTypeControl: false, // remove the top-left buttons
        streetViewControl: false, // remove the pegman
        zoomControl: false, // remove the bottom-right buttons
        styles: mapStyleLight,
      });
      let yellowMarkerOptions = {
        map: map,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(svg_yellow),
          scaledSize: new google.maps.Size(20, 20),
        },
        optimized: false,
      };
      let redMarkerOptions = {
        map: map,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg_red),
          scaledSize: new google.maps.Size(20, 20),
        },
        optimized: false,
      };
      let limeMarkerOptions = {
        map: map,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg_lime),
          scaledSize: new google.maps.Size(20, 20),
        },
        optimized: false,
      };
      var yellowMarker = new google.maps.Marker(limeMarkerOptions);
      yellowMarker.setPosition(new google.maps.LatLng(53.2, 9.957736));
      cities.map((city, index) => {
        if (city.density < 2) {
          new google.maps.Marker({
            ...redMarkerOptions,
            position: new google.maps.LatLng(city.lat, city.lng),
          });
        } else if (city.density == 2) {
          new google.maps.Marker({
            ...yellowMarkerOptions,
            position: new google.maps.LatLng(city.lat, city.lng),
          });
        } else if (city.density > 2) {
          new google.maps.Marker({
            ...limeMarkerOptions,
            position: new google.maps.LatLng(city.lat, city.lng),
          });
        }
      });
      var overlay = new google.maps.OverlayView();
      overlay.draw = function () {
        this.getPanes()!.markerLayer.id = "marker-layer";
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
