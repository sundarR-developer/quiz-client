import { createSlice } from "@reduxjs/toolkit";

export const resultReducer = createSlice({
  name: "result",
  initialState: {
    userId: null,
    result: [],
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    pushResultAction: (state, action) => {
      state.result.push(action.payload);
    },
    updateResultAction: (state, action) => {
      const { trace, checked } = action.payload;
      state.result[trace] = checked;
    },
    createResultAction: (state, action) => {
      state.result = action.payload;
    },
    resetResultAction: () => {
      return {
        userId: null,
        result: [],
      };
    },
  },
});

// where does actions come from?
export const {
  setUserId,
  pushResultAction,
  updateResultAction,
  createResultAction,
  resetResultAction,
} = resultReducer.actions;

// why not .reducers?
export default resultReducer.reducer;
