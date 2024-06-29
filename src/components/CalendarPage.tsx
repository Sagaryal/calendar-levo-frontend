import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  momentLocalizer,
  dateFnsLocalizer,
} from "react-big-calendar";
import { createUserEvent, fetchUser, updateUserEvent } from "../api";
import { UserEvent, User, CalEvent } from "../types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import FormModal from "../ui/overlay/FormModal";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { getLocalUser } from "../utils";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<CalEvent[]>([]);
  const [show, setShow] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalEvent | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleClose = () => {
    setShow(false);
    setCurrentEvent(null);
  };

  const handleSelectEvent = async (event: CalEvent) => {
    console.log("handle selected");
    console.log(event);
    setShow(true);
    setCurrentEvent(event);
  };

  const handleSelectSlot = (slotInfo: any) => {
    console.log("handle select SLOT");
    console.log(slotInfo);
    setShow(true);
  };

  console.log({ currentEvent });

  const fetchEventsData = async () => {
    try {
      const user: User = await fetchUser(currentUser!.id);
      const userEvents: UserEvent[] = user.events;
      console.log(user);
      const calEvents: CalEvent[] = userEvents.map<CalEvent>((event) => ({
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        title: event.title,
        id: event.id,
        description: event.description || "",
      }));

      setEvents(calEvents);
    } catch (error) {
      console.error("Error fetching user events:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentEvent(null);
    navigate("/login");
  };

  useEffect(() => {
    const localUser = getLocalUser();
    if (localUser) {
      setCurrentUser(localUser);
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchEventsData();
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-full px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-600 mb-4">
          Welcome {currentUser?.email.split("@")[0]} !
        </h2>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-3/4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "80vh" }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
        />

        <FormModal
          show={show}
          editEventData={currentEvent}
          handleClose={handleClose}
          refetchEvents={fetchEventsData}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
