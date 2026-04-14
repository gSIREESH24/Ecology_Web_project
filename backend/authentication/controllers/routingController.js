const fetch = require("node-fetch");

const ORS_API_KEY = process.env.ORS_API_KEY;

// POST /api/routing/drive
// Body: { waypoints: [[lat, lng], [lat, lng], ...] }
const getDrivingRoute = async (req, res) => {
  try {
    const { waypoints } = req.body;
    if (!waypoints || waypoints.length < 2) {
      return res.status(400).json({ message: "Need at least 2 waypoints" });
    }

    // ORS uses [longitude, latitude] order
    const coordinates = waypoints.map(([lat, lng]) => [lng, lat]);

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates,
          instructions: false,
          geometry: true,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ORS error:", errText);
      return res.status(502).json({ message: "Routing service error", detail: errText });
    }

    const data = await response.json();
    const feature = data.features?.[0];
    if (!feature) {
      return res.status(502).json({ message: "No route found" });
    }

    // Convert ORS [lng, lat] back to [lat, lng] for Leaflet
    const routeCoords = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const summary = feature.properties.summary;

    // Find segment breakpoints by matching closest points to waypoints
    // Each segment = slice of routeCoords between two consecutive waypoints
    const segments = [];
    let lastIdx = 0;
    for (let w = 1; w < waypoints.length; w++) {
      const [wLat, wLng] = waypoints[w];
      let closestIdx = lastIdx;
      let minDist = Infinity;
      for (let i = lastIdx; i < routeCoords.length; i++) {
        const [rLat, rLng] = routeCoords[i];
        const d = Math.sqrt((rLat - wLat) ** 2 + (rLng - wLng) ** 2);
        if (d < minDist) {
          minDist = d;
          closestIdx = i;
        }
      }
      segments.push(routeCoords.slice(lastIdx, closestIdx + 1));
      lastIdx = closestIdx;
    }

    return res.json({
      routeCoords,
      segments,
      distanceKm: (summary.distance / 1000).toFixed(1),
      durationMin: Math.round(summary.duration / 60),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getDrivingRoute };
