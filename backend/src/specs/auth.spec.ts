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
    const req = {
        body: {
            username: 'testuser',
            password: 'testpassword',
        },
    } as Request;

    const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should login successfully', async () => {
            authService.passwordValid.mockResolvedValue(true);
            authService.singleUser.mockResolvedValue(user);
            await auth.login(req, res, next);
            expect(authService.passwordValid).toHaveBeenCalledWith(db, 'testuser', 'testpassword');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'testuser');
            expect(jwt.sign).toHaveBeenCalledWith(user, '3R#q!ZuFb2sPn8yT^@5vLmN7jA*C6hG', { expiresIn: '1h' });
            expect(res.json).toHaveBeenCalledWith(user);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle invalid credentials', async () => {
            authService.passwordValid.mockResolvedValue(false);
            await auth.login(req, res, next);
            expect(authService.passwordValid).toHaveBeenCalledWith(db, 'testuser', 'testpassword');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INVALID_CREDENTIALS' });
            expect(res.json).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    
        it('should handle internal server error', async () => {
            authService.passwordValid.mockResolvedValue(true);
            authService.singleUser.mockResolvedValue(null);
            await auth.login(req, res, next);
            expect(authService.passwordValid).toHaveBeenCalledWith(db, 'testuser', 'testpassword');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'testuser');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(res.json).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    
        it('should handle errors thrown during execution', async () => {
            authService.passwordValid.mockRejectedValue(new Error('Some error'));
            await auth.login(req, res, next);
            expect(authService.passwordValid).toHaveBeenCalledWith(db, 'testuser', 'testpassword');
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Some error'));
        });
    });

});