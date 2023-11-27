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
  Container,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const MessageType = () => {
  const [messageTypes, setMessageTypes] = useState([]);
  const [newMessageType, setNewMessageType] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // Added checkbox state
  const [modal, setModal] = useState(false);

  useEffect(() => {
    // Fetch message types when the component mounts
    fetchMessageTypes();
  }, []);

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

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleMessageTypeChange = (e) => {
    setNewMessageType(e.target.value);
  };

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/auth/whatsapp/create-message-type",
        {
          name: newMessageType,
          checkboxValue: isCheckboxChecked, // Include checkbox value in the request
        }
      );
      // Fetch updated message types after creating a new one
      fetchMessageTypes();
      setNewMessageType(""); // Clear the input field
      setIsCheckboxChecked(false); // Reset checkbox state
      setModal(false); // Close the modal after submitting
    } catch (error) {
      console.error("Error creating message type:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex gap-2 page-content">
        <Container>
          <div className="my-3">
            <Button color="success" onClick={toggleModal}>
              Add Message Type
            </Button>
          </div>

          <ListGroup className="mt-{0.5}">
            {messageTypes?.map((type) => (
              <ListGroupItem key={type._id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{type.name}</h5>
                    <p>
                      <strong>Checkbox:</strong>{" "}
                      {type.checkboxValue ? "Checked" : "Unchecked"}
                    </p>
                  </div>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>

          <Modal isOpen={modal} toggle={toggleModal} centered>
            <ModalHeader toggle={toggleModal}>Add Message Type</ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <FormGroup className="mb-3">
                  <Label for="messageType" className="mb-2">
                    Message Type
                  </Label>
                  <Input
                    type="text"
                    id="messageType"
                    placeholder="Message Type"
                    value={newMessageType}
                    onChange={handleMessageTypeChange}
                    required
                  />
                </FormGroup>
                <FormGroup check className="mb-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      id="checkbox"
                      checked={isCheckboxChecked}
                      onChange={handleCheckboxChange}
                    />{" "}
                    Is active
                  </Label>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <div className="hstack gap-2 justify-content-end">
                  <Button type="submit" color="success">
                    Submit
                  </Button>
                  <Button color="danger" outline onClick={toggleModal}>
                    Cancel
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MessageType;
