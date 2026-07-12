import { Request, Response, NextFunction } from 'express';
import { roleService } from '../services/role.service';
import { permissionRepository } from '../repositories/permission.repository';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class RoleController {
  getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await roleService.getRoles();
      res.status(HTTP_STATUS.OK).json(successResponse('Roles retrieved successfully.', roles));
    } catch (error) {
      next(error);
    }
  };

  getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await roleService.getRoleById(req.params.id);
      res.status(HTTP_STATUS.OK).json(successResponse('Role retrieved successfully.', role));
    } catch (error) {
      next(error);
    }
  };

  createRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const role = await roleService.createRole(req.body, operatorId);
      res.status(HTTP_STATUS.CREATED).json(successResponse('Role created successfully.', role));
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const role = await roleService.updateRole(req.params.id, req.body, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Role updated successfully.', role));
    } catch (error) {
      next(error);
    }
  };

  deleteRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const result = await roleService.deleteRole(req.params.id, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };

  setPermissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const role = await roleService.setPermissions(req.params.id, req.body.permission_ids, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Role permissions updated.', role));
    } catch (error) {
      next(error);
    }
  };

  assignPermission = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const role = await roleService.assignPermission(req.params.id, req.body.permission_id, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Permission assigned to role.', role));
    } catch (error) {
      next(error);
    }
  };

  removePermission = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const role = await roleService.removePermission(req.params.id, req.params.permissionId, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Permission removed from role.', role));
    } catch (error) {
      next(error);
    }
  };

  getPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permissions = await permissionRepository.findAll();
      res.status(HTTP_STATUS.OK).json(successResponse('Permissions retrieved.', permissions));
    } catch (error) {
      next(error);
    }
  };
}

export const roleController = new RoleController();
export default roleController;
