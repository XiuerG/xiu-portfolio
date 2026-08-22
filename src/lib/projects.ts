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
    /** Small label above the quote, e.g. "The challenge". */
    label?: string;
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
    /** Section opener for a "how it works" system section: title + intro
     *  paragraph on the left, a small framing callout card on the right. */
    kind: "archIntro";
    title: string;
    body: string;
    callout: { title: string; items: string[] };
  }
  | {
    /** Pipeline diagram — numbered step nodes reading left to right on wide
     *  screens, reflowing to a grid and then a vertical stack. */
    kind: "archFlow";
    steps: {
      title: string;
      body: string;
      /** Short qualifier under the body, e.g. "Unstructured input". */
      label: string;
      icon?: ArchIcon;
    }[];
  }
  | {
    /** Quiet three-up cards for the decisions behind the pipeline. */
    kind: "archCards";
    items: { title: string; body: string }[];
  }
  | {
    /** WET Guard interactive dual-device showcase — renders real desktop & mobile screenshots. */
    kind: "wetDemo";
  }
  | {
    /** Click-to-load Vimeo embed. The still frame carries the page until the
     *  viewer presses play, so the video costs nothing on first paint. */
    kind: "video";
    vimeoId: string;
    title: string;
    /** Poster frame in /public. */
    poster?: string;
    caption?: string;
    /** Runtime badge, e.g. "4:12". */
    duration?: string;
  }
  | {
    /** Evaluation methods, set as a quiet reference list rather than feature
     *  cards — a kind (Automated Testing), the tool or activity, and what it
     *  was used to surface. */
    kind: "methods";
    items: { kind: string; name: string; body: string }[];
  }
  | {
    /** Audit findings as a vertically stacked report: numbered marker, the
     *  observation, and the access-path context that makes it matter. */
    kind: "findings";
    items: {
      title: string;
      /** One-sentence observation from the audit. */
      observation: string;
      /** Why it matters — the accessibility context. */
      context: string;
      /** Optional annotated crop of the original interface. */
      figure?: CaseFigure;
    }[];
  }
  | {
    /** Finding → design response pairs. The before/after figures are optional;
     *  a pair renders only once at least one crop exists, so the section reads
     *  as an argument first and a gallery second. */
    kind: "responses";
    items: {
      finding: string;
      response: string;
      /** Accessibility rationale, shown under the pair. */
      rationale?: string;
      before?: CaseFigure;
      after?: CaseFigure;
    }[];
  }
  | {
    /** Compact synthesis grid — used for the four POUR principles. */
    kind: "principles";
    title?: string;
    items: { title: string; body: string }[];
  };

/** Hairline glyphs available to `archFlow` step labels. */
export type ArchIcon =
  | "narrative"
  | "extract"
  | "plan"
  | "search"
  | "match"
  | "output";

export type CaseSection = {
  id: string;
  label: string;
  /** Section heading. When set, `label` drops to an eyebrow above it and this
   *  becomes the section's <h2>. */
  heading?: string;
  blocks: CaseBlock[];
};

/** Rich, long-form case study. Projects without one fall back to the
 *  short overview/problem/approach/outcome template. */
export type CaseStudy = {
  /** Optional eyebrow line above the title (overrides year · role · domain). */
  eyebrow?: string;
  /** Optional multi-paragraph hero description (overrides `summary`). */
  lead?: string[];
  /** Key facts shown under the title (Role, Timeline, Team, Tools…). Omit
   *  when a `researchOverview` block already carries them. */
  meta?: { label: string; value: string }[];
  /** Hero image (Before/After, product shot). Placeholder until `src` is set. */
  hero?: CaseFigure;
  /** One-line statement rendered under the hero. */
  heroNote?: string;
  /** Prominent external link in the header — the live piece the case study
   *  is about ("Experience it live"). */
  liveLink?: { href: string; label: string };
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
    /* Industry design-system accent — matches the product's own slate blue. */
    accent: "#5980a6",
    cover: {
      src: "/wetguard/cover-devices.webp",
      alt: "WET Guard shown on a laptop and phone — the clinician writing console beside the patient session summary",
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
            {
              kind: "callout",
              text: "Every screen had to hold three tensions at once: warmth against authority, guidance against control, and transparency against calm.",
            },
            {
              kind: "cards",
              items: [
                {
                  title: "Safety can't be an afterthought",
                  description:
                    "Risk signals have to surface instantly and route to a human — without alarming the patient.",
                },
                {
                  title: "One protocol, two contexts",
                  description:
                    "A patient on a phone and a clinician at a console need the same flow, shaped differently.",
                },
                {
                  title: "Measurable by design",
                  description:
                    "Eight fidelity dimensions had to read at a glance, not as raw JSON.",
                },
                {
                  title: "Trust through restraint",
                  description:
                    "A calm, near-monochrome interface, so the words carry the weight rather than the chrome.",
                },
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
      src: "/corelink/cover.webp",
      alt: "CoReLink — the four-step flow from case intake to coordination plan, shown across the product screens",
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
      hero: {
        src: "/corelink/plan.png",
        alt: "CoReLink — action plan with the bilingual caregiver handout preview",
        frame: "macbook",
      },
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
                  label: "Program",
                  value:
                    "Nursing AI Challenge — a research project in collaboration with UT Austin Dell Medical School and the School of Nursing.",
                },
                {
                  label: "Context",
                  value: "Dementia caregiving and community resource navigation.",
                },
                {
                  label: "Implementation",
                  value:
                    "Web application · JavaScript · Python (Flask) · LLM + live web search",
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
                    "AI Pipeline Design",
                    "Full-Stack Prototyping",
                  ],
                },
                { label: "Supervision", value: "Supervised by Dr. Bo Xie" },
                {
                  label: "Status",
                  value:
                    "End-to-end prototype, evaluated by healthcare and social work professionals; longitudinal real-world validation still needed.",
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
              ],
            },
          ],
        },
        {
          id: "how-it-works",
          label: "System Architecture",
          blocks: [
            {
              kind: "archIntro",
              title: "How CoReLink Works",
              body:
                "CoReLink turns a caregiver’s messy, open-ended narrative into a more structured resource navigation workflow. Instead of returning generic search results, it extracts key context, generates targeted searches, and organizes grounded recommendations for human review.",
              callout: {
                title: "Why this matters",
                items: [
                  "Community resources are fragmented",
                  "Eligibility depends on context",
                  "AI output needs transparency and review",
                ],
              },
            },
            {
              kind: "archFlow",
              steps: [
                {
                  title: "Care Narrative",
                  body:
                    "A caregiver or CHW describes the patient’s situation in natural language, including care needs, barriers, and personal context.",
                  label: "Unstructured input",
                  icon: "narrative",
                },
                {
                  title: "Context Extraction",
                  body:
                    "The system identifies key constraints such as location, insurance, language, and care needs so the case can be translated into searchable factors.",
                  label: "Location · Insurance · Language · Needs",
                  icon: "extract",
                },
                {
                  title: "Query Planning",
                  body:
                    "Instead of using one generic keyword, CoReLink generates targeted search queries for each need based on the case context.",
                  label: "Need-specific search strategy",
                  icon: "plan",
                },
                {
                  title: "Resource Retrieval",
                  body:
                    "The system searches public web resources, reads source pages, filters duplicates, and gathers candidate services relevant to the case.",
                  label: "Search + source reading",
                  icon: "search",
                },
                {
                  title: "Grounded Matching",
                  body:
                    "Retrieved resources are synthesized into recommendations and matched back to the case constraints, with reasons for fit and visible uncertainty.",
                  label: "Why this matches",
                  icon: "match",
                },
                {
                  title: "Structured Output + Review",
                  body:
                    "Results are organized into clear next steps that can be reviewed, confirmed, and used by caregivers or care teams.",
                  label: "Actionable plan",
                  icon: "output",
                },
              ],
            },
            {
              kind: "archCards",
              items: [
                {
                  title: "Structuring narratives before search",
                  body:
                    "Care situations rarely come in clean categories. CoReLink first translates free-form narratives into structured constraints, making retrieval more specific and relevant than a generic search.",
                },
                {
                  title: "Searching around the person, not just the keyword",
                  body:
                    "Resource matching depends on more than the need itself. Location, language, insurance, and affordability shape which resources are actually useful, so retrieval is tailored to the individual case.",
                },
                {
                  title: "Designing for uncertainty",
                  body:
                    "Community resource information can be incomplete or outdated. Rather than hiding this, the workflow surfaces confidence, missing information, verification status, and human review points.",
                },
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
              lead: "Context matters as much as the recommendation.",
              body: [
                "CoReLink made clear that a resource is only useful when it fits the person’s real constraints. Language, insurance, urgency, caregiver capacity, and missing information all shape whether a recommendation can actually become care. The design challenge was therefore not to automate the decision, but to help people move from an incomplete narrative to a more informed, reviewable, and actionable plan.",
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
                "The prototype was developed with the School of Nursing and evaluated by healthcare and social work professionals. Further validation through real-world, longitudinal use with caregivers and care teams is still needed.",
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
    category: "Accessibility",
    subtitle: "Accessibility Audit & Redesign",
    year: "2023",
    role: "Accessibility Audit · UX Research · Interaction Redesign",
    domain: "Accessibility · WCAG 2.2 AA",
    tags: ["Accessibility", "WCAG 2.2", "UX Audit", "Inclusive Design"],
    cardDescription:
      "A WCAG 2.2 accessibility audit combining automated and manual testing, followed by an evidence-based redesign addressing navigation, semantic structure, visual clarity, and interaction barriers.",
    cardTags: ["Accessibility", "WCAG 2.2", "UX Audit"],
    cardRole: "Accessibility Audit · UX Research · Interaction Redesign",
    summary:
      "Auditing a content-rich digital experience against WCAG 2.2 AA and translating the barriers into design decisions.",
    accent: "#5c93a0",
    cover: {
      src: "/jasmines-cover.png",
      alt: "Jasmine's Beat — audit findings mapped to redesigned interface states",
    },
    overview:
      "An accessibility audit of Jasmine's Beat against WCAG 2.2 AA, combining automated scanning with keyboard and screen-reader review, and a redesign driven by what the audit found.",
    problem:
      "Barriers that were easy to overlook visually — semantic structure, focus visibility, contrast, heading hierarchy — determined whether people using keyboard navigation or assistive technology could work through the experience independently.",
    approach: [
      "Ran WAVE and axe to surface structural errors, contrast issues, and missing accessibility attributes.",
      "Walked the interface by keyboard and reviewed headings, landmarks, and alternative text as assistive technology would encounter them.",
      "Translated each finding into a specific interface change rather than a compliance note.",
    ],
    outcome: [
      "Six representative barriers documented across contrast, semantics, alternative text, hierarchy, focus visibility, and carousel interaction.",
      "A redesign in which every change traces back to a finding — focus states, heading structure, text alternatives, contrast, and carousel controls.",
    ],
    caseStudy: {
      eyebrow: "2023 · Accessibility Audit & Redesign",
      lead: [
        "Auditing a content-rich digital experience against WCAG 2.2 AA and translating accessibility barriers into actionable design improvements.",
      ],
      meta: [
        {
          label: "Role",
          value: "Accessibility Audit · UX Research · Interaction Redesign",
        },
        {
          label: "Methods",
          value:
            "WCAG 2.2 AA · WAVE · axe · Keyboard Testing · Screen Reader Review",
        },
        {
          label: "Focus",
          value:
            "Navigation · Semantic Structure · Visual Accessibility · Interaction States",
        },
        { label: "Year", value: "2023" },
        { label: "Duration", value: "8 Weeks" },
      ],
      hero: {
        src: "/jasmines-cover.png",
        alt: "Jasmine's Beat — the audited interface alongside the redesigned states",
      },
      sections: [
        {
          id: "context",
          label: "Accessibility Case Study",
          heading: "Designing beyond what users can see",
          blocks: [
            {
              kind: "prose",
              body: [
                "Accessibility is not only about whether content is technically available — it shapes whether people can understand, navigate, and interact with an experience independently.",
                "I audited Jasmine's Beat against WCAG 2.2 AA to identify barriers that were easy to overlook visually but meaningful for users relying on keyboard navigation, assistive technology, or clearer information structure.",
              ],
            },
            {
              kind: "callout",
              label: "The challenge",
              text: "How might we uncover accessibility barriers in the existing experience and translate technical audit findings into design decisions that improve usability for a broader range of users?",
            },
          ],
        },
        {
          id: "audit",
          label: "Audit",
          heading: "Evaluating the experience from multiple access paths",
          blocks: [
            {
              kind: "methods",
              items: [
                {
                  kind: "Automated Testing",
                  name: "WAVE",
                  body: "Used to identify issues such as structural errors, contrast problems, missing accessibility attributes, and semantic warnings.",
                },
                {
                  kind: "Automated Testing",
                  name: "axe",
                  body: "Used as an additional accessibility validation layer to identify WCAG-related implementation issues.",
                },
                {
                  kind: "Manual Testing",
                  name: "Keyboard Navigation",
                  body: "Reviewed whether interactive elements could be reached, understood, and operated without a mouse, including focus visibility and navigation order.",
                },
                {
                  kind: "Assistive Technology Review",
                  name: "Screen Reader + Semantic Structure",
                  body: "Reviewed headings, landmarks, alternative text, content hierarchy, and how interface structure would be interpreted beyond the visual presentation.",
                },
              ],
            },
          ],
        },
        {
          id: "findings",
          label: "Findings",
          heading: "The most important barriers were structural, not decorative",
          blocks: [
            {
              kind: "findings",
              items: [
                {
                  title: "Insufficient contrast",
                  observation:
                    "Some text and interface elements did not provide sufficient contrast, reducing readability and making important information harder to distinguish.",
                  context:
                    "Low contrast can create barriers for users with low vision, color-vision differences, or situational visibility constraints.",
                },
                {
                  title: "Weak landmark and semantic structure",
                  observation:
                    "Page regions and content structure were not always communicated clearly through semantic landmarks.",
                  context:
                    "Users navigating with assistive technology rely on structural cues — not visual layout alone — to understand where they are on a page.",
                },
                {
                  title: "Missing or insufficient alternative text",
                  observation:
                    "Some meaningful visual content lacked useful text alternatives.",
                  context:
                    "When visual information is not represented semantically, screen-reader users may lose context entirely.",
                },
                {
                  title: "Heading hierarchy",
                  observation:
                    "Visual hierarchy and semantic heading hierarchy were not consistently aligned.",
                  context:
                    "Headings function as navigation landmarks for many screen-reader users and help everyone scan complex content more efficiently.",
                },
                {
                  title: "Keyboard focus visibility",
                  observation:
                    "Focus states were difficult to identify or inconsistent across interactive elements.",
                  context:
                    "Keyboard users need a persistent visual indication of where interaction will occur.",
                },
                {
                  title: "Carousel interaction",
                  observation:
                    "Carousel behavior introduced accessibility concerns related to navigation, control, and understanding changing content.",
                  context:
                    "Dynamic interfaces can become difficult to operate when users cannot reliably pause, navigate, or understand content changes.",
                },
              ],
            },
          ],
        },
        {
          id: "design-response",
          label: "Design Response",
          heading: "Turning audit findings into design decisions",
          blocks: [
            {
              kind: "responses",
              items: [
                {
                  finding: "Keyboard focus was difficult to perceive.",
                  response:
                    "Introduced consistent, high-visibility focus states across interactive elements so users can track navigation without relying on a pointer.",
                },
                {
                  finding:
                    "Visual hierarchy did not consistently map to semantic structure.",
                  response:
                    "Reorganized heading levels and content grouping so the page hierarchy remains understandable both visually and through assistive technology.",
                },
                {
                  finding:
                    "Some information relied too heavily on visual presentation.",
                  response:
                    "Strengthened text alternatives, labels, and structural cues so important meaning is preserved when visual context is unavailable.",
                },
                {
                  finding: "Low-contrast interface elements reduced clarity.",
                  response:
                    "Adjusted typography, foreground/background relationships, and state styling to improve readability while preserving the original visual identity.",
                },
                {
                  finding:
                    "Dynamic carousel interactions created additional navigation complexity.",
                  response:
                    "Redesigned controls and interaction states to make carousel behavior more understandable and keyboard-accessible.",
                },
              ],
            },
            {
              kind: "principles",
              title: "What changed",
              items: [
                {
                  title: "Perceivable",
                  body: "Improved contrast and text alternatives.",
                },
                {
                  title: "Operable",
                  body: "Improved keyboard navigation and focus visibility.",
                },
                {
                  title: "Understandable",
                  body: "Improved hierarchy and interaction clarity.",
                },
                {
                  title: "Robust",
                  body: "Improved semantic structure for assistive technologies.",
                },
              ],
            },
          ],
        },
        {
          id: "reflection",
          label: "Reflection",
          heading: "Accessibility changed what I considered a design decision.",
          blocks: [
            {
              kind: "prose",
              body: [
                "This project pushed me to evaluate interfaces beyond their visual appearance. A hierarchy that looks clear may not exist semantically; an interaction that feels obvious with a mouse may disappear for a keyboard user.",
                "The audit made accessibility less of a final compliance check and more of a way to question how information and interaction are experienced through different access paths.",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    slug: "ocean-vr",
    title: "Ocean — VR Game",
    category: "Design & Interaction",
    subtitle:
      "An Immersive VR Experience for Marine Conservation Advocacy",
    year: "2024",
    role: "UX Design · Game Design · Unity Development",
    domain: "Virtual Reality · UX Design",
    tags: ["Virtual Reality", "Game Design", "Unity", "Environmental Advocacy"],
    cardDescription:
      "A VR game that turns ocean plastic pollution from a statistic into something you touch — mutated creatures hand you their memories.",
    cardTags: ["Virtual Reality", "Game Design", "Unity"],
    cardRole: "UX & Game Design · Unity Development",
    summary:
      "An immersive VR experience that makes marine plastic pollution felt rather than reported.",
    accent: "#38a3a5",
    cover: {
      src: "/ocean/hero.webp",
      alt: "Ocean — VR Game: an underwater scene rendered in Unity",
    },
    overview:
      "Ocean is a VR game about marine plastic pollution. Players descend into a beautiful but altered underwater world, meet creatures whose bodies have been changed by decades of plastic, and — by touching them — inherit their memories of what the ocean used to be.",
    problem:
      "Ocean conservation loses the public-attention race. Google Trends shows consistently lower search interest than deforestation or climate change, because ocean damage happens out of sight and rarely produces the dramatic visuals that drive coverage.",
    approach: [
      "Built a virtual marine environment in Unity so players could witness ocean degradation firsthand instead of reading about it.",
      "Designed a three-stage mutation system that turns the chemistry of plastic pollution into visible, embodied change in the creatures.",
      "Made touch the core mechanic — contact with a mutated creature triggers its memory, so understanding arrives through the hands.",
    ],
    outcome: [
      "A playable Unity VR build with hand-tracked interaction, a full underwater environment, and custom-modeled mutated species.",
      "A narrative structure where players clean plastic waste and rescue harmed animals, unlocking scattered memory recordings as they explore.",
    ],
    caseStudy: {
      eyebrow: "2024 · Virtual Reality Experience · UX Design",
      lead: [
        "Ocean is an immersive VR experience about the fragility of marine ecosystems and the reach of plastic pollution.",
        "Players dive into a world that is still beautiful — and still wrong. The creatures they meet have adapted to survive plastic, and their bodies carry the record of it. The game is less an argument than an encounter.",
      ],
      meta: [
        { label: "Project Type", value: "VR Experience · Game Design · UX" },
        { label: "Role", value: "UX Design · Game Design · Unity Development" },
        { label: "Platform", value: "Meta Quest · Unity" },
        {
          label: "Tools",
          value: "Unity · Blender · C# · Procreate · Figma",
        },
      ],
      hero: {
        src: "/ocean/hero.webp",
        alt: "An underwater scene from Ocean, rendered in Unity",
      },
      heroNote:
        "Ocean damage happens out of sight. VR is the one medium that can put a person inside it.",
      sections: [
        {
          id: "walkthrough",
          label: "Walkthrough",
          blocks: [
            {
              kind: "prose",
              lead: "See it running.",
              body: [
                "A recorded playthrough of the Unity build — descending into the environment, meeting the mutated species, and triggering the memory sequences by touch.",
              ],
            },
            {
              kind: "video",
              vimeoId: "935813613",
              title: "Ocean — VR Game walkthrough",
              poster: "/ocean/scene-wide.webp",
              caption:
                "Gameplay walkthrough — recorded in-headset from the Unity build.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "atlas-of-crossings",
    title: "An Atlas of Crossings",
    category: "Design & Interaction",
    subtitle:
      "Four Interactive Storybooks on Memory, Return, and Home",
    year: "2026",
    role: "UX Research / Interactive Experience Designer",
    domain: "Interactive Narrative · Web",
    tags: ["Interactive Narrative", "Web", "Diaspora", "Interaction Design"],
    cardDescription:
      "Four interactive storybooks on memory, return, and home across the Asian diaspora. Each spread turns a feeling into something the reader operates.",
    cardTags: ["Interactive Narrative", "Web"],
    cardRole: "UX Research / Interactive Experience Designer",
    summary:
      "Four interactive storybooks on memory, return, and home across the Asian diaspora.",
    accent: "#c08457",
    cover: {
      src: "/design/atlas-of-crossings.webp",
      alt: "An Atlas of Crossings — an interactive storybook spread",
    },
    overview:
      "An Atlas of Crossings is a set of four interactive storybooks about memory, return, and home across the Asian diaspora. Each spread turns a feeling into something the reader operates rather than reads.",
    problem:
      "Diaspora writing usually asks to be read. These stories ask to be handled — the distance between leaving and returning is easier to feel through an interface that resists you than through a paragraph that describes it.",
    approach: [
      "Built each spread around a single interaction that enacts the feeling it is about.",
      "Kept the reading surface quiet so the mechanic, not the ornament, carries the moment.",
    ],
    outcome: [
      "Four playable storybooks running on the web, readable end to end in a browser.",
    ],
    caseStudy: {
      eyebrow: "2026 · Interactive Narrative · Web",
      lead: [
        "Four interactive storybooks on memory, return, and home across the Asian diaspora.",
        "Each spread turns a feeling into something the reader operates.",
      ],
      meta: [
        { label: "Project Type", value: "Interactive Narrative · Web" },
        {
          label: "Role",
          value: "UX Research / Interactive Experience Designer",
        },
        {
          label: "Organization",
          value: "Moritz Center for Societal Impact",
        },
        { label: "Year", value: "2026" },
      ],
      hero: {
        src: "/design/atlas-landing.webp",
        alt: "An Atlas of Crossings — the four storybooks on the landing page",
      },
      liveLink: {
        href: "https://storybook-sigma-ten-66.vercel.app/",
        label: "Experience it live",
      },
      sections: [
        {
          id: "walkthrough",
          label: "Walkthrough",
          blocks: [
            {
              kind: "prose",
              lead: "See it running.",
              body: [
                "A recorded read-through of all four storybooks — every spread, and the interaction each one is built around.",
              ],
            },
            {
              kind: "video",
              vimeoId: "1220378299",
              title: "An Atlas of Crossings walkthrough",
              poster: "/design/atlas-of-crossings.webp",
              duration: "6:53",
              caption:
                "Full walkthrough of the four storybooks.",
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
