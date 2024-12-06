import { Request, Response } from "express";
import { Game } from "../models/game";
import { GameI } from "../interfaces/game.interface";
import { GameService } from "../services/game.service";

export class GameController {

    public static async getGames(req: Request, res: Response): Promise<void> {    
        
        const games = await GameService.getAllGames();
        res.status(200).json(games);
        
    }

    public static async getGame(req: Request, res: Response): Promise<void> {    
        const id = parseInt(req.params.id);
        const products = await GameService.getGame(id);
        res.status(200).json(products);
    }

    public static async postGame(req: Request, res: Response): Promise<void> {
        const { 
            name, 
            price, 
            detailed_description, 
            developers, 
            category, 
            supported_languages, 
            popularity_score, 
            header_image, 
            release_date 
        } = req.body;

        if (
            name === undefined ||
            price === undefined ||
            detailed_description === undefined ||
            developers === undefined ||
            category === undefined ||
            supported_languages === undefined ||
            popularity_score === undefined ||
            header_image === undefined ||
            release_date === undefined
        ) {
            res.status(400).send('Valeurs manquantes');
            return;
        }

        if (!Array.isArray(price) || price.some(p => p.price === undefined || p.date === undefined)) {
            res.status(400).send('Le prix doit être un tableau d\'objets avec un prix et une date');
            return;
        }

        const priceRegex = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;
        const priceIsValid = price.every(p => priceRegex.test(p.price.toString()));
        if (!priceIsValid) {
            res.status(400).send('Le prix doit être un nombre positif');
            return;
        }

        const titleRegex = /^.{3,50}$/;
        if (!titleRegex.test(name)) {
            res.status(400).send('Le titre doit contenir entre 3 et 50 caractères');
            return;
        }

        if (isNaN(popularity_score) || popularity_score < 0) {
            res.status(400).send('Le score de popularité doit être un nombre positif');
            return;
        }

        if (!Array.isArray(developers) || developers.some(dev => typeof dev !== 'string')) {
            res.status(400).send('Les développeurs doivent être un tableau de chaînes de caractères');
            return;
        }

        if (!Array.isArray(category) || category.some(cat => typeof cat !== 'string')) {
            res.status(400).send('La catégorie doit être un tableau de chaînes de caractères');
            return;
        }


        const game = new Game(
            0,
            name,
            detailed_description,
            developers,
            supported_languages,
            category,
            popularity_score,
            header_image,
            price,
            release_date
        );
        
        try {
            const savedGame = await GameService.postGame(game);
            res.status(200).json(savedGame);
        } catch (error) {
            res.status(500).send('Erreur interne du serveur');
        }
    }

    public static async putGame(req: Request, res: Response): Promise<void> {    
        const id = parseInt(req.params.id);
        const products = await GameService.getGame(id);
        res.status(200).json(products);
    }

    public static async deleteGame(req: Request, res: Response): Promise<void> {    
        const id = parseInt(req.params.id);
        await GameService.deleteGame(id).then(
            mesage => {
                switch (mesage) {
                    case 'game already exists':
                        res.status(400).json({ message: 'Jeu existe déjà' });
                        break;
                    case 'user created':
                        res.status(204).json({ message: 'Jeu enregistré avec succès' });
                        break;
                    default:
                        res.status(500).json({ message: 'Erreur interne du serveur' });
                        break;
                }
            }
        )
    }

}
