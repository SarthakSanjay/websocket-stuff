import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface CustomRequest extends Request {
    user?: {
        id: number;
        email: string;
        username: string;
    };
}

export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ msg: "Not authorized" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as Secret) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: {
                email: decoded.email
            }
        });

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        req.user = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        next();
    } catch (error: any) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ msg: 'Authentication failed' });
    }
};
