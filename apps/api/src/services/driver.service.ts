import { driverRepository } from '../repositories/driver.repository';
import { query } from '../database';
import { ConflictError, NotFoundError, ValidationError } from '../helpers/errors';
import { Driver, DriverDocument } from '@transitops/types';
import { auditLogger } from '../utils/logger';

export class DriverService {
  async getDrivers(options: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    availability?: string;
  }) {
    return driverRepository.findAll(options);
  }

  async getDriverById(id: string) {
    const driver = await driverRepository.findById(id);
    if (!driver) throw new NotFoundError(`Driver with id '${id}' not found.`);
    return driver;
  }

  async getDriverDashboardStats() {
    return driverRepository.getDashboardStats();
  }

  private sanitizeInput(input: Partial<Driver>): Partial<Driver> {
    const sanitized = { ...input } as any;
    for (const key in sanitized) {
      if (sanitized[key] === '') {
        sanitized[key] = null;
      }
    }
    return sanitized;
  }

  async createDriver(input: Partial<Driver>, userId?: string) {
    const sanitized = this.sanitizeInput(input);
    // Unique check: employee_id
    let existing = await driverRepository.findByEmployeeId(sanitized.employee_id!);
    if (existing) {
      throw new ConflictError(`Employee ID '${sanitized.employee_id}' is already in use.`);
    }

    // Unique check: email
    existing = await driverRepository.findByEmail(sanitized.email!);
    if (existing) {
      throw new ConflictError(`Email '${sanitized.email}' is already registered.`);
    }

    // Unique check: phone
    existing = await driverRepository.findByPhone(sanitized.phone!);
    if (existing) {
      throw new ConflictError(`Phone number '${sanitized.phone}' is already registered.`);
    }

    // Unique check: license_number
    existing = await driverRepository.findByLicenseNumber(sanitized.license_number!);
    if (existing) {
      throw new ConflictError(`License number '${sanitized.license_number}' is already registered.`);
    }

    const driver = await driverRepository.create(sanitized);
    auditLogger.info(`Driver created: ${driver.id} (${driver.first_name} ${driver.last_name}) by user: ${userId}`);
    return driver;
  }

  async updateDriver(id: string, input: Partial<Driver>, userId?: string) {
    const sanitized = this.sanitizeInput(input);
    const existing = await driverRepository.findById(id);
    if (!existing) throw new NotFoundError(`Driver with id '${id}' not found.`);

    // Checks if values changed and are already taken
    if (sanitized.employee_id && sanitized.employee_id !== existing.employee_id) {
      const taken = await driverRepository.findByEmployeeId(sanitized.employee_id);
      if (taken) throw new ConflictError(`Employee ID '${sanitized.employee_id}' is already in use.`);
    }

    if (sanitized.email && sanitized.email !== existing.email) {
      const taken = await driverRepository.findByEmail(sanitized.email);
      if (taken) throw new ConflictError(`Email '${sanitized.email}' is already registered.`);
    }

    if (sanitized.phone && sanitized.phone !== existing.phone) {
      const taken = await driverRepository.findByPhone(sanitized.phone);
      if (taken) throw new ConflictError(`Phone number '${sanitized.phone}' is already registered.`);
    }

    if (sanitized.license_number && sanitized.license_number !== existing.license_number) {
      const taken = await driverRepository.findByLicenseNumber(sanitized.license_number);
      if (taken) throw new ConflictError(`License number '${sanitized.license_number}' is already registered.`);
    }

    // Business rule: Cannot assign inactive or suspended driver
    if (sanitized.availability === 'assigned' || sanitized.availability === 'driving') {
      const targetStatus = sanitized.status || existing.status;
      if (targetStatus === 'inactive' || targetStatus === 'suspended') {
        throw new ValidationError('Cannot assign an inactive or suspended driver.');
      }

      // Check if license is expired
      const expiryDateStr = sanitized.license_expiry || existing.license_expiry;
      if (expiryDateStr) {
        const expiryDate = new Date(expiryDateStr);
        if (expiryDate < new Date()) {
          throw new ValidationError('Cannot assign a driver with an expired driving license.');
        }
      }
    }

    const updated = await driverRepository.update(id, sanitized);
    auditLogger.info(`Driver updated: ${id} by user: ${userId}`);
    return updated;
  }

  async deleteDriver(id: string, userId?: string) {
    const existing = await driverRepository.findById(id);
    if (!existing) throw new NotFoundError(`Driver with id '${id}' not found.`);

    // Business rule: Cannot delete driver with active assignment
    if (existing.availability === 'assigned' || existing.availability === 'driving') {
      throw new ValidationError('Cannot delete a driver with an active vehicle assignment.');
    }

    await driverRepository.softDelete(id);
    auditLogger.info(`Driver soft deleted: ${id} by user: ${userId}`);
    return { message: 'Driver deleted successfully.' };
  }

  async restoreDriver(id: string, userId?: string) {
    const restored = await driverRepository.restore(id);
    if (!restored) throw new NotFoundError(`Driver with id '${id}' not found or not deleted.`);
    auditLogger.info(`Driver restored: ${id} by user: ${userId}`);
    return restored;
  }

  async updateDriverStatus(id: string, status: 'active' | 'inactive' | 'suspended', userId?: string) {
    const existing = await driverRepository.findById(id);
    if (!existing) throw new NotFoundError(`Driver with id '${id}' not found.`);

    // Business rule: if suspending/deactivating, verify they don't have active duty
    if ((status === 'inactive' || status === 'suspended') && 
        (existing.availability === 'assigned' || existing.availability === 'driving')) {
      throw new ValidationError('Cannot suspend or deactivate a driver with an active vehicle assignment.');
    }

    const updated = await driverRepository.updateStatus(id, status);
    auditLogger.info(`Driver status changed: ${id} to ${status} by user: ${userId}`);
    return updated;
  }

  // --- Document Service Methods ---

  async getDriverDocuments(driverId: string) {
    const driver = await driverRepository.findById(driverId);
    if (!driver) throw new NotFoundError(`Driver with id '${driverId}' not found.`);
    return driverRepository.findDocumentsByDriverId(driverId);
  }

  async uploadDriverDocument(driverId: string, input: Partial<DriverDocument>, userId?: string) {
    const driver = await driverRepository.findById(driverId);
    if (!driver) throw new NotFoundError(`Driver with id '${driverId}' not found.`);

    const document = await driverRepository.createDocument({
      ...input,
      driver_id: driverId,
      status: 'pending',
      verified: false
    });

    auditLogger.info(`Driver document uploaded: ${document.id} for driver: ${driverId} by user: ${userId}`);
    return document;
  }

  async verifyDriverDocument(docId: string, verified: boolean, remarks?: string, userId?: string) {
    const doc = await driverRepository.findDocumentById(docId);
    if (!doc) throw new NotFoundError(`Driver document with id '${docId}' not found.`);

    // Set verification fields in database directly
    const sql = `
      UPDATE driver_documents
      SET verified = $2, status = $3, verified_by = $4, verified_at = CURRENT_TIMESTAMP, notes = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;
    const status = verified ? 'active' : 'rejected';
    const result = await query(sql, [docId, verified, status, userId, remarks || doc.notes]);
    
    // Also, if the document is a driving license or medical certificate, update the main driver verification flag
    const updatedDoc = result.rows[0];
    if (verified) {
      if (updatedDoc.document_type === 'driving_license') {
        await driverRepository.update(doc.driver_id, { license_verified: true });
      } else if (updatedDoc.document_type === 'medical_certificate') {
        await driverRepository.update(doc.driver_id, { medical_certificate_verified: true });
      }
    }

    auditLogger.info(`Driver document verified: ${docId} (verified: ${verified}) by user: ${userId}`);
    return updatedDoc;
  }

  async deleteDriverDocument(docId: string, userId?: string) {
    const doc = await driverRepository.findDocumentById(docId);
    if (!doc) throw new NotFoundError(`Driver document with id '${docId}' not found.`);

    await driverRepository.deleteDocument(docId);
    
    // Update verification flag on driver if deleted
    if (doc.document_type === 'driving_license') {
      await driverRepository.update(doc.driver_id, { license_verified: false });
    } else if (doc.document_type === 'medical_certificate') {
      await driverRepository.update(doc.driver_id, { medical_certificate_verified: false });
    }

    auditLogger.info(`Driver document deleted: ${docId} by user: ${userId}`);
    return { message: 'Document deleted successfully.' };
  }
}

export const driverService = new DriverService();
export default driverService;
