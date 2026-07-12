import { BaseService } from './base.service';
import { FuelLog } from '@transitops/types';
import { fuelRepository } from '../repositories/fuel.repository';
import { expenseRepository } from '../repositories/expense.repository';
import { activityRepository } from '../repositories/activity.repository';
import { vehicleRepository } from '../repositories/vehicle.repository';
import { ValidationError, NotFoundError } from '../helpers/errors';
import { withTransaction } from '../database/transaction';
import { query } from '../database';

export class FuelService extends BaseService<FuelLog> {
  protected repository = fuelRepository;
  protected entityName = 'Fuel Log';

  async getDashboardStats() {
    return fuelRepository.getDashboardStats();
  }

  async getAnalytics() {
    return fuelRepository.getAnalytics();
  }

  private validateFuelData(data: Partial<FuelLog>) {
    if (!data.vehicle_id) {
      throw new ValidationError('A Vehicle must be assigned to this fuel log.');
    }
    if (Number(data.quantity || 0) <= 0) {
      throw new ValidationError('Fuel quantity must be greater than zero.');
    }
    if (Number(data.price_per_liter || 0) <= 0) {
      throw new ValidationError('Price per liter must be greater than zero.');
    }
    if (new Date(data.fuel_date as string) > new Date()) {
      throw new ValidationError('Fuel date cannot be in the future.');
    }
  }

  async createFuelLog(data: Partial<FuelLog>, operatorId?: string): Promise<FuelLog> {
    this.validateFuelData(data);

    const quantity = Number(data.quantity || 0);
    const price_per_liter = Number(data.price_per_liter || 0);
    const total_cost = quantity * price_per_liter;
    
    // Auto calculate mileage based on previous odometer (simple logic)
    let mileage = data.mileage || null;
    const currentOdo = Number(data.odometer || 0);

    return withTransaction(async (client) => {
      // Find fuel category for expenses
      const catRes = await query(`SELECT id FROM expense_categories WHERE name = 'Fuel' LIMIT 1`);
      let fuelCategoryId = catRes.rows[0]?.id;
      
      if (!fuelCategoryId) {
         // Create default fuel category if it doesn't exist just in case
         const newCat = await query(`INSERT INTO expense_categories (name) VALUES ('Fuel') RETURNING id`);
         fuelCategoryId = newCat.rows[0].id;
      }

      // 1. Create Fuel Log
      const record = await fuelRepository.create({
        ...data,
        total_cost,
        mileage
      });

      // 2. Create matching Expense record
      await expenseRepository.create({
        vehicle_id: data.vehicle_id,
        driver_id: data.driver_id,
        trip_id: data.trip_id,
        expense_category_id: fuelCategoryId,
        amount: total_cost,
        expense_date: data.fuel_date ? new Date(data.fuel_date) : new Date(),
        notes: `Fuel logged: ${quantity}L at ${price_per_liter}/L. ${data.notes || ''}`.trim(),
        status: 'paid',
        created_by: operatorId
      });

      // 3. Update Vehicle Odometer if greater
      if (currentOdo > 0) {
        // Here we could add a check or just update it via query
        await query(`UPDATE vehicles SET mileage = GREATEST(mileage, $1) WHERE id = $2`, [currentOdo, data.vehicle_id]);
      }

      // 4. Log Activity
      await activityRepository.log({
        user_id: operatorId,
        action: 'FUEL_LOGGED',
        details: `Logged ${quantity}L fuel for vehicle ${data.vehicle_id} costing ${total_cost}`
      });

      return record;
    });
  }
}

export const fuelService = new FuelService();
export default fuelService;
