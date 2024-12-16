import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from "../config/config";


// vous pensez quoi de l'idée de mettre des codes de message dans les return values
// genre si il y a une erreur parceque l'email est déjà utilisé, je retourne le code 10
// si la fonction a été réussie, je retourne le code 0

// et chaque code sera répertorié dans un fichier de constantes ex: {code: 0, message: 'success'}
// et comme ca quand je retourne la fonction dans le controller je peux faire res.status avec un code et un message)


const internalErrorMessage: string = "Internal server error in : ";

export class UserService {

    public static async registerUser(user: IUser): Promise<{error?: string, success?: string, alreadyExist?: string}>{
        try{
            // vérifier si l'utilisateur existe déjà
            const userInBd: IUser | null = await User.findOne({email: user.email})
            if(userInBd){
                return {alreadyExist: "user already exists"};
            }

            const newUser = new User(user);
            await newUser.save();
            return {success: "user created"};
        }catch(err){
            console.log(err);
            return {error: internalErrorMessage + "registerUser"};
        }
    }

    public static async loginUser(email: string, password:string): Promise<string>{
        
        try{
            const user: IUser | null  = await User.findOne({email: email});
            //if(user && await bcrypt.compare(password, probableUser.password))
            if(!user || user === undefined){
                return "user not found";
            }

            if(await bcrypt.compare(password, user.password)){
                const accessToken: string = jwt.sign({user}, String(config.jwt_secret), {expiresIn: '1d'});
                return accessToken;
            }

            return "wrong password";
        }catch(err){
            console.log(err);
            return internalErrorMessage + "loginUser";
        }
        
    }
}