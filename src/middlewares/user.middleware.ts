import { config } from '../config/config';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


export function authentificateToken(req: Request, res: Response, next: NextFunction){
    try{
        const token = req.header('Authorization')?.split(' ')[1];
        if(!token){
            res.status(401).json({message: "no token detected"});
            return;
        }

        const decoded = jwt.verify(token, config.jwt_secret!) as JwtPayload;
        req.body.role = decoded.user.role;
        next();
    }catch(error){
        res.status(401).json({message: "token invalidfese", error: error})
    }
}

export function authorizeRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.body.role;
        if(!roles.includes(userRole)){
            res.status(403).json({message: 'Accès interdit.'});
            return;
        }
        console.log(userRole)
        console.log(req.body)
        next();
    };
}