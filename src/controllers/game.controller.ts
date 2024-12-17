import { Request, Response } from "express";
import { logger } from '../utils/logger';
import { GameI } from "../interfaces/game.interface";
import { GameService } from "../services/game.service";

export class GameController {

    public static async getGames(req: Request, res: Response): Promise<void> {  
        try{
            const games = await GameService.getAllGames();
            res.json(games); 
            logger.info('GET /games - getAllGames');
        }
        catch{
            res.status(500).send('Internal server error');
            logger.error('GET /games - Internal server error');
        }
    }

    public static async getGame(req: Request, res: Response): Promise<void> {    
        try{
            const id = req.params.id;
            const game = await GameService.getGame(id);
            res.json(game);
            logger.info('GET /games/:id - getGame');
        }
        catch{
            res.status(404).send('Game not found');; 
            logger.info('GET /games/:id - Game not found');
        }
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
            logger.info('POST /games/ - MissingInfo');
            return;
        }
    
        if (isNaN(num_vote) || num_vote < 0) {
            res.status(400).send('Le nombre de votes doit être un nombre positif');
            logger.info('POST /games/ - WrongFormatVote');
            return;
        }
    
        if (isNaN(score) || score < 0) {
            res.status(400).send('Le score doit être un nombre positif');
            logger.info('POST /games/ - WrongFormatScore');
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
            logger.info('POST /games/ - WrongFormatCover');
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
            logger.info('POST /games/ - WrongFormatGenre');
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
            logger.info('POST /games/ - WrongFormatVote');
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
                        logger.info('POST /games/ - gameAdded');
                        break;
                    default:
                        res.status(500).json({ message: 'Erreur interne du serveur' });
                        logger.error('POST /games/ - Internal server error');
                        break;
                }
            }
        );
    }

    public static async putGame(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
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
            logger.info('PUT /games/:id - MissingInfo');
            return;
        }
    
        if (isNaN(num_vote) || num_vote < 0) {
            res.status(400).send('Le nombre de votes doit être un nombre positif');
            logger.info('PUT /games/:id - WrongFormatVote');
            return;
        }
    
        if (isNaN(score) || score < 0) {
            res.status(400).send('Le score doit être un nombre positif');
            logger.info('PUT /games/:id - WrongFormatScore');
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
            logger.info('PUT /games/:id - WrongFormatCover');
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
            logger.info('PUT /games/:id - WrongFormatGenre');
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
            logger.info('PUT /games/:id - WrongFormatPlatform');
            return;
        }
    
        const updatedGameInfo: GameI = {
            name,
            detailed_description,
            num_vote,
            score,
            sample_cover,
            genres,
            platforms,
        };
    
        await GameService.putGame(updatedGameInfo, id).then(
            (message) => {
                switch (message) {
                    case 'Game not found':
                        res.status(404).json({ message: 'Jeu non trouvé' });
                        logger.info('PUT /games/:id - GameNotFound');
                        break;
                    case 'Jeu modifier':
                        res.status(200).json({ message: 'Jeu modifié avec succès' });
                        logger.info('PUT /games/:id - GameModified');
                        break;
                    default:
                        res.status(500).json({ message: 'Erreur interne du serveur' });
                        logger.error('PUT /games/:id:id - Erreur interne du serveur');
                        break;
                }
            }
        );
    }

    public static async deleteGame(req: Request, res: Response): Promise<void> {    
        const id = req.params.id;
    
        await GameService.deleteGame(id).then((message) => {
            switch (message) {
                case 'Game not found':
                    res.status(404).json({ message: 'Jeu non trouvé' });
                    logger.info('DELETE /games/:id - GameModified');
                    break;
                case 'Game deleted':
                    res.status(204).json({ message: 'Jeu supprimé avec succès' });
                    logger.info('DELETE /games/:id - GameDeleted');
                    break;
                default:
                    res.status(500).json({ message: 'Erreur interne du serveur' });
                    logger.error('DELETE /games/:id - Erreur interne du serveur');
                    break;
            }
        })
    }
    
}
