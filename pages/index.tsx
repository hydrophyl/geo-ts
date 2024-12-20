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
  const [locs, setLocs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const data = await axios.get("/api/get-aes");
    setLocs(data.data);
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
      if (locs != null) {
        const google = window.google;
        map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            // define where center of the map should be
            // 50.828538, 10.383900
            center: { lat: 50.828538, lng: 10.383900 },
            // map zoom, for bigger screen 8
            zoom: 7,
            fullscreenControl: false, // remove the top-right button
            mapTypeControl: false, // remove the top-left buttons
            streetViewControl: false, // remove the pegman
            zoomControl: false, // remove the bottom-right buttons
            styles: mapStyleDark,
          }
        );
        let MarkerOption0 = {
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
        // Define type of marker base on its weight
        locs.map((loc, index) => {
          if (loc.weight > 20 && loc.weight < 40) {
            new google.maps.Marker({
              ...MarkerOption0,
              position: new google.maps.LatLng(loc.lat, loc.lon),
            });
          } else if (loc.weight > 40 && loc.weight < 60) {
            new google.maps.Marker({
              ...MarkerOption1,
              position: new google.maps.LatLng(loc.lat, loc.lon),
            });
          } else if (loc.weight > 60 && loc.weight < 80) {
            new google.maps.Marker({
              ...MarkerOption2,
              position: new google.maps.LatLng(loc.lat, loc.lon),
            });
          } else if (loc.weight > 80) {
            new google.maps.Marker({
              ...MarkerOption3,
              position: new google.maps.LatLng(loc.lat, loc.lon),
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
  }, [locs, MAP_API_KEY]);

  return (
    <div style={{ height: "100vh" }}>
      <div id="map">
        <div className="z-30 bg-green-400 w-4 h-4 absolute top-0 right-0"></div>
      </div>
    </div>
  );
};

export default Home;
