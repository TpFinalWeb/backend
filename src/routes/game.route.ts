import { Router } from "express";
import { GameController } from "../controllers/game.controller";

const gameRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: games
 *   description: The games managing API
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get all games
 *     description: Fetch all games from the database
 *     tags: [games]
 *     responses:
 *       200:
 *         description: Successfully fetched all games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Error
 *   
 *   post:
 *     summary: Create a new game
 *     description: Add a new game to the database
 *     tags: [games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Successfully created the game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game added
 *       400:
 *         description: Invalid data format or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data format
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Error
 *   
 * /games/{id}:
 *   get:
 *     summary: Get a specific game by ID
 *     description: Fetch a game by its ID from the database
 *     tags: [games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game
 *     responses:
 *       200:
 *         description: Successfully fetched the game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Error
 *   
 *   put:
 *     summary: Update an existing game
 *     description: Update the details of an existing game in the database
 *     tags: [games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Successfully updated the game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game updated successfully
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Error
 *   
 *   delete:
 *     summary: Delete a game
 *     description: Delete a game by its ID from the database
 *     tags: [games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game to delete
 *     responses:
 *       204:
 *         description: Successfully deleted the game
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Error
 *   
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - name
 *         - sample_cover
 *       properties:
 *         name:
 *           type: string
 *         detailed_description:
 *           type: string
 *         num_vote:
 *           type: integer
 *         score:
 *           type: integer
 *         sample_cover:
 *           type: object
 *           required:
 *             - height
 *             - width
 *             - image
 *             - platforms
 *           properties:
 *             height:
 *               type: integer
 *             width:
 *               type: integer
 *             image:
 *               type: string
 *             thumbnail_image:
 *               type: string
 *             platforms:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - platform_name
 *                   - platform_id
 *                   - first_release_date
 *                 properties:
 *                   platform_name:
 *                     type: string
 *                   platform_id:
 *                     type: integer
 *                   first_release_date:
 *                     type: string
 *                     format: date
 *         genres:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               genre_category:
 *                 type: string
 *               genre_category_id:
 *                 type: integer
 *               genre_id:
 *                 type: integer
 *               genre_name:
 *                 type: string
 *         platforms:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - platform_name
 *               - platform_id
 *               - first_release_date
 *             properties:
 *               platform_name:
 *                 type: string
 *               platform_id:
 *                 type: integer
 *               first_release_date:
 *                 type: string
 *                 format: date
 */

gameRoutes.get('/', GameController.getGames);
gameRoutes.get('/:id', GameController.getGame);
gameRoutes.post('/', GameController.postGame);
gameRoutes.put('/:id', GameController.putGame);
gameRoutes.delete('/:id', GameController.deleteGame);

export default gameRoutes;
