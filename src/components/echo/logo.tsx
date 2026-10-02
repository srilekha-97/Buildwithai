import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface EduAdaptLogoProps {
  className?: string;
  showCaption?: boolean;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

export function EduAdaptMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-300 group-hover:scale-105", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eduGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCE588" />
          <stop offset="45%" stop-color="#E5B869" />
          <stop offset="80%" stop-color="#D4AF37" />
          <stop offset="100%" stop-color="#A27D16" />
        </linearGradient>
        <linearGradient id="eduGoldSoft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF5C0" />
          <stop offset="100%" stop-color="#E5B869" />
        </linearGradient>
        <radialGradient id="eduAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#E5B869" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#E5B869" stop-opacity="0" />
        </radialGradient>
        <filter id="eduGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient gold glow */}
      <circle cx="50" cy="50" r="46" fill="url(#eduAura)" />

      {/* Hexagonal Adaptive Shield */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        fill="#0A0B10"
        stroke="url(#eduGoldGrad)"
        stroke-width="2.5"
        stroke-opacity="0.85"
      />

      {/* Dynamic Adaptive Orbit / Loop */}
      <circle
        cx="50"
        cy="50"
        r="33"
        stroke="url(#eduGoldGrad)"
        stroke-width="2"
        stroke-dasharray="6 5"
        opacity="0.5"
      />

      {/* Bold Architectural 'E' with adaptive chevron geometry */}
      <path
        d="M32 28 H66 C69 28 71 30.5 69.5 33.5 L64 42 C63 43.5 61 44.5 59 44.5 H32"
        stroke="url(#eduGoldGrad)"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M32 49 H56 C58.5 49 60 51 59 53.5 L57.5 56.5 C56.5 58 55 59 53 59 H32"
        stroke="url(#eduGoldGrad)"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M32 63.5 H60 C62 63.5 64 64.5 65 66 L69.5 73.5 C70.5 75.5 69 77.5 66.5 77.5 H32"
        stroke="url(#eduGoldGrad)"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      {/* Spine */}
      <path
        d="M32 26 V78"
        stroke="url(#eduGoldGrad)"
        stroke-width="5.5"
        stroke-linecap="round"
      />

      {/* Adaptive Spark / AI Cognitive Node */}
      <circle cx="75" cy="50" r="5" fill="url(#eduGoldSoft)" filter="url(#eduGlow)" />
      <circle cx="75" cy="50" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

export function EduAdaptLogo({
  className,
  showCaption = false,
  size = "md",
  asLink = true,
}: EduAdaptLogoProps) {
  const iconSize = size === "sm" ? 30 : size === "lg" ? 48 : 38;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

  const content = (
    <div className={cn("group flex items-center gap-3", className)}>
      <div className="relative">
        <EduAdaptMark size={iconSize} />
      </div>
      <div className="flex flex-col">
        <span className={cn("font-bold tracking-tight text-foreground transition-colors", textSize)}>
          Edu<span className="bg-gradient-to-r from-[#F5D061] via-[#E5B869] to-[#C59A3F] bg-clip-text text-transparent">Adapt</span>
        </span>
        {showCaption && (
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Personalised AI Learning for Every Learner
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-block transition-opacity hover:opacity-95" aria-label="EduAdapt home">
        {content}
      </Link>
    );
  }

  return content;
}

export const Logo = EduAdaptLogo;
