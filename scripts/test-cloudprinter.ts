/**
 * CloudPrinter Integration Test Script
 * Run with: npx tsx scripts/test-cloudprinter.ts
 */

import { 
  cloudPrinterClient,
  isCloudPrinterConfigured,
  createCloudPrinterOrder,
  getProductBySku,
  calculatePrice,
  formatPrice,
  FRAMETALE_PRODUCTS,
  SHIPPING_LEVELS,
} from '../src/lib/cloudprinter';

console.log('🧪 CloudPrinter Integration Test\n');

async function testProductCatalog() {
  console.log('📚 Testing Product Catalog...');
  
  console.log('\nFrametale Products:');
  FRAMETALE_PRODUCTS.forEach(product => {
    const price = calculatePrice(product, 36);
    console.log(`  - ${product.name} (${product.cloudprinterSku}): ${formatPrice(price)}`);
  });

  console.log('\nShipping Levels:');
  Object.entries(SHIPPING_LEVELS).forEach(([key, level]) => {
    console.log(`  - ${level.name}: ${level.description} (${formatPrice(level.price)})`);
  });

  console.log('\n✅ Product catalog OK\n');
}

async function testCloudPrinterAPI() {
  console.log('🔌 Testing CloudPrinter API...');
  console.log('Mode:', isCloudPrinterConfigured() ? 'LIVE' : 'MOCK');

  try {
    // Test products endpoint
    const products = await cloudPrinterClient.getProducts();
    console.log(`\nProducts available: ${products.products?.length || 0}`);

    // Test order creation (mock)
    const testOrder = {
      bookId: 'test_book_123',
      orderId: 'test_order_456',
      email: 'test@example.com',
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Test St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
      },
      product: {
        sku: 'book_hardcover_30x30',
        pageCount: 36,
        paperType: 'paper_130mcg' as const,
      },
      files: {
        coverUrl: 'https://cdn.example.com/cover.pdf',
        contentUrl: 'https://cdn.example.com/content.pdf',
      },
      shippingLevel: 'cp_standard' as const,
    };

    const orderResponse = await createCloudPrinterOrder(testOrder);
    
    if (orderResponse.success) {
      console.log(`\n✅ Test order created: ${orderResponse.order_id}`);
      console.log(`   Reference: ${orderResponse.reference}`);

      // Test order status
      if (orderResponse.order_id) {
        const status = await cloudPrinterClient.getOrderStatus(orderResponse.order_id);
        if (status.success && status.order) {
          console.log(`   Status: ${status.order.status}`);
        }
      }
    } else {
      console.log('\n❌ Order creation failed:', orderResponse.errors);
    }

    console.log('\n✅ CloudPrinter API OK\n');
  } catch (error) {
    console.error('\n❌ API Error:', error);
  }
}

async function testPriceCalculation() {
  console.log('💰 Testing Price Calculation...');

  const testCases = [
    { sku: 'book_hardcover_21x21', pages: 20, expected: 2500 },
    { sku: 'book_hardcover_25x25', pages: 36, expected: 3200 + (16 * 100) },
    { sku: 'book_hardcover_30x30', pages: 60, expected: 3900 + (40 * 100) },
  ];

  let allPassed = true;

  for (const test of testCases) {
    const product = getProductBySku(test.sku);
    if (!product) {
      console.log(`❌ Product not found: ${test.sku}`);
      allPassed = false;
      continue;
    }

    const price = calculatePrice(product, test.pages);
    const passed = price === test.expected;
    
    console.log(
      passed ? '✅' : '❌',
      `${product.name} (${test.pages} pages):`,
      formatPrice(price),
      passed ? '' : `(expected ${formatPrice(test.expected)})`
    );

    if (!passed) allPassed = false;
  }

  console.log(allPassed ? '\n✅ All price calculations OK\n' : '\n❌ Some tests failed\n');
}

async function main() {
  try {
    await testProductCatalog();
    await testPriceCalculation();
    await testCloudPrinterAPI();

    console.log('🎉 All tests completed!\n');
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

main();
