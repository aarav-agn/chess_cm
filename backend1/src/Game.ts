import { WebSocket, WebSocketServer } from "ws";
import { Chess, WHITE } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game {

    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private moveCount = 0; 

    constructor (player1: WebSocket, player2: WebSocket) {
        this.player1= player1;
        this.player2= player2;
        this.board= new Chess();
        this.startTime= new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to:string;
    }) {
        //validate the type of move using zod
        if(this.moveCount % 2 === 0 && socket !== this.player1){
            console.log("early retrun 1")
            return
        }
        if(this.moveCount% 2 === 0 && socket !== this.player1){
            console.log("early return 2");
            return;           
        }
        console.log("did not early return");

        try{
            this.board.move(move); 
        }catch(e) {
            console.log(e);
            return;
        }
        console.log("move succeeded");

        //check if the game is over
        if(this.board.isGameOver()) {

            this.player1.emit(JSON.stringify ({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() == "w" ? "black" : "white"
                }

            }))
            this.player2.emit(JSON.stringify ({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() == "w" ? "black" : "white"
                }

            }))
            return;
        }
        console.log(this.board.moves().length % 2 === 0)
        if(this.board.moves().length % 2 === 0){
            console.log("sent1")  
            this.player2.send(JSON.stringify ({
                type: MOVE,
                payload: move
            }))
        } else {
            console.log("sent2") 
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        this.moveCount++;
    } 
    
}