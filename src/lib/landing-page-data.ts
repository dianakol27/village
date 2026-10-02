export type ActivityAudience = "For kids" | "For you" | "Together";

export type ActivityArtwork = "makers" | "forest" | "yoga";

export type LandingActivity = {
  id: string;
  title: string;
  category: string;
  schedule: string;
  ageRange: string;
  price: string;
  distance: string;
  audience: ActivityAudience;
  artwork: ActivityArtwork;
  description: string;
};

export type LandingCategory = {
  id: string;
  label: string;
};

export type CoreExperience = {
  id: "kids" | "parents" | "village";
  label: string;
  title: string;
  description: string;
  topics: readonly string[];
  icon: "sparkles" | "coffee" | "community";
  tone: "sage" | "clay" | "sky";
};

export type LandingCircle = {
  id: string;
  name: string;
  memberCount: number;
  ageRange: string;
  neighborhood: string;
  meetupName: string;
  meetupTime: string;
};

export const activityCategories: LandingCategory[] = [
  { id: "art", label: "Art & making" },
  { id: "nature", label: "Nature" },
  { id: "movement", label: "Movement" },
  { id: "music", label: "Music" },
  { id: "wellbeing", label: "Wellbeing" },
  { id: "meetups", label: "Coffee & meetups" },
];

export const coreExperiences: CoreExperience[] = [
  {
    id: "kids",
    label: "For kids",
    title: "Little adventures, close to home.",
    description:
      "Find the kind of small, happy outing that becomes part of your family story.",
    topics: ["Art", "Sports", "Music", "Nature", "Workshops", "Family days"],
    icon: "sparkles",
    tone: "sage",
  },
  {
    id: "parents",
    label: "For you",
    title: "You are more than the family calendar.",
    description:
      "Make space for what fills you up, with little ones welcome when you need them to be.",
    topics: ["Fitness", "Coffee", "Wellbeing", "Hobbies", "Workshops", "New friends"],
    icon: "coffee",
    tone: "clay",
  },
  {
    id: "village",
    label: "My village",
    title: "Find people nearby who get it.",
    description:
      "Meet parents in your neighborhood who are at a similar stage of family life.",
    topics: ["Local circles", "Shared interests", "Age groups", "Easy meetups"],
    icon: "community",
    tone: "sky",
  },
];

export const landingActivities: LandingActivity[] = [
  {
    id: "little-makers",
    title: "Little Makers Art Club",
    category: "Creative play",
    schedule: "Saturday · 10:30",
    ageRange: "Ages 3–6",
    price: "€12",
    distance: "1.2 km",
    audience: "For kids",
    artwork: "makers",
    description: "A hands-on morning of color, clay, and little discoveries.",
  },
  {
    id: "forest-explorers",
    title: "Forest Explorers",
    category: "Outdoors",
    schedule: "Saturday · 14:00",
    ageRange: "Ages 4–7",
    price: "Free",
    distance: "2.8 km",
    audience: "For kids",
    artwork: "forest",
    description: "Follow a trail, look a little closer, and see what you find.",
  },
  {
    id: "parent-child-yoga",
    title: "Parent & Child Yoga",
    category: "Move together",
    schedule: "Sunday · 09:30",
    ageRange: "Ages 1–4",
    price: "€10",
    distance: "1.7 km",
    audience: "Together",
    artwork: "yoga",
    description: "An easygoing stretch, with room for the little ones too.",
  },
];

export const parentActivities: LandingActivity[] = [
  {
    id: "morning-run-coffee",
    title: "Morning Run & Coffee",
    category: "Move & meet",
    schedule: "Thursday · 09:30",
    ageRange: "Kids welcome",
    price: "Free",
    distance: "0.8 km",
    audience: "For you",
    artwork: "forest",
    description: "A gentle loop, a good coffee, and an unhurried hello.",
  },
];

export const localCircle: LandingCircle = {
  id: "dordrecht-parents",
  name: "Dordrecht Parents 3–5",
  memberCount: 42,
  ageRange: "Parents of little ones aged 3–5",
  neighborhood: "Dordrecht, Centrum",
  meetupName: "Coffee + Playground",
  meetupTime: "Saturday · 11:30",
};

export const familyPreferences = {
  childName: "Emma",
  interests: ["Animals", "Art", "Nature"],
  activity: "Something outdoors",
  time: "Morning",
  distance: "Within 5 km",
  suggestionId: "forest-explorers",
} as const;

export const privacyPrinciples = [
  {
    title: "Only what is useful",
    description: "Keep child details to the minimum needed to find a good fit.",
  },
  {
    title: "Nearby, not pinpointed",
    description: "Show an approximate area instead of anyone’s home address.",
  },
  {
    title: "Community with care",
    description: "Give parents clear choices around the circles they take part in.",
  },
] as const;
