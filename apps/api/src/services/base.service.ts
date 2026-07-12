import { BaseRepository, FindOptions } from '../repositories/base.repository';
import { NotFoundError } from '../helpers/errors';
import { handleDatabaseError } from '../helpers/db-errors';
import { activityRepository } from '../repositories/activity.repository';
import { logger } from '../utils/logger';

export abstract class BaseService<T> {
  protected abstract repository: BaseRepository<T>;
  protected abstract entityName: string;

  async getAll(options: FindOptions = {}) {
    try {
      return await this.repository.find(options);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getById(id: string): Promise<T> {
    try {
      const record = await this.repository.findById(id);
      if (!record) {
        throw new NotFoundError(`${this.entityName} with ID '${id}' not found.`);
      }
      return record;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async create(data: Partial<T>, operatorId?: string): Promise<T> {
    try {
      const record = await this.repository.create(data);
      
      // Audit trail logging
      await activityRepository.log({
        user_id: operatorId,
        action: `${this.entityName.toUpperCase()}_CREATED`,
        details: `Created new ${this.entityName}. ID: ${(record as any).id || 'N/A'}`
      });

      return record;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async update(id: string, data: Partial<T>, operatorId?: string): Promise<T> {
    try {
      const record = await this.repository.update(id, data);
      if (!record) {
        throw new NotFoundError(`${this.entityName} with ID '${id}' not found.`);
      }

      // Audit trail logging
      await activityRepository.log({
        user_id: operatorId,
        action: `${this.entityName.toUpperCase()}_UPDATED`,
        details: `Updated ${this.entityName}. ID: ${id}`
      });

      return record;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async delete(id: string, operatorId?: string): Promise<void> {
    try {
      const success = await this.repository.softDelete(id);
      if (!success) {
        throw new NotFoundError(`${this.entityName} with ID '${id}' not found.`);
      }

      // Audit trail logging
      await activityRepository.log({
        user_id: operatorId,
        action: `${this.entityName.toUpperCase()}_DELETED`,
        details: `Deleted ${this.entityName}. ID: ${id}`
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
