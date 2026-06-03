import { motion } from "framer-motion";

export function CloudsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden stars-bg">
      <Cloud className="absolute top-[8%] -left-10 w-40 opacity-70" delay={0} />
      <Cloud className="absolute top-[28%] -right-12 w-52 opacity-50" delay={-3} />
      <Cloud className="absolute top-[55%] left-1/4 w-44 opacity-60" delay={-6} />
      <Cloud className="absolute top-[78%] -right-8 w-36 opacity-55" delay={-9} />
      <Cloud className="absolute top-[95%] left-[10%] w-48 opacity-45" delay={-2} />
      <Cloud className="absolute top-[120%] -left-6 w-40 opacity-50" delay={-5} />
    </div>
  );
}

function Cloud({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 200 100"
      className={className}
      animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <defs>
        <radialGradient id={`cg${delay}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFDFD3" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <g fill={`url(#cg${delay})`}>
        <ellipse cx="60" cy="60" rx="35" ry="28" />
        <ellipse cx="100" cy="50" rx="45" ry="35" />
        <ellipse cx="140" cy="62" rx="38" ry="30" />
        <ellipse cx="80" cy="70" rx="30" ry="22" />
        <ellipse cx="120" cy="72" rx="32" ry="24" />
      </g>
    </motion.svg>
  );
}
