"use strict";
exports.__esModule = true;
exports.compareCardRanks = exports.suits = exports.values = exports.deckBuilder = exports.dealCards = exports.numToLetter = void 0;
function numToLetter(num) {
    if (num === 1) {
        return "one";
    }
    else if (num === 2) {
        return "two";
    }
    else if (num === 3) {
        return "three";
    }
    else if (num === 4) {
        return "four";
    }
    return "";
}
exports.numToLetter = numToLetter;
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k",];
exports.values = values;
var suits = ["hearts", "diams", "spades", "clubs"];
exports.suits = suits;
function shuffleDeck(deck) {
    var _a;
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [deck[j], deck[i]], deck[i] = _a[0], deck[j] = _a[1];
    }
}
function deckBuilder(values, suits) {
    var cards = [];
    for (var s = 0; s < suits.length; s++) {
        for (var v = 0; v < values.length; v++) {
            var value = values[v];
            var suit = suits[s];
            var card_1 = { rank: value, suit: suit, back: false };
            cards.push(card_1);
        }
    }
    shuffleDeck(cards);
    return cards;
}
exports.deckBuilder = deckBuilder;
var deck = deckBuilder(values, suits);
function dealCards(player, deck) {
    for (var i = 0; i < 9; i++) {
        var card_2 = deck.pop();
        if (card_2 === undefined || card_2 === null) {
            console.log("card is undefined");
        }
        if (i >= 6) {
            player.handCards.push(card_2);
            continue;
        }
        if (i % 2 === 0) {
            card_2.back = true;
        }
        player.cards.push(card_2);
    }
}
exports.dealCards = dealCards;
function compareCardRanks(rank1, rank2, tableCards) {
    var order = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
    var rank1Index = order.indexOf(rank1);
    var rank2Index = order.indexOf(rank2);
    console.log("rank", rank2, "index", rank2Index);
    console.log("rank", rank1, "index", rank1Index);
    if (rank2Index === 7) { // 8 card condition
        if (tableCards.length >= 2) {
            rank2Index = order.indexOf(tableCards[tableCards.length - 2].rank);
        }
    }
    if (rank2Index === 6) { // 7 card condition
        return rank1Index <= rank2Index;
    }
    if (rank2Index === 1) {
        return true;
    }
    if (rank1Index === 1 || rank1Index === 6 || rank1Index === 7 || rank1Index === 9) {
        return true;
    }
    return rank1Index >= rank2Index;
}
exports.compareCardRanks = compareCardRanks;
var player = { name: "moiz", tag: "23", cards: [], handCards: [{ rank: "7", suit: "diams" },
        { rank: "q", suit: "hearts" },
        { rank: "k", suit: "spades" },] };
var card = { rank: "k", suit: "hearts" };
var cardIndex = player.handCards.findIndex(function (c) { return c.rank === card.rank && c.suit === card.suit; });
if (cardIndex !== -1) {
    var cardToPlay = player.handCards.splice(cardIndex, 1)[0];
    cardToPlay.back = false;
    console.log(cardToPlay);
}
else {
    console.log("card not found");
}
// dealCards(playerToAdd,deck)
// console.log(playerToAdd)
// console.log(deck.length)
console.log(compareCardRanks("9", '8', [{ rank: "7", suit: "hearts" }, { rank: "8", suit: "hearts" }]));
