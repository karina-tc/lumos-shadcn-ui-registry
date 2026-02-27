export function LumosSymbol({ className }: { className?: string }) {
  return (
    <svg
      width="110"
      height="113"
      viewBox="0 0 110 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#lumos-clip)">
        <path
          d="M0 86.7835V21.6958H27.0177V86.7835H90.0591V113H0V86.7835Z"
          fill="url(#lumos-grad-0)"
        />
        <path
          d="M77.454 65.0879C95.3598 65.0879 109.875 50.5175 109.875 32.544C109.875 14.5704 95.3598 0 77.454 0C59.5482 0 45.0327 14.5704 45.0327 32.544C45.0327 50.5175 59.5482 65.0879 77.454 65.0879Z"
          fill="url(#lumos-grad-1)"
        />
      </g>
      <defs>
        <radialGradient
          id="lumos-grad-0"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-174.958 176.562 -176.22 -175.212 171.206 -63.5623)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FE9519" />
          <stop offset="0.527051" stopColor="#FE5019" />
          <stop offset="1" stopColor="#FE1995" />
        </radialGradient>
        <radialGradient
          id="lumos-grad-1"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-91.4662 101.229 -101.037 -91.6029 103.195 2.35416)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FE9519" />
          <stop offset="0.442708" stopColor="#FE5019" />
          <stop offset="1" stopColor="#FE1995" />
        </radialGradient>
        <clipPath id="lumos-clip">
          <rect width="110" height="113" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
