import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import timezones from "timezones-list";
import Form from "react-bootstrap/Form";
import { CalEvent } from "../../types";
import { createUserEvent, deleteUserEvent, updateUserEvent } from "../../api";
import { changeTimezone } from "../../utils";

export interface ModalProps {
  show: boolean;
  editEventData: CalEvent | null;
  handleClose: () => void;
  refetchEvents: () => void;
}

const FormModal: React.FC<ModalProps> = ({
  show,
  editEventData,
  handleClose,
  refetchEvents,
}) => {
  const initialState: CalEvent = {
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
  };

  const initialMyOwnTimeZone: string =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [event, setEvent] = useState<CalEvent>(initialState);
  const [selectedTimezone, setSelectedTimezone] =
    useState(initialMyOwnTimeZone);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvent((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = (e: any) => {
    e.preventDefault();

    if (editEventData) {
      handleEdit();
    } else {
      handleCreate();
    }
  };

  const close = () => {
    setEvent(initialState);
    handleClose();
  };

  const handleEdit = async () => {
    try {
      await updateUserEvent({
        id: event.id!,
        title: event.title,
        start_time: event.start,
        end_time: event.end,
        description: event.description,
      });
      close();
      refetchEvents();
    } catch (err: any) {
      console.error("Error updating the event: ", err);
      alert(err.response.data.detail.message);
    }
  };

  const handleCreate = async () => {
    try {
      const start = changeTimezone(event.start, selectedTimezone);
      const end = changeTimezone(event.end, selectedTimezone);

      await createUserEvent({
        title: event.title,
        start_time: start,
        end_time: end,
        description: event.description,
      });
      close();
      refetchEvents();
    } catch (err: any) {
      console.error("Error creating the event: ", err);
      alert(err.response.data.detail.message);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this event?")) {
        await deleteUserEvent(event.id!);
        close();
        refetchEvents();
      }
    } catch (err: any) {
      console.error("Error deleting the event: ", err);
      alert(err.response.data.detail.message);
    }
  };

  useEffect(() => {
    if (editEventData) {
      setEvent(editEventData);
    }
  }, [editEventData]);

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editEventData ? "Update Event" : "Create Event"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              required
              name="title"
              value={event.title}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start"
              required
              value={format(event.start, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) =>
                setEvent((prevState) => ({
                  ...prevState,
                  start: parseISO(e.target.value),
                }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end"
              required
              value={format(event.end, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) =>
                setEvent((prevState) => ({
                  ...prevState,
                  end: parseISO(e.target.value),
                }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTimezone">
            <Form.Label>Timezone</Form.Label>
            <Form.Select
              value={selectedTimezone}
              onChange={(e) => {
                setSelectedTimezone(e.target.value);
              }}
            >
              {timezones.map((tz) => (
                <option key={tz.tzCode} value={tz.tzCode}>
                  {tz.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={event.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div className="flex justify-between border-t-2 pt-3">
            <div>
              <Button variant="primary" type="submit" className="mr-4">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={close}>
                Close
              </Button>
            </div>
            {editEventData && (
              <Button variant="danger" onClick={handleDeleteEvent}>
                Delete Event
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormModal;
