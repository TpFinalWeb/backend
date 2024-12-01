import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";


// vous pensez quoi de l'idée de mettre des codes de message dans les return values
// genre si il y a une erreur parceque l'email est déjà utilisé, je retourne le code 10
// si la fonction a été réussie, je retourne le code 0

// et chaque code sera répertorié dans un fichier de constantes ex: {code: 0, message: 'success'}
// et comme ca quand je retourne la fonction dans le controller je peux faire res.status avec un code et un message)

export class UserService {
    
    public static async registerUser(user: IUser): Promise<string>{
        try{
            
            // vérifier si l'utilisateur existe déjà
            const userInBd = await User.findOne({email: user.email})
            if(userInBd){
                return "user already exists";
            }

            const newUser = new User(user);
            await newUser.save();
            return "user created";
        }catch(err){
            console.log(err);
            return err as string;
        }
    }
}