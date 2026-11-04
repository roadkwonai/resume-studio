const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const Arrow = () => (
  <svg {...props} strokeWidth="2" className="ff-arrow">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const CircleArrow = () => (
  <svg {...props} strokeWidth="2" width="24" height="24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12l4 4 4-4" />
  </svg>
);

export const Quote = () => (
  <svg {...props} strokeWidth="1.5" width="36" height="36" className="ff-quote">
    <path d="M10 3H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5V5a2 2 0 0 0-2-2zM10 8v8a5 5 0 0 1-5 5M21 3h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5V5a2 2 0 0 0-2-2zM21 8v8a5 5 0 0 1-5 5" />
  </svg>
);

const SOCIAL: Record<string, React.ReactNode> = {
  github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  x: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <path d="M2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
};
SOCIAL.twitter = SOCIAL.x;

export const hasSocialIcon = (network: string) => network.toLowerCase() in SOCIAL;

export const Social = ({ network }: { network: string }) => (
  <svg {...props} strokeWidth="2" width="20" height="20">
    {SOCIAL[network.toLowerCase()]}
  </svg>
);
