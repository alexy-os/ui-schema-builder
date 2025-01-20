import { pageGenerator } from '../core/page-generator';

async function generate() {
  try {
    await pageGenerator.generatePages();
    console.log('✅ Pages generated successfully');
  } catch (error) {
    console.error('❌ Error generating pages:', error);
    process.exit(1);
  }
}

generate(); 