function numToLetter(num: number): string {
  if (num === 1) {
    return "one";
  }else if (num === 2) {
    return "two";}
    else if (num === 3) {
    return "three";}
    else if (num === 4){
        return "four"
    }
    return ""
}

const values = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", ];
const suits = ["hearts", "diams", "spades", "clubs"];
type Card = {
    rank: string;
    suit: string;
    back?: boolean;
  };

  function shuffleDeck(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

function deckBuilder (values:string[], suits:string[]) {
const cards:Card[] = [];
for (let s = 0; s < suits.length; s++) {
  for (let v = 0; v < values.length; v++) {
    const value = values[v];
    const suit = suits[s];
    const card: Card = { rank: value, suit: suit, back: false }
    cards.push(card);
  }
}

shuffleDeck(cards)
return cards ;
}



const deck:Card[] = deckBuilder(values, suits);

  type Player = {
    name: string;
    tag: string;
    cards: Card[];
    handCards: Card[];
  };

function dealCards(player:Player, deck:Card[]){

    for (let i:number = 0; i < 9; i++) {
        let card: any = deck.pop();
        if (card === undefined || card === null) {
            console.log("card is undefined");
        }

        if (i>=6){
            player.handCards.push(card);
            continue
        }

        if (i%2 === 0) {
            card.back = true;
        }

        player.cards.push(card);
      }
}

function compareCardRanks(rank1: string, rank2: string,tableCards:Card[]): boolean {
    const order = ["A","2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
  
    const rank1Index = order.indexOf(rank1);
    let rank2Index = order.indexOf(rank2);
    console.log("rank",rank2, "index",rank2Index)
    console.log("rank",rank1, "index",rank1Index)

    if (rank2Index === 7){  // 8 card condition
        if (tableCards.length >=2){
            rank2Index = order.indexOf(tableCards[tableCards.length-2].rank)
        }
    } 

    if (rank2Index === 6){ // 7 card condition
       return rank1Index <= rank2Index
    }

    if (rank2Index === 1){
    
        return true
    }

    if (rank1Index === 1 || rank1Index === 6 || rank1Index === 7 || rank1Index === 9){
        return true
    }
  
    return rank1Index >= rank2Index;
  }
  

let player:Player = { name: "moiz", tag: "23", cards: [], handCards: [ { rank: "7", suit: "diams" },
  { rank: "q", suit: "hearts" },
   { rank: "k", suit: "spades" },] };
let card:Card = { rank: "k", suit: "hearts" }
   let cardIndex = player.handCards.findIndex((c:Card)=> c.rank === card.rank && c.suit === card.suit)
   if (cardIndex !== -1) {
       let cardToPlay = player.handCards.splice(cardIndex,1)[0]
      cardToPlay.back = false
       console.log(cardToPlay)
   }else{
         console.log("card not found")
   }

// dealCards(playerToAdd,deck)
// console.log(playerToAdd)
// console.log(deck.length)

console.log(compareCardRanks("9",'8',[{ rank: "7", suit: "hearts" }, {rank: "8", suit: "hearts" }]))

export { numToLetter,dealCards, deckBuilder, values, suits, compareCardRanks};