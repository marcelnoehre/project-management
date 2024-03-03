import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as taskService from '../services/task.service';
import * as notificationsService from '../services/notifications.service';
import * as jwt from 'jsonwebtoken';
import * as task from '../controllers/task.controller';
import * as admin from 'firebase-admin';

jest.mock('../services/auth.service');
jest.mock('../services/task.service');
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
const taskList = [{
    state: 'MockState',
    tasks: [{
        uid: 'DHfqbZ18jhH55SFWFGwO',
        author: 'owner',
        project: 'MockProject',
        title: 'MockTitle',
        description: 'MockDescription',
        assigned: '',
        state: 'MockState',
        order: 1,
        history: [
            {
            previous: null,
            state: 'MockState',
            timestamp: 1707706711326,
            username: 'owner'
            }
        ]
    }]
}];

describe('task controller', () => {
    const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getTaskList', () => {
        const req = {
            query: {
                token: 'owner',
            },
        } as unknown as Request;

        test('should successfully get task list and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.getTaskList.mockResolvedValue(taskList);
            await task.getTaskList(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.getTaskList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(taskList);
            expect(next).not.toHaveBeenCalled();
        });
        
        test('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });    
            await task.getTaskList(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.getTaskList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });
    
    describe('getTrashBin', () => {
        const req = {
            query: {
                token: 'owner',
            },
        } as unknown as Request;

        test('should successfully get trashed list and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.getTrashedList.mockResolvedValueOnce(taskList);
            await task.getTrashBin(req, res, next);
        
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.getTrashedList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(taskList);
            expect(next).not.toHaveBeenCalled();
          });
        
          test('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await task.getTrashBin(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.getTrashedList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
          });
    });
    
    describe('createTask', () => {
    
    });
    
    describe('importTasks', () => {
    
    });
    
    describe('updateTask', () => {
    
    });
    
    describe('updatePosition', () => {
    
    });
    
    describe('moveToTrashBin', () => {
    
    });
    
    describe('restoreTask', () => {
    
    });
    
    describe('deleteTask', () => {
    
    });
    
    describe('clearTrashBin', () => {
    
    });    
});
