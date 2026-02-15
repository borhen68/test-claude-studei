/**
 * Printful API Client for print fulfillment
 * Docs: https://developers.printful.com/docs/
 */

const PRINTFUL_API_URL = 'https://api.printful.com';
const API_KEY = process.env.PRINTFUL_API_KEY || '';

interface PrintfulError {
  code: number;
  message: string;
  result?: any;
}

class PrintfulClient {
  private headers: HeadersInit;

  constructor(apiKey: string) {
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${PRINTFUL_API_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.headers, ...options?.headers },
      });

      const data = await response.json();

      if (!response.ok) {
        const error: PrintfulError = data.error || data;
        throw new Error(`Printful API error: ${error.message || 'Unknown error'}`);
      }

      return data.result as T;
    } catch (error) {
      console.error('Printful API request failed:', error);
      throw error;
    }
  }

  /**
   * Upload file to Printful
   */
  async uploadFile(fileUrl: string, fileName: string): Promise<{ id: string; url: string }> {
    return this.request('/files', {
      method: 'POST',
      body: JSON.stringify({
        type: 'default',
        url: fileUrl,
        filename: fileName,
        options: {
          printfile_id: null,
        },
      }),
    });
  }

  /**
   * Create order
   */
  async createOrder(params: {
    recipient: {
      name: string;
      address1: string;
      address2?: string;
      city: string;
      state_code: string;
      country_code: string;
      zip: string;
      email?: string;
      phone?: string;
    };
    items: Array<{
      variant_id: number; // Printful product variant ID
      quantity: number;
      files: Array<{ id: string }>;
    }>;
    externalId?: string;
  }): Promise<{
    id: number;
    external_id: string;
    status: string;
    shipping: string;
    costs: any;
  }> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<any> {
    return this.request(`/orders/${orderId}`);
  }

  /**
   * Get shipping rates
   */
  async getShippingRates(params: {
    recipient: {
      country_code: string;
      state_code?: string;
      city?: string;
      zip?: string;
    };
    items: Array<{
      variant_id: number;
      quantity: number;
    }>;
  }): Promise<Array<{ id: string; name: string; rate: string }>> {
    return this.request('/shipping/rates', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get product variants
   */
  async getProductVariants(productId: number): Promise<any[]> {
    return this.request(`/products/${productId}`);
  }

  /**
   * Confirm order (submit for fulfillment)
   */
  async confirmOrder(orderId: string): Promise<any> {
    return this.request(`/orders/${orderId}/confirm`, {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const printfulClient = API_KEY ? new PrintfulClient(API_KEY) : null;

/**
 * Create and submit print order
 */
export async function submitPrintOrder(params: {
  bookId: string;
  pdfUrl: string;
  recipient: {
    name: string;
    email: string;
    phone?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}): Promise<{ orderId: string; status: string }> {
  if (!printfulClient) {
    throw new Error('Printful not configured');
  }

  try {
    // 1. Upload PDF to Printful
    const file = await printfulClient.uploadFile(params.pdfUrl, `${params.bookId}.pdf`);

    // 2. Create order (using hardcover photo book variant)
    // TODO: Get actual variant ID from Printful catalog
    const PHOTOBOOK_VARIANT_ID = parseInt(process.env.PRINTFUL_BOOK_VARIANT_ID || '0');

    const order = await printfulClient.createOrder({
      recipient: {
        name: params.recipient.name,
        address1: params.recipient.address1,
        address2: params.recipient.address2,
        city: params.recipient.city,
        state_code: params.recipient.state,
        country_code: params.recipient.country,
        zip: params.recipient.zip,
        email: params.recipient.email,
        phone: params.recipient.phone,
      },
      items: [
        {
          variant_id: PHOTOBOOK_VARIANT_ID,
          quantity: 1,
          files: [{ id: file.id }],
        },
      ],
      externalId: params.bookId,
    });

    // 3. Confirm order (submit for production)
    await printfulClient.confirmOrder(order.id.toString());

    return {
      orderId: order.id.toString(),
      status: 'submitted',
    };
  } catch (error) {
    console.error('Printful order submission failed:', error);
    throw new Error(`Failed to submit print order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get order tracking info
 */
export async function getOrderTracking(printfulOrderId: string): Promise<{
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
}> {
  if (!printfulClient) {
    throw new Error('Printful not configured');
  }

  try {
    const order = await printfulClient.getOrder(printfulOrderId);
    
    return {
      status: order.status,
      trackingNumber: order.shipments?.[0]?.tracking_number,
      trackingUrl: order.shipments?.[0]?.tracking_url,
      carrier: order.shipments?.[0]?.carrier,
    };
  } catch (error) {
    console.error('Failed to get tracking info:', error);
    throw new Error('Failed to retrieve tracking information');
  }
}
