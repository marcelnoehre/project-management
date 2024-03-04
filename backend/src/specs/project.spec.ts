import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as projectService from '../services/project.service';
import * as notificationsService from '../services/notifications.service';
import * as jwt from 'jsonwebtoken';
import * as project from '../controllers/project.controller';
import * as admin from 'firebase-admin';

jest.mock('../services/auth.service');
jest.mock('../services/project.service');
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
const teamMembers = [
    user,  
    {
        token: 'member',
        username: 'member',
        fullName: 'Mock Member',
        initials: 'MM',
        color: '#FFFFFF',
        language: 'de',
        project: 'mockProject',
        permission: 'MEMBER',
        profilePicture: '',
        notificationsEnabled: false,
        isLoggedIn: true,
        stats: {
            created: 64,
            imported: 27,
            updated: 89,
            edited: 14,
            trashed: 50,
            restored: 73,
            deleted: 3,
            cleared: 67
        }
    }
]


describe('project controller', () => {
    const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getTeamMembers', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should get team members', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);                            
            projectService.getTeamMembers.mockResolvedValueOnce(teamMembers);
            await project.getTeamMembers(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.getTeamMembers).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(teamMembers);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle invalid project', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            projectService.getTeamMembers.mockResolvedValueOnce([]);        
            await project.getTeamMembers(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.getTeamMembers).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {        
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
              throw new Error('Mock error');
            });
            await project.getTeamMembers(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.getTeamMembers).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock error'));
        });
    });

    describe('createProject', () => {
        const req = {
            body: {
                token: 'owner',
                project: 'MockProject'
            }
        } as unknown as Request;
    });

    describe('inviteUser', () => {
        const req = {
            body: {
                token: 'owner',
                username: 'invite'
            }
        } as unknown as Request;
    });

    describe('handleInvite', () => {
        const reqAccept = {
            body: {
                token: 'owner',
                decision: true
            }
        } as unknown as Request;
        const reqReject = {
            body: {
                token: 'owner',
                decision: true
            }
        } as unknown as Request;
    });

    describe('updatePermission', () => {
        const req = {
            body: {
                token: 'owner',
                username: 'member',
                permisison: 'OWNER'
            }
        } as unknown as Request;
    });

    describe('removeUser', () => {
        const req = {
            body: {
                token: 'owner',
                username: 'member'
            }
        } as unknown as Request;
    });

    describe('leaveProject', () => {
        const req = {
            body: {
                token: 'owner'
            }
        } as unknown as Request;
    });

});
