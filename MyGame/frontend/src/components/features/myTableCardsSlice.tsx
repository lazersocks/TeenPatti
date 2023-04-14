import { createSlice } from "@reduxjs/toolkit";
type Card = {
  rank: string;
  suit: string;
  back?: boolean;
};
export interface tableCards {
  tableCards: Card[];
}

const initialState: tableCards = {
  tableCards: [{ rank: "7", suit: "diams", back: false }],
};

export const myTableCardsSlice = createSlice({
  name: "myTableCards",
  initialState,
  reducers: {
    setMyTableCards: (state, action) => {
      console.log("action payload ", action.payload);
      state.tableCards = action.payload;
      console.log("tableCardsSlice: ", state.tableCards);
    },
  },
});

export const { setMyTableCards } = myTableCardsSlice.actions;

export default myTableCardsSlice.reducer;
