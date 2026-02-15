/**
 * CloudPrinter API Client
 * Handles all communication with CloudPrinter API
 */

import type {
  CloudPrinterOrderRequest,
  CloudPrinterOrderResponse,
  CloudPrinterOrderStatusResponse,
  CloudPrinterProductsResponse,
} from './types';

const CLOUDPRINTER_API_URL = process.env.CLOUDPRINTER_API_URL || 'https://api.cloudprinter.com/cloudcore/1.0';
const CLOUDPRINTER_API_KEY = process.env.CLOUDPRINTER_API_KEY;

// Mock mode for development without API key
const MOCK_MODE = !CLOUDPRINTER_API_KEY || CLOUDPRINTER_API_KEY === 'your_api_key_here';

/**
 * CloudPrinter API Client Class
 */
export class CloudPrinterClient {
  private apiKey: string;
  private baseUrl: string;
  private mockMode: boolean;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || CLOUDPRINTER_API_KEY || '';
    this.baseUrl = baseUrl || CLOUDPRINTER_API_URL;
    this.mockMode = MOCK_MODE;

    if (this.mockMode) {
      console.warn('⚠️  CloudPrinter running in MOCK MODE - no real orders will be created');
    }
  }

  /**
   * Create a new print order
   */
  async createOrder(orderData: Omit<CloudPrinterOrderRequest, 'apikey'>): Promise<CloudPrinterOrderResponse> {
    if (this.mockMode) {
      return this.mockCreateOrder(orderData);
    }

    try {
      const response = await fetch(`${this.baseUrl}/orders/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          apikey: this.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`CloudPrinter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as CloudPrinterOrderResponse;
    } catch (error) {
      console.error('CloudPrinter createOrder error:', error);
      throw new Error(`Failed to create CloudPrinter order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string): Promise<CloudPrinterOrderStatusResponse> {
    if (this.mockMode) {
      return this.mockGetOrderStatus(orderId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/orders/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apikey: this.apiKey,
          order_id: orderId,
        }),
      });

      if (!response.ok) {
        throw new Error(`CloudPrinter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as CloudPrinterOrderStatusResponse;
    } catch (error) {
      console.error('CloudPrinter getOrderStatus error:', error);
      throw new Error(`Failed to get order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available products catalog
   */
  async getProducts(): Promise<CloudPrinterProductsResponse> {
    if (this.mockMode) {
      return this.mockGetProducts();
    }

    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apikey: this.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`CloudPrinter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as CloudPrinterProductsResponse;
    } catch (error) {
      console.error('CloudPrinter getProducts error:', error);
      throw new Error(`Failed to get products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List all orders
   */
  async listOrders(params?: { limit?: number; offset?: number }): Promise<any> {
    if (this.mockMode) {
      return this.mockListOrders();
    }

    try {
      const response = await fetch(`${this.baseUrl}/orders/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apikey: this.apiKey,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error(`CloudPrinter API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CloudPrinter listOrders error:', error);
      throw new Error(`Failed to list orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Mock implementations for development
   */

  private mockCreateOrder(orderData: Omit<CloudPrinterOrderRequest, 'apikey'>): CloudPrinterOrderResponse {
    console.log('📦 [MOCK] Creating CloudPrinter order:', orderData.reference);
    
    return {
      success: true,
      order_id: `mock_cp_${Date.now()}`,
      reference: orderData.reference,
    };
  }

  private mockGetOrderStatus(orderId: string): CloudPrinterOrderStatusResponse {
    console.log('📊 [MOCK] Getting order status:', orderId);
    
    return {
      success: true,
      order: {
        id: orderId,
        reference: `order_${orderId}`,
        status: 'processing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [
          {
            reference: 'item-1',
            status: 'processing',
          },
        ],
      },
    };
  }

  private mockGetProducts(): CloudPrinterProductsResponse {
    console.log('📚 [MOCK] Getting products catalog');
    
    return {
      success: true,
      products: [
        {
          sku: 'book_hardcover_21x21',
          name: 'Hardcover Photo Book 21x21cm (8x8")',
          category: 'books',
          price: 25.00,
          currency: 'USD',
          options: [
            {
              type: 'total_pages',
              values: ['20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60'],
              required: true,
            },
            {
              type: 'paper_130mcg',
              values: ['130mcg'],
              required: true,
            },
          ],
        },
        {
          sku: 'book_hardcover_25x25',
          name: 'Hardcover Photo Book 25x25cm (10x10")',
          category: 'books',
          price: 32.00,
          currency: 'USD',
          options: [
            {
              type: 'total_pages',
              values: ['20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60'],
              required: true,
            },
            {
              type: 'paper_130mcg',
              values: ['130mcg'],
              required: true,
            },
          ],
        },
        {
          sku: 'book_hardcover_30x30',
          name: 'Hardcover Photo Book 30x30cm (12x12")',
          category: 'books',
          price: 39.00,
          currency: 'USD',
          options: [
            {
              type: 'total_pages',
              values: ['20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60'],
              required: true,
            },
            {
              type: 'paper_130mcg',
              values: ['130mcg'],
              required: true,
            },
          ],
        },
      ],
    };
  }

  private mockListOrders(): any {
    console.log('📋 [MOCK] Listing orders');
    
    return {
      success: true,
      orders: [],
    };
  }
}

/**
 * Default client instance
 */
export const cloudPrinterClient = new CloudPrinterClient();

/**
 * Helper function to check if CloudPrinter is configured
 */
export function isCloudPrinterConfigured(): boolean {
  return !MOCK_MODE;
}
