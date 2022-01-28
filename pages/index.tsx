import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  svg_red0,
  svg_red1,
  svg_red2,
  svg_red3,
  mapStyleDark,
} from "../constants/styles";
import { useAEs } from "@/lib/swr-hooks";

const Home = () => {
  const MAP_API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
  const { aes, isLoading } = useAEs();
  useEffect(() => {
    console.log(isLoading);
    const loader = new Loader({
      apiKey: MAP_API_KEY,
      version: "weekly",
    });
    let map;
    loader.load().then(() => {
      if (isLoading == false) {
        const google = window.google;
        map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            center: { lat: 51.2, lng: 10.23 },
            zoom: 7,
            fullscreenControl: false, // remove the top-right button
            mapTypeControl: false, // remove the top-left buttons
            streetViewControl: false, // remove the pegman
            zoomControl: false, // remove the bottom-right buttons
            styles: mapStyleDark,
          }
        );
        let red0MarkerOptions = {
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svg_red0),
            scaledSize: new google.maps.Size(20, 20),
          },
          optimized: false,
        };
        let red1MarkerOptions = {
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svg_red1),
            scaledSize: new google.maps.Size(20, 20),
          },
          optimized: false,
        };
        let red2MarkerOptions = {
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svg_red2),
            scaledSize: new google.maps.Size(20, 20),
          },
          optimized: false,
        };
        let red3MarkerOptions = {
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svg_red3),
            scaledSize: new google.maps.Size(20, 20),
          },
          optimized: false,
        };
        aes.map((ae, index) => {
          if (ae.ae_countcontract > 20 && ae.ae_countcontract < 40) {
            new google.maps.Marker({
              ...red0MarkerOptions,
              position: new google.maps.LatLng(ae.lat, ae.lng),
            });
          } else if (ae.ae_countcontract > 40 && ae.ae_countcontract < 60) {
            new google.maps.Marker({
              ...red1MarkerOptions,
              position: new google.maps.LatLng(ae.lat, ae.lng),
            });
          } else if (ae.ae_countcontract > 60 && ae.ae_countcontract < 80) {
            new google.maps.Marker({
              ...red2MarkerOptions,
              position: new google.maps.LatLng(ae.lat, ae.lng),
            });
          } else if (ae.ae_countcontract > 80) {
            new google.maps.Marker({
              ...red3MarkerOptions,
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
  });

  return (
    <div style={{ height: "100vh" }}>
      <div id="map"></div>
    </div>
  );
};

export default Home;
