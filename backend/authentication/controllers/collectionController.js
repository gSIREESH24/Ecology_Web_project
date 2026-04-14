const CollectionRequest = require("../models/collectionRequestSchema");
const CarbonCredit = require("../models/carbonCreditSchema");
const User = require("../models/userSchema");

const CREDITS_PER_TON = 1.8;
const CO2_KG_PER_CREDIT = 900;

// Haversine distance (km)
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// POST /api/collections — Farmer creates request
const createRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can create collection requests" });
    }

    const {
      cropType,
      biomassQuantity,
      priceExpectation,
      qualityNotes,
      preferredPickupDate,
      lat,
      lng,
      address,
    } = req.body;

    if (!cropType || !biomassQuantity || !priceExpectation || !preferredPickupDate || !lat || !lng || !address) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const cropPhotoUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const request = await CollectionRequest.create({
      farmerId: user._id,
      farmerName: user.name,
      farmerPhone: user.mobile,
      cropType,
      biomassQuantity: Number(biomassQuantity),
      priceExpectation: Number(priceExpectation),
      qualityNotes: qualityNotes || "",
      cropPhotoUrl,
      preferredPickupDate: new Date(preferredPickupDate),
      coordinates: { lat: Number(lat), lng: Number(lng) },
      address,
    });

    // Notify aggregators — increment notificationCount for all aggregators
    await User.updateMany({ role: "aggregator" }, { $inc: { notificationCount: 1 } });

    return res.status(201).json({ message: "Collection request created", request });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/collections — Aggregator sees all requests
const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await CollectionRequest.find(filter).sort({ createdAt: -1 });

    // If aggregator, add distance from their location
    let aggCoords = null;
    if (req.user.role === "aggregator") {
      const agg = await User.findById(req.user.id);
      if (agg?.coordinates?.lat && agg?.coordinates?.lng) {
        aggCoords = agg.coordinates;
      }
    }

    const enriched = requests.map((r) => {
      const obj = r.toObject();
      if (aggCoords && r.coordinates?.lat && r.coordinates?.lng) {
        obj.distanceKm = haversineKm(
          aggCoords.lat, aggCoords.lng,
          r.coordinates.lat, r.coordinates.lng
        ).toFixed(1);
      } else {
        obj.distanceKm = null;
      }
      return obj;
    });

    return res.json({ requests: enriched });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/collections/my — Farmer sees own requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await CollectionRequest.find({ farmerId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ requests });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/collections/:id/accept — Aggregator accepts
const acceptRequest = async (req, res) => {
  try {
    if (req.user.role !== "aggregator") {
      return res.status(403).json({ message: "Only aggregators can accept requests" });
    }
    const request = await CollectionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is no longer pending" });
    }

    const aggregator = await User.findById(req.user.id);
    request.status = "accepted";
    request.assignedAggregatorId = req.user.id;
    request.assignedAggregatorName = aggregator.name;
    if (req.body.scheduledPickupDate) {
      request.scheduledPickupDate = new Date(req.body.scheduledPickupDate);
    }
    await request.save();
    return res.json({ message: "Request accepted", request });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/collections/:id/collect — Aggregator marks collected + awards carbon credits
const markCollected = async (req, res) => {
  try {
    if (req.user.role !== "aggregator") {
      return res.status(403).json({ message: "Only aggregators can mark as collected" });
    }
    const request = await CollectionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "accepted") {
      return res.status(400).json({ message: "Request must be accepted before marking collected" });
    }

    const credits = +(request.biomassQuantity * CREDITS_PER_TON).toFixed(2);
    const co2Kg = +(credits * CO2_KG_PER_CREDIT).toFixed(0);

    request.status = "collected";
    request.carbonCreditsEarned = credits;
    await request.save();

    // Award farmer carbon credits
    let farmerCredit = await CarbonCredit.findOne({ userId: request.farmerId });
    if (!farmerCredit) {
      farmerCredit = new CarbonCredit({ userId: request.farmerId, userRole: "farmer" });
    }
    farmerCredit.credits += credits;
    farmerCredit.co2SavedKg += co2Kg;
    farmerCredit.transactions.push({
      type: "earn",
      amount: credits,
      co2Kg,
      description: `${request.biomassQuantity}t ${request.cropType} straw collected`,
      relatedRequestId: request._id,
    });
    await farmerCredit.save();

    // Award aggregator smaller credits (0.5 per ton)
    const aggCredits = +(request.biomassQuantity * 0.5).toFixed(2);
    let aggCredit = await CarbonCredit.findOne({ userId: request.assignedAggregatorId });
    if (!aggCredit) {
      aggCredit = new CarbonCredit({ userId: request.assignedAggregatorId, userRole: "aggregator" });
    }
    aggCredit.credits += aggCredits;
    aggCredit.co2SavedKg += +(aggCredits * CO2_KG_PER_CREDIT).toFixed(0);
    aggCredit.transactions.push({
      type: "earn",
      amount: aggCredits,
      co2Kg: +(aggCredits * CO2_KG_PER_CREDIT).toFixed(0),
      description: `Collected ${request.biomassQuantity}t from ${request.farmerName}`,
      relatedRequestId: request._id,
    });
    await aggCredit.save();

    return res.json({ message: "Marked as collected. Carbon credits awarded.", request, credits });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createRequest, getAllRequests, getMyRequests, acceptRequest, markCollected };
