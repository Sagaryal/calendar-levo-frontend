import { User } from "./types";

export const getLocalUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser: User = JSON.parse(storedUser);
    return parsedUser;
  }

  return null;
};
