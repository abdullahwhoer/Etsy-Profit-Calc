import { runAllTests } from './calculator.test';

try {
  runAllTests();
  process.exit(0);
} catch (err) {
  console.error('❌ Test failed:', err);
  process.exit(1);
}
