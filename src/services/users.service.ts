import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserModel.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await UserModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
  public async findUserByEmail(email: string): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: email });

    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const createUserData: User = await UserModel.create(userData);

    return createUserData;
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    if (userData.email) {
      const findUser: User = await UserModel.findOne({ email: userData.email });
      if (findUser && findUser._id.toString() != userId.toString()) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    // Find the user by id
    const user = await UserModel.findById(userId);
    if (!user) throw new HttpException(409, "User doesn't exist");

    // Update the properties of the user
    user.set(userData);

    // Save the user with the updated data
    const updatedUser = await user.save();

    return updatedUser;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await UserModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
  public async resetDailyParticipation(): Promise<void> {
    const users = await UserModel.find({});

    for (const user of users) {
      user.gamesPlayedToday = null;
      user.prizesWonToday = null;
      await user.save();
    }
  }
}
