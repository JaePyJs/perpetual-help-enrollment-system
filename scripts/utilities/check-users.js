require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  studentId: String,
  role: String,
  department: String,
  yearLevel: Number,
  section: String,
  status: String,
  profileImage: String,
  passwordResetRequired: Boolean,
  createdAt: Date,
  updatedAt: Date
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Check if there are any users
async function checkUsers() {
  try {
    const users = await User.find().select('-password');
    console.log('Total users:', users.length);
    
    if (users.length === 0) {
      console.log('No users found. Creating a test user...');
      
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const testUser = new User({
        name: 'Test Student',
        email: 'student1@test.com',
        password: hashedPassword,
        studentId: 'student1',
        role: 'student',
        department: 'BSIT',
        yearLevel: 1,
        section: 'A',
        status: 'active',
        profileImage: 'default-profile.png',
        passwordResetRequired: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await testUser.save();
      console.log('Test user created successfully');
    } else {
      console.log('Users found:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}), Role: ${user.role}, ID: ${user.studentId || user._id}`);
      });
    }
    
    // Test login with student1/password123
    const testUser = await User.findOne({ studentId: 'student1' });
    if (testUser) {
      const isMatch = await testUser.comparePassword('password123');
      console.log('Login test with student1/password123:', isMatch ? 'Success' : 'Failed');
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

checkUsers();
