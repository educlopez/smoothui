'use client';

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Timer as TimerIcon, Sun, Cloud, CloudRain, CloudLightning, Thermometer } from "lucide-react";

// Animation variants remain the same
const ANIMATION_VARIANTS = {
  "ring-idle": { scale: 0.9, scaleX: 0.9, bounce: 0.5 },
  "timer-ring": { scale: 0.7, y: -7.5, bounce: 0.35 },
  "ring-timer": { scale: 1.4, y: 7.5, bounce: 0.35 },
  "timer-idle": { scale: 0.7, y: -7.5, bounce: 0.3 },
  "idle-timer": { scale: 1.2, y: 5, bounce: 0.3 },
  "idle-ring": { scale: 1.1, y: 3, bounce: 0.5 }
} as const;

const BOUNCE_VARIANTS = {
  idle: 0.5,
  "ring-idle": 0.5,
  "timer-ring": 0.35,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "idle-timer": 0.3,
  "idle-ring": 0.5,
} as const;

const variants = {
  exit: (transition: any) => ({
    ...transition,
    opacity: [1, 0],
    filter: "blur(5px)",
  }),
};

// Weather types and configs
type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'storm';

const WEATHER_CONFIGS = {
  sunny: { icon: Sun, color: 'yellow-400', temp: '24°C' },
  cloudy: { icon: Cloud, color: 'gray-400', temp: '18°C' },
  rainy: { icon: CloudRain, color: 'blue-400', temp: '15°C' },
  storm: { icon: CloudLightning, color: 'purple-500', temp: '12°C' },
} as const;

// Idle Component with Weather
const Idle = () => {
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [showTemp, setShowTemp] = useState(false);

  // Simulate weather changes
  useEffect(() => {
    const weathers: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'storm'];
    const interval = setInterval(() => {
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const config = WEATHER_CONFIGS[weather];
  const WeatherIcon = config.icon;

  return (
    <motion.div
      className="px-3 py-2 flex items-center gap-2"
      onHoverStart={() => setShowTemp(true)}
      onHoverEnd={() => setShowTemp(false)}
      layout
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={weather}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`text-${config.color}`}
        >
          <WeatherIcon className="h-5 w-5" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showTemp && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1 text-white overflow-hidden"
          >
            <Thermometer className="h-3 w-3" />
            <span className="text-xs whitespace-nowrap">{config.temp}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Ring Component
const Ring = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-white w-64">
      <Phone className="h-5 w-5" />
      <div className="flex-1">
        <p className="text-sm font-medium">Incoming Call</p>
        <p className="text-xs opacity-70">John Doe</p>
      </div>
      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
    </div>
  );
};

// Timer Component
const Timer = () => {
  const [time, setTime] = useState(60);

  useMemo(() => {
    const timer = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 text-white w-64">
      <TimerIcon className="h-5 w-5" />
      <div className="flex-1">
        <p className="text-sm font-medium">{time}s remaining</p>
      </div>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: time, ease: "linear" }}
        />
      </div>
    </div>
  );
};

type View = "idle" | "ring" | "timer";

export default function DynamicIsland() {
  const [view, setView] = useState<View>("idle");
  const [variantKey, setVariantKey] = useState<keyof typeof BOUNCE_VARIANTS>("idle");

  const content = useMemo(() => {
    switch (view) {
      case "ring":
        return <Ring />;
      case "timer":
        return <Timer />;
      default:
        return <Idle />;
    }
  }, [view]);

  const handleViewChange = (newView: View) => {
    if (view === newView) return;
    setVariantKey(`${view}-${newView}` as keyof typeof BOUNCE_VARIANTS);
    setView(newView);
  };

  return (
    <div className="h-[200px]">
      <div className="relative flex h-full w-full flex-col justify-between">
        <motion.div
          layout
          transition={{
            type: "spring",
            bounce: BOUNCE_VARIANTS[variantKey],
          }}
          style={{ borderRadius: 32 }}
          className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black"
        >
          <motion.div
            transition={{
              type: "spring",
              bounce: BOUNCE_VARIANTS[variantKey],
            }}
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: "blur(5px)",
              originX: 0.5,
              originY: 0.5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              originX: 0.5,
              originY: 0.5,
              transition: { delay: 0.05 },
            }}
            key={view}
          >
            {content}
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center">
          <AnimatePresence
            mode="popLayout"
            custom={ANIMATION_VARIANTS[variantKey as keyof typeof ANIMATION_VARIANTS]}
          >
            <motion.div
              initial={{ opacity: 0 }}
              exit="exit"
              variants={variants}
              key={view}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex w-full justify-center gap-4">
          {["idle", "ring", "timer"].map((v) => (
            <motion.button
              type="button"
              key={v}
              onClick={() => handleViewChange(v as View)}
              className={`
                rounded-full capitalize w-32 h-10
                bg-white px-2.5 py-1.5 text-sm font-medium
                text-gray-900 shadow-sm ring-1 ring-inset
                ring-gray-300/50 hover:bg-gray-50
                ${view === v ? "ring-2 ring-blue-500" : ""}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={view === v}
            >
              {v}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}