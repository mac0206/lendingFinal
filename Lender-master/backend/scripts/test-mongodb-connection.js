const path = require('path');
const mongoose = require(require.resolve('mongoose', { paths: [path.join(__dirname, '..', 'member-a')] }));
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log('\n🔍 Testing MongoDB Connection...\n');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lendify';
const safeURI = mongoURI.replace(/:[^:@]+@/, ':****@');
console.log('Connection String: ' + safeURI + '\n');
console.log('Attempting to connect...\n');

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB connection established!\n');
  mongoose.connection.close();
  process.exit(0);
})
.catch((err) => {
  console.error('❌ FAILED! MongoDB connection error:\n');
  console.error(err.message);
  process.exit(1);
});
