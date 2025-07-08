import { Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  salt: string;
}

export interface IUserModel extends Model<IUser> {
  matchPassword(username: string, password: string): Promise<string>;
}
