
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


// Endpoint to mark a phone number as spam
exports.markSpam = async (req, res) => {
  try {
    // Extract phone number from the request body
    const { phoneNumber } = req.body;

    // Search for the user with the given phone number
    const user = await prisma.user.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    // If the user exists, update the spam count
    if (user) {
      await prisma.user.update({
        where: { phoneNumber: phoneNumber },
        data: { spamCount: user.spamCount + 1 },
      });

      return res.status(200).json({ message: 'Phone number marked as spam successfully.' });
    } else {
      return res.status(404).json({ message: 'User not found for the given phone number.' });
    }
  } catch (error) {
    console.error('Error marking phone number as spam:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


