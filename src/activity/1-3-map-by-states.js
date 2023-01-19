import {
  Map,
  Layer,
  Source,
  FullscreenControl,
  NavigationControl,
} from "react-map-gl";
import { layer, highlightLayer } from "./1-3-map-style";
import { useState, useCallback, useMemo, useRef,useContext } from "react";
import bbox from "@turf/bbox";
import MarkerList from "./markerList";
import { MapBoxContext } from ".";

const MapByStates = () => {
  const {setParams, params} = useContext(MapBoxContext)
  const mapRef = useRef();
  const [hoverInfo, setHoverInfo] = useState(null);

  const isMapLoaded = useRef(false); //value that's not needed for rendering


  const onHover = useCallback((event) => {
    if (isMapLoaded.current) {
      const state = event.features && event.features[0];
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        stateName: state && state.properties.name,
      });
    }
  }, []);

  const onClick = (event) => {
    event.preventDefault();
    
    if (event.features[0]) {
      if (params?.state !== event.features[0].properties.postal) {
        const [minLng, minLat, maxLng, maxLat] = bbox(event.features[0]);
        mapRef.current.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 60, duration: 1000 }
        );
      }

      setParams((curr) => ({
        ...curr,
        state: event.features[0].properties.postal,
      }));
    }
  };

  const selectedstate = useMemo(
    () => (hoverInfo && hoverInfo.stateName) || "",
    [hoverInfo]
  );

  const filter = useMemo(() => ["in", "name", selectedstate], [selectedstate]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{ latitude: 38.88, longitude: -98, zoom: 3 }}
      minZoom={2}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onMouseMove={onHover}
      onClick={onClick}
      interactiveLayerIds={[layer.id]}
      onLoad={() => (isMapLoaded.current = true)}
    >
      <FullscreenControl position="top-right" />
      <NavigationControl position="top-right" />
      <Source
        id="map"
        type="geojson"
        data={
          "https://docs.mapbox.com/mapbox-gl-js/assets/ne_110m_admin_1_states_provinces_shp.geojson"
        }
      >
        <Layer {...layer} />
        <Layer {...highlightLayer} filter={filter} />
      </Source>
      <MarkerList />
    </Map>
  );
};

export default MapByStates;
