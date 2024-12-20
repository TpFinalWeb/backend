import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authentificateToken, authorizeRole} from "../middlewares/user.middleware"

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


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in a user
 *     description: Authenticates a user and returns a token
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: testJohnny@gmail.com
 *               password:
 *                 type: string
 *                 example: ILoveYouGilFromSusan&Mary
 *     responses:
 *       200:
 *         description: User authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
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
userRoutes.post('/login', UserController.loginUser)

export default userRoutes;