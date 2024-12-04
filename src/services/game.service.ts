import { GameI } from "../interfaces/game.Interface";
import { Game } from "../models/game.model";

export class UserService {
    
    public static async getAllGames(): Promise<GameI[]> {
        try {
            const games = await Game.find();
            return games;
        } catch (err) {
            console.error("Error fetching games:", err);
            throw new Error("Error fetching games");
        }
    }
}
