import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    owner: {
      type: String,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Project", projectSchema);
