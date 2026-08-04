export type ExperienceItem = {
  period: string;
  role: string;
  org: string;
  /** Optional program / affiliation line shown under the org. */
  detail?: string;
  summary: string;
};

export const experience: ExperienceItem[] = [
  {
    period: "2025–2026",
    role: "Graduate Researcher",
    org: "The University of Texas at Austin",
    detail: "Graduate Portfolio in Ethical AI",
    summary:
      "Studied how people prioritize safety, accessibility, privacy, fairness, and efficiency in autonomous systems.",
  },
  {
    period: "2026",
    role: "UX / Interactive Experience Designer",
    org: "Moritz Center for Societal Impact",
    summary:
      "Designed and developed a public digital exhibit and four interactive storybooks.",
  },
  {
    period: "2023–2024",
    role: "Research Assistant",
    org: "The Ohio State University",
    detail: "Living Art Eco Lab",
    summary:
      "Built ecological visualizations and an interactive sensor-based installation.",
  },
  {
    period: "2023",
    role: "Research Intern",
    org: "Hunan University of Technology & Business",
    summary:
      "Conducted field interviews and translated findings into bilingual digital narratives.",
  },
];
