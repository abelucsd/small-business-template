import type { Request, Response, NextFunction} from 'express';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import type { CreateUser, IUser } from '../model.js';
import { User } from '../model.js';
import * as userController from '../controller.js';
import * as userService from '../service.js';

describe('User Controller', () => {
  const testIUsers: IUser[] = [
    {
      _id: '1',
      id: 'user-01',
      firstname: 'Foo1',
      lastname: 'Bar1',
      email: 'foobar1@gmail.com',
      password: 'properTestPass@1'
    }, 
    {
      _id: '2',
      id: 'user-02',
      firstname: 'Foo2',
      lastname: 'Bar2',
      email: 'foobar2@gmail.com',
      password: 'properTestPass@2'
    }
  ];
  let req: Request;
  const mockResponse = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };  
  let next: NextFunction;

  beforeAll(() => {    
    vi.clearAllMocks();    
  });
  beforeEach(() => {
    req = {} as Request; 
    next = vi.fn();
  });

  describe('Create user', async () => {
    it('should return 201', async () => {
      const newUser = testIUsers[0]!;
      req.body = newUser;
      const res = mockResponse();
      vi.spyOn(userService, 'createUser').mockResolvedValue(newUser);      
  
      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUser);
    });
  })

  describe('Get users', async () => {
    it('should return 200', async () => {
      const newUsers = testIUsers;
      req.body = newUsers;
      const res = mockResponse();
      vi.spyOn(userService, 'getUsers').mockResolvedValue(newUsers);

      await userController.getUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newUsers);
    });
  });

  describe('Get user by ID', async () => {
    it('should return 200', async () => {
      const newUser = testIUsers[0]!;
      req.params = {
        id: newUser.id
      };
      const res = mockResponse();
      vi.spyOn(userService, 'getUserById').mockResolvedValue(newUser);

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newUser);
    });
    it('should return 404', async () => {
      const newUser = testIUsers[0]!;
      req.params = {
        id: newUser.id
      };
      const res = mockResponse();
      vi.spyOn(userService, 'getUserById').mockResolvedValue(null);

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);      
    });
  });

  describe('Update user by ID', async () => {
    it('should return 200', async () => {
      const newUser:IUser = testIUsers[0]!;
      const updatedUser = { ...newUser, firstname: 'Foo3' };
      const res = mockResponse();   
      req.params = {
        id: newUser.id
      };
      req.body = newUser;
      vi.spyOn(userService, 'updateUser').mockResolvedValue(updatedUser);

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    })
    it('should return 404', async () => {
      const newUser:IUser = testIUsers[0]!;
      const updatedUser = { ...newUser, firstname: 'Foo3' };
      const res = mockResponse();   
      req.params = {
        id: newUser.id
      };
      req.body = newUser;
      vi.spyOn(userService, 'updateUser').mockResolvedValue(null);

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);      
    })
  });

  describe('Delete user by ID', async () => {
    it('should return 200', async () => {
      const newUser = testIUsers[0]!;
      req.params = {
        id: newUser.id
      };
      const res = mockResponse();
      vi.spyOn(userService, 'deleteUser').mockResolvedValue(true);

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(`Deleted user with ID ${newUser.id}`);
    });
    it('should return 404', async () => {
      const newUser = testIUsers[0]!;
      req.params = {
        id: newUser.id
      };
      const res = mockResponse();

      vi.spyOn(userService, 'deleteUser').mockResolvedValue(false);

      await userController.deleteUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);      
    });
  });
});