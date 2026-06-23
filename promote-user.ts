import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load env variables manually from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found! Make sure you are running this in the project root.');
  process.exit(1);
}

const envFile = fs.readFileSync(envPath, 'utf8');
const envVars: Record<string, string> = {};
envFile.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    envVars[key] = value.trim();
  }
});

const MONGODB_URI = envVars.MONGODB_URI;

// Import User model
import User from './src/models/User';

async function promote() {
  // Get email from command line args or default to user's registered email
  const args = process.argv.slice(2);
  const targetEmail = args[0] || 'chamikaratharusha97@gmail.com';

  console.log(`🚀 Promoting user with email: "${targetEmail}" to admin...`);

  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: targetEmail.toLowerCase() });

    if (!user) {
      console.error(`❌ User not found with email: "${targetEmail}". Make sure you register the account first!`);
      await mongoose.disconnect();
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`ℹ️ User "${targetEmail}" is already an admin.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Success! User "${targetEmail}" has been promoted to admin.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error promoting user:', error);
    process.exit(1);
  }
}

promote();
