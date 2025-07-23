import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  email: String
});

export default mongoose.model("User", UserSchema);
