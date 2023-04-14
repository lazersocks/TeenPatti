import { createSlice } from "@reduxjs/toolkit";
type Card = {
  rank: string;
  suit: string;
  back?: boolean;
};
export interface mainCards {
  mainCards: Card[];
}

const initialState: mainCards = {
  mainCards: [],
};

export const mainCardsSlice = createSlice({
  name: "mainCards",
  initialState,
  reducers: {
    setMainCards: (state, action) => {
      console.log("hereee");
      if (action.payload.length === 0) {
        state.mainCards = [];
      } else {
        state.mainCards = [...state.mainCards, action.payload];
      }
    },
  },
});

export const { setMainCards } = mainCardsSlice.actions;

export default mainCardsSlice.reducer;
