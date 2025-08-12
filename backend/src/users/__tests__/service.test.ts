import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { CreateUser, IUser } from '../model.js';
import { User } from '../model.js';
import * as userService from '../service.js';
import * as counterService from '../../shared/counter.model.js';
import { ObjectId, Types } from 'mongoose';


describe('User Service', () => {
  const testUsers: IUser[] = [
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f7'),
      id: 'user-01',
      firstname: 'Foo1',
      lastname: 'Bar1',
      email: 'foobar1@gmail.com',
      password: 'properTestPass@1'
    }, 
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f2'),
      id: 'user-02',
      firstname: 'Foo2',
      lastname: 'Bar2',
      email: 'foobar2@gmail.com',
      password: 'properTestPass@2'
    }
  ];

  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe('Create User', () => {
    it('Should create a new user', async () => {      
      const newUser: CreateUser = testUsers[0]!;

      vi.spyOn(counterService, 'getNextId').mockResolvedValue(1);

      User.create = vi.fn().mockResolvedValue(newUser);

      const user = await userService.createUser(newUser);      

      expect(user.id).toBe(newUser.id);
      expect(user.firstname).toBe(newUser.firstname);
    });
  });

  describe('Get Users', () => {
    it('Should return all the users', async () => {
      const newUsers: IUser[] = testUsers;
      User.find = vi.fn().mockResolvedValue(newUsers);

      const users = await userService.getUsers();

      expect(users).toBe(newUsers);      
    });
  });

  describe('Get User by ID', () => {
    it('Should return a user by ID', async () => {
      const newUser: IUser = testUsers[0]!;
      User.findOne = vi.fn().mockResolvedValue(newUser);      

      const user = await userService.getUserById(newUser._id);

      expect(user).toBe(newUser);
    });
  });

  describe('Update User by ID', () => {
    it('Should update a user by ID', async () => {
      const newUser: IUser = testUsers[0]!;
      const updatedUser: IUser = { ...newUser, firstname: 'Foo3' };
      User.findOneAndUpdate = vi.fn().mockResolvedValue(updatedUser);      

      const user = await userService.updateUser(updatedUser._id, updatedUser);

      expect(user).toBe(updatedUser);
    })
  });

  describe('Delete User by ID', () => {
    it('Should delete a user by ID', async () => {
      const newUser: IUser = testUsers[0]!;
      User.findByIdAndDelete = vi.fn().mockResolvedValue(newUser);
      
      const deleted = await userService.deleteUser(newUser._id);
      expect(deleted).toBe(newUser);
    });
  });
});