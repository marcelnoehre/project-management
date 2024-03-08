import { Request, Response, NextFunction } from 'express';
import * as notificationsService from '../services/notifications.service';
import * as jwt from 'jsonwebtoken';
import * as notifications from '../controllers/notifications.controller';
import * as admin from 'firebase-admin';

jest.mock('../services/notifications.service');
jest.mock('jsonwebtoken');
jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    firestore: jest.fn(),
}));
const db = admin.firestore();
const user = {
    username: 'owner',
    fullName: 'Mock Owner',
    initials: 'MO',
    color: '#FFFFFF',
    language: 'en',
    project: 'MockProject',
    permission: 'OWNER',
    profilePicture: '',
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
const notificationsList = [
    {
        uid: 'lPMZOH0Hxy6z0mhZ9shV',
        message: 'NOTIFICATIONS.NEW.JOINED',
        data: ['admin'], 
        icon: 'person_add',
        timestamp: 1707948598239, 
        seen: false 
    },
    { 
        uid: 'lk8id9WVL0N1o97vRDK6',
        message: 'NOTIFICATIONS.NEW.CREATE_TASK',
        data: ['admin', 'mock'], 
        icon: 'note_add',
        timestamp: 1707948640062, 
        seen: true 
    }
]

describe('notifications controller', () => {
    const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getNotifications', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should get notifications', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);        
            notificationsService.getNotifications.mockResolvedValue(notificationsList);
            await notifications.getNotifications(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(notificationsService.getNotifications).toHaveBeenCalledWith(db, 'MockProject', 'owner');
            expect(res.json).toHaveBeenCalledWith(notificationsList);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });    
            await notifications.getNotifications(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(notificationsService.getNotifications).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('updateNotifications', () => {
        const req = {
            body: {
                token: 'owner',
                removed: ['1', '2'],
                seen: ['3', '4']
            }
        } as unknown as Request;

        it('should update notifications', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);                    
            notificationsService.updateNotifications.mockResolvedValue();
            notificationsService.getNotifications.mockResolvedValue(notificationsList);
            await notifications.updateNotifications(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(notificationsService.updateNotifications).toHaveBeenCalledWith(db, ['1', '2'], ['3', '4'], 'owner', 'MockProject');
            expect(notificationsService.getNotifications).toHaveBeenCalledWith(db, 'MockProject', 'owner');
            expect(res.json).toHaveBeenCalledWith(notificationsList);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await notifications.updateNotifications(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(notificationsService.updateNotifications).not.toHaveBeenCalled();
            expect(notificationsService.getNotifications).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

});