import User from "./models/User.js";

const MOCK_USER_EMAIL = "mock.user@example.com";

let mockUser = null;

const getMockUser = async () => {
  if (mockUser) {
    return mockUser;
  }

  try {
    let user = await User.findOne({ email: MOCK_USER_EMAIL });

    if (!user) {
      console.log("Mock user not found, creating one...");
      user = await User.create({
        name: "Mock User",
        email: MOCK_USER_EMAIL,
      });
      console.log("✅ Mock user created.");
    } else {
      console.log("Found mock user.");
    }
    mockUser = user;
    return user;
  } catch (error) {
    console.error("❌ Error getting or creating mock user:", error.message);
    process.exit(1);
  }
};

export default getMockUser;
