import * as jwt from 'jsonwebtoken';
import * as jwtAuth from '../auth/jwtAuth'; 
import { NextFunction } from 'express';

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe('JWT auth', () => {
    const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;
    
    it('should validate token', () => {
        jest.spyOn(jwt, 'verify').mockReturnValue();
        jwtAuth.jwtAuth('valid', res, next);
        expect(jwt.verify).toHaveBeenCalledWith('valid', '3R#q!ZuFb2sPn8yT^@5vLmN7jA*C6hG');
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should block invalid token', () => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('Mock Error');
        });
        jwtAuth.jwtAuth('invalid', res, next);
        expect(jwt.verify).toHaveBeenCalledWith('invalid', '3R#q!ZuFb2sPn8yT^@5vLmN7jA*C6hG');
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should call jwtAuth for get and delete requests', () => {
            const req = {
                query: 'token'
            };
            jwtAuth.query(req, res, next);
            expect(next).toHaveBeenCalled();
    });

    it('should call jwtAuth for post and put requests', () => {
        const req = {
            body: 'token'
        };
        jwtAuth.body(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});