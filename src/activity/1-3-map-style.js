export const highlightLayer = {
  id: "states-highlighted",
  type: "fill",
  source: "map",
  paint: {
    "fill-outline-color": "rgba(0,0,24,0.2)",
    "fill-color": "rgba(0,0,24,0.2)",
    "fill-opacity": 0.75,
  },
};

export const layer = {
  id: "states",
  type: "fill",
  source: "map",
  paint: {
    // 'circle-radius': 10,
    "fill-outline-color": "rgba(0,0,0,0.1)",
    "fill-color": "rgba(0,0,0,0.1)",
  },
};

export const radiusLayer = {
  id: "search-radius",
  source: {
    type: 'geojson',
    data: { "type": "FeatureCollection", "features": [] }
  },
  type: "fill",
  paint: {
    'fill-color': '#F1CF65',
    'fill-opacity': 0.1
  }
};
