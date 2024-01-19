const bcrypt = require("bcrypt");

// Function to hash a password using bcrypt
const passwordEncryption = async (password) => {
  try {
  // Generaing a Salt 
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // creating a hash using that salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    
    console.error('Error encrypting password:', error);
    throw error;
  }
};

module.exports = passwordEncryption;


