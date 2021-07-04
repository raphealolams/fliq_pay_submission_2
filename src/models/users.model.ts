import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "agent"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * @author Model hook. hash password before storing on the db
 * @author Only hash the password if it has been modified (or is new)
 * @author Random additional data
 * @author Replace the password with the hash
 */
UserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  let user = this as UserDocument;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;

  return next();
});

/**
 *
 * @param candidatePassword
 * @author Used for logging in
 * @returns Promise
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
