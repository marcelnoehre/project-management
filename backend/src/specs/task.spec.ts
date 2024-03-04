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
const stateList = [{
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
                timestamp: 1234567890,
                username: 'owner'
            }
        ]
    }]
}];
const taskList = [{
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
            timestamp: 1234567890,
            username: 'owner'
        }
    ]
}];
const taskObj = {
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
            timestamp: 1234567890,
            username: 'owner'
        }
    ]
}

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

        it('should successfully get task list and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.getTaskList.mockResolvedValue(stateList);
            await task.getTaskList(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.getTaskList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(stateList);
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
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

        it('should successfully get trashed list and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.getTrashedList.mockResolvedValue(taskList);
            await task.getTrashBin(req, res, next);
        
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.getTrashedList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(taskList);
            expect(next).not.toHaveBeenCalled();
          });
        
        it('should handle errors and call next', async () => {
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

        it('should successfully create task and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.highestOrder.mockResolvedValue(17);
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
        
        it('should handle errors and call next', async () => {
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
        const req = {
            body: {
                token: 'owner',
                tasks: [
                    { title: 'Task 1', description: 'Description 1' },
                    { title: 'Task 2', description: 'Description 2' }
                ]
            }
        };

        it('should successfully import tasks and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.importTask.mockImplementation((db, task, project, username) => {
                if (task.title === 'Task 1') {
                    return { id: 1, title: 'Task 1', description: 'Description 1' };
                } else {
                    return null;
                }
            });
            await task.importTasks(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.importTask).toHaveBeenCalledTimes(2);
            expect(taskService.importTask).toHaveBeenCalledWith(db, { title: 'Task 1', description: 'Description 1' }, 'MockProject', 'owner');
            expect(taskService.importTask).toHaveBeenCalledWith(db, { title: 'Task 2', description: 'Description 2' }, 'MockProject', 'owner');
            expect(authService.updateUserStats).toHaveBeenCalledWith(db, 'owner', 'imported', 1);
            expect(authService.updateProjectStats).toHaveBeenCalledWith(db, 'MockProject', 'imported', 1);
            expect(notificationsService.createTeamNotification).toHaveBeenCalledWith(db, 'MockProject', 'owner', 'NOTIFICATIONS.NEW.IMPORTED_TASKS', ['owner'], 'upload_file');
            expect(res.json).toHaveBeenCalledWith({amount: 2, success: 1, fail: 1, taskList: [{ id: 1, title: 'Task 1', description: 'Description 1' }]});
            expect(next).not.toHaveBeenCalled();
        });

        it('should import 0 tasks', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.importTask.mockImplementation((db, task, project, username) => {
                return null;
            });
            await task.importTasks(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.importTask).toHaveBeenCalledTimes(2);
            expect(taskService.importTask).toHaveBeenCalledWith(db, { title: 'Task 1', description: 'Description 1' }, 'MockProject', 'owner');
            expect(taskService.importTask).toHaveBeenCalledWith(db, { title: 'Task 2', description: 'Description 2' }, 'MockProject', 'owner');
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createTeamNotification).not.toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({amount: 2, success: 0, fail: 2, taskList: []});
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await task.importTasks(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.importTask).not.toHaveBeenCalled();
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createTeamNotification).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });
    
    describe('updateTask', () => {
        const req = {
            body: {
                token: 'owner',
                task: taskObj
            }
        };

        it('should successfully update task and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.singleTask.mockResolvedValue(taskObj);
            taskService.updateTask.mockResolvedValue();
            authService.updateUserStats.mockResolvedValue();
            authService.updateProjectStats.mockResolvedValue();
            notificationsService.createRelatedNotification.mockResolvedValue();
            taskService.getTaskList.mockResolvedValue(taskList);
            await task.updateTask(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO');
            expect(taskService.updateTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO', req.body.task);
            expect(authService.updateUserStats).toHaveBeenCalledWith(db, 'owner', 'edited', 1);
            expect(authService.updateProjectStats).toHaveBeenCalledWith(db, 'MockProject', 'edited', 1);
            expect(notificationsService.createRelatedNotification).toHaveBeenCalledWith(db, 'MockProject', 'owner', 'owner', '', 'NOTIFICATIONS.NEW.EDITED_TASK', ['owner', 'MockTitle'], 'edit_square');
            expect(taskService.getTaskList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(taskList);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle case where task does not exist and send appropriate status', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.singleTask.mockResolvedValue(null);
            await task.updateTask(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO');
            expect(taskService.updateTask).not.toHaveBeenCalled();
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createRelatedNotification).not.toHaveBeenCalled();
            expect(taskService.getTaskList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await task.updateTask(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).not.toHaveBeenCalled();
            expect(taskService.updateTask).not.toHaveBeenCalled();
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createRelatedNotification).not.toHaveBeenCalled();
            expect(taskService.getTaskList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });
    
    describe('updatePosition', () => {
        const req = {
            body: {
                token: 'owner',
                uid: 'DHfqbZ18jhH55SFWFGwO',
                state: 'NewState',
                order: 1
            }
        }

        it('should successfully update position and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.singleTask.mockResolvedValue(taskObj);
            taskService.updateTask.mockResolvedValue();
            authService.updateUserStats.mockResolvedValue();
            authService.updateProjectStats.mockResolvedValue();
            notificationsService.createRelatedNotification.mockResolvedValue();
            taskService.getTaskList.mockResolvedValue(taskList);
            await task.updatePosition(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO');
            expect(taskService.updateTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO', {
              state: 'NewState',
              order: 1,
              history: [
                    {
                        timestamp: 1234567890,
                        username: 'owner',
                        state: 'MockState',
                        previous: null,
                    },
                    {
                        timestamp: expect.any(Number),
                        username: 'owner',
                        state: 'NewState',
                        previous: 'MockState',
                    }
                ],
            });
            expect(authService.updateUserStats).toHaveBeenCalledWith(db, 'owner', 'updated', 1);
            expect(authService.updateProjectStats).toHaveBeenCalledWith(db, 'MockProject', 'updated', 1);
            expect(notificationsService.createRelatedNotification).toHaveBeenCalledWith(
              db,
              'MockProject',
              'owner',
              'owner',
              '',
              'NOTIFICATIONS.NEW.UPDATE_TASK_POSITION',
              ['owner', 'MockTitle'],
              'edit_square'
            );
            expect(taskService.getTaskList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(taskList);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle case where task does not exist and send appropriate status', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.singleTask.mockResolvedValue(null);
            await task.updatePosition(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO');
            expect(taskService.updateTask).not.toHaveBeenCalled();
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createRelatedNotification).not.toHaveBeenCalled();
            expect(taskService.getTaskList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await task.updatePosition(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).not.toHaveBeenCalled();
            expect(taskService.updateTask).not.toHaveBeenCalled();
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createRelatedNotification).not.toHaveBeenCalled();
            expect(taskService.getTaskList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });
    
    describe('moveToTrashBin', () => {
        const req = {
            body: {
                token: 'owner',
                uid: 'DHfqbZ18jhH55SFWFGwO'
            }
        }

        it('should successfully move task to trash bin and send response', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.singleTask.mockResolvedValue(taskObj);
            taskService.updateTask.mockResolvedValue();
            authService.updateUserStats.mockResolvedValue();
            authService.updateProjectStats.mockResolvedValue();
            notificationsService.createRelatedNotification.mockResolvedValue();
            taskService.getTaskList.mockResolvedValue(taskList);
            await task.moveToTrashBin(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO');
            expect(taskService.updateTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO', { state: 'DELETED' });
            expect(authService.updateUserStats).toHaveBeenCalledWith(db, 'owner', 'trashed', 1);
            expect(authService.updateProjectStats).toHaveBeenCalledWith(db, 'MockProject', 'trashed', 1);
            expect(notificationsService.createRelatedNotification).toHaveBeenCalledWith(
              db,
              'MockProject',
              'owner',
              'owner',
              '',
              'NOTIFICATIONS.NEW.TRASHED_TASK',
              ['owner', 'MockTitle'],
              'delete'
            );
            expect(taskService.getTaskList).toHaveBeenCalledWith(db, 'MockProject');
            expect(res.json).toHaveBeenCalledWith(taskList);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle case where task does not exist and send appropriate status', async () => {
            jest.spyOn(jwt, 'decode').mockReturnValue(user);
            taskService.singleTask.mockResolvedValue(null);
            await task.moveToTrashBin(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).toHaveBeenCalledWith(db, 'DHfqbZ18jhH55SFWFGwO');
            expect(taskService.updateTask).not.toHaveBeenCalled();
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createRelatedNotification).not.toHaveBeenCalled();
            expect(taskService.getTaskList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'ERROR.INTERNAL' });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle errors and call next', async () => {
            jest.spyOn(jwt, 'decode').mockImplementation(() => {
                throw new Error('Mock Error');
            });
            await task.moveToTrashBin(req, res, next);
            expect(jwt.decode).toHaveBeenCalledWith('owner');
            expect(taskService.singleTask).not.toHaveBeenCalled();
            expect(taskService.updateTask).not.toHaveBeenCalled();
            expect(authService.updateUserStats).not.toHaveBeenCalled();
            expect(authService.updateProjectStats).not.toHaveBeenCalled();
            expect(notificationsService.createRelatedNotification).not.toHaveBeenCalled();
            expect(taskService.getTaskList).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Mock Error'));
        });
    });
    
    describe('restoreTask', () => {
    
    });
    
    describe('deleteTask', () => {
    
    });
    
    describe('clearTrashBin', () => {
    
    });    
});
