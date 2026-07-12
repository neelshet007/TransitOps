import { roleRepository, CreateRoleInput, UpdateRoleInput } from '../repositories/role.repository';
import { permissionRepository } from '../repositories/permission.repository';
import { ConflictError, NotFoundError } from '../helpers/errors';
import { activityRepository } from '../repositories/activity.repository';

export class RoleService {
  async getRoles() {
    return roleRepository.findAll();
  }

  async getRoleById(id: string) {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError(`Role with id '${id}' not found.`);
    return role;
  }

  async createRole(input: CreateRoleInput, operatorId?: string) {
    const existing = await roleRepository.findByCode(input.code);
    if (existing) throw new ConflictError(`A role with code '${input.code}' already exists.`);
    const role = await roleRepository.create(input);
    if (!role) throw new Error('Failed to create role.');

    await activityRepository.log({
      user_id: operatorId,
      action: 'ROLE_CREATED',
      details: `Role created: ${role.name} (${role.code})`
    });

    return role;
  }

  async updateRole(id: string, input: UpdateRoleInput, operatorId?: string) {
    const existing = await roleRepository.findById(id);
    if (!existing) throw new NotFoundError(`Role with id '${id}' not found.`);
    const updated = await roleRepository.update(id, input);
    if (!updated) throw new Error('Failed to update role.');

    await activityRepository.log({
      user_id: operatorId,
      action: 'ROLE_UPDATED',
      details: `Role updated: ${updated.name}`
    });

    return updated;
  }

  async deleteRole(id: string, operatorId?: string) {
    const existing = await roleRepository.findById(id);
    if (!existing) throw new NotFoundError(`Role with id '${id}' not found.`);
    const deleted = await roleRepository.softDelete(id);
    if (!deleted) throw new Error('Failed to delete role.');

    await activityRepository.log({
      user_id: operatorId,
      action: 'ROLE_DELETED',
      details: `Role deleted: ${existing.name}`
    });

    return { message: 'Role deleted successfully.' };
  }

  async setPermissions(roleId: string, permissionIds: string[], operatorId?: string) {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new NotFoundError(`Role with id '${roleId}' not found.`);

    // Validate all permission IDs exist
    for (const permId of permissionIds) {
      const perm = await permissionRepository.findById(permId);
      if (!perm) throw new NotFoundError(`Permission with id '${permId}' not found.`);
    }

    await roleRepository.setPermissions(roleId, permissionIds);

    await activityRepository.log({
      user_id: operatorId,
      action: 'PERMISSION_CHANGED',
      details: `Permissions updated for role: ${role.name}`
    });

    return roleRepository.findById(roleId);
  }

  async assignPermission(roleId: string, permissionId: string, operatorId?: string) {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new NotFoundError(`Role with id '${roleId}' not found.`);
    const perm = await permissionRepository.findById(permissionId);
    if (!perm) throw new NotFoundError(`Permission with id '${permissionId}' not found.`);
    await roleRepository.assignPermission(roleId, permissionId);

    await activityRepository.log({
      user_id: operatorId,
      action: 'PERMISSION_CHANGED',
      details: `Permission ${perm.name} assigned to role: ${role.name}`
    });

    return roleRepository.findById(roleId);
  }

  async removePermission(roleId: string, permissionId: string, operatorId?: string) {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new NotFoundError(`Role with id '${roleId}' not found.`);
    const perm = await permissionRepository.findById(permissionId);
    if (!perm) throw new NotFoundError(`Permission with id '${permissionId}' not found.`);
    await roleRepository.removePermission(roleId, permissionId);

    await activityRepository.log({
      user_id: operatorId,
      action: 'PERMISSION_CHANGED',
      details: `Permission ${perm.name} removed from role: ${role.name}`
    });

    return roleRepository.findById(roleId);
  }
}

export const roleService = new RoleService();
export default roleService;
