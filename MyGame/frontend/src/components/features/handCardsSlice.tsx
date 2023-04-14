import { createSlice } from "@reduxjs/toolkit";
type Card = {
  rank: string;
  suit: string;
  back?: boolean;
};
export interface handCards {
  handCards: Card[];
}

const initialState: handCards = {
  handCards: [{ rank: "7", suit: "diams", back: false }],
};

export const handCardsSlice = createSlice({
  name: "handCards",
  initialState,
  reducers: {
    setHandCards: (state, action) => {
      console.log("action payload ", action.payload);
      state.handCards = action.payload;
      console.log("handCardsSlice: ", state.handCards);
    },
  },
});

export const { setHandCards } = handCardsSlice.actions;

export default handCardsSlice.reducer;
