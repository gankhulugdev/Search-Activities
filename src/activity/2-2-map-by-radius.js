import {
  Map,
  Layer,
  Source,
  FullscreenControl,
  NavigationControl,
} from "react-map-gl";
import {
  useState,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from "react";
import { Row, Col, Slider, InputNumber } from "antd";
import * as turf from "@turf/turf";
import { radiusLayer } from "./1-3-map-style";
import MarkerList from "./markerList";
import { MapBoxContext } from ".";

const MapByRadius = () => {
  const { setParams } = useContext(MapBoxContext);
  const mapRef = useRef();
  const [miles, setMiles] = useState(50);
  const [lngLat, setLngLat] = useState(null);
  const isMapLoaded = useRef(false); //value that's not needed for rendering
  

  const makeRadius = useCallback((lngLatArray, radiusInMiles) => {
    const point = turf.point(lngLatArray);
    const buffered = turf.buffer(point, radiusInMiles, { units: "miles" });
    return buffered;
  },[]);

  useEffect(() => {
    if (lngLat) {
      const searchRadius = makeRadius(lngLat, miles);
      mapRef.current.getSource("mapbyRadius").setData(searchRadius);

      const [lat, lon] = lngLat;   
      setParams((curr) => {
        return { ...curr, state: "", radius: miles, lat_lon: `${lon.toFixed(2)},${lat.toFixed(2)}` };
      });
    }
  }, [lngLat, miles,setParams,makeRadius]);

  const onClick = (e) => {
    e.preventDefault();
    const eventLngLat = [e.lngLat.lng, e.lngLat.lat];
    setLngLat(eventLngLat);
  };

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={{ latitude: 38.88, longitude: -98, zoom: 3 }}
        minZoom={2}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onClick={onClick}
        interactiveLayerIds={[radiusLayer.id]}
        onLoad={() => (isMapLoaded.current = true)}
      >
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
        {/* <GeolocateControl ref={geolocateControlRef} /> */}
        <Source
          id="mapbyRadius"
          type="geojson"
          data={
            "https://docs.mapbox.com/mapbox-gl-js/assets/ne_110m_admin_1_states_provinces_shp.geojson"
          }
        >
          <Layer {...radiusLayer} />
        </Source>
        <MarkerList />
        <IntegerStep setMiles={setMiles} makeRadius={makeRadius} />
      </Map>
    </>
  );
};

const IntegerStep = ({ setMiles }) => {
  const [inputValue, setInputValue] = useState(1);
  const onChange = (newValue) => {
    setInputValue(newValue);

    setMiles(newValue);
  };
  return (
    <Row className="control-panel">
      <Col span={22}>
        <Slider
          min={10}
          max={400}
          onChange={onChange}
          value={typeof inputValue === "number" ? inputValue : 0}
          defaultValue={20}
        />
      </Col>
      <Col span={2}>
        <InputNumber
          min={10}
          max={400}
          defaultValue={20}
          style={{
            margin: "0 16px",
          }}
          value={inputValue}
          // onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default MapByRadius;
