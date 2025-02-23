// src/services/serviceabilityService.ts
import axios from 'axios';
import { ENV } from '../config/environment';
import { IItem } from '../interfaces/IItem';

/**
 * This service checks if the order is serviceable for the given address.
 * The microservice presumably uses MySQL behind the scenes.
 */
export class ServiceabilityService {
  static async checkServiceability(
    customerId: string,
    items: IItem[]
  ): Promise<boolean> {
    // const url = `${ENV.SERVICEABILITY_URL}/api/check`;
    // const response = await axios.post(url, {
    //   customerId,
    //   items
    //   // Possibly other data like address, location
    // });

    // if (response.status === 200 && response.data.isServiceable) {
    //   return true;
    // }

    // return false;
    // Always return true because of dummy calls
    return true;
  }
}