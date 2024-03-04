import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as statsService from '../services/stats.service';
import * as projectService from '../services/project.service';
import * as jwt from 'jsonwebtoken';
import * as stats from '../controllers/stats.controller';
import * as admin from 'firebase-admin';

jest.mock('../services/auth.service');
jest.mock('../services/stats.service');
jest.mock('../services/project.service');
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
const project = {
    name: 'MockProject',
    history: ['event_1', 'event_2', 'event_3'],
    stats: [{
        created: 91,
        imported: 10,
        updated: 45,
        edited: 78,
        trashed: 32,
        restored: 57,
        deleted: 23,
        cleared: 69
    }]
}
const states = {
    NONE: 1,
    TODO: 2,
    PROGRESS: 3,
    REVIEW: 4,
    DONE: 5,
    DELETED: 6
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

    describe('personalStats', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should return user stats', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            authService.singleUser.mockResolvedValue(user);
            await stats.personalStats(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(res.json).toHaveBeenCalledWith(user.stats);
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle invalid user', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            authService.singleUser.mockResolvedValue(null);
            await stats.personalStats(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).toHaveBeenCalledWith(db, 'owner');
            expect(res.json).toHaveBeenCalledWith({
                created: 0,
                imported: 0,
                updated: 0,
                edited: 0,
                trashed: 0,
                restored: 0,
                deleted: 0,
                cleared: 0
            });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await stats.personalStats(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(authService.singleUser).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('stats', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should return project stats', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            projectService.singleProject.mockResolvedValue(project);
            statsService.stats.mockResolvedValue(project.stats);
            await stats.stats(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.singleProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(statsService.stats).toHaveBeenCalledWith(db, project);
            expect(res.json).toHaveBeenCalledWith(project.stats);
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await stats.stats(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.singleProject).not.toHaveBeenCalled();
            expect(statsService.stats).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('statLeaders', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should return stat leaders', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            statsService.statLeaders.mockResolvedValue(project.stats);
            await stats.statLeaders(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.statLeaders).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(project.stats);
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await stats.statLeaders(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.statLeaders).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('taskAmount', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should return task amounts', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            const tasklist = {
                NONE: [1],
                TODO: [2, 2],
                PROGRESS: [3, 3, 3],
                REVIEW: [4, 4, 4, 4],
                DONE: [5, 5, 5, 5, 5],
                DELETED: [6, 6, 6, 6, 6, 6]
            };
            statsService.getTaskList.mockResolvedValue(tasklist);
            await stats.taskAmount(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.getTaskList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith({
                NONE: 1,
                TODO: 2,
                PROGRESS: 3,
                REVIEW: 4,
                DONE: 5,
                DELETED: 6
            });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await stats.taskAmount(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.getTaskList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('averageTime', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should calculate average time for each state', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            statsService.getTaskList.mockResolvedValue(project.stats);
            statsService.averageTime.mockResolvedValue(states);
            await stats.averageTime(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.getTaskList).toHaveBeenCalledWith(db, 'MockProject');
            expect(statsService.averageTime).toHaveBeenCalledWith(project.stats);
            expect(res.json).toHaveBeenCalledWith(states);
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle tasks with no history entries', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await stats.averageTime(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.getTaskList).not.toHaveBeenCalled();
            expect(statsService.averageTime).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('wip', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should return work in progress data', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            statsService.wip.mockResolvedValue(17);
            await stats.wip(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.wip).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(17);
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await stats.wip(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.wip).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalledWith();
            expect(res.send).not.toHaveBeenCalledWith();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('taskProgress', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should return task progress data', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            statsService.taskProgress.mockResolvedValue(project.history);
            await stats.taskProgress(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.taskProgress).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(project.history);
            expect(next).not.toHaveBeenCalled();
          });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await stats.taskProgress(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(statsService.taskProgress).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalledWith();
            expect(res.send).not.toHaveBeenCalledWith();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('projectRoadmap', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;

        it('should return project roadmap', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            projectService.singleProject.mockResolvedValue(project);
            statsService.projectRoadmap.mockResolvedValue(project.history);
            await stats.projectRoadmap(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.singleProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(statsService.projectRoadmap).toHaveBeenCalledWith(project);
            expect(res.json).toHaveBeenCalledWith(project.history);
            expect(next).not.toHaveBeenCalled();
        });

        it('should return empty project roadmap', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            projectService.singleProject.mockResolvedValue(null);
            await stats.projectRoadmap(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.singleProject).toHaveBeenCalledWith(db, 'MockProject');
            expect(statsService.projectRoadmap).not.toHaveBeenCalledWith();
            expect(res.json).toHaveBeenCalledWith([]);
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await stats.projectRoadmap(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(projectService.singleProject).not.toHaveBeenCalled();
            expect(statsService.projectRoadmap).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });

    describe('optimizeOrder', () => {
        const req = {
            body: {
                token: 'owner'
            }
        } as unknown as Request;
    });
});