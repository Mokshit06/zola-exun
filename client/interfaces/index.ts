import { IconType } from 'react-icons/lib';

type Model<T> = T & {
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type ApiResponse<T = {}> = T & {
  success: boolean;
  message?: string;
};

export type User = Model<{
  socialId: string;
  name: string;
  email: string;
  image: string;
  isTeacher: boolean;
  isAdmin: boolean;
  class: Class;
  provider: string;
}>;

export type Room = Model<{
  users: User[];
  messages: Message[];
}>;

export type Message = Model<{
  from: User;
  body: string;
}>;

export type Class = Model<{
  grade: number;
  section: string;
  teacher: User;
  code: string;
  students: User[];
}>;

export type Meeting = Model<{
  code: string;
  class: Class;
  studentsPresent: {
    user: User;
    joinedAt: string;
  }[];
}>;

export interface Weather {
  weather: string;
  minTemp: number;
  maxTemp: number;
  temperature: number;
  humidity: number;
  feelsLike: number;
  icon: string;
}

export interface Card {
  icon: IconType;
  title: string;
  slug?: string;
}
