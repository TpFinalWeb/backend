import fs from "fs";
import { Game } from '../model/game';
import { GameI } from '../interface/gameInterface';
import { PriceI } from '../interface/priceInterface';
const games: GameI[] = [];
const data = fs.readFileSync("./mockdata.json", "utf-8");
const parsedData: GameI[] = JSON.parse(data);
games.push(...parsedData);

async function getListGameAndId(): Promise<any[]>{
    const access_token = "eyAidHlwIjogIkpXVCIsICJhbGciOiAiRWREU0EiIH0.eyAiaXNzIjogInI6MDAwNl8yNTY2QzMwM183RkU4QyIsICJzdWIiOiAiNzY1NjExOTgyODI4NzEzODciLCAiYXVkIjogWyAid2ViOnN0b3JlIiBdLCAiZXhwIjogMTczMjcxNzQxOCwgIm5iZiI6IDE3MjM5ODkyMzAsICJpYXQiOiAxNzMyNjI5MjMwLCAianRpIjogIjAwMEFfMjU2NkMzMDNfQjRBREIiLCAib2F0IjogMTczMjYyOTIzMCwgInJ0X2V4cCI6IDE3NTA3OTkwMDYsICJwZXIiOiAwLCAiaXBfc3ViamVjdCI6ICIyMDUuMjM3LjIxNS4yNTIiLCAiaXBfY29uZmlybWVyIjogIjIwNS4yMzcuMjE1LjI1MiIgfQ.1VKfLR10MzwDNOVmyNhAdzFL5yElWgFwV8gcEm2dwdXpdet3_jj7lqrk6gWkwjdfN49zjmhLGXg2-VgInuZhAQ";
        const response = await fetch(`https://api.steampowered.com/IStoreService/GetAppList/v1/?access_token=${access_token}&include_games=true&max_results=100`);
        if (!response.ok) {
            throw new Error("La requête a échoué avec le statut " + response.status);
        }
        let jsonResponse = await response.json();
        let returnlist: any[] = jsonResponse.apps;
        return returnlist;
    
}



async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGameFromApiByAppId(appid: number): Promise<any | null> {
    try{

        const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`, {method: 'GET'});
        if (!response.ok) {
            throw new Error("La requête a échoué avec le statut " + response.status);
        }
        return await response.json();
    }catch(error){
        console.error("Failed to fetch app by id", error);
        return null;
    }
}


async function fetchGameDetail(appid: number): Promise<Game | null> {
    try {
        const response = await fetchGameFromApiByAppId(appid);
        
        if (response[appid].success && !response[appid].data.is_free) {
            //Mapdata
            let datamap: any = response[appid].data;
            let category: string[] = datamap.categories.map((cat: any) => cat.description);
            let rating : number = datamap.categories.map((cat: any) => cat.description);
            let price: PriceI[] = [{ date: new Date(), price: datamap.price_overview.final / 100 }];
            let dataresp = new Game(
                datamap.steam_appid,
                datamap.name,
                datamap.short_description,
                datamap.developers,
                datamap.supported_languages.replace(/<[^>]*>?/gm, ''),
                //https://stackoverflow.com/questions/822452/strip-html-tags-from-text-using-plain-javascript
                category,
                datamap.recommendations.total|| 0,
                datamap.header_image,
                price,
                datamap.release_date || ""
            );
            return dataresp;
        } else {
            throw new Error("Failed to get data for appid " + appid);
        }
    } catch (error) {
        console.error(error);
        return null; 
    }
}

async function generatedata() {
    try {
        const response = await getListGameAndId();
        const delayTime = 1500; 
        //steam api rate limit 200 request per 5 minutes and 1.5s per request
        const list = await Promise.all(response.map(async (product: any, index: number) => {
            await delay(delayTime * index); 
            //https://stackoverflow.com/questions/72972814/setting-a-delay-in-fetch-api-call
            return fetchGameDetail(product.appid);
        }));

        fs.writeFile("./mockdata.json", JSON.stringify(list), (error) => {
            if (error) {
                console.error("Failed to write file", error);
            } else {
                console.log("File written successfully");
            }
        });
    } catch (error) {
        console.error("Failed to fetch app list", error);
    }
}

async function updatePrice() {
    try {
        const response = games;
        const delayTime = 1500; 
        const list = await Promise.all(response.map(async (game: any, index: number) => {
            await delay(delayTime * index); 
            return updatePriceOfGame(game.appid, game);
        }));

        fs.writeFile("./mockdata.json", JSON.stringify(list), (error) => {
            if (error) {
                console.error("Failed to write file", error);
            } else {
                console.log("File written successfully");
            }
        });
    } catch (error) {
        console.error("Failed to fetch app list", error);
    }
}

async function updatePriceOfGame(appid: number, game : GameI): Promise<GameI | null> {
    try {
        const response = await fetchGameFromApiByAppId(appid);
        
        if (response[appid].success && !response[appid].data.is_free) {
            game.price.push({ date: new Date(), price: response[appid].data.price_overview.final / 100 });
            return game;
        } else {
            throw new Error("Failed to get data for appid " + appid);
        }
    } catch (error) {
        console.error(error);
        return null; 
    }
}



export default generatedata;