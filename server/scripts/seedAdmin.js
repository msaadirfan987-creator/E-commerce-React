const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    // Check if any admin account already exists
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      console.log(`An admin account already exists in the system (Total: ${adminCount}).`);
      console.log("Seeding aborted. Only one Super Admin account is permitted.");
      process.exit(0);
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@cartify.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    console.log(`Seeding Admin Account: "${adminName}" <${adminEmail}>...`);

    // Create the admin account
    const admin = await User.create({
      fullName: adminName,
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword,
      role: "admin",
      isVerified: true, // Super admin is pre-verified
      sellerStatus: "Approved", // Approved status
      isBlocked: false,
    });

    console.log("\n==================================================");
    console.log("🚀  SUPER ADMIN SEEDED SUCCESSFULLY!");
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: [Password specified in .env or default]`);
    console.log(`Role:     ${admin.role}`);
    console.log("==================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
