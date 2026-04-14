const Demand = require("../models/demandSchema");
const User = require("../models/userSchema");

// POST /api/demands — Industry posts demand
const createDemand = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "industry") {
      return res.status(403).json({ message: "Only industry users can post demands" });
    }

    const {
      cropType,
      quantityNeeded,
      priceOffered,
      deadline,
      description,
      address,
      lat,
      lng,
    } = req.body;

    if (!cropType || !quantityNeeded || !priceOffered || !deadline || !address) {
      return res.status(400).json({ message: "Required: cropType, quantityNeeded, priceOffered, deadline, address" });
    }

    const demand = await Demand.create({
      industryId: user._id,
      industryName: user.name,
      companyName: user.profile?.companyName || user.name,
      cropType,
      quantityNeeded: Number(quantityNeeded),
      priceOffered: Number(priceOffered),
      deadline: new Date(deadline),
      description: description || "",
      location: {
        address,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
      },
    });

    // Notify aggregators
    await User.updateMany({ role: "aggregator" }, { $inc: { notificationCount: 1 } });

    return res.status(201).json({ message: "Demand posted", demand });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/demands — All open demands (aggregators + farmers can view)
const getAllDemands = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : { status: "open" };
    const demands = await Demand.find(filter).sort({ createdAt: -1 });
    return res.json({ demands });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/demands/my — Industry sees own demands
const getMyDemands = async (req, res) => {
  try {
    const demands = await Demand.find({ industryId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ demands });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/demands/:id/accept — Aggregator accepts demand
const acceptDemand = async (req, res) => {
  try {
    if (req.user.role !== "aggregator") {
      return res.status(403).json({ message: "Only aggregators can accept demands" });
    }
    const demand = await Demand.findById(req.params.id);
    if (!demand) return res.status(404).json({ message: "Demand not found" });
    if (demand.status !== "open") {
      return res.status(400).json({ message: "Demand is no longer open" });
    }

    const aggregator = await User.findById(req.user.id);
    demand.status = "accepted";
    demand.acceptedAggregatorId = req.user.id;
    demand.acceptedAggregatorName = aggregator.name;
    await demand.save();

    return res.json({ message: "Demand accepted", demand });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/demands/:id/close — Industry closes demand
const closeDemand = async (req, res) => {
  try {
    const demand = await Demand.findById(req.params.id);
    if (!demand) return res.status(404).json({ message: "Demand not found" });
    if (demand.industryId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to close this demand" });
    }
    demand.status = "closed";
    await demand.save();
    return res.json({ message: "Demand closed", demand });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createDemand, getAllDemands, getMyDemands, acceptDemand, closeDemand };
