const CarbonCredit = require("../models/carbonCreditSchema");

// GET /api/carbon/me
const getMyCarbonCredits = async (req, res) => {
  try {
    let creditDoc = await CarbonCredit.findOne({ userId: req.user.id });
    if (!creditDoc) {
      creditDoc = { credits: 0, co2SavedKg: 0, transactions: [] };
    }

    // Calculate trees equivalent: 1 tree absorbs ~21 kg CO2/year
    const treesEquivalent = Math.floor(creditDoc.co2SavedKg / 21);

    return res.json({
      credits: creditDoc.credits || 0,
      co2SavedKg: creditDoc.co2SavedKg || 0,
      treesEquivalent,
      transactions: creditDoc.transactions || [],
      formula: {
        creditsPerTon: 1.8,
        co2KgPerCredit: 900,
        explanation: "1 ton of stubble prevented from burning = 1.8 carbon credits = 1,620 kg CO2 saved",
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyCarbonCredits };
