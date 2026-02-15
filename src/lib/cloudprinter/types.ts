/**
 * CloudPrinter API TypeScript Types
 * Documentation: https://docs.cloudprinter.com/client/cloudprinter-core-api-v1-0.html
 */

export type ShippingLevel = 'cp_saver' | 'cp_standard' | 'cp_express';

export type AddressType = 'delivery' | 'billing' | 'return';

export type FileType = 'cover' | 'book' | 'content' | 'page';

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'error';

export interface CloudPrinterAddress {
  type: AddressType;
  company?: string;
  firstname: string;
  lastname: string;
  street1: string;
  street2?: string;
  zip: string;
  city: string;
  state?: string;
  country: string;
  email: string;
  phone?: string;
}

export interface CloudPrinterFile {
  type: FileType;
  url: string;
  md5sum: string;
}

export interface CloudPrinterOption {
  type: string;
  count?: string;
  value?: string;
}

export interface CloudPrinterItem {
  reference: string;
  product: string;
  shipping_level: ShippingLevel;
  title: string;
  count: string;
  files: CloudPrinterFile[];
  options: CloudPrinterOption[];
}

export interface CloudPrinterOrderRequest {
  apikey: string;
  reference: string;
  email: string;
  addresses: CloudPrinterAddress[];
  items: CloudPrinterItem[];
  meta?: Record<string, string>;
}

export interface CloudPrinterOrderResponse {
  success: boolean;
  order_id?: string;
  reference?: string;
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

export interface CloudPrinterOrderStatusResponse {
  success: boolean;
  order?: {
    id: string;
    reference: string;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
    items: Array<{
      reference: string;
      status: string;
      tracking?: {
        number: string;
        url: string;
        carrier: string;
      };
    }>;
  };
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

export interface CloudPrinterProduct {
  sku: string;
  name: string;
  description?: string;
  category: string;
  price?: number;
  currency?: string;
  options: Array<{
    type: string;
    values: string[];
    required: boolean;
  }>;
}

export interface CloudPrinterProductsResponse {
  success: boolean;
  products?: CloudPrinterProduct[];
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

export interface CloudPrinterWebhook {
  event: 'order.created' | 'order.processing' | 'order.in_production' | 'order.shipped' | 'order.delivered' | 'order.cancelled' | 'order.error';
  order_id: string;
  reference: string;
  timestamp: string;
  data: {
    status: OrderStatus;
    items?: Array<{
      reference: string;
      status: string;
      tracking?: {
        number: string;
        url: string;
        carrier: string;
      };
    }>;
  };
}

/**
 * Frametale-specific types
 */

export interface FrametaleProduct {
  id: string;
  name: string;
  cloudprinterSku: string;
  basePrice: number;
  sizes: {
    code: string;
    name: string;
    dimensions: string;
  }[];
  paperOptions: {
    code: string;
    name: string;
    weight: string;
  }[];
  minPages: number;
  maxPages: number;
}

export interface CreateOrderParams {
  bookId: string;
  orderId: string;
  email: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };
  product: {
    sku: string;
    pageCount: number;
    paperType?: string;
    coverType?: string;
  };
  files: {
    coverUrl: string;
    contentUrl: string;
  };
  shippingLevel?: ShippingLevel;
}
