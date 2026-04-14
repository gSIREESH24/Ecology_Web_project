const mongoose = require("mongoose");

const collectionRequestSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },

    cropType: {
      type: String,
      required: true,
      enum: ["Wheat", "Paddy", "Maize", "Sugarcane", "Cotton", "Other"],
    },
    biomassQuantity: { type: Number, required: true }, // in tons
    priceExpectation: { type: Number, required: true }, // Rs per ton
    qualityNotes: { type: String, default: "" },
    cropPhotoUrl: { type: String, default: "" },
    preferredPickupDate: { type: Date, required: true },

    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    address: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "collected", "cancelled"],
      default: "pending",
    },

    assignedAggregatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedAggregatorName: { type: String, default: "" },
    scheduledPickupDate: { type: Date, default: null },

    carbonCreditsEarned: { type: Number, default: 0 }, // auto-calculated on collection
  },
  { timestamps: true }
);

module.exports = mongoose.model("CollectionRequest", collectionRequestSchema);
