const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 MongoDB Password Update Helper\n');
console.log('This script will update the MongoDB URI in backend/.env.\n');

rl.question('Enter your MongoDB Atlas password: ', (password) => {
  if (!password || password.trim() === '') {
    console.error('❌ Password cannot be empty!');
    rl.close();
    process.exit(1);
  }

  const encodedPassword = encodeURIComponent(password);
  const uri = `mongodb+srv://zervic:${encodedPassword}@cluster0.v8zubag.mongodb.net/lendify?retryWrites=true&w=majority`;

  const envPath = path.join(__dirname, '..', '.env');
  const content = `MONGODB_URI=${uri}\nNODE_ENV=development\n`;

  try {
    fs.writeFileSync(envPath, content, 'utf8');
    console.log(`✅ Updated backend/.env`);
  } catch (error) {
    console.error(`❌ Error updating backend/.env:`, error.message);
    rl.close();
    process.exit(1);
  }

  console.log('\n✅ MongoDB URI updated successfully!');
  console.log('🚀 You can now start the backends: npm start\n');
  rl.close();
});
