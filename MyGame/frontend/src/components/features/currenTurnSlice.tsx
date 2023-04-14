import { createSlice } from "@reduxjs/toolkit";

export interface turn {
  name: string;
}

const initialState: turn = {
  name: "",
};

export const turnSlice = createSlice({
  name: "setName",
  initialState,
  reducers: {
    setTurn: (state, action) => {
      console.log("action payload ", action.payload);
      state.name = action.payload;
    },
  },
});

export const { setTurn } = turnSlice.actions;
export default turnSlice.reducer;
