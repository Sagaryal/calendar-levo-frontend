import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { fetchUser, getCalendarCountries, getCalendarHolidays } from "../api";
import { UserEvent, User, CalEvent } from "../types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import FormModal from "../ui/overlay/FormModal";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { getLocalUser } from "../utils";
import Form from "react-bootstrap/Form";

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

const eventPropGetter = (
  event: CalEvent,
  _start: Date,
  _end: Date,
  isSelected: boolean
) => {
  const style = {
    backgroundColor: event.isHoliday ? "#fa5448" : "#3174ad",
  };

  if (isSelected) {
    style.backgroundColor = event.isHoliday ? "#c92216" : "#1a4c73";
  }

  return {
    style: style,
  };
};

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<CalEvent[]>([]);
  const [holidays, setHolidays] = useState<CalEvent[]>([]);
  const [show, setShow] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalEvent | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("NP");

  const handleClose = () => {
    setShow(false);
    setCurrentEvent(null);
  };

  const handleSelectEvent = async (event: CalEvent) => {
    if (!event.isHoliday) {
      console.log("handle selected");
      console.log(event);
      setShow(true);
      setCurrentEvent(event);
    }
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

  const fetchHolidays = async (year: number, country: string) => {
    try {
      const holidays = (await getCalendarHolidays(year, country)).map<CalEvent>(
        (holiday: any) => ({
          start: new Date(holiday.date.iso),
          end: new Date(holiday.date.iso),
          title: holiday.name,
          id: holiday.name,
          description: "Public Holiday",
          isHoliday: true,
        })
      );

      setHolidays(holidays);
    } catch (error) {
      console.error("Error fetching public holidays:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const calCountries = await getCalendarCountries();
      setCountries(calCountries);
    } catch (error) {
      console.error("Error fetching public holidays:", error);
    }
  };

  const handleCalNavigate = async (date: Date) => {
    const year = date.getFullYear();
    if (year !== currentYear) {
      setCurrentYear(year);
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
      fetchCountries();
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchHolidays(currentYear, selectedCountry);
    }
  }, [currentYear, selectedCountry]);

  useEffect(() => {
    if (currentUser) {
      fetchEventsData();
    }
  }, [currentUser]);

  console.log({ events });
  console.log({ holidays });
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-full px-4 py-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-600">
            Welcome {currentUser?.email.split("@")[0]} !
          </h2>
        </div>

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
        <div className="mb-4">
          <Form.Select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countries.map((country: any) => (
              <option key={country.uuid} value={country["iso-3166"]}>
                {country.flag_unicode} {country.country_name}
              </option>
            ))}
          </Form.Select>
        </div>
        <Calendar
          localizer={localizer}
          events={[...events, ...holidays]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "80vh" }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onNavigate={handleCalNavigate}
          eventPropGetter={eventPropGetter}
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
