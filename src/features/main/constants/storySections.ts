export type StorySectionId = "intro" | "chat" | "next";

export type StorySectionProgressMap = Record<StorySectionId, number>;

type ScrollTerm = "short" | "long";
type StorySceneKind = "hold" | "transition" | "chatStage";

export const STORY_SCROLL_TERM_VH = {
  short: 50,
  long: 10,
} as const;

export const STORY_SECTION_ORDER: StorySectionId[] = ["intro", "chat", "next"];

export const STORY_SCENE_SEQUENCE = [
  {
    id: "introDotHold",
    kind: "hold",
    section: "intro",
    term: "long",
  },
  {
    id: "introComposerReveal",
    kind: "transition",
    section: "intro",
    term: "long",
  },
  {
    id: "introComposerIdle",
    kind: "hold",
    section: "intro",
    term: "long",
  },
  {
    id: "introPromptFill",
    kind: "transition",
    section: "intro",
    term: "long",
  },
  {
    id: "chatDock",
    kind: "transition",
    section: "chat",
    term: "long",
  },
  {
    id: "chatPromptExit",
    kind: "transition",
    section: "chat",
    term: "short",
  },
  {
    id: "chatUserOnly",
    kind: "chatStage",
    section: "chat",
    term: "short",
  },
  {
    id: "chatHelpAndMethod",
    kind: "chatStage",
    section: "chat",
    term: "short",
  },
  {
    id: "chatNeedInfo",
    kind: "chatStage",
    section: "chat",
    term: "short",
  },
  {
    id: "chatUserCrown",
    kind: "chatStage",
    section: "chat",
    term: "short",
  },
  {
    id: "chatHallucination",
    kind: "chatStage",
    section: "chat",
    term: "short",
  },
  {
    id: "chatCorrection",
    kind: "chatStage",
    section: "chat",
    term: "short",
  },
  {
    id: "chatGaslight",
    kind: "chatStage",
    section: "chat",
    term: "short",
  },
  {
    id: "chatGaslightHold",
    kind: "hold",
    section: "chat",
    term: "long",
  },
  {
    id: "nextComposerSettle",
    kind: "transition",
    section: "next",
    term: "long",
  },
  {
    id: "nextBackdropReveal",
    kind: "transition",
    section: "next",
    term: "long",
  },
  {
    id: "nextHold",
    kind: "hold",
    section: "next",
    term: "long",
  },
] as const satisfies readonly {
  id: string;
  kind: StorySceneKind;
  section: StorySectionId;
  term: ScrollTerm;
}[];

export type StoryScene = (typeof STORY_SCENE_SEQUENCE)[number];
export type StorySceneId = StoryScene["id"];

export type StorySceneProgress = StoryScene & {
  end: number;
  start: number;
};

const roundScrollValue = (value: number) => {
  return Number(value.toFixed(4));
};

const createZeroSectionMap = <Value>(
  value: Value,
): Record<StorySectionId, Value> => {
  return {
    intro: value,
    chat: value,
    next: value,
  };
};

const resolveTermVh = (term: ScrollTerm) => {
  return STORY_SCROLL_TERM_VH[term];
};

const createProgressSectionHeight = (travelVh: number) => {
  return roundScrollValue(100 + travelVh);
};

const STORY_SECTION_TRAVEL_VH = STORY_SCENE_SEQUENCE.reduce<
  Record<StorySectionId, number>
>((travelBySection, scene) => {
  travelBySection[scene.section] += resolveTermVh(scene.term);
  return travelBySection;
}, createZeroSectionMap(0));

export const STORY_SECTION_VH: Record<StorySectionId, number> =
  STORY_SECTION_ORDER.reduce<Record<StorySectionId, number>>(
    (sectionHeights, sectionId) => {
      sectionHeights[sectionId] = createProgressSectionHeight(
        STORY_SECTION_TRAVEL_VH[sectionId],
      );
      return sectionHeights;
    },
    createZeroSectionMap(0),
  );

export const STORY_SCENE_PROGRESS = (() => {
  const sceneCursorBySection = createZeroSectionMap(0);

  return STORY_SCENE_SEQUENCE.reduce<Record<StorySceneId, StorySceneProgress>>(
    (progressLookup, scene) => {
      const startVh = sceneCursorBySection[scene.section];
      const endVh = startVh + resolveTermVh(scene.term);
      const sectionTravelVh = STORY_SECTION_TRAVEL_VH[scene.section];

      sceneCursorBySection[scene.section] = endVh;
      progressLookup[scene.id] = {
        ...scene,
        end: roundScrollValue(endVh / sectionTravelVh),
        start: roundScrollValue(startVh / sectionTravelVh),
      };

      return progressLookup;
    },
    {} as Record<StorySceneId, StorySceneProgress>,
  );
})();
