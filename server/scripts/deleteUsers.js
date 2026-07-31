const mongoose = require("mongoose");
const dns = require("dns");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

if (process.platform === "win32") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const User = require("../models/User");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    const emailsToDelete = ["saad1111@gmail.com", "saad@gmail.com", "pakistan12@gmail.com"];
    
    for (const email of emailsToDelete) {
      const res = await User.deleteMany({ email: email.toLowerCase().trim() });
      console.log(`Deleted ${res.deletedCount} users matching: ${email}`);
    }

    console.log("Cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

run();
