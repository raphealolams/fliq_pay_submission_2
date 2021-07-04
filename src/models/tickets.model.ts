import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { UserDocument } from "./users.model";

export interface TicketDocument extends mongoose.Document {
  user: UserDocument["_id"];
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, default: true },
    description: { type: String, default: true },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    tag: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    comments: [
        {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        author: {
          type: String,
          default: "agent",
          enum: ["agent", "admin", "user"],
        },
      },
    ]
  },
  { timestamps: true }
);



const Ticket = mongoose.model<TicketDocument>("Ticket", TicketSchema);

export default Ticket;
