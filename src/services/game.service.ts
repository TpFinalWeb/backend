import { GameI } from "../interfaces/game.interface";
import { Game } from "../models/game.model";

export class GameService {
    
    public static async getGame(idGame: Number): Promise<GameI> {
        try {
            const game = await Game.findById({idGame});

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

    public static async postGame(newGameInfo: GameI): Promise<GameI> {
        try {
            const newGame = new Game(newGameInfo);
            const savedGame = await newGame.save();
            return savedGame;
        } catch (err) {
            console.error("Error adding new game:", err);
            throw new Error("Error adding new game");
        }
    }

    public static async putGame(newGameInfo: GameI): Promise<GameI> {
        try {
            const editedGame = await Game.findById(newGameInfo._id);
            
            if (!editedGame) {
                throw new Error('Game not found');
            }
    
            editedGame.name = newGameInfo.name;
            editedGame.detailed_description = newGameInfo.detailed_description;
            editedGame.developers = newGameInfo.developers;
            editedGame.category = newGameInfo.category;
            editedGame.price = newGameInfo.price;
            editedGame.supported_languages = newGameInfo.supported_languages;
            editedGame.popularity_score = newGameInfo.popularity_score;
            editedGame.header_image = newGameInfo.header_image;
            editedGame.release_date = newGameInfo.release_date;
            await editedGame.save();
            
            return editedGame;
        } catch (err) {
            console.error("Error updating game:", err);
            throw new Error("Error updating game");
        }
    }

    public static async deleteGame(idGame: Number): Promise<string> {
        try {
            await Game.deleteOne({ idGame });
            return "game deleted";
        } catch (err) {
            console.error("Error posting new game:", err);
            return err as string;
        }
    }
    
}
