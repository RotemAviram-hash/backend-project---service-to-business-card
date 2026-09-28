import bcrypt from "bcryptjs";
import User from "../models/Users.js";
import Card from "../models/Card.js";
import printMessage from "../utils/printMessage.js";

const seedDatabase = async () => {
  try {
    const usersCount = await User.countDocuments();

    if (usersCount > 0) {
      printMessage("Initial data already exists", "warning");
      return;
    }

    const hashedPassword = await bcrypt.hash("12345678", 10);

    const users = await User.create([
      {
        name: {
          first: "Regular",
          middle: "",
          last: "User",
        },
        phone: "0501111111",
        email: "regular@example.com",
        password: hashedPassword,
        address: {
          state: "Israel",
          country: "Israel",
          city: "Tel Aviv",
          street: "Dizengoff",
          houseNumber: 10,
          zip: 61000,
        },
        isAdmin: false,
        isBusiness: false,
      },
      {
        name: {
          first: "Business",
          middle: "",
          last: "User",
        },
        phone: "0502222222",
        email: "business@example.com",
        password: hashedPassword,
        address: {
          state: "Israel",
          country: "Israel",
          city: "Rishon LeZion",
          street: "Herzl",
          houseNumber: 20,
          zip: 75432,
        },
        isAdmin: false,
        isBusiness: true,
      },
      {
        name: {
          first: "Admin",
          middle: "",
          last: "User",
        },
        phone: "0503333333",
        email: "admin@example.com",
        password: hashedPassword,
        address: {
          state: "Israel",
          country: "Israel",
          city: "Haifa",
          street: "Haneviim",
          houseNumber: 30,
          zip: 33000,
        },
        isAdmin: true,
        isBusiness: false,
      },
    ]);

    const businessUser = users[1];

    await Card.create([
      {
        title: "Business Consulting",
        subtitle: "Professional Consulting",
        description: "Professional business consulting services",
        phone: "0504444444",
        email: "consulting@example.com",
        web: "https://example.com",
        address: {
          state: "Israel",
          country: "Israel",
          city: "Tel Aviv",
          street: "Rothschild",
          houseNumber: 15,
          zip: 65000,
        },
        bizNumber: 100001,
        user_id: businessUser._id,
      },
      {
        title: "Digital Marketing",
        subtitle: "Marketing Services",
        description: "Digital marketing and advertising services",
        phone: "0505555555",
        email: "marketing@example.com",
        web: "https://example.com",
        address: {
          state: "Israel",
          country: "Israel",
          city: "Rishon LeZion",
          street: "Herzl",
          houseNumber: 25,
          zip: 75400,
        },
        bizNumber: 100002,
        user_id: businessUser._id,
      },
      {
        title: "Web Development",
        subtitle: "Web Development Services",
        description: "Professional websites and web applications",
        phone: "0506666666",
        email: "web@example.com",
        web: "https://example.com",
        address: {
          state: "Israel",
          country: "Israel",
          city: "Haifa",
          street: "Ben Gurion",
          houseNumber: 5,
          zip: 31000,
        },
        bizNumber: 100003,
        user_id: businessUser._id,
      },
    ]);

    printMessage("Initial data created successfully", "success");
  } catch (error) {
    printMessage(`Error creating initial data: ${error.message}`, "error");
  }
};

export default seedDatabase;
