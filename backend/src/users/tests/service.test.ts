import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { CreateUser } from '../model.js';
import { User } from '../model.js';
import * as userService from '../service.js';


describe('User Service', () => {
  const testUsers: CreateUser[] = [
    {
      id: 'user-01',
      firstname: 'Foo1',
      lastname: 'Bar1',
      email: 'foobar1@gmail.com',
      password: 'properTestPass@1'
    }, 
    {
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
      User.create = vi.fn().mockResolvedValue(newUser);      

      const user = await userService.createUser(newUser);      

      expect(user.id).toBe(newUser.id);
      expect(user.firstname).toBe(newUser.firstname);
    });
  });

  describe('Get Users', () => {
    it('Should return all the users', async () => {
      const newUsers: CreateUser[] = testUsers;
      User.find = vi.fn().mockResolvedValue(newUsers);

      const users = await userService.getUsers();

      expect(users).toBe(newUsers);      
    });
  });

  describe('Get User by ID', () => {
    it('Should return a user by ID', async () => {
      const newUser: CreateUser = testUsers[0]!;
      User.findOne = vi.fn().mockResolvedValue(newUser);      

      const user = await userService.getUserById(newUser.id);

      expect(user).toBe(newUser);
    });
  });

  describe('Update User by ID', () => {
    it('Should update a user by ID', async () => {
      const newUser: CreateUser = testUsers[0]!;
      const updatedUser: CreateUser = { ...newUser, firstname: 'Foo3' };
      User.findOneAndUpdate = vi.fn().mockResolvedValue(updatedUser);      

      const user = await userService.updateUser(updatedUser.id, updatedUser);

      expect(user).toBe(updatedUser);
    })
  });

  describe('Delete User by ID', () => {
    it('Should delete a user by ID', async () => {
      const newUser: CreateUser = testUsers[0]!;
      User.deleteOne = vi.fn().mockResolvedValue({acknowledged: true, deletedCount: 1});
      
      const deleted = await userService.deleteUser(newUser.id);
      expect(deleted).toBe(true);
    });
  });
});