import { Request, Response } from "express";
import { Game } from "../models/game";
import { GameI } from "../interfaces/game.interface";
import { GameService } from "../services/game.service";

export class GameController {

    public static async getGames(req: Request, res: Response): Promise<void> {    
        const games = await GameService.getAllGames();
        res.json(games); 
    }

    public static async getGame(req: Request, res: Response): Promise<void> {    
        const id = req.params.id;
        const game = await GameService.getGame(id);
        res.json(game);
    }

    public static async postGame(req: Request, res: Response): Promise<void> {
        const {
            name,
            detailed_description,
            num_vote = 0,
            score = 0,
            sample_cover = {
                height: 0,
                width: 0,
                image: '',
                thumbnail_image: '',
                platforms: []
            },
            genres = [],
            platforms = []
        } = req.body;
    
        if (!name || !detailed_description) {
            res.status(400).send('Nom et description détaillée sont obligatoires');
            return;
        }
    
        if (isNaN(num_vote) || num_vote < 0) {
            res.status(400).send('Le nombre de votes doit être un nombre positif');
            return;
        }
    
        if (isNaN(score) || score < 0) {
            res.status(400).send('Le score doit être un nombre positif');
            return;
        }
    
        if (
            typeof sample_cover.height !== 'number' ||
            typeof sample_cover.width !== 'number' ||
            typeof sample_cover.image !== 'string' ||
            typeof sample_cover.thumbnail_image !== 'string' ||
            !Array.isArray(sample_cover.platforms)
        ) {
            res.status(400).send('La couverture doit contenir les champs requis avec des types valides');
            return;
        }
    
        if (
            !Array.isArray(genres) ||
            genres.some(genre => 
                !genre.genre_category ||
                typeof genre.genre_category !== 'string' ||
                typeof genre.genre_category_id !== 'number' ||
                typeof genre.genre_id !== 'number' ||
                typeof genre.genre_name !== 'string'
            )
        ) {
            res.status(400).send('Les genres doivent être un tableau avec des champs valides');
            return;
        }
    
        if (
            !Array.isArray(platforms) ||
            platforms.some(platform =>
                typeof platform.first_release_date !== 'string' ||
                typeof platform.platform_id !== 'number' ||
                typeof platform.platform_name !== 'string'
            )
        ) {
            res.status(400).send('Les plateformes doivent être un tableau avec des champs valides');
            return;
        }
    
        const game: GameI = {
            name,
            detailed_description,
            num_vote,
            score,
            sample_cover,
            genres,
            platforms,
        };
    
        await GameService.postGame(game).then(
            message => {
                switch (message) {
                    case 'Jeu ajouté':
                        res.status(201).json({ message: 'Jeu ajouté' });
                        break;
                    default:
                        res.status(500).json({ message: 'Erreur interne du serveur' });
                        break;
                }
            }
        );
    }

    public static async putGame(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const newGameInfo = req.body;
    
        await GameService.putGame(newGameInfo, id).then(
            (message) => {
                switch (message) {
                    case 'Game not found':
                        res.status(404).json({ message: 'Jeu non trouvé' });
                        break;
                    case 'Jeu modifier':
                        res.status(200).json({ message: 'Jeu modifié avec succès' });
                        break;
                    default:
                        res.status(500).json({ message: 'Erreur interne du serveur' });
                        break;
                }
            }
        )
    }
    

    public static async deleteGame(req: Request, res: Response): Promise<void> {    
        const id = req.params.id;
    
        await GameService.deleteGame(id).then((message) => {
            switch (message) {
                case 'Game not found':
                    res.status(404).json({ message: 'Jeu non trouvé' });
                    break;
                case 'Game deleted':
                    res.status(204).json({ message: 'Jeu supprimé avec succès' });
                    break;
                default:
                    res.status(500).json({ message: 'Erreur interne du serveur' });
                    break;
            }
        })
    }
    
}
