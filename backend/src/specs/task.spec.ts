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
const trashList = [{
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
            taskService.getTrashedList.mockResolvedValueOnce(trashList);
            await task.getTrashBin(req, res, next);
        
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.getTrashedList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(trashList);
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
        const req = {
            body: {
                token: 'owner',
                title: 'MockTitle',
                description: 'MockDescription',
                assigned: 'assignedUser',
                state: 'MockState',
                tokenUser: 'owner',
                order: 17
            }
        } as Request;

        test('should successfully create task and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValueOnce(user);
            taskService.highestOrder.mockResolvedValueOnce(17);
            await task.createTask(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.highestOrder).toHaveBeenCalledWith(db, 'MockProject', 'MockState');
            expect(taskService.createTask).toHaveBeenCalledWith(db, 'owner', 'MockProject', 'MockTitle', 'MockDescription', 'assignedUser', 'MockState', 17);
            expect(authService.updateUserStats).toHaveBeenCalledWith(db, 'owner', 'created', 1);
            expect(authService.updateProjectStats).toHaveBeenCalledWith(db, 'MockProject', 'created', 1);
            expect(notificationsService.createTeamNotification).toHaveBeenCalledWith(db, 'MockProject', 'owner', 'NOTIFICATIONS.NEW.CREATE_TASK', ['owner', 'MockTitle'], 'note_add');
            expect(res.json).toHaveBeenCalledWith({ message: 'SUCCESS.CREATE_TASK' });
            expect(next).not.toHaveBeenCalled();
        });
        
        test('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await task.createTask(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.highestOrder).not.toHaveBeenCalled();
            expect(taskService.createTask).not.toHaveBeenCalled();
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createTeamNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
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
