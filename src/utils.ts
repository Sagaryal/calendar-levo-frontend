import { User } from "./types";

export const getLocalUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser: User = JSON.parse(storedUser);
    return parsedUser;
  }

  return null;
};

export const changeTimezone = (date: Date, timeZone: string) => {
  const tDate = new Date(
    date.toLocaleString("en-US", {
      timeZone,
    })
  );

  const diff = date.getTime() - tDate.getTime();
  return new Date(date.getTime() + diff);
};
