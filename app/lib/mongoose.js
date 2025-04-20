import mongoose from "mongoose";

export async function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        // Already connected
        console.info("Using existing MongoDB connection");
        return mongoose.connection.asPromise();
    } else {
        // Not connected, so establish a new connection
        try {
            const uri = process.env.MONGODB_URI;
            if (!uri) {
                throw new Error("MONGODB_URI is not defined");
            }

            console.info("Connecting to MongoDB...");
            await mongoose.connect(uri);
            console.info("MongoDB connected successfully");
        } catch (error) {
            console.error("MongoDB connection error:", error);
            throw new Error("MongoDB connection failed: " + error.message);
        }
    }
}
