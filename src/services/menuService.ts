// src/services/menuService.ts
import axios from 'axios';
import { ENV } from '../config/environment';
import { IItem } from '../interfaces/IItem';

/**
 * This service is responsible for validating the items with the Menu API (MongoDB).
 */
export class MenuService {
  static async validateItems(items: IItem[]): Promise<boolean> {
    // Example call to external Menu Service
    // We are just doing a dummy check, you would do actual logic.
    const url = `${ENV.MENU_SERVICE_URL}/api/menu/validate`;

    //const response = await axios.post(url, { items });
    // Return boolean based on external response
    // if (response.status === 200 && response.data.isValid) {
    //   return true;
    // }

    // return false; 
    // Always return true because of dummy calls
    return true;
  }
}