import { Request, Response } from "express";
import bcrypt from 'bcryptjs';

// je suis pas certain, est-ce qu<il faut que je fasse une interface pour le user?
import { User } from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { UserService } from "../services/user.service";

export class UserController {

    public static async registerUser(req: Request, res: Response): Promise<void> {    
        
        // input validation
        if(UserController.isContainingNullOrUndefined(Object.values(req.body))){
            res.status(400).json({message: 'Veuillez remplir tous les champs'});
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;

        if (!emailRegex.test(req.body.email)
            || !passwordRegex.test(req.body.password)) {
            res.status(400).json({message: 'Données invalide'});
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
            (mesage: string) => {
                switch (mesage) {
                    case 'user already exists':
                        res.status(400).json({ message: 'Utilisateur existe déjà' });
                        break;
                    case 'user created':
                        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
                        break;
                    default:
                        res.status(500).json({ message: 'Erreur interne du serveur' });
                        break;
                }
            }
        )
        
    }


    public static async loginUser(req: Request, res: Response): Promise<void> {
        const {email, password} = req.body;
        if(UserController.isContainingNullOrUndefined([email, password])){
            res.status(400).json({message: 'Veuillez remplir tous les champs'});
            return;
        }
        if(!UserController.isEmailFormatGood(email)){
            res.status(400).json({message: 'Adresse courriel invalide'});
            return;
        }

        await UserService.loginUser(email, password).then(
            (message: string) => {
                switch (message) {
                    case 'user not found':
                    case 'wrong password':
                        res.status(401).json({ message: 'email ou mot de passe incorrect' });
                        break;
                    case "Internal server error in : loginUser":
                        res.status(500).json({ message: 'Erreur interne du serveur' });
                        break;
                    default:
                        res.status(200).json({ token: message });
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



    public static async Testies(req: Request, res: Response): Promise<void> {
        res.send('testies are workindawawdadwawdawdg fine');
    }
}