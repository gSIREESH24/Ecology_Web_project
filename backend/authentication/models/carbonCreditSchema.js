const mongoose = require("mongoose");

// Carbon formula: 1 ton biomass = 1.8 carbon credits
// 1 credit = ~0.9 kg CO2 prevented from stubble burning
// Burning 1 ton paddy straw emits ~1.62 tCO2eq -> so 1.8 credits per ton collected

const carbonCreditSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userRole: { type: String, enum: ["farmer", "aggregator", "industry"] },
    credits: { type: Number, default: 0 }, // total accumulated credits
    co2SavedKg: { type: Number, default: 0 }, // total CO2 saved in kg
    transactions: [
      {
        type: { type: String, enum: ["earn", "redeem"], default: "earn" },
        amount: { type: Number },
        co2Kg: { type: Number, default: 0 },
        description: { type: String },
        relatedRequestId: { type: mongoose.Schema.Types.ObjectId, default: null },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Static method for credit calculation
carbonCreditSchema.statics.CREDITS_PER_TON = 1.8;
carbonCreditSchema.statics.CO2_KG_PER_CREDIT = 900; // 0.9 tonnes = 900 kg

module.exports = mongoose.model("CarbonCredit", carbonCreditSchema);
