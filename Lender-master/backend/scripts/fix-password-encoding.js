const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('🔧 Fix MongoDB Password Encoding');
rl.question('Enter your MongoDB Atlas password to encode: ', (password) => {
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
    console.log('✅ backend/.env updated with encoded password');
  } catch (error) {
    console.error('❌ Error writing backend/.env:', error.message);
  }
  rl.close();
});
