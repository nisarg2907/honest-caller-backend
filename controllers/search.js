const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


exports.searchName = async (req, res) => {
  try {
    const query = req.params.name;
    const searchingUserId = req.body.id;

    const initialResults = await prisma.user.findMany({
      where: {
        OR: [{ name: { startsWith: query } }, { name: { contains: query } }],
        isRegistered: true, // Filter for registered users initially
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        spamCount: true,
        email: true,
        isRegistered: true,
      },
    });

    const sortedResults = [
      ...initialResults.filter((user) => user.name === query),
      ...initialResults.filter((user) => user.name !== query),
    ];

    const sender = await prisma.user.findUnique({
      where: { id: searchingUserId }, 
      select: { contacts: true },
    });
    const senderContacts = sender.contacts;

    const finalResults = sortedResults.map((user) => {
      const isContact = senderContacts.some(
        (contact) => contact.id === user.id
      );
      return {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        spamCount: user.spamCount,
        email: user.isRegistered && isContact ? user.email : null,
      };
    });

    res.json(finalResults);
  } catch (error) {
    console.error("Error searching by name:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.searchPhone = async (req, res) => {
  try {
    const query = req.params.phone;
    const searchingUserId = req.body.id;

    const initialResults = await prisma.user.findMany({
      where: {
        phoneNumber: {
          contains: query,
        },
        OR: [{ id: searchingUserId }],
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        spamCount: true,
        email: true,
        isRegistered: true,
      },
    });
    const sortedResults = [
        ...initialResults.filter((user) => user.name === query),
        ...initialResults.filter((user) => user.name !== query),
      ];

    const sender = await prisma.user.findUnique({
      where: { id: searchingUserId }, // Provide the `id` to uniquely identify the user
      select: { contacts: true },
    });
    const senderContacts = sender.contacts;
    const filteredResults = sortedResults.map((user) => {
      const isContact = senderContacts.some(
        (contact) => contact.id === user.id
      );
      return {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        spamCount: user.spamCount,
        email: user.isRegistered && isContact ? user.email : null,
        isRegistered: user.isRegistered,
      };
    });

    const finalResults = filteredResults.some((user) => user.isRegistered)
      ? filteredResults.find((user) => user.isRegistered)
      : filteredResults;

    res.json(finalResults);

  } catch (error) {
    console.error("Error searching by phone number:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
