import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";
import {
  svg_blue0,
  svg_blue1,
  svg_blue2,
  svg_blue3,
  mapStyleDark,
} from "../constants/styles";

const Home = () => {
  const MAP_API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
  const [aes, setAes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const data = await axios.get("/api/get-aes");
    setAes(data.data);
  };
  setTimeout(() => {
    setIsLoading(!isLoading);
  }, 60000);
  // init data
  useEffect(() => {
    fetchData();
  }, [isLoading]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: MAP_API_KEY,
      version: "weekly",
    });
    let map; 
    loader.load().then(() => {
      if (aes != null) {
        const google = window.google;
        map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            // define where center of the map should be
            center: { lat: 51.2, lng: 10.23 },
            // map zoom, for bigger screen 8
            zoom: 7,
            fullscreenControl: false, // remove the top-right button
            mapTypeControl: false, // remove the top-left buttons
            streetViewControl: false, // remove the pegman
            zoomControl: false, // remove the bottom-right buttons
            styles: mapStyleDark,
          }
        );
        let MarkerOption0= {
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svg_blue0),
            scaledSize: new google.maps.Size(20, 20),
          },
          optimized: false,
        };
        let MarkerOption1 = {
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svg_blue1),
            scaledSize: new google.maps.Size(20, 20),
          },
          optimized: false,
        };
        let MarkerOption2 = {
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svg_blue2),
            scaledSize: new google.maps.Size(20, 20),
          },
          optimized: false,
        };
        let MarkerOption3 = {
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svg_blue3),
            scaledSize: new google.maps.Size(20, 20),
          },
          optimized: false,
        };
        // Define type of marker base on its time different
        aes.map((ae, index) => {
          if (ae.ae_timediff > 20 && ae.ae_timediff < 40) {
            new google.maps.Marker({
              ...MarkerOption0,
              position: new google.maps.LatLng(ae.lat, ae.lng),
            });
          } else if (ae.ae_timediff > 40 && ae.ae_timediff < 60) {
            new google.maps.Marker({
              ...MarkerOption1,
              position: new google.maps.LatLng(ae.lat, ae.lng),
            });
          } else if (ae.ae_timediff > 60 && ae.ae_timediff < 80) {
            new google.maps.Marker({
              ...MarkerOption2,
              position: new google.maps.LatLng(ae.lat, ae.lng),
            });
          } else if (ae.ae_timediff > 80) {
            new google.maps.Marker({
              ...MarkerOption3,
              position: new google.maps.LatLng(ae.lat, ae.lng),
            });
          }
        });
        var overlay = new google.maps.OverlayView();
        overlay.draw = function () {
          this.getPanes()!.markerLayer.id = "marker-layer";
        };
        overlay.setMap(map);
      }
    });
  }, [aes]);

  return (
    <div style={{ height: "100vh" }}>
      <div id="map"></div>
    </div>
  );
};

export default Home;