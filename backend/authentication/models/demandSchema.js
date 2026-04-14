const mongoose = require("mongoose");

const demandSchema = new mongoose.Schema(
  {
    industryId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    industryName: { type: String, required: true },
    companyName: { type: String, required: true },

    cropType: {
      type: String,
      required: true,
      enum: ["Wheat", "Paddy", "Maize", "Sugarcane", "Cotton", "Any"],
    },
    quantityNeeded: { type: Number, required: true }, // in tons
    priceOffered: { type: Number, required: true }, // Rs per ton
    deadline: { type: Date, required: true },
    description: { type: String, default: "" },

    location: {
      address: { type: String, required: true },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },

    status: {
      type: String,
      enum: ["open", "accepted", "fulfilled", "closed"],
      default: "open",
    },

    acceptedAggregatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    acceptedAggregatorName: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Demand", demandSchema);
