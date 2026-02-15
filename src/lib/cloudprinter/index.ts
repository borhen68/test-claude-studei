/**
 * CloudPrinter Integration - Main Export
 */

// Client
export { CloudPrinterClient, cloudPrinterClient, isCloudPrinterConfigured } from './client';

// Service
export { 
  createCloudPrinterOrder, 
  getCloudPrinterOrderStatus,
  syncOrderStatus,
  mapCloudPrinterStatus 
} from './service';

// Products
export {
  FRAMETALE_PRODUCTS,
  SHIPPING_LEVELS,
  getProductById,
  getProductBySku,
  getDefaultProduct,
  isValidPageCount,
  calculatePrice,
  formatPrice,
} from './products';

// Files
export {
  generateMD5,
  generateMD5FromFile,
  uploadPDFWithMD5,
  uploadPDFFileWithMD5,
  prepareBookFiles,
  isValidPDF,
  getPDFPageCount,
  mockFileUpload,
} from './files';

// Types
export type {
  ShippingLevel,
  AddressType,
  FileType,
  OrderStatus,
  CloudPrinterAddress,
  CloudPrinterFile,
  CloudPrinterOption,
  CloudPrinterItem,
  CloudPrinterOrderRequest,
  CloudPrinterOrderResponse,
  CloudPrinterOrderStatusResponse,
  CloudPrinterProduct,
  CloudPrinterProductsResponse,
  CloudPrinterWebhook,
  FrametaleProduct,
  CreateOrderParams,
} from './types';
