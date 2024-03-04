import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as statsService from '../services/stats.service';
import * as projectService from '../services/project.service';
import * as jwt from 'jsonwebtoken';
import * as stats from '../controllers/stats.controller';
import * as admin from 'firebase-admin';

jest.mock('../services/auth.service');
jest.mock('../services/stats.service');
jest.mock('../services/projects.service');
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
    });

    describe('stats', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;
    });

    describe('statLeaders', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;
    });

    describe('taskAmount', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;
    });

    describe('averageTime', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;
    });

    describe('wip', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;
    });

    describe('taskProgress', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;
    });

    describe('projectRoadmap', () => {
        const req = {
            query: {
                token: 'owner'
            }
        } as unknown as Request;
    });

    describe('optimizeOrder', () => {
        const req = {
            body: {
                token: 'owner'
            }
        } as unknown as Request;
    });
});