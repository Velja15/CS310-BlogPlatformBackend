import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blogplatforma";
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB povezan: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`Greška pri povezivanju na bazu: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
