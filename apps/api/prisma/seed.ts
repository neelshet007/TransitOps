import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Define standard roles
  const roles = [
    { name: 'Administrator', code: 'admin', description: 'System Administrator with full access' },
    { name: 'Operator', code: 'operator', description: 'Fleet and dispatch operator' },
    { name: 'Driver', code: 'driver', description: 'Vehicle driver' },
    { name: 'Maintenance Staff', code: 'maintenance', description: 'Maintenance technician' },
  ];

  console.log('Creating roles...');
  const roleMap: Record<string, any> = {};
  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
    roleMap[role.code] = createdRole;
  }

  // 2. Define standard permissions
  const permissions = [
    { name: 'View Users', code: 'users:view', description: 'View user accounts' },
    { name: 'Create Users', code: 'users:create', description: 'Create user accounts' },
    { name: 'Edit Users', code: 'users:edit', description: 'Edit user accounts' },
    { name: 'Delete Users', code: 'users:delete', description: 'Delete user accounts' },
    
    { name: 'View Vehicles', code: 'vehicles:view', description: 'View fleet vehicles' },
    { name: 'Create Vehicles', code: 'vehicles:create', description: 'Add new vehicles' },
    { name: 'Edit Vehicles', code: 'vehicles:edit', description: 'Edit vehicles' },
    { name: 'Delete Vehicles', code: 'vehicles:delete', description: 'Remove vehicles' },

    { name: 'View Drivers', code: 'drivers:view', description: 'View system drivers' },
    { name: 'Create Drivers', code: 'drivers:create', description: 'Add system drivers' },
    { name: 'Edit Drivers', code: 'drivers:edit', description: 'Edit driver profiles' },
    
    { name: 'View Trips', code: 'trips:view', description: 'View trip dispatch logs' },
    { name: 'Create Trips', code: 'trips:create', description: 'Schedule new trips' },
    { name: 'Edit Trips', code: 'trips:edit', description: 'Modify active trips' },
    
    { name: 'View Fuel Logs', code: 'fuel:view', description: 'View fuel logs' },
    { name: 'Create Fuel Logs', code: 'fuel:create', description: 'Add new fuel logs' },

    { name: 'View Maintenance', code: 'maintenance:view', description: 'View maintenance logs' },
    { name: 'Manage Maintenance', code: 'maintenance:manage', description: 'Schedule or update maintenance' },

    { name: 'View Expenses', code: 'expenses:view', description: 'View system expenses' },
    { name: 'Create Expenses', code: 'expenses:create', description: 'Log new expenses' },
    
    { name: 'View Reports', code: 'reports:view', description: 'View operations reports' },
    { name: 'Manage Settings', code: 'settings:manage', description: 'Update application settings' },
  ];

  console.log('Creating permissions...');
  const permMap: Record<string, any> = {};
  for (const perm of permissions) {
    const createdPerm = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
    permMap[perm.code] = createdPerm;
  }

  // 3. Map permissions to admin and operator roles
  console.log('Configuring role-permission mappings...');
  const adminRole = roleMap['admin'];
  const operatorRole = roleMap['operator'];

  // Admin gets all permissions
  for (const perm of Object.values(permMap)) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: perm.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: perm.id,
      },
    });
  }

  // Operator gets a subset of permissions
  const operatorPermCodes = [
    'vehicles:view', 'vehicles:create', 'vehicles:edit',
    'drivers:view', 'drivers:create', 'drivers:edit',
    'trips:view', 'trips:create', 'trips:edit',
    'fuel:view', 'fuel:create',
    'maintenance:view', 'maintenance:manage',
    'expenses:view', 'expenses:create',
    'reports:view'
  ];

  for (const code of operatorPermCodes) {
    const perm = permMap[code];
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: operatorRole.id,
            permission_id: perm.id,
          },
        },
        update: {},
        create: {
          role_id: operatorRole.id,
          permission_id: perm.id,
        },
      });
    }
  }

  // 4. Create default administrative user
  console.log('Creating default admin user...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@transitops.com' },
    update: {},
    create: {
      email: 'admin@transitops.com',
      password_hash: passwordHash,
      first_name: 'System',
      last_name: 'Administrator',
      is_active: true,
    },
  });

  // Assign admin role to user
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: adminRole.id,
      },
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: adminRole.id,
    },
  });

  console.log('✨ Seeding completed successfully!');
  console.log('Admin Login Details:');
  console.log('Email: admin@transitops.com');
  console.log('Password: Password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
