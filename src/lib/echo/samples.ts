import { buildAdaptations } from "./adapt";
import type { AdaptedChapter, LearningProfile } from "./types";

const photosynthesisRaw = `Photosynthesis is the process by which green plants, algae and certain bacteria convert light energy into chemical energy stored in glucose. It sustains almost every food chain on Earth and is responsible for the oxygen in our atmosphere.

The raw materials required are carbon dioxide, absorbed from the air through tiny pores called stomata, and water, drawn up from the soil by the roots and carried through the xylem. Sunlight is captured by chlorophyll, the green pigment held inside chloroplasts.

The light-dependent reactions take place in the thylakoid membranes of the chloroplast. Light energy splits water molecules in a reaction called photolysis, releasing oxygen as a by-product and producing energy carriers known as ATP and NADPH.

The light-independent reactions, also called the Calvin cycle, occur in the stroma. Here carbon dioxide is fixed and, using the ATP and NADPH from the previous stage, is built up into glucose.

Several factors limit the rate of photosynthesis: light intensity, carbon dioxide concentration and temperature. Increasing any one of them raises the rate only until another factor becomes limiting.

The glucose produced is used for respiration, converted into starch for storage, or built into cellulose for cell walls. Photosynthesis and respiration together keep carbon and oxygen cycling through living systems.`;

const independenceRaw = `The Indian independence movement was a long campaign of political, social and economic resistance that ended nearly two centuries of British rule in 1947. It combined mass non-violent protest with negotiation, organisation and sacrifice.

Early organised nationalism began with the founding of the Indian National Congress in 1885. Moderate leaders petitioned for representation, while assertive leaders such as Bal Gangadhar Tilak argued that self-rule was a birthright.

The partition of Bengal in 1905 triggered the Swadeshi movement, in which people boycotted British goods and revived Indian industries. It turned nationalism into a mass experience rather than an elite debate.

From 1919 Mahatma Gandhi reshaped the struggle around satyagraha, or non-violent resistance. The Non-Cooperation Movement, the Salt March of 1930 and the Civil Disobedience Movement drew millions of ordinary people, including women and students, into political action.

The Quit India Movement of 1942 demanded an immediate end to British rule. Despite mass arrests, it made continued colonial administration increasingly impossible.

Independence arrived on 15 August 1947, accompanied by the partition of the subcontinent and enormous human displacement. The movement left a constitutional democracy and a model of non-violent resistance studied around the world.`;

function chapter(
  base: Omit<AdaptedChapter, "adaptationsApplied" | "engine" | "createdAt">,
  profile: LearningProfile,
): AdaptedChapter {
  return {
    ...base,
    adaptationsApplied: buildAdaptations(profile),
    engine: "fallback",
    createdAt: new Date().toISOString(),
  };
}

export function sampleChapters(profile: LearningProfile): AdaptedChapter[] {
  return [
    chapter(
      {
        id: "demo-photosynthesis",
        title: "Photosynthesis",
        subject: "Biology",
        source: "demo",
        rawText: photosynthesisRaw,
        concepts: [
          {
            id: "c1",
            title: "What photosynthesis is",
            chunks: [
              "Photosynthesis is how plants turn light energy into food energy.",
              "The food energy is stored inside a sugar called glucose.",
              "This process feeds almost every food chain and makes the oxygen we breathe.",
            ],
            steps: ["Light arrives", "Plant captures it", "Energy is stored as glucose"],
            keyTerms: ["photosynthesis", "glucose", "light energy"],
            callout: "Key idea: light energy in, stored chemical energy out.",
            checkpoint: "In one sentence: what does a plant make during photosynthesis?",
          },
          {
            id: "c2",
            title: "The raw materials",
            chunks: [
              "A plant needs three things: carbon dioxide, water and sunlight.",
              "Carbon dioxide enters through tiny pores on the leaf called stomata.",
              "Water travels up from the roots through tubes called xylem.",
              "Sunlight is captured by chlorophyll, the green pigment in chloroplasts.",
            ],
            steps: [
              "Carbon dioxide enters through stomata",
              "Water rises through the xylem",
              "Chlorophyll captures sunlight",
            ],
            keyTerms: ["stomata", "xylem", "chlorophyll", "chloroplast"],
            callout: "Key idea: carbon dioxide + water + light are the inputs.",
            checkpoint: "Name the three raw materials a plant needs.",
          },
          {
            id: "c3",
            title: "Light-dependent reactions",
            chunks: [
              "These happen in the thylakoid membranes inside the chloroplast.",
              "Light splits water molecules — this is called photolysis.",
              "Oxygen is released as a by-product, and energy carriers ATP and NADPH are made.",
            ],
            steps: [
              "Light hits the thylakoid membrane",
              "Water is split (photolysis)",
              "Oxygen is released",
              "ATP and NADPH are produced",
            ],
            keyTerms: ["thylakoid", "photolysis", "ATP", "NADPH"],
            callout: "Key idea: this stage needs light and produces oxygen.",
            checkpoint: "Where does the oxygen you breathe come from in this stage?",
          },
          {
            id: "c4",
            title: "The Calvin cycle",
            chunks: [
              "The light-independent reactions happen in the stroma.",
              "Carbon dioxide is fixed into a stable molecule.",
              "Using ATP and NADPH from stage one, glucose is built up.",
            ],
            steps: ["Carbon dioxide is fixed", "ATP and NADPH supply energy", "Glucose is assembled"],
            keyTerms: ["Calvin cycle", "stroma", "carbon fixation"],
            callout: "Key idea: no light needed here — only the energy carriers.",
            checkpoint: "What does the Calvin cycle build?",
          },
          {
            id: "c5",
            title: "Limiting factors",
            chunks: [
              "Three things limit how fast photosynthesis happens.",
              "They are light intensity, carbon dioxide concentration and temperature.",
              "Raising one only helps until another becomes the new limit.",
            ],
            steps: ["Check light intensity", "Check carbon dioxide level", "Check temperature"],
            keyTerms: ["limiting factor", "light intensity", "temperature"],
            callout: "Key idea: the slowest factor sets the overall rate.",
            checkpoint: "Name one limiting factor and why it matters.",
          },
          {
            id: "c6",
            title: "What happens to the glucose",
            chunks: [
              "Some glucose is used straight away in respiration for energy.",
              "Some is stored as starch for later.",
              "Some becomes cellulose, which builds strong cell walls.",
            ],
            steps: ["Used in respiration", "Stored as starch", "Built into cellulose"],
            keyTerms: ["respiration", "starch", "cellulose"],
            callout: "Key idea: photosynthesis stores energy, respiration releases it.",
            checkpoint: "Give two uses of the glucose a plant makes.",
          },
        ],
        mindMap: [
          { id: "root", label: "Photosynthesis", parent: null, kind: "root" },
          { id: "c2", label: "Raw materials", parent: "root", kind: "branch" },
          { id: "c2-1", label: "Carbon dioxide", parent: "c2", kind: "leaf" },
          { id: "c2-2", label: "Water", parent: "c2", kind: "leaf" },
          { id: "c2-3", label: "Sunlight", parent: "c2", kind: "leaf" },
          { id: "c3", label: "Light reactions", parent: "root", kind: "branch" },
          { id: "c3-1", label: "Photolysis", parent: "c3", kind: "leaf" },
          { id: "c3-2", label: "ATP + NADPH", parent: "c3", kind: "leaf" },
          { id: "c4", label: "Calvin cycle", parent: "root", kind: "branch" },
          { id: "c4-1", label: "Carbon fixation", parent: "c4", kind: "leaf" },
          { id: "c4-2", label: "Glucose built", parent: "c4", kind: "leaf" },
          { id: "c6", label: "Products", parent: "root", kind: "branch" },
          { id: "c6-1", label: "Oxygen", parent: "c6", kind: "leaf" },
          { id: "c6-2", label: "Starch & cellulose", parent: "c6", kind: "leaf" },
        ],
        quiz: [
          {
            id: "q1",
            kind: "multiple",
            prompt: "Which gas is released as a by-product of photosynthesis?",
            options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
            answer: "Oxygen",
            explanation: "Water is split during photolysis, which releases oxygen.",
          },
          {
            id: "q2",
            kind: "multiple",
            prompt: "Where do the light-dependent reactions take place?",
            options: ["Thylakoid membranes", "Stroma", "Nucleus", "Root hair cells"],
            answer: "Thylakoid membranes",
            explanation: "The thylakoid membranes inside the chloroplast hold the light-capturing pigments.",
          },
          {
            id: "q3",
            kind: "truefalse",
            prompt: "The Calvin cycle needs direct sunlight to run.",
            options: ["True", "False"],
            answer: "False",
            explanation: "It is light-independent — it runs on the ATP and NADPH made earlier.",
          },
          {
            id: "q4",
            kind: "fill",
            prompt: "The green pigment that captures light is called ______.",
            options: ["chlorophyll", "cellulose", "glucose", "xylem"],
            answer: "chlorophyll",
            explanation: "Chlorophyll sits inside chloroplasts and absorbs light energy.",
          },
          {
            id: "q5",
            kind: "multiple",
            prompt: "Which is NOT a limiting factor of photosynthesis?",
            options: ["Soil colour", "Light intensity", "Temperature", "Carbon dioxide concentration"],
            answer: "Soil colour",
            explanation: "The three limiting factors are light intensity, carbon dioxide and temperature.",
          },
        ],
      },
      profile,
    ),
    chapter(
      {
        id: "demo-independence",
        title: "The Indian Independence Movement",
        subject: "History",
        source: "demo",
        rawText: independenceRaw,
        concepts: [
          {
            id: "c1",
            title: "What the movement was",
            chunks: [
              "It was a long campaign to end British rule in India.",
              "It mixed mass non-violent protest with negotiation and organisation.",
              "It succeeded in 1947, after nearly two centuries of colonial rule.",
            ],
            steps: ["Resistance builds", "Mass movements grow", "Independence in 1947"],
            keyTerms: ["independence", "British rule", "1947"],
            callout: "Key idea: protest, organisation and negotiation together.",
            checkpoint: "In one sentence, what was the movement trying to achieve?",
          },
          {
            id: "c2",
            title: "Early nationalism (1885 onwards)",
            chunks: [
              "The Indian National Congress was founded in 1885.",
              "Moderate leaders asked for more Indian representation.",
              "Assertive leaders like Tilak argued self-rule was a birthright.",
            ],
            steps: ["Congress founded 1885", "Moderates petition", "Assertive leaders demand self-rule"],
            keyTerms: ["Indian National Congress", "Tilak", "self-rule"],
            callout: "Key idea: organised politics replaced scattered protest.",
            checkpoint: "Which organisation was founded in 1885?",
          },
          {
            id: "c3",
            title: "Swadeshi and the Bengal partition",
            chunks: [
              "Bengal was partitioned in 1905.",
              "People boycotted British goods and revived Indian industry.",
              "Nationalism became a mass experience, not an elite debate.",
            ],
            steps: ["Bengal partitioned 1905", "Boycott of British goods", "Indian industries revived"],
            keyTerms: ["Swadeshi", "boycott", "partition of Bengal"],
            callout: "Key idea: economic protest became political power.",
            checkpoint: "What did the Swadeshi movement ask people to do?",
          },
          {
            id: "c4",
            title: "Gandhi and satyagraha",
            chunks: [
              "From 1919 Gandhi reshaped the struggle around non-violent resistance.",
              "Key campaigns were Non-Cooperation, the 1930 Salt March and Civil Disobedience.",
              "Millions joined, including women and students.",
            ],
            steps: [
              "Non-Cooperation Movement",
              "Salt March, 1930",
              "Civil Disobedience Movement",
            ],
            keyTerms: ["satyagraha", "Salt March", "civil disobedience"],
            callout: "Key idea: non-violence turned into a mass political tool.",
            checkpoint: "What does satyagraha mean in practice?",
          },
          {
            id: "c5",
            title: "Quit India, 1942",
            chunks: [
              "The Quit India Movement demanded an immediate end to British rule.",
              "Leaders were arrested in large numbers.",
              "Even so, governing India became increasingly impossible for Britain.",
            ],
            steps: ["Demand issued 1942", "Mass arrests", "Colonial control weakens"],
            keyTerms: ["Quit India", "1942", "mass arrests"],
            callout: "Key idea: repression could not restore control.",
            checkpoint: "What did the Quit India Movement demand?",
          },
          {
            id: "c6",
            title: "Independence and partition",
            chunks: [
              "Independence came on 15 August 1947.",
              "It arrived with the partition of the subcontinent and huge displacement.",
              "The movement left behind a constitutional democracy and a global model of non-violence.",
            ],
            steps: ["Independence, 15 August 1947", "Partition", "Constitutional democracy"],
            keyTerms: ["1947", "partition", "democracy"],
            callout: "Key idea: freedom arrived alongside great human cost.",
            checkpoint: "Name the date of independence and one consequence.",
          },
        ],
        mindMap: [
          { id: "root", label: "Indian Independence Movement", parent: null, kind: "root" },
          { id: "c2", label: "Early nationalism", parent: "root", kind: "branch" },
          { id: "c2-1", label: "Congress, 1885", parent: "c2", kind: "leaf" },
          { id: "c2-2", label: "Tilak & self-rule", parent: "c2", kind: "leaf" },
          { id: "c3", label: "Swadeshi", parent: "root", kind: "branch" },
          { id: "c3-1", label: "Bengal partition 1905", parent: "c3", kind: "leaf" },
          { id: "c3-2", label: "Boycott", parent: "c3", kind: "leaf" },
          { id: "c4", label: "Gandhian phase", parent: "root", kind: "branch" },
          { id: "c4-1", label: "Salt March 1930", parent: "c4", kind: "leaf" },
          { id: "c4-2", label: "Civil disobedience", parent: "c4", kind: "leaf" },
          { id: "c6", label: "Outcome", parent: "root", kind: "branch" },
          { id: "c6-1", label: "15 August 1947", parent: "c6", kind: "leaf" },
          { id: "c6-2", label: "Partition", parent: "c6", kind: "leaf" },
        ],
        quiz: [
          {
            id: "q1",
            kind: "multiple",
            prompt: "In which year was the Indian National Congress founded?",
            options: ["1885", "1905", "1930", "1947"],
            answer: "1885",
            explanation: "The Congress was founded in 1885 and became the main nationalist platform.",
          },
          {
            id: "q2",
            kind: "multiple",
            prompt: "Which event triggered the Swadeshi movement?",
            options: [
              "The partition of Bengal in 1905",
              "The Salt March",
              "The Quit India Movement",
              "Independence in 1947",
            ],
            answer: "The partition of Bengal in 1905",
            explanation: "The 1905 partition of Bengal sparked boycotts of British goods.",
          },
          {
            id: "q3",
            kind: "truefalse",
            prompt: "The Salt March took place in 1930.",
            options: ["True", "False"],
            answer: "True",
            explanation: "Gandhi's Salt March of 1930 launched the Civil Disobedience Movement.",
          },
          {
            id: "q4",
            kind: "fill",
            prompt: "Gandhi's method of non-violent resistance is called ______.",
            options: ["satyagraha", "swadeshi", "partition", "boycott"],
            answer: "satyagraha",
            explanation: "Satyagraha means holding firmly to truth through non-violent resistance.",
          },
          {
            id: "q5",
            kind: "multiple",
            prompt: "What accompanied independence in August 1947?",
            options: [
              "The partition of the subcontinent",
              "The founding of the Congress",
              "The Swadeshi boycott",
              "The Bengal partition",
            ],
            answer: "The partition of the subcontinent",
            explanation: "Independence came with partition and large-scale displacement.",
          },
        ],
      },
      profile,
    ),
  ];
}

export const demoProfile: LearningProfile = {
  reading: "High",
  focus: "Medium",
  sequencing: "High",
  visual: "High",
  chunking: "High",
  summary:
    "You learn best with structured concept chunks, visual mind maps and progressive scaffolding. EduAdapt shapes every chapter around your active goals.",
  adaptations: [
    "Simpler wording with key terms highlighted",
    "Shorter content chunks with micro-checkpoints",
    "Numbered step-by-step structure",
    "Mind map view of how ideas connect",
  ],
  createdAt: new Date().toISOString(),
};
