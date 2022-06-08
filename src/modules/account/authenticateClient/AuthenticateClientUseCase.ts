import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAuthenticateClient {
    username: string;
    password: string;
}

export class AuthenticateClientUseCase {
    async execute({ username, password }: IAuthenticateClient){
        // Receber username, password

        // Verificar se username cadastrado
        const client = await prisma.clients.findFirst({
            where: {
                username
            }
        });

        if(!client){
            throw new Error("Username or password invalid!");
        }

        // Verificar se senha corresponde ao username
        const passwordMatch = await compare(password, client.password)

        if(!passwordMatch){
            throw new Error("Username or password invalid!");
        }

        // Gerar o token
        const token = sign({username}, "46747f884706983c199e6f0de2fc0f44", {
            subject: client.id,
            expiresIn: "1d"
        });

        return token;
    }
}