import axios from "axios";
import React, { useState, useEffect, createContext, useCallback } from "react";
import { Layout, Spin } from "antd";
import { Routes, Route } from "react-router-dom";

import SideBar from "./sidebar";
import "./style.css";
import MapContainer from "./1-1-map-container";
import MapContainerByRadius from "./2-1-map-container-radius";

export const MapBoxContext = createContext();

const baseURL = "https://cors-anywhere.herokuapp.com";

const active_data_key = process.env.REACT_APP_ACTIVE_DATA_KEY;
const url = `/https://api.amp.active.com/v2/search?&api_key=${active_data_key}&exclude_children=true&sort=distance&current_page=1&per_page=50`;

const Activity = () => {
  // ---------------------------------------------------
  const [activities, setActivities] = useState(
    localStorage.getItem("activities")
      ? JSON.parse(localStorage.getItem("activities"))
      : []
  );

  const [favoriteActivities, setFavoriteActivities] = useState(
    localStorage.getItem("favoriteActivities")
      ? JSON.parse(localStorage.getItem("favoriteActivities"))
      : []
  );

  const [params, setParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  //store favorite activities in local storage
  useEffect(() => {
    localStorage.setItem(
      "favoriteActivities",
      JSON.stringify(favoriteActivities)
    );
  }, [favoriteActivities]);

  //store fetched data in local storage
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  const fetchActivityData = useCallback(() => {
    console.log(params);
    setIsLoading(true);
    axios
      .create({
        baseURL: baseURL,
      })
      .get(url, {
        params: params,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          setActivities(
            res.data.results.map((activity) => {
              return {
                geoPoint: activity.place?.geoPoint,
                assetName: activity.assetName,
                description: activity.assetDescriptions[0]?.description,
                homePageUrlAdr: activity?.homePageUrlAdr,
                logoUrlAdr: activity?.logoUrlAdr,
                addressLine1Txt: activity.place.addressLine1Txt,
                cityName: activity.place.cityName,
                stateProvinceCode: activity.place.stateProvinceCode,
                postalCode: activity.place.postalCode,
                primaryContactPhone: activity.organization?.primaryContactPhone,
                contactPhone: activity?.contactPhone,
                assetGuid: activity.assetGuid,
              };
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params]);

  return (
    <MapBoxContext.Provider
      value={{
        activities,
        setParams,
        params,
        fetchActivityData,
        setFavoriteActivities,
        favoriteActivities,
      }}
    >
      {isLoading && (
        <div className="loading">
          <div className="loader-spin">
            <Spin size="large" />
            <br />
            <span>Fetching data...</span>
          </div>
        </div>
      )}

      {!isLoading && (
        <Layout style={{ height: "100vh", width: "100vw" }}>
          <SideBar />
          <Routes>
            <Route path="/" element={<MapContainer />}></Route>
            <Route
              path="/searchByRadius" element={<MapContainerByRadius />}
            ></Route>
            <Route path="/favorite" element={<div>favorite</div>}></Route>
          </Routes>
          {/* <MapContainer /> */}
        </Layout>
      )}
    </MapBoxContext.Provider>
  );
};

export default Activity;
