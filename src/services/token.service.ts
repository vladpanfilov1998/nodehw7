import jwt from 'jsonwebtoken';

import {config} from '../config';
import {IToken} from '../entity';
import {tokenRepository} from '../repositories';
import {ITokenPair, IUserPayload} from '../interfaces';

class TokenService {
    public async generateTokenPair(payload: IUserPayload): Promise<ITokenPair> {
        const accessToken = jwt.sign(
            payload,
            config.SECRET_ACCESS_KEY as string,
            {expiresIn: config.EXPIRES_IN_ACCESS},
        );
        const refreshToken = jwt.sign(
            payload,
            config.SECRET_REFRESH_KEY as string,
            {expiresIn: config.EXPIRES_IN_REFRESH},
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    public async saveToken(userId: number, refreshToken: string): Promise<IToken> {
        const tokenFromDb = await tokenRepository.findTokenByUserId(userId);
        if (tokenFromDb) {
            tokenFromDb.refreshToken = refreshToken;
            return tokenRepository.createToken(tokenFromDb);
        }

        return tokenRepository.createToken({refreshToken, userId});
    }

    public async deleteUserTokenPair(userId: number) {
        return tokenRepository.deleteByParams({userId});
    }

    public async verifyToken(authToken: string, tokenType = 'access'): Promise<IUserPayload> {
        let secretWord = config.SECRET_ACCESS_KEY;

        if (tokenType === 'refresh') {
            secretWord = config.SECRET_REFRESH_KEY;
        }

        return jwt.verify(authToken, secretWord as string) as IUserPayload;
    }
}

export const tokenService = new TokenService();