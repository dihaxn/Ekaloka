import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.warn("[DB] MONGO_URI env var not set. Server will start without a database connection.");
        return { connected: false, reason: 'MISSING_URI' };
    }

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        console.error("[DB] Invalid MONGO_URI scheme. It must start with mongodb:// or mongodb+srv://. Provided:", uri);
        return { connected: false, reason: 'INVALID_SCHEME' };
    }

    try {
        await mongoose.connect(uri, {
            // Add common, safe options (mongoose 8 uses defaults but explicit for clarity)
            autoIndex: true
        });
        console.log("[DB] MongoDB Connected");
        return { connected: true };
    } catch (err) {
        console.error("[DB] MongoDB connection error:", err.message);
        return { connected: false, reason: 'CONNECTION_ERROR', error: err };
    }
};
