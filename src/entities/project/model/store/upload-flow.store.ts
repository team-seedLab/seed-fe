import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type UploadFlowState = {
  projectId: string | null;
  error: Error | null;
};

type UploadFlowActions = {
  setProjectId: (projectId: string) => void;
  setError: (error: Error) => void;
  reset: () => void;
};

const initialState: UploadFlowState = {
  projectId: null,
  error: null,
};

export const useUploadFlowStore = create<UploadFlowState & UploadFlowActions>()(
  devtools(
    immer(
      combine(initialState, (set) => ({
        setProjectId: (projectId: string) =>
          set((state) => {
            state.projectId = projectId;
          }),
        setError: (error: Error) =>
          set((state) => {
            state.error = error;
          }),
        reset: () =>
          set((state) => {
            state.projectId = null;
            state.error = null;
          }),
      })),
    ),
    { name: "upload-flow-store-devtools" },
  ),
);
