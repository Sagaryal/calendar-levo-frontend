export interface UserEvent {
  id: number;
  user_id: number;
  title: string;
  start_time: Date;
  end_time: Date;
  description?: string;
}

export interface CreateUserEvent extends Omit<UserEvent, "id" | "user_id"> {}
export interface UpdateUserEvent extends Omit<UserEvent, "user_id"> {}

export interface User {
  id: number;
  email: string;
  events: UserEvent[];
}

export interface CalEvent {
  id?: number;
  isHoliday?: boolean;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

// export interface CalEvent extends CreateCalEvent {
//   id: number;
// }
