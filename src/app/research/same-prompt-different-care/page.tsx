import type { Metadata } from "next";

import { SamePromptStudy } from "@/components/research/SamePromptStudy";

export const metadata: Metadata = {
  title: "Same Prompt, Different Care? — Xiuer Gu",
  description:
    "A multilingual audit of three large language models: do equivalent mental health disclosures receive equivalent standards of AI support in English, Spanish, and Chinese?",
};

export default function SamePromptDifferentCarePage() {
  return <SamePromptStudy />;
}
