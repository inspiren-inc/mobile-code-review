export interface Score {
  id: string;
  userId: string;
  score: number;
  updated: Date;
}

export type UserBase = { id: string };

type DefaultNameType = string;
type UserNameType = `${DefaultNameType}`;
interface UserImpl<T_name extends UserNameType, T_title extends string>
  extends Record<keyof UserBase, string> {
  username: UserNameType;
  title: T_title;
}
export type User = UserImpl<UserNameType, string>;
