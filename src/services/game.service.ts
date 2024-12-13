import { GameI } from "../interfaces/game.interface";
import { Game } from "../models/game.model";

export class GameService {
    
    public static async getGame(idGame: string): Promise<GameI> {
        try {
            const game = await Game.findById(idGame);

            if (!game) {
                throw new Error('Game not found');
            }

            return game;
        } catch (err) {
            console.error("Error fetching games:", err);
            throw new Error("Error fetching games");
        }
    }

    public static async getAllGames(): Promise<GameI[]> {
        try {
            const games = await Game.find();
            return games;
        } catch (err) {
            console.error("Error fetching games:", err);
            throw new Error("Error fetching games");
        }
    }

    public static async postGame(newGameInfo: GameI): Promise<string> {
        try {
            const newGame = new Game(newGameInfo);
            await newGame.save();
            return "Jeu ajouté";
        } catch (err) {
            console.error("Error adding new game:", err);
            return "Error adding new game";
        }
    }

    public static async putGame(newGameInfo: GameI,id: string): Promise<string> {
        try {
            const editedGame = await Game.findById(id);
    
            if (!editedGame) {
                return 'Game not found';
            }
    
            editedGame.name = newGameInfo.name;
            editedGame.detailed_description = newGameInfo.detailed_description;
            editedGame.num_vote = newGameInfo.num_vote;
            editedGame.score = newGameInfo.score;
            editedGame.sample_cover = newGameInfo.sample_cover;
            editedGame.genres = newGameInfo.genres;
            editedGame.platforms = newGameInfo.platforms;
    
            await editedGame.save();
            return "Jeu modifier";
        } catch (err) {
            console.error("Error updating game:", err);
            return "Error updating game";
        }
    }
    

    public static async deleteGame(idGame: string): Promise<string> {
        try {
            const result = await Game.deleteOne({ _id: idGame });
    
            if (result.deletedCount === 0) {
                return "Game not found or already deleted";
            }
    
            return "Game deleted";
        } catch (err) {
            console.error("Error deleting game:", err);
            return "Error deleting game";
        }
    }
    
    
}
