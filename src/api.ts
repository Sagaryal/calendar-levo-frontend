import axios from "axios";
import { UserEvent, User, UpdateUserEvent, CreateUserEvent } from "./types";
import { getLocalUser } from "./utils";
import {
  BACKEND_URL,
  CALENDARIFIC_API_KEY,
  CALENDARIFIC_URL,
} from "./contants";

export const fetchEvents = async (): Promise<UserEvent[]> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/events/all`);
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
    const response = await axios.get(`${BACKEND_URL}/users/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrGetUser = async (email: string): Promise<User> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/users/create`, {
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

    const response = await axios.post(`${BACKEND_URL}/events/create`, event, {
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
    const response = await axios.get(`${CALENDARIFIC_URL}/holidays`, {
      params: {
        api_key: CALENDARIFIC_API_KEY,
        country,
        year,
      },
    });

    return response.data.response.holidays;
  } catch (error) {
    console.error("Error fetching public holidays:", error);
    throw error;
  }
};

export const getCalendarCountries = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${CALENDARIFIC_URL}/countries`, {
      params: {
        api_key: CALENDARIFIC_API_KEY,
      },
    });

    return response.data.response.countries;
  } catch (error) {
    console.error("Error fetching public holidays:", error);
    throw error;
  }
};
