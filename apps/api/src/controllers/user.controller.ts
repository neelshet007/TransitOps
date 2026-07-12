import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';

export class UserController {
  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string | undefined;
      const is_active =
        req.query.is_active === 'true'
          ? true
          : req.query.is_active === 'false'
            ? false
            : undefined;

      const result = await userService.getUsers({ page, limit, search, is_active });

      res.status(HTTP_STATUS.OK).json(
        successResponse('Users retrieved successfully.', result.data, {
          page: result.page,
          limit: result.limit,
          total_records: result.total,
          total_pages: result.total_pages,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(HTTP_STATUS.OK).json(successResponse('User retrieved successfully.', user));
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.createUser(req.body);
      res.status(HTTP_STATUS.CREATED).json(successResponse('User created successfully.', user));
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json(successResponse('User updated successfully.', user));
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.status(HTTP_STATUS.OK).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await userService.resetPassword(req.params.id, req.body.new_password);
      res.status(HTTP_STATUS.OK).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };

  assignRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.assignRole(req.params.id, req.body.role_id);
      res.status(HTTP_STATUS.OK).json(successResponse('Role assigned to user.', user));
    } catch (error) {
      next(error);
    }
  };

  removeRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.removeRole(req.params.id, req.params.roleId);
      res.status(HTTP_STATUS.OK).json(successResponse('Role removed from user.', user));
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
export default userController;
