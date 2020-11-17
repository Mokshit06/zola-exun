type Model<T> = T & {
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type User = Model<{
  socialId: string;
  name: string;
  email: string;
  image: string;
  isTeacher: boolean;
  isAdmin: boolean;
  class: Class;
}>;

export type Room = Model<{
  users: User[];
}>;

export type Message = Model<{
  from: User;
  body: string;
  room: Room;
}>;

export type Class = Model<{
  grade: number;
  section: string;
  teacher: User;
}>;
