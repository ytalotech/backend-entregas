import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticateDeliveryman(request: Request, response: Response, next: NextFunction){
    //NextFunction caso esteja autenticado para passar para o proximo passo
    const authHeader = request.headers.authorization;

    if(!authHeader){
        return response.status(401).json({
            message: "Token missing",
        });
    }

    // Estou definindo um nome para minah segunda posição [, token] do array que se formou ao usar split
    const [, token] = authHeader.split(" ");

    try {
        
        const { sub } = verify(token, "46747f884706983c177e6f0de2fc0f44") as IPayload;

        request.id_deliveryman = sub;

        return next();
    } catch (err) {
        return response.status(401).json({
            message: "Invalid Token!",
        });
    }
}