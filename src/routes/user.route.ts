import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Creates a user
 *     description: Creates a user and sends it to the database
 *     tags: [users]
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
 *       201:
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
userRoutes.post('/register', UserController.registerUser)


userRoutes.post('/login', UserController.loginUser)

export default userRoutes;