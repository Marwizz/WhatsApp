import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const MessageSend = () => {
  const [messageTypes, setMessageTypes] = useState([]);
  const [messageOptions, setMessageOptions] = useState([]);
  const [newMessageSend, setNewMessageSend] = useState({
    header: "",
    body: "",
    footer: "",
    action: "",
    options: [],
    type: "",
  });
  const [modal, setModal] = useState(false);

  useEffect(() => {
    // Fetch message types and options when the component mounts
    fetchMessageTypes();
    fetchMessageOptions();
  }, []); // Empty dependency array to ensure it only runs once during the initial render

  const fetchMessageTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/auth/whatsapp/get-message-type"
      );
      console.log("Received data:", response);
      setMessageTypes(response);
    } catch (error) {
      console.error("Error fetching message types:", error);
    }
  };

  const fetchMessageOptions = async () => {
    try {
      // Assuming you have a similar endpoint for fetching options
      const response = await axios.get(
        "http://localhost:8000/auth/whatsapp/get-message-options"
      );
      setMessageOptions(response);
    } catch (error) {
      console.error("Error fetching message options:", error);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessageSend({
      ...newMessageSend,
      [name]: value,
    });
  };

  const handleMessageTypeChange = (e) => {
    const selectedMessageType = messageTypes.find(
      (type) => type.name === e.target.value
    );
    setNewMessageSend({
      ...newMessageSend,
      type: selectedMessageType?._id || "",
    });
  };

  const handleOptionsChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewMessageSend({
      ...newMessageSend,
      options: selectedOptions,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Sending a POST request to your server's endpoint for creating a new message send
      const response = await axios.post(
        "http://localhost:8000/api/auth/whatsapp/create-message-send",
        newMessageSend
      );

      console.log("Message send created:", response);

      // You can add any further actions you want to take after successful submission

      // Closing the modal or resetting the form, if needed
      setModal(false);
      setNewMessageSend({
        header: "",
        body: "",
        footer: "",
        action: "",
        options: [],
        type: "",
      });
    } catch (error) {
      console.error("Error creating message send:", error);
      // You can handle errors and display messages to the user if needed
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex gap-2 page-content">
        <Button color="primary" onClick={toggleModal}>
          Add Message Send
        </Button>
        <Modal isOpen={modal} toggle={toggleModal} centered>
          <ModalHeader toggle={toggleModal}>Add Message Send</ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup className="mb-3">
                <Label for="header" className="mb-2">
                  Header
                </Label>
                <Input
                  type="text"
                  id="header"
                  name="header"
                  value={newMessageSend.header}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label for="body" className="mb-2">
                  Body
                </Label>
                <Input
                  type="text"
                  id="body"
                  name="body"
                  value={newMessageSend.body}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label for="footer" className="mb-2">
                  Footer
                </Label>
                <Input
                  type="text"
                  id="footer"
                  name="footer"
                  value={newMessageSend.footer}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label for="action" className="mb-2">
                  Action
                </Label>
                <Input
                  type="text"
                  id="action"
                  name="action"
                  value={newMessageSend.action}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label for="type" className="mb-2">
                  Message Type
                </Label>
                <Input
                  type="select"
                  id="type"
                  name="type"
                  value={newMessageSend.type}
                  onChange={handleMessageTypeChange}
                  required
                >
                  <option value="" disabled>
                    Select Message Type
                  </option>
                  {messageTypes &&
                    messageTypes.map((type) => (
                      <option key={type._id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
              <FormGroup className="mb-3">
                <Label for="options" className="mb-2">
                  Message Options
                </Label>
                <Input
                  type="select"
                  id="options"
                  name="options"
                  multiple
                  value={newMessageSend.options}
                  onChange={handleOptionsChange}
                >
                  {messageOptions &&
                    messageOptions.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <div className="hstack gap-2 justify-content-end">
                <Button type="submit" color="primary">
                  Submit
                </Button>
                <Button color="secondary" onClick={toggleModal}>
                  Cancel
                </Button>
              </div>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default MessageSend;
