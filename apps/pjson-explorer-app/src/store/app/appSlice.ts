import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Source {
  package_json = "package.json",
  repo_url = "Repository URL",
}

export type SourceItems = keyof typeof Source;

export interface AppState {
  currentOperation: Source | undefined;
  isLandingPageActive: boolean;
  isLoading: boolean;
  jsonString: string | undefined;
  repositoryUrl: string | undefined;
  source: SourceItems;
}

const initialState: AppState = {
  currentOperation: undefined,
  isLandingPageActive: true,
  isLoading: false,
  jsonString: undefined,
  repositoryUrl: undefined,
  source: "repo_url",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setJsonString: (state, { payload }: PayloadAction<string | undefined>) => {
      state.jsonString = payload;
    },
    setLandingPageStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isLandingPageActive = payload;
    },
    setRepositoryUrl: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.repositoryUrl = payload;
    },
    setSource: (state, { payload }: PayloadAction<SourceItems>) => {
      state.source = payload;
    },
  },
});

export const {
  setJsonString,
  setLandingPageStatus,
  setRepositoryUrl,
  setSource,
} = appSlice.actions;
