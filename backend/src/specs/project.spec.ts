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
const owner = {
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
const projectObj = {
    name: 'MockProject',
    history: [],
    stats: []
}
const teamMembers = [
    owner,  
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
];
let mockUser = {
    username: 'mock',
    fullName: 'Mock FullName',
    initials: 'MF',
    color: '#FFFFFF',
    language: 'en',
    project: '',
    permission: '',
    profilePicture: '',
    notificationsEnabled: true,
    isLoggedIn: true,
    stats: {
        created: 0,
        imported: 0,
        updated: 0,
        edited: 0,
        trashed: 0,
        restored: 0,
        deleted: 0,
        cleared: 0
    }
}

describe('project controller', () => {
    const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUser = {
            username: 'mock',
            fullName: 'Mock FullName',
            initials: 'MF',
            color: '#FFFFFF',
            language: 'en',
            project: '',
            permission: '',
            profilePicture: '',
            notificationsEnabled: true,
            isLoggedIn: true,
            stats: {
                created: 0,
                imported: 0,
                updated: 0,
                edited: 0,
                trashed: 0,
                restored: 0,
                deleted: 0,
                cleared: 0
            }
        }
    });

    describe('getTeamMembers', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should get team members', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);                            
            projectService.getTeamMembers.mockResolvedValue(teamMembers);
            await project.getTeamMembers(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.getTeamMembers).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(teamMembers);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle invalid project', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);
            projectService.getTeamMembers.mockResolvedValue([]);        
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

        it('should create a new project', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);
            authService.singleUser.mockResolvedValue(owner);
            projectService.isNewProject.mockResolvedValue(true);
            authService.updateUserData.mockResolvedValue();
            projectService.createProject.mockResolvedValue();
            await project.createProject(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(projectService.isNewProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(authService.updateUserData).toHaveBeenCalledWith(db, 'owner', {
              project: 'MockProject',
              permission: 'OWNER',
              isLoggedIn: true
            });
            expect(projectService.createProject).toHaveBeenCalledWith(db, 'owner', 'MockProject');
            expect(res.json).toHaveBeenCalledWith({ message: 'SUCCESS.CREATE_PROJECT' });
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle already existing project', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);
            authService.singleUser.mockResolvedValue(owner);
            projectService.isNewProject.mockResolvedValue(false);
            await project.createProject(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(projectService.isNewProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.createProject).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.CREATE_PROJECT' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle invalid user', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);        
            authService.singleUser.mockResolvedValue(null);
            await project.createProject(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(projectService.isNewProject).not.toHaveBeenCalled();
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.createProject).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock error');
            });
            await project.createProject(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).not.toHaveBeenCalled();
            expect(projectService.isNewProject).not.toHaveBeenCalled();
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.createProject).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock error'));
        });
    });

    describe('inviteUser', () => {
        const req = {
            body: {
                token: 'owner',
                username: 'mock'
            }
        } as unknown as Request;

        it('should invite user', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);
            authService.singleUser.mockResolvedValue(mockUser);
            projectService.singleProject.mockResolvedValue(projectObj);
            authService.updateUserData.mockResolvedValue();
            projectService.updateProjectHistory.mockResolvedValue();
            notificationsService.createAdminNotification.mockResolvedValue();
            await project.inviteUser(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'mock');
            expect(projectService.singleProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(authService.updateUserData).toHaveBeenCalledWith(db, 'mock', { project: 'MockProject', permission: 'INVITED' });
            expect(projectService.updateProjectHistory).toHaveBeenCalledWith(db, 'MockProject', {
                timestamp: expect.any(Number),
                username: 'owner',
                type: 'INVITED',
                target: 'mock'
            });
            expect(notificationsService.createAdminNotification).toHaveBeenCalledWith(db, 'MockProject', 'owner', 'NOTIFICATIONS.NEW.INVITED', ['owner', 'mock'], 'cancel');
            expect(res.json).toHaveBeenCalledWith(mockUser);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle already invited user', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);
            mockUser.permission = 'INVITED';
            authService.singleUser.mockResolvedValue(mockUser);
            await project.inviteUser(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'mock');
            expect(projectService.singleProject).not.toHaveBeenCalled();
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.updateProjectHistory).not.toHaveBeenCalled();
            expect(notificationsService.createAdminNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(423);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.PENDING_INVITE' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle user with project', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);
            mockUser.project = 'AnotherProject';
            authService.singleUser.mockResolvedValue(mockUser);
            await project.inviteUser(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'mock');
            expect(projectService.singleProject).not.toHaveBeenCalled();
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.updateProjectHistory).not.toHaveBeenCalled();
            expect(notificationsService.createAdminNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(423);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.HAS_PROJECT' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle invalid user', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(owner);
            authService.singleUser.mockResolvedValue(null);
            await project.inviteUser(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'mock');
            expect(projectService.singleProject).not.toHaveBeenCalled();
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.updateProjectHistory).not.toHaveBeenCalled();
            expect(notificationsService.createAdminNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.NO_ACCOUNT' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock error');
            });
            await project.inviteUser(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).not.toHaveBeenCalled();
            expect(projectService.singleProject).not.toHaveBeenCalled();
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.updateProjectHistory).not.toHaveBeenCalled();
            expect(notificationsService.createAdminNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock error'));
        });
    });

    describe('handleInvite', () => {
        const reqAccept = {
            body: {
                token: 'mock',
                decision: true
            }
        } as unknown as Request;
        const reqReject = {
            body: {
                token: 'mock',
                decision: false
            }
        } as unknown as Request;

        it('should accept invite', async () => {
            mockUser.permission = 'INVITED';
            mockUser.project = 'MockProject';
            jest.spyOn(jwt, 'decode').mockReturnValue(mockUser);
            authService.singleUser.mockResolvedValue(mockUser);
            projectService.singleProject.mockResolvedValue(projectObj);
            authService.updateUserData.mockResolvedValue();
            projectService.updateProjectHistory.mockResolvedValue();
            notificationsService.createTeamNotification.mockResolvedValue();
            await project.handleInvite(reqAccept, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('mock');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'mock');
            expect(projectService.singleProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(authService.updateUserData).toHaveBeenCalledWith(db, 'mock', { project: 'MockProject', permission: 'MEMBER' });
            expect(projectService.updateProjectHistory).toHaveBeenCalledWith(db, 'MockProject', {timestamp: expect.any(Number), type: 'JOINED', username: 'mock', target: null });
            expect(notificationsService.createTeamNotification).toHaveBeenCalledWith(db, 'MockProject', 'mock', 'NOTIFICATIONS.NEW.JOINED', ['mock'], 'person_add');
            expect(res.json).toHaveBeenCalledWith({ message: 'SUCCESS.INVITE_ACCEPTED' });
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should reject invite', async () => {
            mockUser.permission = 'INVITED';
            mockUser.project = 'MockProject';
            jest.spyOn(jwt, 'decode').mockReturnValue(mockUser);
            authService.singleUser.mockResolvedValue(mockUser);
            projectService.singleProject.mockResolvedValue(projectObj);
            authService.updateUserData.mockResolvedValue();
            projectService.updateProjectHistory.mockResolvedValue();
            notificationsService.createAdminNotification.mockResolvedValue();
            await project.handleInvite(reqReject, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('mock');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'mock');
            expect(projectService.singleProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(authService.updateUserData).toHaveBeenCalledWith(db, 'mock', { project: '', permission: '' });
            expect(projectService.updateProjectHistory).toHaveBeenCalledWith(db, 'MockProject', {timestamp: expect.any(Number), type: 'REJECTED', username: 'mock', target: null });
            expect(notificationsService.createAdminNotification).toHaveBeenCalledWith(db, 'MockProject', 'mock', 'NOTIFICATIONS.NEW.REJECTED', ['mock'], 'cancel');
            expect(res.json).toHaveBeenCalledWith({ message: 'SUCCESS.INVITE_REJECTED' });
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle invalid user', async () => {
            mockUser.permission = 'INVITED';
            mockUser.project = 'MockProject';
            jest.spyOn(jwt, 'decode').mockReturnValue(mockUser);
            authService.singleUser.mockResolvedValue(null);
            projectService.singleProject.mockResolvedValue(projectObj);
            await project.handleInvite(reqAccept, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('mock');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'mock');
            expect(projectService.singleProject).not.toHaveBeenCalled();
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.updateProjectHistory).not.toHaveBeenCalled();
            expect(notificationsService.createTeamNotification).not.toHaveBeenCalled();
            expect(notificationsService.createAdminNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle invalid project', async () => {
            mockUser.permission = 'INVITED';
            mockUser.project = 'MockProject';
            jest.spyOn(jwt, 'decode').mockReturnValue(mockUser);
            authService.singleUser.mockResolvedValue(mockUser);
            projectService.singleProject.mockResolvedValue(null);
            await project.handleInvite(reqAccept, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('mock');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'mock');
            expect(projectService.singleProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.updateProjectHistory).not.toHaveBeenCalled();
            expect(notificationsService.createTeamNotification).not.toHaveBeenCalled();
            expect(notificationsService.createAdminNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock error');
            });
            await project.handleInvite(reqAccept, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('mock');
            expect(authService.singleUser).not.toHaveBeenCalled();
            expect(projectService.singleProject).not.toHaveBeenCalled();
            expect(authService.updateUserData).not.toHaveBeenCalled();
            expect(projectService.updateProjectHistory).not.toHaveBeenCalled();
            expect(notificationsService.createTeamNotification).not.toHaveBeenCalled();
            expect(notificationsService.createAdminNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock error'));
        });
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
