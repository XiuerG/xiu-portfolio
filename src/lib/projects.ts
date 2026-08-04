/** A single image slot in a case study. Leave `src` unset to render a
 *  placeholder block; drop the real image in /public and set `src` later. */
export type CaseFigure = {
  src?: string;
  alt: string;
  caption?: string;
  /** Render the image inside a device mockup (e.g. a MacBook). */
  frame?: "macbook";
};

/** One content block inside a case study section. */
export type CaseBlock =
  | {
      kind: "prose";
      /** Big serif statement that opens the section (e.g. "Therapy is about people — not paperwork."). */
      lead?: string;
      body?: string[];
    }
  | {
      /** Accent-marked pull quote / framing question. */
      kind: "callout";
      text: string;
    }
  | {
      /** Grid of titled cards — design principles, barriers, interaction modes. */
      kind: "cards";
      items: { title: string; description: string }[];
    }
  | {
      /** Vertical journey / workflow diagram. */
      kind: "flow";
      steps: string[];
    }
  | { kind: "figure"; figure: CaseFigure }
  | {
      /** Subsection with its own heading, e.g. one redesign area. */
      kind: "sub";
      title: string;
      body: string[];
      figure?: CaseFigure;
    }
  | {
      /** Plain or check-marked list. */
      kind: "list";
      items: string[];
      checked?: boolean;
    }
  | {
      /** Column groups — used for "My Contribution" at the end. */
      kind: "columns";
      groups: { title: string; items: string[] }[];
    }
  | {
      /** Image-led product frame: breaks out of the text column and lets the
       *  screenshot carry the story. Step number + short title + tag chips. */
      kind: "showcase";
      step?: string;
      title: string;
      description?: string;
      tags?: string[];
      figure: CaseFigure;
    }
  | {
      /** Interactive demo embed — renders the CoReLink scenario walkthrough
       *  with auto-play, simulated cursor, and staged output. */
      kind: "demo";
    }
  | {
      /** Web product-page feature row: a wide screenshot on one side, a short
       *  headline + body + optional bullet points on the other. Rows alternate
       *  sides (`flip`) down the page — a big-tech marketing-page rhythm that
       *  reads differently from the centered `showcase` blocks. */
      kind: "feature";
      eyebrow?: string;
      title: string;
      body: string[];
      points?: string[];
      figure: CaseFigure;
      flip?: boolean;
    }
  | {
      /** Small screenshot gallery — a caption plus a row of compact images.
       *  Used to show a secondary surface (e.g. the phone app) without giving
       *  it full-width real estate. */
      kind: "gallery";
      title?: string;
      caption?: string;
      figures: CaseFigure[];
    };

export type CaseSection = {
  id: string;
  label: string;
  blocks: CaseBlock[];
};

/** Rich, long-form case study. Projects without one fall back to the
 *  short overview/problem/approach/outcome template. */
export type CaseStudy = {
  /** Key facts shown under the title (Role, Timeline, Team, Tools…). */
  meta: { label: string; value: string }[];
  /** Hero image (Before/After, product shot). Placeholder until `src` is set. */
  hero?: CaseFigure;
  /** One-line statement rendered under the hero. */
  heroNote?: string;
  sections: CaseSection[];
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  role: string;
  domain: string;
  /** One-line summary shown in the index and case study header. */
  summary: string;
  /** Per-project theme color used for the cover block + section accents. */
  accent: string;
  cover: {
    /** Replace with a real image path in /public when you have one. */
    src?: string;
    alt: string;
  };
  /** Case study body. Keep sections short; let the work speak. */
  overview: string;
  problem: string;
  approach: string[];
  outcome: string[];
  /** Optional long-form case study; overrides the short template when present. */
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "wet-guard",
    title: "WET Guard",
    year: "2026",
    role: "UX · UI · AI Systems",
    domain: "Digital health — AI clinical workflow",
    summary:
      "Helping therapists deliver Written Exposure Therapy — with AI that follows the manual and knows when to escalate.",
    accent: "#84b59f",
    cover: {
      src: "/wetguard/console-session.png",
      alt: "WET Guard therapist console — live session with real-time risk monitoring",
    },
    overview:
      "An AI therapy engine for Written Exposure Therapy. A LangGraph pipeline delivers the manualized protocol — every patient message passes a context gate and a safety gate before the therapist agent may reply — with knowledge-graph memory across sessions and an eight-metric evaluation harness. I designed and built the therapist console, the patient app, and the AI system behind them.",
    problem:
      "WET works because it is manualized — a five-session protocol with a fixed script and checkpoints. That same structure makes it expensive to deliver: every session asks the therapist to recite the script faithfully, pause on cue, watch every reply for risk, document outcomes, and supervise trainees. The manual scales; therapist hours don't.",
    approach: [
      "Treated the WET manual as a spec: the agent delivers the script and its checkpoints, while clinical judgment stays human.",
      "Put a safety gate in front of the therapist agent — every message is risk-classified first, and moderate-or-higher risk escalates instead of getting a reply.",
      "Built the evaluation harness before polishing the prompts — eight weighted protocol metrics make every change measurable.",
    ],
    outcome: [
      "A working two-surface product — therapist console and patient app — on a FastAPI + LangGraph backend with knowledge-graph memory.",
      "Sessions that end in evidence: AI narrative summaries scored on eight protocol metrics, benchmarked against ground-truth transcripts.",
    ],
    caseStudy: {
      meta: [
        { label: "Role", value: "UX Designer · Full-stack Developer · AI Systems" },
        { label: "Timeline", value: "16 Weeks" },
        { label: "Stack", value: "React · FastAPI · LangGraph · DSPy · FAISS RAG" },
      ],
      hero: {
        src: "/wetguard/console-start.png",
        alt: "WET Guard — AI-guided Written Exposure Therapy console",
        frame: "macbook",
      },
      heroNote:
        "How might AI support therapists throughout the therapy workflow — without replacing clinical judgment?",
      sections: [
        {
          id: "context",
          label: "Context",
          blocks: [
            {
              kind: "prose",
              lead: "Therapy is about people — not paperwork.",
              body: [
                "Written Exposure Therapy (WET) is a five-session, evidence-based treatment for PTSD with one defining property: it is manualized. Every session follows a written script, with fixed checkpoints where the therapist pauses, checks in, and assesses risk.",
                "That structure is why it works — and why it is hard to scale. Each session asks the therapist to deliver the script faithfully, stop on cue, watch every reply for warning signs, document the outcome, and supervise trainees doing the same. The manual scales; therapist hours don't.",
              ],
            },
            {
              kind: "callout",
              text: "How might AI support therapists throughout the therapy workflow — without replacing clinical judgment?",
            },
          ],
        },
        {
          id: "insight",
          label: "The Insight",
          blocks: [
            {
              kind: "prose",
              lead: "The script is the opportunity.",
              body: [
                "Because WET is manualized, most of a session is already specified: what to say, where to stop, what must be assessed. That is exactly the part an AI agent can carry reliably — and exactly the part that burns therapist hours. The judgment calls stay human.",
                "Four principles shaped the system.",
              ],
            },
            {
              kind: "cards",
              items: [
                {
                  title: "Follow the manual, verbatim",
                  description:
                    "The agent delivers the WET script with its checkpoints — not improvised, therapy-flavored chat.",
                },
                {
                  title: "Check risk before every reply",
                  description:
                    "Every patient message passes a safety gate before the therapist agent is allowed to respond.",
                },
                {
                  title: "Remember across sessions",
                  description:
                    "A knowledge-graph memory carries what matters between the five sessions, so patients never repeat themselves.",
                },
                {
                  title: "Make quality measurable",
                  description:
                    "Every session is scored against the protocol — 'good' is a number, not a feeling.",
                },
              ],
            },
          ],
        },
        {
          id: "how-it-works",
          label: "How It Works",
          blocks: [
            {
              kind: "prose",
              body: [
                "Under every reply runs the same loop — a LangGraph with two gates in front of the therapist agent:",
              ],
            },
            {
              kind: "flow",
              steps: [
                "Patient message arrives",
                "Context gate — summarizes the session and recalls knowledge-graph memory",
                "Safety gate — an LLM classifier rates risk: none · low · moderate · high",
                "Moderate or high risk escalates immediately — the therapist agent never replies",
                "Therapist agent responds, grounded in the WET manual",
                "The turn is logged back into memory",
              ],
            },
            {
              kind: "prose",
              body: [
                "The escalation path is the spine of the design: the system's most important output is knowing when not to answer.",
              ],
            },
          ],
        },
        {
          id: "console",
          label: "The Therapist Console",
          blocks: [
            {
              kind: "prose",
              lead: "A workspace built around one live session.",
              body: [
                "The console is the clinician's home. Everything a therapist needs to run — and trust — a WET session lives on one screen: the scripted conversation in the center, and the session's vital signs alongside it.",
              ],
            },
            {
              kind: "feature",
              eyebrow: "Run the session",
              title: "The protocol, delivered turn by turn",
              body: [
                "The therapist agent walks the WET script exactly as written — psychoeducation, checkpoints, and the first writing directive — pausing at every checkpoint for the patient to respond.",
              ],
              points: [
                "Live session vitals — duration and protocol step",
                "A risk level that re-computes on every single turn",
                "One clear action: summarize & end the session",
              ],
              figure: {
                src: "/wetguard/console-session.png",
                alt: "WET Guard console — a WET session in progress with the vitals panel",
              },
            },
            {
              kind: "feature",
              eyebrow: "The safety gate",
              title: "The system's most important output is knowing when not to answer",
              body: [
                "Every patient message is risk-classified before the therapist agent may reply. When a message crosses the threshold, the agent is held back and the session escalates to a human — no automated response is ever generated.",
              ],
              points: [
                "LLM risk classifier with a deterministic rule fallback",
                "Moderate-or-higher risk escalates instead of replying",
                "The clinician sees exactly why, and takes over",
              ],
              figure: {
                src: "/wetguard/console-escalation.png",
                alt: "WET Guard console — the safety gate escalating a high-risk session to a human clinician",
              },
              flip: true,
            },
            {
              kind: "feature",
              eyebrow: "Close the loop",
              title: "Every session ends in evidence",
              body: [
                "Ending a session generates an AI clinical narrative and scores the transcript against the WET protocol — with a safety trend, session identity, and one-click export to the clinical record.",
              ],
              points: [
                "AI narrative summary of the session's key themes",
                "Eight protocol metrics, benchmarked to ground truth",
                "Export to PDF, EHR, or raw research JSON",
              ],
              figure: {
                src: "/wetguard/session-summary.png",
                alt: "WET Guard session summary — safety analysis and eight-metric protocol scoring",
              },
            },
          ],
        },
        {
          id: "phone",
          label: "On the Patient's Phone",
          blocks: [
            {
              kind: "gallery",
              title: "The same protocol engine, patient-side",
              caption:
                "Patients meet the session on their phone — a calm conversation with the WET Guide, plus a session view that surfaces the same safety status and knowledge-graph memory the clinician sees. One backend drives both surfaces.",
              figures: [
                {
                  src: "/wetguard/phone-welcome.png",
                  alt: "WET Guard patient app — start a session",
                },
                {
                  src: "/wetguard/phone-session.png",
                  alt: "WET Guard patient app — therapy session",
                },
                {
                  src: "/wetguard/phone-info.png",
                  alt: "WET Guard patient app — session info, safety status, and memory",
                },
              ],
            },
          ],
        },
        {
          id: "under-the-hood",
          label: "Under the Hood",
          blocks: [
            {
              kind: "prose",
              lead: "The parts you don't see.",
              body: [
                "Most of WET Guard is invisible in a screenshot — and it is most of the product:",
              ],
            },
            {
              kind: "list",
              items: [
                "LangGraph orchestration — context gate → safety gate → therapist agent, every turn",
                "Two-layer safety — an LLM risk classifier with a deterministic rule fallback, so a model outage can never silence the gate",
                "Knowledge-graph memory — session facts stored as triplets (SQLite + FAISS), recalled with recency weighting",
                "Guideline RAG — the official WET treatment manual, chunked and retrievable by the safety and evaluation systems",
                "Patient simulation — cooperative, resistant, and derailing patient agents for stress-testing and therapist training",
                "DSPy signatures — every agent behavior is a typed, testable module",
              ],
            },
          ],
        },
        {
          id: "measuring-success",
          label: "Measuring Success",
          blocks: [
            {
              kind: "prose",
              lead: "Quality you can regression-test.",
              body: [
                "Every transcript is scored against the WET protocol on eight weighted metrics, calibrated with few-shot examples and benchmarked against ground-truth reference sessions:",
              ],
            },
            {
              kind: "list",
              checked: true,
              items: [
                "Verbatim delivery · 15% — fidelity to the therapy script",
                "Prompt adherence · 20% — follows the therapeutic guidelines",
                "Derailment management · 20% — redirects off-topic attempts",
                "Suicidality assessment · 15% — risk evaluated per protocol",
                "Patient interaction · 10% — pauses for input at every checkpoint",
                "Professional boundaries · 10% — no advice or diagnosis outside protocol",
                "Session completion · 10% — ends with the writing directive",
              ],
            },
            {
              kind: "prose",
              body: [
                "The harness turns prompt changes into measurable diffs: a tweak that hurts protocol fidelity fails loudly in evaluation — before it ever reaches a patient.",
              ],
            },
          ],
        },
        {
          id: "reflection",
          label: "Reflection",
          blocks: [
            {
              kind: "prose",
              lead: "The hardest feature is refusing to answer.",
              body: [
                "Building WET Guard taught me that in clinical AI, generation is the easy half. The real design work lives in the gates — what the system must check before it speaks, and when it must stop and hand the conversation back to a human.",
                "It also changed how I design: the safety gate, the memory, and the evaluation harness never appear in a screenshot, and they are most of the product. Designing systems means designing what users never see.",
              ],
            },
          ],
        },
        {
          id: "contribution",
          label: "My Contribution",
          blocks: [
            {
              kind: "prose",
              body: [
                "I worked across the complete product — from UX to the AI systems underneath.",
              ],
            },
            {
              kind: "columns",
              groups: [
                {
                  title: "Product & UX",
                  items: [
                    "End-to-end workflow definition",
                    "Therapist console & patient app design",
                    "Risk & escalation UX",
                    "Session summary & reporting design",
                  ],
                },
                {
                  title: "Front-end",
                  items: [
                    "React console + patient app",
                    "Live session vitals & risk panel",
                    "Session chat experience",
                    "Dark mode & responsive layouts",
                  ],
                },
                {
                  title: "AI Systems",
                  items: [
                    "LangGraph orchestration",
                    "Two-layer safety gate with escalation",
                    "Knowledge-graph memory (SQLite + FAISS)",
                    "WET-manual RAG",
                  ],
                },
                {
                  title: "Evaluation",
                  items: [
                    "8-metric protocol scoring harness",
                    "Few-shot calibrated judges (DSPy)",
                    "Patient simulators for stress-testing",
                    "BLEU / ROUGE benchmarking",
                  ],
                },
              ],
            },
            {
              kind: "prose",
              body: [
                "Every surface in this case study — and the system behind it — was designed and built by me.",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    slug: "corelink",
    title: "CoReLink",
    year: "2026",
    role: "UX · UI · Full-stack",
    domain: "Digital health — AI care navigation",
    summary:
      "Turning messy case conversations into verified, bilingual care plans for community health workers.",
    accent: "#4e8d76",
    cover: {
      src: "/corelink/match.png",
      alt: "CoReLink — verified resource matches for community health workers",
    },
    overview:
      "CoReLink (Community Resource Link) helps community health workers connect patients and caregivers with verified local resources. I designed the four-screen experience and built the entire product — the front-end, the Flask API, and a multi-stage AI pipeline with PHI masking, live web search, and structured synthesis.",
    problem:
      "When a patient leaves the hospital, a community health worker helps the family find transportation, meals, and caregiver support. That last mile runs on manual searching, outdated phone numbers, and constant translation — the information exists, but the time to find, verify, and hand it over does not.",
    approach: [
      "Designed the workflow as one arc — conversation, review, match, plan — where a structured case file assembles itself while the CHW just talks.",
      "Made the AI's uncertainty visible: confidence indicators on every extracted fact, and a three-state verification system so no unverified phone number reaches a family.",
      "Built the full product — front-end, API, and a staged AI pipeline (PHI masking → analysis → live search → synthesis) with streaming progress.",
    ],
    outcome: [
      "A working end-to-end loop: from pasted case notes to real searched resources, each carrying an explicit verification state.",
      "One plan, two audiences — a task view for the CHW and a print-ready bilingual (EN/ES) handout for the family.",
    ],
    caseStudy: {
      meta: [
        {
          label: "Role",
          value: "UX Designer · UI Designer · Full-stack Developer",
        },
        { label: "Platform", value: "Web Application · Live AI Pipeline" },
        {
          label: "Stack",
          value: "JavaScript · Python (Flask) · LLM + Live Web Search",
        },
      ],
      hero: {
        src: "/corelink/plan.png",
        alt: "CoReLink — action plan with the bilingual caregiver handout preview",
        frame: "macbook",
      },
      heroNote:
        "How might AI turn one messy case conversation into a verified, bilingual action plan — without asking the community health worker to trust it blindly?",
      sections: [
        {
          id: "context",
          label: "Context",
          blocks: [
            {
              kind: "prose",
              lead: "Care doesn't end at discharge — it moves home.",
              body: [
                "When a patient leaves the hospital, a community health worker (CHW) helps the family find transportation, meals, home safety, and caregiver relief. That last mile runs on manual searching, outdated phone numbers, and constant translation — the information exists, but the time to find, verify, and hand it over does not.",
                "CoReLink compresses that work into one arc: describe the case, review what the AI understood, match verified resources, hand over a plan.",
              ],
            },
          ],
        },
        {
          id: "prototype",
          label: "Live Prototype",
          blocks: [
            {
              kind: "prose",
              body: [
                "Watch the product work a real case — a Spanish-speaking Medicare patient discharged in Travis County. It plays itself: the CHW's notes type in, CoReLink reads them and replies, the case file fills, and it walks step by step from intake to a verified, bilingual plan. Click any step to drive it yourself.",
              ],
            },
            { kind: "demo" },
          ],
        },
        {
          id: "pipeline",
          label: "Behind the Interface",
          blocks: [
            {
              kind: "prose",
              lead: "The pipeline is the product too.",
              body: [
                "This isn't a click-through prototype — behind the four screens runs a staged AI pipeline, each stage independently callable through a Flask API:",
              ],
            },
            {
              kind: "flow",
              steps: [
                "PHI masking — before any text reaches the model",
                "LLM case analysis — structured, validated output",
                "Live web search across local organizations",
                "Source verification — every card cites where it came from",
                "Synthesis into the plan, with streaming progress throughout",
              ],
            },
          ],
        },
        {
          id: "measuring-success",
          label: "Measuring Success",
          blocks: [
            {
              kind: "list",
              checked: true,
              items: [
                "A full working loop — from pasted case notes to a searched, verified plan",
                "Every resource carries an explicit verification state",
                "Personal details masked before text leaves for the model",
                "Print-ready bilingual caregiver handout + Excel export for the care team",
              ],
            },
            {
              kind: "prose",
              body: [
                "The measure isn't how much the AI automates — it's whether the CHW leaves with fewer calls to make, and the family leaves with a page they can actually use.",
              ],
            },
          ],
        },
        {
          id: "reflection",
          label: "Reflection",
          blocks: [
            {
              kind: "prose",
              lead: "Trust is an interface problem.",
              body: [
                "The hardest decisions weren't visual — they were about what the AI should assert, what it should ask about, and what it should refuse to pass along. Like WET Guard, CoReLink sits in the space I care most about: AI that supports human expertise in high-stakes care, rather than replacing it.",
              ],
            },
          ],
        },
        {
          id: "contribution",
          label: "My Contribution",
          blocks: [
            {
              kind: "prose",
              body: [
                "I designed and built CoReLink end to end — the product concept, the four-screen experience, and the AI pipeline behind it.",
              ],
            },
            {
              kind: "columns",
              groups: [
                {
                  title: "Product & UX",
                  items: [
                    "Concept & workflow definition",
                    "Conversational intake design",
                    "Confidence & verification model",
                    "Bilingual handoff design",
                  ],
                },
                {
                  title: "UI Design",
                  items: [
                    "Design system — color, type, components",
                    "Four-screen hi-fi interface",
                    "Three-state trust system",
                    "Print-ready caregiver handout",
                  ],
                },
                {
                  title: "Front-end",
                  items: [
                    "Hand-built JavaScript application",
                    "Live case file & plan rendering",
                    "Streaming progress UI",
                    "EN/ES toggle & print view",
                  ],
                },
                {
                  title: "AI & Backend",
                  items: [
                    "Multi-stage AI pipeline",
                    "PHI masking stage",
                    "Live search & source verification",
                    "Flask API with streaming",
                    "Structured output validation",
                  ],
                },
              ],
            },
            {
              kind: "prose",
              body: [
                "Every screen and every pipeline stage in this case study was designed and built by me.",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    slug: "jasmines-beat",
    title: "Jasmine's Beat",
    year: "2023",
    role: "UX Designer & Researcher",
    domain: "Accessibility · Inclusive design",
    summary:
      "Designing an inclusive digital experience for an adaptive dance community.",
    accent: "#5c93a0",
    cover: {
      src: "/jasmines-cover.png",
      alt: "Jasmine's Beat accessible redesign — before and after",
    },
    overview:
      "Jasmine's Beat is an adaptive dance organization for people with diverse physical, sensory, and cognitive abilities — yet its website excluded many of the people it was designed to serve. Over 8 weeks, our team of four turned an accessibility audit into a full inclusive redesign built on WCAG 2.2 and a component-based design system.",
    problem:
      "While the physical community emphasized inclusion, the website introduced barriers — missing alt text, broken page structure, non-descriptive links, poor readability — that prevented users from independently accessing classes, instructors, and registration.",
    approach: [
      "Audited the site against WCAG 2.2 and examined failures as human problems, not isolated violations.",
      "Designed for different ways of interacting — voice-first, keyboard-first, and visual-first — rather than a single persona.",
      "Rebuilt the experience on four principles and an accessible component system with design tokens.",
    ],
    outcome: [
      "Logical keyboard navigation, semantic structure, descriptive accessible names, and screen reader compatibility across the experience.",
      "Improvements that reduced cognitive effort and enabled more users to independently complete essential tasks.",
    ],
    caseStudy: {
      meta: [
        {
          label: "Project Type",
          value: "Accessibility · Inclusive Design · UX Research",
        },
        { label: "Role", value: "UX Designer & Researcher" },
        { label: "Duration", value: "8 Weeks" },
        { label: "Team", value: "2 UX Designers · 2 UX Researchers" },
        {
          label: "Tools",
          value: "Figma · WCAG 2.2 · Accessibility Audit · User Research",
        },
      ],
      hero: { alt: "Jasmine's Beat website — before and after the redesign" },
      heroNote:
        "Jasmine's Beat empowers people of all abilities through adaptive dance. Yet its digital experience unintentionally excluded many of the people it was designed to serve.",
      sections: [
        {
          id: "context",
          label: "Context",
          blocks: [
            {
              kind: "prose",
              lead: "Inclusion shouldn't stop at the front door.",
              body: [
                "Jasmine's Beat is an adaptive dance organization dedicated to creating movement experiences for people with diverse physical, sensory, and cognitive abilities.",
                "However, while the physical community emphasized inclusion, its website introduced barriers that prevented many users from independently accessing classes, instructors, and registration.",
                "This project explored how accessibility could become an integral part of the product experience rather than a technical afterthought.",
              ],
            },
            { kind: "figure", figure: { alt: "The original Jasmine's Beat website" } },
          ],
        },
        {
          id: "challenge",
          label: "The Challenge",
          blocks: [
            {
              kind: "prose",
              lead: "Accessibility failures are human problems.",
              body: [
                "Our accessibility audit identified several barriers that interrupted users' ability to complete essential tasks. Instead of treating these as isolated WCAG violations, we examined how they affected real user experiences.",
              ],
            },
            {
              kind: "cards",
              items: [
                {
                  title: "Missing alternative text",
                  description:
                    "Images and non-text content became invisible to screen reader users.",
                },
                {
                  title: "Broken page structure",
                  description:
                    "Users relying on assistive technologies struggled to understand where they were within the site.",
                },
                {
                  title: "Non-descriptive links",
                  description:
                    "Generic labels such as “Click Here” removed important navigation context.",
                },
                {
                  title: "Poor readability",
                  description:
                    "Low contrast and inconsistent typography increased cognitive effort for users with visual impairments.",
                },
              ],
            },
            { kind: "figure", figure: { alt: "Accessibility audit findings" } },
          ],
        },
        {
          id: "interaction-modes",
          label: "Designing for Different Ways of Interacting",
          blocks: [
            {
              kind: "prose",
              lead: "Accessibility isn't one experience.",
              body: [
                "Different users interact with digital products in fundamentally different ways.",
              ],
            },
            {
              kind: "cards",
              items: [
                {
                  title: "Voice-first interaction",
                  description:
                    "Users relying on voice control need predictable page structure, meaningful labels, and consistent navigation.",
                },
                {
                  title: "Keyboard-first interaction",
                  description:
                    "Sequential focus order determines whether tasks can be completed efficiently.",
                },
                {
                  title: "Visual-first communication",
                  description:
                    "Users with hearing impairments depend on captions, structured content, and clear visual hierarchy rather than audio cues.",
                },
              ],
            },
            { kind: "figure", figure: { alt: "Two user journeys through the site" } },
          ],
        },
        {
          id: "principles",
          label: "Design Principles",
          blocks: [
            {
              kind: "prose",
              body: [
                "Rather than redesigning individual screens, we redesigned the experience around four principles.",
              ],
            },
            {
              kind: "cards",
              items: [
                {
                  title: "Make navigation predictable",
                  description:
                    "Users should always know where they are and how to move forward.",
                },
                {
                  title: "Reduce cognitive effort",
                  description:
                    "Content should be easy to scan, understand, and interact with.",
                },
                {
                  title: "Support assistive technologies",
                  description:
                    "Accessibility should work naturally with screen readers, voice control, and keyboard navigation.",
                },
                {
                  title: "Create consistency",
                  description:
                    "Reusable components and design tokens ensure accessibility across the entire experience.",
                },
              ],
            },
          ],
        },
        {
          id: "redesign",
          label: "Redesigning the Experience",
          blocks: [
            {
              kind: "sub",
              title: "Helping users navigate with confidence",
              body: [
                "The original navigation relied on visual placement alone, leaving screen reader and keyboard users without a sense of place.",
                "We rebuilt it with a consistent structure, semantic landmarks, and a logical heading hierarchy — so users always know where they are and how to move forward, whether they see the page, hear it, or tab through it.",
              ],
              figure: { alt: "Navigation — before and after" },
            },
            {
              kind: "sub",
              title: "Making every interaction understandable",
              body: [
                "Buttons, forms, and links were redesigned to describe their purpose.",
                "Generic labels became descriptive accessible names, forms gained clear labels and error messages, and every interactive element received a visible, consistent focus state.",
              ],
              figure: { alt: "Redesigned buttons, forms, and links" },
            },
            {
              kind: "sub",
              title: "Designing for focus",
              body: [
                "Typography, contrast, and spacing were reworked to reduce cognitive effort.",
                "Higher contrast, a comfortable type scale, and generous spacing make content easy to scan and understand for users with visual impairments — and calmer to read for everyone.",
              ],
              figure: { alt: "Typography, contrast, and spacing system" },
            },
            {
              kind: "sub",
              title: "Building consistency through components",
              body: [
                "Buttons, inputs, and cards were consolidated into a reusable component library.",
                "Accessibility is built into each component once — labels, focus states, contrast — and inherited everywhere it is used.",
              ],
              figure: { alt: "Component sticker sheet" },
            },
          ],
        },
        {
          id: "beyond-compliance",
          label: "Designing Beyond Compliance",
          blocks: [
            {
              kind: "prose",
              lead: "Accessibility isn't a checklist.",
              body: [
                "Instead of designing only to satisfy WCAG guidelines, we focused on creating an experience that felt intuitive regardless of how users interacted with the interface.",
                "Accessibility became a design principle rather than a validation step.",
              ],
            },
            { kind: "figure", figure: { alt: "Accessible design tokens" } },
          ],
        },
        {
          id: "outcome",
          label: "Measuring the Outcome",
          blocks: [
            {
              kind: "prose",
              lead: "Measuring success.",
              body: [
                "The redesigned experience was evaluated against the accessibility issues identified during the initial audit. Improvements included:",
              ],
            },
            {
              kind: "list",
              checked: true,
              items: [
                "Logical keyboard navigation",
                "Descriptive accessible names",
                "Semantic page structure",
                "Improved visual contrast",
                "Accessible forms",
                "Screen reader compatibility",
              ],
            },
            {
              kind: "prose",
              body: [
                "Rather than simply increasing compliance, these improvements reduced cognitive effort and enabled more users to independently complete essential tasks.",
              ],
            },
            { kind: "figure", figure: { alt: "Validation against the original audit" } },
          ],
        },
        {
          id: "reflection",
          label: "Reflection",
          blocks: [
            {
              kind: "prose",
              lead: "Accessibility is product quality.",
              body: [
                "Working on Jasmine's Beat changed how I think about accessibility. Designing for people with different abilities is not about creating separate experiences — it is about creating one experience that works for everyone.",
                "Although this project focused on an adaptive dance community, the principles directly translate to digital health, where trust, accessibility, and equitable participation are essential to patient and caregiver experiences.",
                "This project reinforced my belief that inclusive design is not an additional feature — it is the foundation of responsible product design.",
              ],
            },
          ],
        },
        {
          id: "contributions",
          label: "My Contributions",
          blocks: [
            {
              kind: "columns",
              groups: [
                {
                  title: "UX Research",
                  items: [
                    "Accessibility Audit",
                    "Competitive Analysis",
                    "User Journey Analysis",
                    "Research Planning",
                  ],
                },
                {
                  title: "Product Design",
                  items: [
                    "Information Architecture",
                    "Interaction Design",
                    "Responsive Interface",
                    "Design System",
                  ],
                },
                {
                  title: "Accessibility",
                  items: [
                    "WCAG 2.2 Evaluation",
                    "Keyboard Navigation",
                    "Screen Reader Optimization",
                    "Inclusive Interaction Design",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
