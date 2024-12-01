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
            mesage => {
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
    }



    public static isContainingNullOrUndefined(listOfItems: any[]): boolean {
        return listOfItems.includes(null) || listOfItems.includes(undefined);
    }
}