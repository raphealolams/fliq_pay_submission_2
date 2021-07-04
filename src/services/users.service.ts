import { DocumentDefinition, FilterQuery } from 'mongoose';
import { omit } from "lodash";
import User, { UserDocument } from '../models/users.model';


export const create = async (data: DocumentDefinition<UserDocument>) => {
    try {
        return await User.create(data)
    } catch (error) {
        throw new Error(error)
    }
}

export const findAllUsers = async (query: FilterQuery<UserDocument>) => {
  return User.find().lean();
}


export const findOneUser = (query: FilterQuery<UserDocument>) => {
  return User.findOne(query).lean();
}

export const deleteUser = (query: FilterQuery<UserDocument>) => {
  return User.findOneAndDelete(query).lean();
}

export const updateUser = (query: FilterQuery<UserDocument>) => {
  return User.findOneAndUpdate(query).lean();
}

export const validatePassword = async({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
}