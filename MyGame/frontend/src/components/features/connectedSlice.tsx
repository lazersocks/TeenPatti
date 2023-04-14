import { createSlice } from "@reduxjs/toolkit";

export interface connPlayers {
  value: number;
}

const initialState: connPlayers = {
  value: 1,
};

export const connectSlice = createSlice({
  name: "connected",
  initialState,
  reducers: {
    setPlayers: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setPlayers } = connectSlice.actions;

export default connectSlice.reducer;
