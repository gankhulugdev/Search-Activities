import { Popup } from "react-map-gl";
import { memo, useMemo, useState, useContext } from "react";
import ActivityMarker from "./marker";
import { MapBoxContext } from ".";
import { Row, Col, Divider } from "antd";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
const MarkerList = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { activities, favoriteActivities, setFavoriteActivities } =
    useContext(MapBoxContext);

  const filteredActivities = useMemo(
    () => activities?.filter((activity) => activity.geoPoint),
    [activities]
  );

  const nonFavoriteActivities = useMemo(
    () =>
      filteredActivities?.filter(
        (activity) => !favoriteActivities.includes(activity.assetGuid)
      ),
    [filteredActivities, favoriteActivities]
  );

  const isFavIncluded = () =>
    favoriteActivities.some(
      (activity) => activity.assetGuid === selectedActivity.assetGuid
    );

  const onClick = () => {
    !isFavIncluded()
      ? setFavoriteActivities((curr) => [...curr, selectedActivity])
      : setFavoriteActivities((curr) =>
          curr.filter(
            (currAcitvity) =>
              currAcitvity.assetGuid !== selectedActivity.assetGuid
          )
        );
  };

  return (
    <div>
      {nonFavoriteActivities?.map((activity) => {
        return (
          <ActivityMarker
            activity={activity}
            key={activity.assetGuid}
            setSelectedActivity={setSelectedActivity}
            color={"green"}
          />
        );
      })}

      {favoriteActivities?.map((activity) => {
        return (
          <ActivityMarker
            activity={activity}
            key={activity.assetGuid}
            setSelectedActivity={setSelectedActivity}
            color={"red"}
          />
        );
      })}

      {selectedActivity && (
        <Popup
          longitude={selectedActivity.geoPoint.lon}
          latitude={selectedActivity.geoPoint.lat}
          offset={[0, -10]}
          anchor="bottom"
          closeOnClick={false}
          onClose={() => {
            setSelectedActivity(null);
          }}
        >
          <div style={{ margin: "10px" }}>
            <div className=" flex space-x-2 font-bold rounded bg-slate-500 p-1 text-white">
              <div
                onClick={onClick}
                className="flex cursor-pointer justify-center text-xl text-red-700"
              >
                {isFavIncluded() ? <AiFillHeart /> : <AiOutlineHeart />}
              </div>
              <div>{selectedActivity.assetName}</div>
            </div>
            <Divider />
            <Row>
              <Col span={12}>
                <div>
                  {`${selectedActivity.addressLine1Txt} ${selectedActivity.cityName} ${selectedActivity.stateProvinceCode} ${selectedActivity.postalCode}`}
                </div>
              </Col>
              <Col span={11} offset={1}>
                <img
                  // style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
                  className="w-full h-full rounded-xl"
                  alt="Not Found"
                  src={
                    selectedActivity.logoUrlAdr
                      ? selectedActivity.logoUrlAdr
                      : "https://play-lh.googleusercontent.com/g0Ftdu58Q0cn3eluvdTHq4ojwdyLmgjge_rFTLcE0QDSKLNmBHFlhRjGeh-ZHss8lWY"
                  }
                />
              </Col>
            </Row>

            <div className="bg-sky-600 cursor-pointer rounded text-center text-white">
              More Info
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default memo(MarkerList);
