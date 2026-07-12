import { Request, Response, NextFunction } from 'express';
import { query } from '../database';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { ValidationError, NotFoundError } from '../helpers/errors';

export class LookupController {
  /**
   * Dynamic lookup endpoint returning base details for select options.
   */
  getLookup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { entity } = req.params;
      let sql = '';

      switch (entity.toLowerCase()) {
        case 'users':
          sql = `SELECT id, first_name || ' ' || last_name as label, email FROM users WHERE deleted_at IS NULL ORDER BY label ASC`;
          break;
        case 'roles':
          sql = `SELECT id, name as label, code FROM roles WHERE deleted_at IS NULL ORDER BY label ASC`;
          break;
        case 'drivers':
          sql = `SELECT id, first_name || ' ' || last_name as label, employee_id, availability, status FROM drivers WHERE deleted_at IS NULL ORDER BY label ASC`;
          break;
        case 'vehicles':
          sql = `SELECT id, plate_number as label, make, model, status FROM vehicles WHERE deleted_at IS NULL ORDER BY label ASC`;
          break;
        default:
          throw new ValidationError(`Unsupported lookup entity: '${entity}'. Supported: users, roles, drivers, vehicles`);
      }

      const result = await query(sql);
      res.status(HTTP_STATUS.OK).json(successResponse(`${entity} lookup fetched successfully.`, result.rows));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Global cross-entity search bar query.
   */
  globalSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = req.query.q as string;
      if (!q || q.trim() === '') {
        throw new ValidationError('Search term "q" is required.');
      }

      const searchTerm = `%${q.trim()}%`;
      const searchResults: any[] = [];

      // 1. Search Users
      const usersSql = `
        SELECT 'User' as type, id, first_name || ' ' || last_name as title, email as subtitle, '/users' as target_url
        FROM users
        WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1) AND deleted_at IS NULL
        LIMIT 5
      `;
      const usersRes = await query(usersSql, [searchTerm]);
      searchResults.push(...usersRes.rows);

      // 2. Search Roles
      const rolesSql = `
        SELECT 'Role' as type, id, name as title, code as subtitle, '/roles' as target_url
        FROM roles
        WHERE (name ILIKE $1 OR code ILIKE $1) AND deleted_at IS NULL
        LIMIT 5
      `;
      const rolesRes = await query(rolesSql, [searchTerm]);
      searchResults.push(...rolesRes.rows);

      // 3. Search Drivers
      const driversSql = `
        SELECT 'Driver' as type, id, first_name || ' ' || last_name as title, 'Employee ID: ' || employee_id as subtitle, '/drivers' as target_url
        FROM drivers
        WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR employee_id ILIKE $1 OR license_number ILIKE $1) AND deleted_at IS NULL
        LIMIT 5
      `;
      const driversRes = await query(driversSql, [searchTerm]);
      searchResults.push(...driversRes.rows);

      // 4. Search Vehicles
      const vehiclesSql = `
        SELECT 'Vehicle' as type, id, plate_number as title, make || ' ' || model as subtitle, '/vehicles' as target_url
        FROM vehicles
        WHERE (plate_number ILIKE $1 OR make ILIKE $1 OR model ILIKE $1) AND deleted_at IS NULL
        LIMIT 5
      `;
      const vehiclesRes = await query(vehiclesSql, [searchTerm]);
      searchResults.push(...vehiclesRes.rows);

      res.status(HTTP_STATUS.OK).json(successResponse('Search results retrieved.', searchResults));
    } catch (error) {
      next(error);
    }
  };
}

export const lookupController = new LookupController();
export default lookupController;
