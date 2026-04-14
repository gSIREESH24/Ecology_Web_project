import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, Box, Typography, Chip, Divider, Button,
  Avatar, LinearProgress, Grid, CircularProgress
} from "@mui/material";
import EcoIcon from "@mui/icons-material/EnergySavingsLeaf";
import ForestIcon from "@mui/icons-material/Forest";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import ScienceIcon from "@mui/icons-material/Science";
import StarIcon from "@mui/icons-material/Star";
import api from "../../../api";

const CREDITS_PER_TON = 1.8;
const CO2_KG_PER_CREDIT = 900;

const StatBox = ({ icon, value, label, color, bg }) => (
  <Box sx={{ p: 2.5, borderRadius: "20px", background: bg, textAlign: "center", border: `1px solid ${color}22` }}>
    <Avatar sx={{ bgcolor: `${color}20`, color, mx: "auto", mb: 1, width: 48, height: 48 }}>{icon}</Avatar>
    <Typography variant="h4" fontWeight="900" sx={{ color }}>{value}</Typography>
    <Typography variant="caption" color="text.secondary" fontWeight="600">{label}</Typography>
  </Box>
);

export default function CarbonCreditModal({ open, onClose }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.get("/carbon/me")
      .then(res => setData(res.data))
      .catch(() => setData({ credits: 0, co2SavedKg: 0, treesEquivalent: 0, transactions: [] }))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper"
      PaperProps={{ sx: { borderRadius: "28px", boxShadow: "0 30px 80px rgba(46,125,50,0.2)" } }}>
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        {/* Green header */}
        <Box sx={{ background: "linear-gradient(135deg, #0f3424 0%, #1b5e20 50%, #2e7d32 100%)", p: 3.5, color: "white", position: "relative" }}>
          <Button onClick={onClose} sx={{ position: "absolute", top: 12, right: 12, minWidth: 0, color: "white", opacity: 0.7 }}>
            <CloseIcon />
          </Button>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 52, height: 52 }}>
              <EcoIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="900">{t("carbon.title")}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>AgriCycle Green Initiative</Typography>
            </Box>
          </Box>

          {loading ? (
            <CircularProgress sx={{ color: "white" }} />
          ) : (
            <Box sx={{ background: "rgba(255,255,255,0.1)", borderRadius: "16px", p: 2.5, backdropFilter: "blur(10px)" }}>
              <Typography variant="h2" fontWeight="900" sx={{ letterSpacing: "-2px" }}>
                {data?.credits?.toFixed(2) || "0.00"}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>{t("carbon.yourCredits")}</Typography>
              <Box display="flex" gap={2} mt={1.5} flexWrap="wrap">
                <Chip icon={<EcoIcon />} label={`${((data?.co2SavedKg || 0) / 1000).toFixed(2)} tCO₂ ${t("carbon.co2Saved")}`}
                  sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 700 }} />
                <Chip icon={<ForestIcon />} label={`${data?.treesEquivalent || 0} ${t("carbon.treesEquivalent")}`}
                  sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 700 }} />
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 3 }}>
          {/* How it works */}
          <Box sx={{ mb: 3, p: 2.5, borderRadius: "16px", bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <ScienceIcon sx={{ color: "#15803d" }} />
              <Typography fontWeight="800" color="#15803d">{t("carbon.howItWorks")}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" lineHeight={1.7} mb={1.5}>
              {t("carbon.explanation")}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Grid container spacing={1.5}>
              {[
                { icon: "🌾", label: "1 ton stubble collected", value: "" },
                { icon: "→", label: "", value: "" },
                { icon: "⚡", label: `${CREDITS_PER_TON}`, value: t("carbon.creditsEarned") },
                { icon: "→", label: "", value: "" },
                { icon: "🌍", label: `${CO2_KG_PER_CREDIT * CREDITS_PER_TON} kg`, value: t("carbon.co2Prevented") }
              ].map((item, i) => (
                <Grid item key={i} xs={2.4} sx={{ textAlign: "center" }}>
                  <Typography fontSize="1.5rem">{item.icon}</Typography>
                  <Typography fontSize="0.7rem" fontWeight={700} color="#15803d">{item.label}</Typography>
                  <Typography fontSize="0.65rem" color="text.secondary">{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Impact Stats */}
          {!loading && data && (
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6}>
                <StatBox icon={<EcoIcon />} value={`${data.co2SavedKg || 0}`} label="kg CO₂ Saved" color="#15803d" bg="#f0fdf4" />
              </Grid>
              <Grid item xs={6}>
                <StatBox icon={<ForestIcon />} value={data.treesEquivalent || 0} label="Trees Equivalent" color="#0891b2" bg="#f0f9ff" />
              </Grid>
            </Grid>
          )}

          {/* Progress bar */}
          {!loading && data && (
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" fontWeight="700">{t("carbon.impact")}</Typography>
                <Typography variant="body2" color="#15803d" fontWeight="700">
                  {((data.credits / 100) * 100).toFixed(0)}% to 100 credits
                </Typography>
              </Box>
              <LinearProgress value={Math.min(data.credits, 100)} variant="determinate"
                sx={{ height: 12, borderRadius: 999, bgcolor: "#dcfce7", "& .MuiLinearProgress-bar": { borderRadius: 999, background: "linear-gradient(90deg, #15803d, #4ade80)" } }} />
            </Box>
          )}

          {/* Transaction History */}
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <HistoryIcon sx={{ color: "#1a3b2b" }} />
            <Typography fontWeight="800" color="#1a3b2b">{t("carbon.history")}</Typography>
          </Box>

          {loading ? (
            <Box textAlign="center" py={3}><CircularProgress size={28} sx={{ color: "#2e7d32" }} /></Box>
          ) : data?.transactions?.length === 0 ? (
            <Box sx={{ p: 3, borderRadius: "16px", bgcolor: "#f9f9f9", textAlign: "center" }}>
              <Typography color="text.secondary">{t("carbon.noHistory")}</Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 220, overflowY: "auto", pr: 0.5 }}>
              {data?.transactions?.slice().reverse().map((tx, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: "12px", mb: 1, bgcolor: "#f9fafb", border: "1px solid #f0f0f0" }}>
                  <Avatar sx={{ bgcolor: "#dcfce7", color: "#15803d", width: 36, height: 36 }}>
                    <StarIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="700">{tx.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(tx.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body2" fontWeight="900" color="#15803d">+{tx.amount}</Typography>
                    <Typography variant="caption" color="text.secondary">{tx.co2Kg}kg CO₂</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Future: Sell Credits */}
          <Box sx={{ mt: 2.5, p: 2.5, borderRadius: "16px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px dashed #86efac" }}>
            <Typography fontWeight="800" color="#15803d" mb={0.5}>🚀 {t("carbon.futureSell")}</Typography>
            <Typography variant="body2" color="#166534">{t("carbon.futureSellDesc")}</Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
