import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as projectService from '../services/project.service';
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
