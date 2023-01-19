import { Marker } from "react-map-gl";
import {GiPositionMarker} from "react-icons/gi"


const ActivityMarker = ({ activity, setSelectedActivity, color }) => {

  return (
    <Marker
      latitude={activity.geoPoint.lat}
      longitude={activity.geoPoint.lon}
    >

      <button
        onClick={(e) => {
          e.preventDefault();
          setSelectedActivity(activity);
        }}
        className="marker-btn"
      >
        <GiPositionMarker style={{color}}/>
      </button>
    </Marker>
  );
};

export default ActivityMarker;
