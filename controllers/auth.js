const { PrismaClient } = require("@prisma/client");
const passwordEncryption  = require("../utils/password");
const generateJwtToken  = require("../utils/token");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

// Function to register/authenticate a new user
exports.registerUser = async (req, res) => {
  console.log("request reached");
  try {
    const { name, phoneNumber, email, password } = req.body;
     
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber
      },
      select: {
        isRegistered: true, 
      },
    });

    if (existingUser && existingUser.isRegistered) {
      return res.status(400).json({ message: "User already exists and is registered." });
    }


    // Hash the provided password using the passwordEncryption function
    
    const hashedPassword = await passwordEncryption(password);
  
   
    const newUser = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        email,
        password: hashedPassword,
        isRegistered: true,
      },
    });

    // Generate a token
    const token = generateJwtToken(
      {
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
      },
      JWT_SECRET
    );

    return res
      .status(201)
      .json({ message: "User registered successfully", token : `Bearer ${token}` });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error [USER_REGISTER]" });
  }
};


