import axios from "axios";
import { UserEvent, User, UpdateUserEvent, CreateUserEvent } from "./types";
import { getLocalUser } from "./utils";

const BACKEND_URL = "https://levo-calendar-frontend.fly.dev/api";

export const fetchEvents = async (): Promise<UserEvent[]> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/events`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const fetchUser = async (userId: number): Promise<User> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrGetUser = async (email: string): Promise<User> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/users`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUserEvent = async (
  event: CreateUserEvent
): Promise<UserEvent> => {
  try {
    const localUser = getLocalUser();
    const user_id = localUser?.id;

    const response = await axios.post(`${BACKEND_URL}/events`, event, {
      headers: {
        "user-id": user_id,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserEvent = async (
  event: UpdateUserEvent
): Promise<UserEvent> => {
  try {
    const localUser = getLocalUser();
    const user_id = localUser?.id;

    const response = await axios.put(
      `${BACKEND_URL}/events/${event.id}`,
      {
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        description: event.description,
      },
      {
        headers: {
          "user-id": user_id,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserEvent = async (event_id: number): Promise<UserEvent> => {
  try {
    const localUser = getLocalUser();
    const user_id = localUser?.id;

    const response = await axios.delete(`${BACKEND_URL}/events/${event_id}`, {
      headers: {
        "user-id": user_id,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCalendarHolidays = async (
  year: number,
  country: string
): Promise<any[]> => {
  try {
    const response = await axios.get(
      "https://calendarific.com/api/v2/holidays",
      {
        params: {
          api_key: "bf9NOnJeHav7097KeuRjzqylHS4IVhKU",
          country,
          year,
        },
      }
    );

    return response.data.response.holidays;
  } catch (error) {
    console.error("Error fetching public holidays:", error);
    throw error;
  }
};

export const getCalendarCountries = async (): Promise<any[]> => {
  try {
    const response = await axios.get(
      "https://calendarific.com/api/v2/countries",
      {
        params: {
          api_key: "bf9NOnJeHav7097KeuRjzqylHS4IVhKU",
        },
      }
    );

    return response.data.response.countries;
  } catch (error) {
    console.error("Error fetching public holidays:", error);
    throw error;
  }
};
