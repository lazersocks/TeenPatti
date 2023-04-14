import { configureStore } from "@reduxjs/toolkit";
import connectReducer from "./connectedSlice";
import handCardsReducer from "./handCardsSlice";
import myTableCardsReducer from "./myTableCardsSlice";
import turnReducer from "./currenTurnSlice";
import mainCardReducer from "./mainCardsSlice";

export const reduxStore = configureStore({
  reducer: {
    count: connectReducer,
    handCards: handCardsReducer,
    myTableCards: myTableCardsReducer,
    currentTurn: turnReducer,
    mainCards: mainCardReducer,
  },
});
