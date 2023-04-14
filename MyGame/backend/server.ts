import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from 'path';
import { numToLetter,dealCards,deckBuilder,values,suits, compareCardRanks } from "./utils";

 
const app = express();
app.use(cors())
const server = http.createServer(app)
const io = new Server( 
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})


let connectedUsers = 0;
type Card = {
    rank: string;
    suit: string;
    back?: boolean;
  };
  
  type Player = {
    name: string;
    tag: string;
    cards: Card[];
    handCards: Card[];
  };

  const deck:Card[] = deckBuilder(values, suits);
  let tableCards:Card[] = []

  const players: Map<string, Player> = new Map([]);
  let turn:number = 0;

function increaseTurn(validTurn:boolean, socket1:any){
    console.log("increase turn callled")
    if (validTurn){
        turn = (turn+1)%players.size
        io.emit("setTurn",`${Array. from (players.values())[turn].name}`)
    }
    else{
       // console.log("skipped turn")
        console.log("turn before skip: ", turn)
        turn = (turn+1)%players.size
        let all_cards = tableCards
        let player = players.get(socket1) as Player
        player.handCards.push(...all_cards)
        tableCards = []
        io.emit("mainCards",{data: "reset"}) //table deck reset
        io.emit('gameStarted', {data:Array. from (players.values())}); //update player hand cards
        io.emit("message",`${Array. from (players.values())[(((turn-1)+4))%4].name} your turn is skipped since you had no valid card`)


       // turn = (turn+1)%players.size
        io.emit("setTurn",`${Array. from (players.values())[turn].name}`) //set next turn
        io.emit("message",`${Array. from (players.values())[turn].name} it's your turn`)
        
    }
}

// app.use(express.static(path.resolve(__dirname, '..', 'build')));

// app.get('/', (req:any, res:any) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//   });

server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
    console.log(__dirname)
})
io.on("connection",(socket:any)=>{
    console.log("user connected with a socket id", socket.id)
    socket.on("join",(data:any)=>{
        //remove card from deck add it to main table deck 
           

        connectedUsers++
        console.log("user joined with name: ", data.message)
        const tag = numToLetter(connectedUsers)

        let playerToAdd:Player = { name: data.message, tag: `player-${tag}`, cards: [], handCards: [] };
        dealCards(playerToAdd,deck)
        players.set(socket.id, playerToAdd);
        socket.emit("setMyTableCards", {data: playerToAdd.cards});

        
            console.log("connectedUsers: ", connectedUsers)
            // if (connectedUsers <=2) {
            // io.emit('playerJoined', {data: connectedUsers});
            // }
            io.emit('playerJoined', {data: connectedUsers});
            if (connectedUsers == 2) {
                tableCards.push(deck.pop() as Card)
                io.emit('gameStarted', {data:Array. from (players.values())});
                io.emit("message",`${Array. from (players.values())[turn].name} it's your turn`)
                io.emit("mainCards",{data: tableCards[tableCards.length-1]})
                io.emit("setTurn",`${Array. from (players.values())[turn].name}`)
                //console.log(tableCards[tableCards.length-1])
            }
            // if (connectedUsers > 2) {
            //  let   arr = Array. from (players.values())
            //         arr[0].handCards.push(deck.pop() as Card)
            //     io.emit('gameStarted', {data:Array. from (players.values())});
             
            // }
        
    
    })

    socket.on("playCard",(card:any)=>{
       // console.log("rank", card.rank,JSON.stringify(tableCards[tableCards.length-1].rank))
        let player = players.get(socket.id)

        if (player) {
           // console.log (compareCardRanks(card.rank,tableCards[tableCards.length-1].rank))
            if (tableCards.length === 0 || (compareCardRanks(card.rank,tableCards[tableCards.length-1].rank,tableCards))){  // allow turn when table = 0 or when card is higher than last card
                let cardIndex = player.handCards.findIndex((c:Card)=> c.rank === card.rank && c.suit === card.suit)
                if (cardIndex !== -1) {
                        let cardToPlay = player.handCards.splice(cardIndex,1)[0]
                        cardToPlay.back = false
                        if (deck.length > 0) {
                            player.handCards.push(deck.pop() as Card)
                        }
                        if (cardToPlay.rank === "2") {
                            tableCards.push(cardToPlay)
                            io.emit('gameStarted', {data:Array. from (players.values())});
                            io.emit("mainCards",{data: tableCards[tableCards.length-1]})
                            io.emit("message",`${player.name} played ${cardToPlay.rank} of ${cardToPlay.suit}`)
                            io.emit("message",`${player.name} It's your turn again`)
                            return
                        }
                        if (cardToPlay.rank === "10") {
                            tableCards = [] 
                            io.emit("mainCards",{data: "reset"}) //table deck reset
                            io.emit('gameStarted', {data:Array. from (players.values())});
                            io.emit("message",`${player.name} played ${cardToPlay.rank} of ${cardToPlay.suit}. Deck BURNED!`)
                            
                            turn = (turn+1)%players.size
                            io.emit("setTurn",`${Array. from (players.values())[turn].name}`) //set next turn
                            io.emit("message",`${Array. from (players.values())[turn].name} it's your turn`)
                            return
                        }
                        tableCards.push(cardToPlay)
                        io.emit('gameStarted', {data:Array. from (players.values())});
                        io.emit("mainCards",{data: tableCards[tableCards.length-1]})
                        io.emit("message",`${player.name} played ${cardToPlay.rank} of ${cardToPlay.suit}`)
                        //increaseTurn()
                        turn = (turn+1)%players.size
                        io.emit("setTurn",`${Array. from (players.values())[turn].name}`)
                        io.emit("message",`${Array. from (players.values())[turn].name} it's your turn`)
                        return
                    }
                    //bs idher check kero if card is not in 
                    // if table card is valid add to table else add tht table card to player hand along with rest of table cards
                    // check if card is in face up  table cards
               
                //io.emit("setMyTableCards", {data: player.cards});
               // io.emit("setMyHandCards", {data: player.handCards});
            } 
            if (card.type === "face-up"){}
            
            io.emit("message",`${player.name} you can't play this card`)

        }
    })

    //i think if card is not in hand then take action when player chooses the card instead of verifying

    socket.on("verifyTurn",(data:any)=>{  //check if handCards are not empty,
        let socket = data.id                // if yes then choose from cards which have back set to false
        let player = players.get(socket)    // else use cards which have back set to true
        if (player) {
            console.log("verify turn",players.get(data.id)?.name)
            let cards = player.handCards
            console.log("table cards", tableCards)
            if (tableCards.length > 0) {
                let lastCard = tableCards[tableCards.length-1]
                console.log(cards)
                for (let i of cards){
                    //console.log("i.rank",i.rank,"lastCard.rank",lastCard.rank)
                    if (compareCardRanks(i.rank,lastCard.rank,tableCards)){
                        //increaseTurn(true,socket) //if player has valid card let him choose and then increase turn
                        return
                    }
                }
                //io.emit("setTurn",`${Array. from (players.values())[0].name}`)
                console.log("skipping turn of",players.get(data.id)?.name)
                increaseTurn(false,socket)// tell increase turn function from where to
                
            }
            // increaseTurn(false,socket)
            //increaseTurn(true,socket)
        }
       
    })
 
})


//verifying if player has a valid card if not skip his turn through increaseTurn function else manually increase turn when he chooses a card in choose card function