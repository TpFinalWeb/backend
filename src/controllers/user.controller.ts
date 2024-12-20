import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';
// je suis pas certain, est-ce qu<il faut que je fasse une interface pour le user?
import { User } from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { UserService } from "../services/user.service";

export class UserController {

    public static async registerUser(req: Request, res: Response): Promise<void> {    
        
        // input validation
        if(UserController.isContainingNullOrUndefined(Object.values(req.body))){
            res.status(400).json({message: 'Veuillez remplir tous les champs'});
            logger.info('POST /register - MissingFields');
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;

        if (!emailRegex.test(req.body.email)
            || !passwordRegex.test(req.body.password)) {
            res.status(400).json({message: 'Données invalide'});
            logger.info('POST /register - IncorectFormat');
            return;
        }

        const hashedPasswd = await bcrypt.hash(req.body.password, 10);
        //const user = new User(req.body.email, req.body.username, hashedPasswd);
        const user: IUser = new User({
            role: req.body.role,
            email: req.body.email,
            username: req.body.username,
            password: hashedPasswd
        })

        await UserService.registerUser(user).then(
            (message) => {
                if(message.alreadyExist){
                    res.status(400).json({ error: message.alreadyExist});
                    logger.info('POST /register - UserAlreadyExist');
                }
                else if(message.success){
                    res.status(201).json({ message: message.success});
                    logger.info('POST /register - UserCreated');
                }
                else{
                    res.status(500).json({ error: message.error });
                    logger.error('POST /register - Erreur interne du serveur');
                }
            }
        )
        
    }


    public static async loginUser(req: Request, res: Response): Promise<void> {
        const {email, password} = req.body;
        if(UserController.isContainingNullOrUndefined([email, password])){
            res.status(400).json({message: 'Veuillez remplir tous les champs'});
            logger.info('POST /login - MissingFields');
            return;
        }
        if(!UserController.isEmailFormatGood(email)){
            res.status(400).json({message: 'Adresse courriel invalide'});
            logger.info('POST /login - WrongFormatEmail');
            return;
        }

        await UserService.loginUser(email, password).then(
            (message: string) => {
                switch (message) {
                    case 'user not found':
                    case 'wrong password':
                        res.status(401).json({ message: 'email ou mot de passe incorrect' });
                        logger.info('POST /login - WrongEmailOrPassword');
                        break;
                    case "Internal server error in : loginUser":
                        res.status(500).json({ message: 'Erreur interne du serveur' });
                        logger.error('POST /login - Erreur interne du serveur');
                        break;
                    default:
                        res.status(200).json({ token: message });
                        logger.info('POST /login - UserConnected');
                        break;
                }
            }
        ); 
    }



    public static isContainingNullOrUndefined(listOfItems: any[]): boolean {
        return listOfItems.includes(null) || listOfItems.includes(undefined) || listOfItems.includes("");
    }

    public static isEmailFormatGood(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        return emailRegex.test(email);
    }
}