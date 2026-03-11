import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function IntroPage({ onLoginComplete }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const bgColor = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#121614", "#1a0b00", "#0b132b", "#02040a", "#0a0a0a"]
  );

   useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      if (v > 0.98) {
        onLoginComplete();
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, onLoginComplete]);
  
  const stubbleVideoOpacity = useTransform(smoothProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const stubbleVideoScale = useTransform(smoothProgress, [0, 0.3], [1, 1.1]);

  const smokeVideoOpacity = useTransform(smoothProgress, [0.1, 0.3, 0.5, 0.7], [0, 0.9, 0.9, 0]);
  const smokeVideoScale = useTransform(smoothProgress, [0.1, 0.7], [1.2, 1]);
  const smokeVideoY = useTransform(smoothProgress, [0.1, 0.6], ["20vh", "-30vh"]);

  const ozoneVideoOpacity = useTransform(smoothProgress, [0.35, 0.45, 0.6, 0.8], [0, 1, 0.9, 0]);
  const ozoneVideoScale = useTransform(smoothProgress, [0.4, 0.55, 0.7], [1, 1.05, 1.2]);
  
  const ozoneRedOverlayOpacity = useTransform(smoothProgress, [0.45, 0.55, 0.7], [0, 1, 0]);

  const ozoneTextOpacity = useTransform(smoothProgress, [0.4, 0.45, 0.55], [0, 1, 0]);
  const ozoneTextScale = useTransform(smoothProgress, [0.45, 0.55], [1, 1.2]);
  const ozoneTextBlur = useTransform(smoothProgress, [0.45, 0.55], ["blur(0px)", "blur(10px)"]);
  const ozoneTextColor = useTransform(smoothProgress, [0.45, 0.55], ["#bcedff", "#ff5555"]);

  const textOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} style={{ height: "500vh", position: "relative", backgroundColor:"#0a0a0a", margin:0, padding:0 }}>
      <motion.div 
        style={{ 
          position: "sticky", 
          top: 0, 
          height: "100vh", 
          overflow: "hidden", 
          backgroundColor: bgColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: 0
        }}
      >
        <motion.div 
          style={{ 
            opacity: textOpacity, 
            position: "absolute", 
            top: "40%", 
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center", 
            zIndex: 50, 
            color: "white",
            width: "100%",
            padding: "0 1.5rem",
            boxSizing: "border-box"
          }}
        >
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: "900", letterSpacing: "-1px", textShadow: "0px 4px 10px rgba(0,0,0,0.8)", margin: 0, lineHeight: 1.2 }}>
            The Hidden Cost of <br style={{ display: "block", marginBottom: "0.2rem" }} />
            <span style={{ color: "#fb7185" }}>Stubble Burning</span>
          </h1>
          <p style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)", opacity: 0.8, margin: "1rem auto 0 max", maxWidth: "800px" }}>Scroll down to trace the journey of the smoke</p>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ marginTop: "2rem", opacity: 0.7, fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}
          >
            ↓
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100vh",
            opacity: stubbleVideoOpacity,
            scale: stubbleVideoScale,
            zIndex: 10,
            overflow: "hidden",
            pointerEvents: "none"
          }}
        >
          <video 
            src="/assets/stubble_burning.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.7) contrast(1.2)"
            }}
          />
        </motion.div>

        <motion.div 
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            opacity: smokeVideoOpacity,
            scale: smokeVideoScale,
            y: smokeVideoY,
            zIndex: 12,
            overflow: "hidden",
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{
            position: "absolute",
            width: "100%", height: "100%",
            background: "radial-gradient(circle at center, rgba(10,10,15,0.8) 0%, rgba(5,5,8,1) 70%)",
            opacity: 0.8
          }} />
          
          <video 
            src="/assets/smoke.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{
              width: "120%",
              height: "120%", 
              objectFit: "cover",
              objectPosition: "center",
              position: "relative",
              mixBlendMode: "screen",
              opacity: 0.9,
              filter: "contrast(2) brightness(0.5) sepia(0.3) hue-rotate(-20deg)", 
              WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 75%)",
              maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 75%)"
            }}
          />
        </motion.div>

        <motion.div 
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            opacity: ozoneVideoOpacity,
            scale: ozoneVideoScale,
            zIndex: 14,
            overflow: "hidden",
            pointerEvents: "none"
          }}
        >
          <video 
            src="/assets/Ozone_layer.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(1) contrast(1)"
            }}
          />
          <motion.div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 0, 0, 1)",
              mixBlendMode: "color",
              opacity: ozoneRedOverlayOpacity
            }}
          />
          <motion.div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(200, 0, 0, 0.6)",
              mixBlendMode: "multiply",
              opacity: ozoneRedOverlayOpacity
            }}
          />
        </motion.div>
        <motion.div style={{
            color: ozoneTextColor, 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            fontSize: "clamp(2rem, 8vw, 4rem)",
            fontWeight: "900",
            letterSpacing: "0.2em",
            textAlign: "center",
            width: "100%",
            padding: "0 1rem",
            boxSizing: "border-box",
            opacity: ozoneTextOpacity,
            scale: ozoneTextScale,
            filter: ozoneTextBlur,
            zIndex: 16,
            textShadow: "0px 0px 20px rgba(0, 150, 255, 0.8), 0px 4px 10px rgba(0,0,0,1)"
          }}>
            OZONE LAYER
        </motion.div>

      </motion.div>
    </div>
  );
}
