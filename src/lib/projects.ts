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
  }
  | {
    /** Compact research/evaluation summary — a grid of label → value(s)
     *  entries (Research Question, Methods, My Role, Status…). Sits near
     *  the top of a case study, before the detailed process. */
    kind: "researchOverview";
    entries: { label: string; value: string | string[] }[];
  }
  | {
    /** Honest scoping note at the foot of a case study — what stage the work
     *  reached and what has not yet been evaluated. */
    kind: "limitations";
    title?: string;
    body: string[];
  }
  | {
    /** WET Guard interactive dual-device showcase — renders real desktop & mobile screenshots. */
    kind: "wetDemo";
  };

export type CaseSection = {
  id: string;
  label: string;
  blocks: CaseBlock[];
};

/** Rich, long-form case study. Projects without one fall back to the
 *  short overview/problem/approach/outcome template. */
export type CaseStudy = {
  /** Optional eyebrow line above the title (overrides year · role · domain). */
  eyebrow?: string;
  /** Optional multi-paragraph hero description (overrides `summary`). */
  lead?: string[];
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
  /** Research theme used to group the card in the Research Work section. */
  category?: string;
  /** Descriptive subtitle shown under the title on the card + case study. */
  subtitle?: string;
  year: string;
  role: string;
  domain: string;
  /** Topic tags shown on the homepage project card. */
  tags?: string[];
  /** Concise, research-focused description for the homepage card. Falls back
   *  to `summary`. Kept separate so the case study header stays untouched. */
  cardDescription?: string;
  /** Up to 3 key research tags for the homepage card (overrides `tags`). */
  cardTags?: string[];
  /** Role + project-type line for the homepage card, e.g.
   *  "UX & Front-end Lead · Research Prototype". Falls back to `role`. */
  cardRole?: string;
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
    category: "Digital Health",
    subtitle:
      "An Interactive Research Interface for AI-Based Written Exposure Therapy Simulation and Evaluation",
    year: "2026",
    role: "Interaction Design · Front-End Prototyping",
    domain: "Digital Mental Health · Health HCI",
    tags: [
      "Digital Mental Health",
      "Health HCI",
      "Safety-Aware Interaction",
      "Front-End Prototyping",
    ],
    cardDescription:
      "An interactive research interface for simulating and evaluating AI-based Written Exposure Therapy sessions.",
    cardTags: ["Health HCI", "Human-AI Interaction", "Research Tool"],
    cardRole: "Interaction Design & Front-End Lead · Research Prototype",
    summary:
      "An interactive research interface for AI-based Written Exposure Therapy simulation and evaluation.",
    accent: "#84b59f",
    cover: {
      src: "/wetguard/console-session.png",
      alt: "WET Guard research console — a simulated therapist-agent and patient-agent session with researcher controls",
    },
    overview:
      "An interactive research interface for an AI-based Written Exposure Therapy system. The broader system simulates conversations between therapist and patient agents and evaluates the resulting transcripts against WET guidelines. My contribution was the application and interaction layer — workflow analysis, information architecture, interaction design, front-end implementation, and integration with existing back-end services. I did not develop the underlying models, agents, retrieval pipeline, or evaluation metrics.",
    problem:
      "The existing research pipeline connected session configuration, agent-based conversation generation, transcript storage, and automated evaluation — but there was no coherent way to operate, observe, and review a simulated session as a research process.",
    approach: [
      "Analyzed the research workflow and organized the application around four stages: configure, generate, review, evaluate.",
      "Designed the simulated-session experience for observation, keeping agent dialogue, researcher controls, and system status distinct.",
      "Implemented the front-end and integrated it with existing session, storage, and evaluation services.",
    ],
    outcome: [
      "A working prototype connecting session preparation, simulated therapist–patient dialogue, transcript review, and available research outputs within one application workflow.",
      "A foundation for future research on protocol adherence, simulated interaction patterns, and the usability of AI-based therapy simulation tools.",
    ],
    caseStudy: {
      eyebrow: "Health HCI · Human-Centered AI · Research Tool",
      lead: [
        "WET Guard is an interactive prototype developed for an AI-based Written Exposure Therapy research system. The broader system simulates conversations between therapist and patient agents and evaluates the resulting transcripts using WET guidelines and protocol-related metrics.",
        "My contribution focused on translating the existing research pipeline into a coherent application through workflow analysis, interaction design, front-end development, and back-end integration.",
      ],
      meta: [
        { label: "Role", value: "Interaction Design and Front-End Lead" },
        { label: "Timeline", value: "Spring 2026" },
        { label: "Institution", value: "The University of Texas at Austin" },
        { label: "Supervisor", value: "Dr. Ying Ding" },
        { label: "Status", value: "Interactive Research Prototype" },
      ],
      hero: {
        src: "/wetguard/console-start.png",
        alt: "WET Guard research console — the session overview screen of the AI-based Written Exposure Therapy research interface",
        frame: "macbook",
      },
      heroNote:
        "How can an existing AI-based WET research pipeline be translated into an application that makes simulated sessions easier to operate, observe, and review?",
      sections: [
        {
          id: "context",
          label: "Project Context",
          blocks: [
            {
              kind: "prose",
              lead: "Using WET as a structured context for AI research",
              body: [
                "Written Exposure Therapy follows a defined treatment protocol, which makes it a useful context for studying how AI-generated therapist behavior follows, interprets, or deviates from established guidelines.",
                "The broader research system uses separate therapist and patient agents to generate simulated sessions. It also includes session orchestration, guideline retrieval, transcript evaluation, and session persistence.",
                "Its intended research applications include protocol-adherence studies, analysis of simulated interaction patterns, comparison of conversational conditions, and exploratory training research — research directions rather than established claims of clinical effectiveness.",
              ],
            },
          ],
        },
        {
          id: "challenge",
          label: "The Challenge",
          blocks: [
            {
              kind: "prose",
              lead: "Turning an AI pipeline into a usable research workflow",
              body: [
                "The existing system connected session configuration, agent-based conversation generation, transcript storage, and automated evaluation.",
                "The interaction challenge was not simply to display a chatbot. Researchers needed to understand what conditions produced a session, observe the interaction between two agents, review the resulting transcript, and connect available evaluation results with the same research run.",
                "I organized the application around four stages.",
              ],
            },
            {
              kind: "flow",
              steps: [
                "Configure — define the conditions for a simulated session",
                "Generate — run the therapist–patient agent conversation",
                "Review — read and interpret the resulting transcript",
                "Evaluate — connect available protocol metrics to the same run",
              ],
            },
          ],
        },
        {
          id: "role",
          label: "My Role",
          blocks: [
            {
              kind: "prose",
              lead: "Connecting the research pipeline to the application experience",
              body: [
                "My primary contribution was at the application and interaction layer. I mapped the research workflow, organized the information architecture, designed the simulated-session experience, implemented reusable front-end components, and connected the interface with existing back-end services.",
                "The underlying language models, agent algorithms, retrieval pipeline, and automated evaluation metrics were developed collaboratively and were not the focus of my role. My responsibility was to make the existing system accessible through a coherent research application.",
              ],
            },
            {
              kind: "list",
              items: [
                "Formative research and requirement clarification",
                "Research workflow analysis",
                "Information architecture",
                "Interaction design",
                "Front-end implementation",
                "Front-end–back-end integration",
              ],
            },
          ],
        },
        {
          id: "decisions",
          label: "Key Design Decisions",
          blocks: [
            {
              kind: "feature",
              eyebrow: "Decision 01",
              title: "Designing for observation, not conversation",
              body: [
                "Unlike a conventional chatbot, the primary user observes a conversation between simulated therapist and patient agents.",
                "I designed clear distinctions among agent dialogue, researcher controls, system messages, and generation status, so a session can be followed as a research process rather than experienced as a consumer chat.",
              ],
              points: [
                "Therapist-agent dialogue kept distinct from patient-agent dialogue",
                "Session progress and generation status kept visible",
                "Researcher controls separated from system messages",
              ],
              figure: {
                src: "/wetguard/console-session.png",
                alt: "WET Guard research console — a simulated therapist-agent and patient-agent conversation, with session status and researcher controls",
              },
            },
            {
              kind: "feature",
              eyebrow: "Decision 02",
              title: "Preserving experimental context",
              body: [
                "A generated transcript is hard to interpret when the conditions that produced it are missing.",
                "I connected session configuration, generated dialogue, metadata, and available outputs within the same session record, so the design supports revisiting and interpreting previous runs.",
              ],
              figure: {
                src: "/wetguard/console-start.png",
                alt: "WET Guard research console — the session configuration screen that defines the conditions for a simulated run",
              },
              flip: true,
            },
            {
              kind: "feature",
              eyebrow: "Decision 03",
              title: "Presenting evaluation as research output",
              body: [
                "The broader system evaluates transcripts using protocol-related guidelines and metrics. I did not develop these metrics; I worked on how the available outputs were represented within the application.",
                "The interface distinguishes generated dialogue, automated evaluation, and researcher interpretation, rather than presenting scores as definitive judgments of therapeutic quality.",
              ],
              figure: {
                src: "/wetguard/session-summary.png",
                alt: "WET Guard research console — a session summary presenting automated evaluation output alongside the generated transcript",
              },
            },
          ],
        },
        {
          id: "implementation",
          label: "Technical Implementation",
          blocks: [
            {
              kind: "prose",
              lead: "Building the application layer",
              body: [
                "I implemented the application interface and integrated it with the existing research back end. The harder problems were less about any single screen and more about holding the workflow together across stages.",
              ],
            },
            {
              kind: "cards",
              items: [
                {
                  title: "Multi-stage session state",
                  description:
                    "Maintain continuity across setup, active generation, transcript review, and post-session outputs.",
                },
                {
                  title: "Variable AI-generated content",
                  description:
                    "Support responses with different lengths, structures, and generation times without disrupting readability.",
                },
                {
                  title: "Asynchronous feedback",
                  description:
                    "Communicate loading, generation, completion, unavailable, and error states clearly.",
                },
                {
                  title: "Front-end–back-end integration",
                  description:
                    "Connect user-facing actions with existing session, storage, and evaluation services.",
                },
              ],
            },
            {
              kind: "researchOverview",
              entries: [
                {
                  label: "System Context",
                  value:
                    "The broader research system included agent-based session generation, guideline retrieval, transcript evaluation, and session persistence.",
                },
                {
                  label: "My Technical Contribution",
                  value: [
                    "React / JavaScript",
                    "Front-End State Management",
                    "API Integration",
                    "Python Back-End Integration",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "interactive-prototype",
          label: "Interactive Prototype",
          blocks: [
            {
              kind: "prose",
              lead: "One protocol, two hands",
              body: [
                "Written Exposure Therapy is a rigid, script-driven treatment. The hard part was never the model — it was wrapping a high-stakes therapeutic conversation in an interface a clinician trusts, a patient isn't frightened by, and a researcher can measure.",
                "The system runs the same five-step flow across two clients. The clinician works it from a desktop console: deep session configuration, live observation of agent dialogue, a safety gate that holds the agent back on a risk signal, and multi-dimensional evaluation of the transcript. The patient meets it on a phone — a single soft onboarding card, guided turns, timed writing, and a calm restatement of the same safety status.",
                "Neither surface is a scaled copy of the other. One token sheet drives both, but mobile is reassuring and linear where the console is dense and analytical — the same words carried with different confidence.",
              ],
            },
            {
              kind: "wetDemo",
            },
          ],
        },
        {
          id: "outcome",
          label: "Outcome",
          blocks: [
            {
              kind: "prose",
              lead: "An end-to-end interactive research prototype",
              body: [
                "The project resulted in a working prototype connecting session preparation, simulated therapist–patient dialogue, transcript review, and available research outputs within one application workflow.",
                "My contribution helped move the project from a set of technical research functions toward an interface through which the system could be operated, observed, and reviewed.",
                "The prototype provides a foundation for future research on protocol adherence, simulated interaction patterns, and the usability of AI-based therapy simulation tools.",
              ],
            },
          ],
        },
        {
          id: "limitations",
          label: "Limitations",
          blocks: [
            {
              kind: "limitations",
              title: "What this prototype does not establish",
              body: [
                "This project remained at the research-prototype stage. It did not involve a clinical trial, formal evaluation of treatment effectiveness, validation of outcome prediction, or validation of automated metrics as clinical measures.",
                "The prototype was not formally evaluated with patients, researchers, or therapists. The system's listed applications represent intended directions for research rather than demonstrated clinical capabilities.",
              ],
            },
          ],
        },
        {
          id: "future-work",
          label: "Future Work",
          blocks: [
            {
              kind: "prose",
              lead: "Evaluating the research experience",
              body: [
                "Future work should examine whether researchers and therapists can understand and operate the simulation workflow, connect evaluation outputs with transcript content, and interpret the limitations of automated metrics. A formal usability study could also investigate how effectively the interface supports reviewing and comparing simulated sessions.",
              ],
            },
            {
              kind: "list",
              items: [
                "Can researchers understand how each simulated session was configured?",
                "Can users connect evaluation outputs with the relevant transcript content?",
                "Do users correctly interpret the limitations of automated scores?",
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
              lead: "What I learned",
              body: [
                "This project strengthened my interest in the human-centered design of AI research systems.",
                "My contribution was not the development of the underlying models. It was translating a technically complex research pipeline into an application through which researchers could operate, observe, and review the system's outputs.",
              ],
            },
            {
              kind: "prose",
              lead: "AI research systems need interfaces that make their processes understandable and their outputs easier to examine.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "corelink",
    title: "CoReLink",
    category: "Digital Health",
    subtitle: "AI Resource Navigation for Dementia Caregivers",
    year: "2025",
    role: "Research Framing · Interaction Design · Front-End",
    domain: "Dementia Care · Human-Centered AI",
    tags: [
      "Dementia Care",
      "Caregiver Support",
      "Human-Centered AI",
      "Digital Health",
    ],
    cardDescription:
      "An AI resource-navigation prototype that turns caregiver narratives into structured, actionable care recommendations.",
    cardTags: ["Dementia Care", "Caregiver Support", "Human-AI Interaction"],
    cardRole: "Research & Front-end Lead · End-to-End Prototype",
    summary:
      "Turning caregiver narratives and clinical notes into structured, actionable resource recommendations for care teams.",
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
        "How might AI turn one messy case conversation into a structured, bilingual action plan — without asking the care team to trust it blindly?",
      sections: [
        {
          id: "research-overview",
          label: "Research Overview",
          blocks: [
            {
              kind: "researchOverview",
              entries: [
                {
                  label: "Research Question",
                  value:
                    "How can AI translate complex caregiver and clinical narratives into actionable care resources while keeping care teams in control of final decisions?",
                },
                {
                  label: "Context",
                  value: "Dementia caregiving and community resource navigation.",
                },
                {
                  label: "Methods",
                  value: [
                    "Care Workflow Modeling",
                    "Narrative-Based Need Extraction",
                    "Resource Retrieval",
                    "Interaction Design",
                    "Front-End Prototyping",
                  ],
                },
                {
                  label: "My Role",
                  value: [
                    "Research Framing",
                    "Workflow Design",
                    "Interaction Design",
                    "Front-End Prototyping",
                  ],
                },
                { label: "Supervision", value: "Supervised by Dr. Bo Xie" },
                {
                  label: "Status",
                  value:
                    "End-to-end prototype; formal user evaluation not yet completed.",
                },
              ],
            },
          ],
        },
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
          label: "Prototype Walkthrough",
          blocks: [
            {
              kind: "prose",
              body: [
                "Watch the prototype work a sample case — a Spanish-speaking Medicare patient discharged in Travis County. It plays itself: the case notes type in, CoReLink reads them and replies, the case file fills, and it walks step by step from intake to a structured, bilingual plan. Click any step to drive it yourself.",
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
          id: "limitations",
          label: "Limitations",
          blocks: [
            {
              kind: "limitations",
              body: [
                "The prototype demonstrates a complete workflow from care narratives to resource planning, but it has not yet been evaluated through a formal study with caregivers or community health workers.",
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
    category: "Design & Interaction",
    subtitle:
      "Accessibility Evaluation and Redesign of an Adaptive Dance Platform",
    year: "2023",
    role: "Accessibility Evaluation · Interaction Design",
    domain: "Accessibility Evaluation · Inclusive Design",
    tags: [
      "Accessibility Evaluation",
      "Inclusive Design",
      "WCAG 2.2",
      "Interaction Design",
    ],
    cardDescription:
      "A multi-method WCAG 2.2 accessibility evaluation and redesign of key journeys for an adaptive dance community.",
    cardTags: ["Accessibility", "Inclusive Design", "WCAG 2.2"],
    cardRole: "UX Research & Interaction Design · Evaluation",
    summary:
      "Evaluating and redesigning key digital journeys for an adaptive dance community using WCAG 2.2.",
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
          id: "evaluation-overview",
          label: "Evaluation Overview",
          blocks: [
            {
              kind: "researchOverview",
              entries: [
                {
                  label: "Evaluation Question",
                  value:
                    "What barriers prevent people with visual, motor, and cognitive access needs from completing key tasks?",
                },
                {
                  label: "Methods",
                  value: [
                    "WCAG 2.2 AA Review",
                    "Automated Testing",
                    "Keyboard Navigation",
                    "Screen-Reader Inspection",
                    "Interface Analysis",
                  ],
                },
                {
                  label: "Scope",
                  value: [
                    "Class Discovery",
                    "Registration",
                    "Donation",
                    "Content Navigation",
                  ],
                },
                {
                  label: "My Role",
                  value: [
                    "Accessibility Evaluation",
                    "Interaction Design",
                    "Prototyping",
                  ],
                },
              ],
            },
          ],
        },
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
              lead: "Beyond the guidelines.",
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
              lead:
                "Accessibility is not a checklist; it is a measure of whether people can meaningfully participate.",
              body: [
                "Working on Jasmine's Beat changed how I think about accessibility. Designing for people with different abilities is not about creating separate experiences — it is about creating one experience that works for everyone.",
                "Although this project focused on an adaptive dance community, the principles directly translate to digital health, where trust, accessibility, and equitable participation are essential to patient and caregiver experiences.",
              ],
            },
          ],
        },
        {
          id: "scope",
          label: "Project Scope",
          blocks: [
            {
              kind: "limitations",
              body: [
                "This project was a multi-method accessibility evaluation and redesign exercise. It did not include a participant-based study with disabled users.",
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
