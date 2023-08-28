import {
  createUserController,
  retrieveUsersController,
} from '../../src/components/user/user.controller';
import { Request, Response } from 'express';
import {
  createUser,
  retrieveUsers,
} from '../../src/components/user/user.service';
import { generateAuthTokens } from '../../src/components/tokens/token.service';
import User from '../../src/components/user/user.model';

jest.mock('../../src/components/user/user.service');
jest.mock('../../src/components/tokens/token.service');

describe('User Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockNext = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  describe('createUserController', () => {
    it('should create a user and return auth token', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword123',
      } as unknown as User;

      const mockAuthToken = 'mockAuthToken';
      (
        createUser as jest.MockedFunction<typeof createUser>
      ).mockResolvedValueOnce(mockUser);
      (
        generateAuthTokens as jest.MockedFunction<typeof generateAuthTokens>
      ).mockResolvedValueOnce({ token: mockAuthToken });

      await createUserController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      // expect(createUser).toHaveBeenCalledWith(expect.anything());
      expect(generateAuthTokens).toHaveBeenCalledWith(expect.anything());
      // expect(mockResponse.send).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('retriveUsersController', () => {
    it('should retrieve users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword123',
        },
      ] as User[];

      (
        retrieveUsers as jest.MockedFunction<typeof retrieveUsers>
      ).mockResolvedValueOnce(mockUsers);

      await retrieveUsersController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.send).toHaveBeenCalledWith({
        success: true,
        message: 'Users retrieved successfully.',
        data: {
          users: mockUsers,
        },
      });
    });
  });
});
