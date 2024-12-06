import { Router } from "express";
import { GameController } from "../controllers/game.controller";

const gameRoutes = Router();

/**
 * @swagger
 * /:
 *   post:
 *     summary: Get all games
 *     description: Fetch all games from database
 *     tags: [games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: gestionnaire
 *               email:
 *                 type: string
 *                 example: testJohnny@gmail.com
 *               username:
 *                 type: string
 *                 example: Johnny test
 *               password:
 *                 type: string
 *                 example: ILoveYouGilFromSusan&Mary
 *     responses:
 *       200:
 *         description: user created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created
 *       400:
 *         description: Error in product validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wrong Data format
 *       500:
 *         description: Internal Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Error
 */
gameRoutes.get('/', GameController.getGames)
gameRoutes.get('/:id', GameController.getGame)
gameRoutes.post('/', GameController.postGame)
gameRoutes.put('/:id', GameController.putGame)
gameRoutes.delete('/:id', GameController.deleteGame)

export default gameRoutes;