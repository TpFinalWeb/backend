import fs from "fs";
import { Game } from '../models/game';
import { GameI } from '../interfaces/game.interface';
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import { config } from "../config/config";
import { GameService } from "./game.service";


const games: GameI[] = [];


const url :string = config.mongo_uri||"";
const dbName : string = "test";

async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function fetchGameDetail(arg0: number): Promise<GameI[]> {
    const response = await fetch(`https://api.mobygames.com/v1/games?limit=100&api_key=moby_HBxa5enVtuiho2QA4dUqi6dsFNy&format=normal&offset=${50000+arg0*100}`);
    
    if(response.status !== 200) {
        console.log("Failed to fetch data from batch: ", arg0);
        return [];
    }
    console.log("fetching data from batch: ", arg0);
    let data = await response.json();
    const res: GameI[] = [];
    data = data.games;
    if (!data) {
        console.log("No data found");
        return res;
    }
    for (let ii = 0; ii < data.length; ii++) {
        let game = new Game(
            data[ii].title,
            data[ii].description? data[ii].description.replaceAll("<[^>]*>", ""): "No description",
            data[ii].num_votes,
            data[ii].moby_score || 0,
            data[ii].sample_cover,
            data[ii].genres,
            data[ii].platforms // Adding the missing argument
        );
        
        const postGameResponse = await GameService.postGame(game);
        console.log(postGameResponse + " " + game.name);
    }
    
    return res;
}



async function generatedata() {
    try {
        const delayTime = 1000; 
        //steam api rate limit 200 request per 5 minutes and 1.5s per request
        for(let i = 0; i < 3000; i++) {
            await delay(delayTime);
            await fetchGameDetail(i);
        }

       
    } catch (error) {
        console.error("Failed to fetch app list", error);
    }
}

  
export default generatedata;