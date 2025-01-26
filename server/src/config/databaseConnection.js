import mongoose from "mongoose";

const databaseConnection = async () =>
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database Connected!");
    })
    .catch((error) => {
      console.log(error.message);
      process.exit(0);
    });

export default databaseConnection;
