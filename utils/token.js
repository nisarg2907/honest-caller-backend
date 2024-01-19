const jwt = require('jsonwebtoken');

// Generating Toekn for the user who registers

const generateJwtToken = (userData,secretKey) => {

  const payload = {
    name: userData.name,
    phoneNumber: userData.phoneNumber,
    email: userData.email,
   
  };


  const token = jwt.sign(payload, secretKey, { expiresIn: '100d' }); 

  return token;
};

module.exports = generateJwtToken;



