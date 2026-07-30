const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google DNS to prevent querySrv connection issues on Windows
try {
    if (process.platform === "win32") {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    }
} catch (error) {
    console.warn("Could not set DNS servers:", error.message);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Do not crash the server in production/serverless environments
        if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
