const mongoose = require("mongoose");
const dns = require("dns");

// Fix for "querySrv ECONNREFUSED" caused by local DNS blocking SRV lookups
dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb+srv://smartframer:mCC7hzVKdeQ6DeKT@cluster0.zupiioh.mongodb.net/smartfarmer";
        await mongoose.connect(uri);

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;