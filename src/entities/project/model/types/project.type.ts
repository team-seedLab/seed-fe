export interface Project {
  projectId: string;
  title: string;
  roadmapType: string;
  status: string;
  createdAt: string;
}

export interface ProjectInitialContext {
  topic: string;
  concept: string;
  difficulty: string;
  target_level: string;
}
