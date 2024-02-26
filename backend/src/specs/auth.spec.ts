import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as jwt from 'jsonwebtoken';
import * as auth from '../controllers/auth.controller';
import * as admin from 'firebase-admin';

jest.mock('../services/auth.service');
jest.mock('jsonwebtoken');
jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    firestore: jest.fn(),
}));
const db = admin.firestore();
const user = {
    username: "owner",
    fullName: "Mock Owner",
    initials: "MO",
    color: "#FFFFFF",
    language: "en",
    project: "MockProject",
    permission: "OWNER",
    profilePicture: "",
    notificationsEnabled: true,
    isLoggedIn: true,
    stats: {
        created: 91,
        imported: 10,
        updated: 45,
        edited: 78,
        trashed: 32,
        restored: 57,
        deleted: 23,
        cleared: 69
    }
}

describe('auth controller', () => {
    const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('verify', () => {
        const req = {
            query: {
                token: 'owner',
            },
        } as unknown as Request;

        it('should verify successfully with a valid token', async () => {            
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            authService.singleUser.mockResolvedValue(user);
            await auth.verify(req, res, next);
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(res.json).toHaveBeenCalledWith(user);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
          it('should handle invalid token', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            authService.singleUser.mockResolvedValue(null);
            await auth.verify(req, res, next);
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INVALID_TOKEN' });
            expect(res.json).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
          });
        
          it('should handle errors thrown during execution', async () => {
            authService.singleUser.mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await auth.verify(req, res, next);
            expect(authService.singleUser).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
          });
    });

    describe('refreshToken', () => {
        const req = {
            query: {
                token: 'owner',
            },
        } as unknown as Request;

        it('should refresh token successfully', async () => {
            authService.singleUser.mockResolvedValue(user);
            await auth.refreshToken(req, res, next);
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(res.json).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle invalid token', async () => {
            authService.singleUser.mockResolvedValue(null);
            await auth.refreshToken(req, res, next);
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INVALID_TOKEN' });
            expect(res.json).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors during token refresh', async () => {
            authService.singleUser.mockRejectedValue(new Error('Mock Error'));
            await auth.refreshToken(req, res, next);
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('login', () => {
        const req = {
            body: {
                username: 'owner',
                password: '1234',
            },
        } as Request;

        it('should login successfully', async () => {
            authService.passwordValid.mockResolvedValue(true);
            authService.singleUser.mockResolvedValue(user);
            await auth.login(req, res, next);
            expect(authService.passwordValid).toHaveBeenCalledWith(db, 'owner', '1234');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(jwt.sign).toHaveBeenCalledWith(user, '3R#q!ZuFb2sPn8yT^@5vLmN7jA*C6hG', { expiresIn: '1h' });
            expect(res.json).toHaveBeenCalledWith(user);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle invalid credentials', async () => {
            authService.passwordValid.mockResolvedValue(false);
            await auth.login(req, res, next);
            expect(authService.passwordValid).toHaveBeenCalledWith(db, 'owner', '1234');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INVALID_CREDENTIALS' });
            expect(res.json).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    
        it('should handle internal server error', async () => {
            authService.passwordValid.mockResolvedValue(true);
            authService.singleUser.mockResolvedValue(null);
            await auth.login(req, res, next);
            expect(authService.passwordValid).toHaveBeenCalledWith(db, 'owner', '1234');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(res.json).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    
        it('should handle errors thrown during execution', async () => {
            authService.passwordValid.mockRejectedValue(new Error('Mock Error'));
            await auth.login(req, res, next);
            expect(authService.passwordValid).toHaveBeenCalledWith(db, 'owner', '1234');
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('register', () => {
        const req = {
            body: {
                username: 'mock',
                fullName: 'Mock User',
                language: 'en',
                password: 'test*0TEST'
            }
        } as Request;

        it('should register a new user successfully', async () => {
            authService.isNewUser.mockResolvedValue(true);
            authService.createUser.mockResolvedValue();
            await auth.register(req, res, next);
            expect(authService.isNewUser).toHaveBeenCalledWith(db, 'mock');
            expect(authService.createUser).toHaveBeenCalledWith(db, 'mock', 'Mock User', 'en', 'test*0TEST');
            expect(res.json).toHaveBeenCalledWith({ message: 'SUCCESS.REGISTRATION' });
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    
        it('should handle existing username', async () => {
            authService.isNewUser.mockResolvedValue(false);
            await auth.register(req, res, next);
            expect(authService.isNewUser).toHaveBeenCalledWith(db, 'mock');
            expect(authService.createUser).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(402);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.USERNAME_TAKEN' });
            expect(res.json).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    
        it('should handle errors thrown during registration', async () => {
            authService.isNewUser.mockRejectedValue(new Error('Mock Error'));
            await auth.register(req, res, next);
            expect(authService.isNewUser).toHaveBeenCalledWith(db, 'mock');
            expect(authService.createUser).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });
});