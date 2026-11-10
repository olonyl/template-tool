export const PROFILES = {
  taller: {
    name: "Taller Don Ronald",
    headerBg: "#0d0f2b",
    headerSub: "#9399b3",
  },
  chikitech: {
    name: "Chiki Tech",
    headerBg: "#3a1f0d",
    headerSub: "#e8c9a8",
  },
} as const;

export type Profile = keyof typeof PROFILES;
