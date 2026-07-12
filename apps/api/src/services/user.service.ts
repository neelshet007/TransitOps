import { userRepository, CreateUserInput, UpdateUserInput } from '../repositories/user.repository';
import { ConflictError, NotFoundError } from '../helpers/errors';
import { activityRepository } from '../repositories/activity.repository';

export class UserService {
  async getUsers(options: {
    page: number;
    limit: number;
    search?: string;
    is_active?: boolean;
  }) {
    return userRepository.findAll(options);
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError(`User with id '${id}' not found.`);
    return user;
  }

  async createUser(input: CreateUserInput, operatorId?: string) {
    // Check email uniqueness
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError(`A user with email '${input.email}' already exists.`);
    const user = await userRepository.create(input);
    if (!user) throw new Error('Failed to create user.');

    await activityRepository.log({
      user_id: operatorId,
      action: 'USER_CREATED',
      details: `User account created: ${user.email} (${user.first_name} ${user.last_name})`
    });

    return user;
  }

  async updateUser(id: string, input: UpdateUserInput, operatorId?: string) {
    // Check user exists
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id '${id}' not found.`);

    // Check email uniqueness if updating email
    if (input.email && input.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(input.email);
      if (emailTaken) throw new ConflictError(`Email '${input.email}' is already in use.`);
    }

    const updated = await userRepository.update(id, input);
    if (!updated) throw new Error('Failed to update user.');

    await activityRepository.log({
      user_id: operatorId,
      action: 'USER_UPDATED',
      details: `User account updated: ${updated.email}`
    });

    return updated;
  }

  async deleteUser(id: string, operatorId?: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id '${id}' not found.`);
    const deleted = await userRepository.softDelete(id);
    if (!deleted) throw new Error('Failed to delete user.');

    await activityRepository.log({
      user_id: operatorId,
      action: 'USER_DELETED',
      details: `User account deleted: ${existing.email}`
    });

    return { message: 'User deleted successfully.' };
  }

  async resetPassword(id: string, newPassword: string, operatorId?: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id '${id}' not found.`);
    const done = await userRepository.resetPassword(id, newPassword);
    if (!done) throw new Error('Failed to reset password.');

    await activityRepository.log({
      user_id: operatorId,
      action: 'PASSWORD_CHANGED',
      details: `Password reset for user: ${existing.email}`
    });

    return { message: 'Password reset successfully.' };
  }

  async assignRole(userId: string, roleId: string, operatorId?: string) {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new NotFoundError(`User with id '${userId}' not found.`);
    await userRepository.assignRole(userId, roleId);

    await activityRepository.log({
      user_id: operatorId,
      action: 'PERMISSION_CHANGED',
      details: `Role assigned to user: ${existing.email}`
    });

    return this.getUserById(userId);
  }

  async removeRole(userId: string, roleId: string, operatorId?: string) {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new NotFoundError(`User with id '${userId}' not found.`);
    await userRepository.removeRole(userId, roleId);

    await activityRepository.log({
      user_id: operatorId,
      action: 'PERMISSION_CHANGED',
      details: `Role removed from user: ${existing.email}`
    });

    return this.getUserById(userId);
  }
}

export const userService = new UserService();
export default userService;
