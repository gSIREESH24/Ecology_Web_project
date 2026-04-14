import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, Grid, Button, Dialog, DialogContent, Chip, Divider, CircularProgress, Alert } from "@mui/material";
import CashCard from "./CashCard";
import ReportCard from "./ReportCard";
import FieldCard from "./FieldCard";
import FarmLandMap from "./FarmLandMap";
import CollectionRequestForm from "./CollectionRequestForm";
import { motion } from "framer-motion";
import { Map, Activity, Plus, List } from "lucide-react";
import api from "../../../api";
import { useAuth } from "../../../context/AuthContext";

const STATUS_COLOR = {
  pending: "#f59e0b",
  accepted: "#3b82f6",
  collected: "#22c55e",
  cancelled: "#ef4444"
};

export default function MainPage() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const currentDate = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const [showForm, setShowForm] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const fetchRequests = () => {
    setReqLoading(true);
    api.get("/collections/my")
      .then(res => setMyRequests(res.data.requests || []))
      .catch(() => {})
      .finally(() => setReqLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4, lg: 5 }, maxWidth: "1400px", mx: "auto" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary" fontWeight="600" mb={0.5}>{currentDate}</Typography>
            <Typography variant="h3" fontWeight="900" sx={{ color: "#1a3b2b", letterSpacing: "-1px" }}>
              {t("farmer.welcome").replace("Farmer", session?.name?.split(" ")[0] || "Farmer")}
            </Typography>
          </Box>
          <Box display="flex" gap={1.5} flexWrap="wrap">
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setShowForm(true)}
              sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, boxShadow: "0 4px 16px rgba(46,125,50,0.3)" }}>
              {t("farmer.requestPickup")}
            </Button>
            <Button variant="outlined" startIcon={<List size={18} />} onClick={() => { setShowRequests(true); fetchRequests(); }}
              sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, borderColor: "#2e7d32", color: "#2e7d32" }}>
              {t("farmer.myRequests")} {myRequests.length > 0 && `(${myRequests.length})`}
            </Button>
          </Box>
        </Box>
      </motion.div>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 4, width: "100%" }}>
        <Box sx={{ flex: { xs: "1 1 auto", sm: "2 1 0%" } }}><CashCard /></Box>
        <Box sx={{ flex: { xs: "1 1 auto", sm: "1 1 0%" }, minWidth: { sm: "280px", lg: "350px" } }}><ReportCard /></Box>
      </Box>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
        <Box display="flex" alignItems="center" gap={1.5} sx={{ mt: 6, mb: 3 }}>
          <Box sx={{ p: 1, background: "#e8f5e9", borderRadius: "12px", color: "#2e7d32" }}><Map size={24} /></Box>
          <Typography variant="h5" sx={{ fontWeight: "800", color: "#1a3b2b", letterSpacing: "-0.5px" }}>{t("map.satellite")}</Typography>
        </Box>
        <FarmLandMap />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
        <Box display="flex" alignItems="center" gap={1.5} sx={{ mt: 6, mb: 3 }}>
          <Box sx={{ p: 1, background: "#e3f2fd", borderRadius: "12px", color: "#1976d2" }}><Activity size={24} /></Box>
          <Typography variant="h5" sx={{ fontWeight: "800", color: "#1a3b2b", letterSpacing: "-0.5px" }}>Fields Activity</Typography>
        </Box>
        <Grid container spacing={3}><Grid item xs={12}><FieldCard /></Grid></Grid>
      </motion.div>

      {/* Collection Request Form Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth scroll="paper"
        PaperProps={{ sx: { borderRadius: "28px", boxShadow: "0 30px 80px rgba(0,0,0,0.15)" } }}>
        <DialogContent sx={{ p: 0 }}>
          <CollectionRequestForm onClose={() => setShowForm(false)} onSuccess={fetchRequests} />
        </DialogContent>
      </Dialog>

      {/* My Requests Dialog */}
      <Dialog open={showRequests} onClose={() => setShowRequests(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "24px" } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="800" mb={2}>{t("farmer.myRequests")}</Typography>
          {reqLoading ? (
            <Box textAlign="center" py={4}><CircularProgress sx={{ color: "#2e7d32" }} /></Box>
          ) : myRequests.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: "12px" }}>{t("farmer.noRequests")}</Alert>
          ) : (
            myRequests.map(r => (
              <Box key={r._id} sx={{ p: 2, mb: 1.5, borderRadius: "16px", border: "1px solid #e0e0e0", bgcolor: "#fafafa" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography fontWeight="700">{t(`crops.${r.cropType}`)} — {r.biomassQuantity}t</Typography>
                  <Chip label={t(`status.${r.status}`)} size="small"
                    sx={{ bgcolor: `${STATUS_COLOR[r.status]}20`, color: STATUS_COLOR[r.status], fontWeight: 700, borderRadius: "10px" }} />
                </Box>
                <Typography variant="body2" color="text.secondary">📍 {r.address}</Typography>
                <Typography variant="body2" color="text.secondary">💰 ₹{r.priceExpectation}/ton</Typography>
                <Typography variant="body2" color="text.secondary">📅 {new Date(r.preferredPickupDate).toLocaleDateString()}</Typography>
                {r.assignedAggregatorName && (
                  <Typography variant="body2" color="#2e7d32" fontWeight="600" mt={0.5}>
                    ✅ Aggregator: {r.assignedAggregatorName}
                  </Typography>
                )}
              </Box>
            ))
          )}
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Button fullWidth variant="outlined" onClick={() => setShowRequests(false)}
            sx={{ borderRadius: "12px", borderColor: "#2e7d32", color: "#2e7d32", textTransform: "none", fontWeight: 700 }}>
            {t("common.close")}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}