import { motion } from "framer-motion";

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      data-testid="container-splash"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            initial={{ 
              x: Math.random() * 400 - 200, 
              y: -20,
              opacity: 0 
            }}
            animate={{ 
              y: 600,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.3 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        <svg viewBox="0 0 400 120" className="w-full h-auto" fill="currentColor">
          <defs>
            <linearGradient id="mosqueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
          </defs>
          <path 
            d="M0 120 L0 80 L30 80 L30 60 L35 50 L40 60 L40 80 L60 80 L60 70 Q80 40 100 70 L100 80 L120 80 L120 50 L125 35 L130 50 L130 80 L150 80 L150 60 Q180 20 210 60 L210 80 L230 80 L230 50 L235 35 L240 50 L240 80 L260 80 L260 70 Q280 40 300 70 L300 80 L320 80 L320 60 L325 50 L330 60 L330 80 L360 80 L360 80 L360 60 L365 50 L370 60 L370 80 L400 80 L400 120 Z"
            fill="url(#mosqueGradient)"
          />
        </svg>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.1, 
            duration: 0.8, 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(251, 191, 36, 0.3)",
                "0 0 60px rgba(251, 191, 36, 0.5)",
                "0 0 30px rgba(251, 191, 36, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 100" className="w-20 h-20" data-testid="icon-mosque">
              <defs>
                <linearGradient id="mosqueIconGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#065f46" />
                  <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
              </defs>
              <path 
                d="M50 15 L50 25 M50 25 Q30 25 25 45 L25 75 L35 75 L35 65 Q35 55 50 55 Q65 55 65 65 L65 75 L75 75 L75 45 Q70 25 50 25 M50 35 A8 8 0 1 0 50 51 A8 8 0 1 0 50 35 M20 75 L20 55 L15 45 L20 45 L20 55 M80 75 L80 55 L85 45 L80 45 L80 55 M25 75 L75 75 L75 80 L25 80 Z"
                fill="url(#mosqueIconGradient)"
                stroke="#064e3b"
                strokeWidth="1"
              />
              <circle cx="50" cy="43" r="5" fill="#fbbf24" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
            data-testid="icon-crescent"
          >
            <div className="w-10 h-10 relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="crescentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M20 2 A18 18 0 1 1 20 38 A14 14 0 1 0 20 2"
                    fill="url(#crescentGradient)"
                  />
                  <circle cx="32" cy="8" r="2" fill="#fbbf24" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          className="mt-8 text-3xl font-bold text-white tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          data-testid="text-app-name"
        >
          Islamic Companion
        </motion.h1>

        <motion.p
          className="mt-2 text-xl text-amber-300 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
        >
          ইসলামিক সঙ্গী
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.div
            className="w-2 h-2 bg-amber-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-amber-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-amber-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>

        <motion.p
          className="mt-4 text-emerald-300/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          লোড হচ্ছে...
        </motion.p>
      </div>
    </motion.div>
  );
}
