var _a;
import mongoose from 'mongoose';
const MONGODB_URI = (_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : '';
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
/**
 * Cached connection for MongoDB.
 */
mongoose.set('debug', true);
var cached = { conn: null, promise: null };
async function dbConnect() {
    try {
        if (cached.conn) {
            return cached.conn;
        }
        if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
                return mongoose;
            });
        }
        cached.conn = await cached.promise;
        return cached.conn;
    }
    catch (error) {
        return error;
    }
}
export default dbConnect;
