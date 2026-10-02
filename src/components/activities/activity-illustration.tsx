import type { ActivityArtwork } from "@/lib/landing-page-data";

const descriptions: Record<ActivityArtwork, string> = {
  makers: "A sunlit table with a painted paper sun and small jars of color",
  forest: "Layered forest-green hills beneath a soft morning sky",
  yoga: "A quiet terracotta sun above a yoga mat and leafy stems",
};

type ActivityIllustrationProps = {
  artwork: ActivityArtwork;
  className?: string;
};

export function ActivityIllustration({ artwork, className }: ActivityIllustrationProps) {
  return (
    <svg
      role="img"
      aria-label={descriptions[artwork]}
      viewBox="0 0 440 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {artwork === "makers" ? (
        <>
          <rect width="440" height="240" fill="#EFDAC3" />
          <circle cx="330" cy="62" r="42" fill="#D97F60" />
          <path d="M0 188c89-29 164-20 245 3 72 20 137 19 195-3v52H0v-52Z" fill="#F7EBDD" />
          <path d="M72 53h178v118H72z" fill="#FBF7EF" />
          <path d="m99 135 54-54 48 46-28 32h-74v-24Z" fill="#648875" />
          <circle cx="209" cy="95" r="11" fill="#D97F60" />
          <rect x="292" y="137" width="73" height="51" rx="8" fill="#FFFDF8" />
          <rect x="302" y="124" width="18" height="39" rx="7" fill="#D98E70" />
          <rect x="324" y="116" width="18" height="47" rx="7" fill="#7D9B81" />
          <rect x="346" y="130" width="10" height="33" rx="5" fill="#D9B364" />
          <path d="M0 207h440" stroke="#D7BFA7" strokeWidth="2" />
        </>
      ) : null}
      {artwork === "forest" ? (
        <>
          <rect width="440" height="240" fill="#DDE6D6" />
          <circle cx="335" cy="62" r="34" fill="#EBCB8A" />
          <path d="M0 164c69-29 122-31 190 0 70 32 136 28 250-15v91H0v-76Z" fill="#9EB49A" />
          <path d="M0 195c82-45 164-31 226 2 73 39 130 19 214-13v56H0v-45Z" fill="#57765E" />
          <path d="M142 194c47-46 85-53 127-35 26 11 43 31 59 61H124l18-26Z" fill="#EAD8B9" />
          <path d="m99 91 25-50 25 50h-15v47h-20V91H99Zm195 21 20-42 21 42h-12v45h-17v-45h-12Z" fill="#405E4B" />
          <path d="M0 219h440" stroke="#45614B" strokeOpacity=".35" strokeWidth="2" />
        </>
      ) : null}
      {artwork === "yoga" ? (
        <>
          <rect width="440" height="240" fill="#E8D9D0" />
          <circle cx="220" cy="111" r="70" fill="#CF8066" />
          <path d="M0 188c95-23 163-12 227 8 69 21 143 13 213-3v47H0v-52Z" fill="#F3EAE1" />
          <rect x="115" y="174" width="212" height="25" rx="12" fill="#526C57" />
          <path d="M217 164c-31-19-37-47-15-61 20 6 31 22 29 42 3-32 23-51 47-44 4 22-9 44-36 57" stroke="#405E4B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M113 78c-5-18 2-36 20-44 15 12 19 28 9 45m-12-1c-22-4-36-18-35-38 18-7 36-1 47 17" stroke="#789477" strokeWidth="4" strokeLinecap="round" />
          <path d="M324 101c-4-17 2-34 18-41 14 10 17 26 8 42m-10-2c-20-3-32-17-31-35 16-6 33 0 42 16" stroke="#789477" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}
