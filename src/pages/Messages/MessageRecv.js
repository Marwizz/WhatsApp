import React, { useState } from "react";
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

const MessageRecv = () => {
  const [todos, setTodos] = useState([{ name: "", label: "" }]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleTodoChange = (e, i) => {
    const field = e.target.name;
    const newTodos = [...todos];

    // Make sure the todo object exists at index i
    if (!newTodos[i]) {
      newTodos[i] = { name: "", label: "" };
    }

    newTodos[i][field] = e.target.value;
    setTodos(newTodos);
  };


 const handleSubmit = async (event) => {
   event.preventDefault();
   console.log("Submitting data:", todos);
   try {
     // Assuming you want to send the first item in the todos array
     const todo = todos[0];

     const response = await axios.post(
       "http://localhost:8000/api/auth/whatsapp/create-message-received",
       {
         message: todo.name, // Assuming 'name' is the message field
         sendId: "dummy", // Assuming 'label' is the sendId field
         type: todo.label, // You need to provide a valid type value
       }
     );

     console.log("Server response:", response.data);
     setTodos([]);
     setModal(false);
   } catch (error) {
     console.error("Error submitting data:", error);
   }
 };


  return (
    <React.Fragment>
      <div className="d-flex gap-2 page-content">
        <Button color="success" onClick={toggleModal}>
          Add Field
        </Button>
        <Modal isOpen={modal} toggle={toggleModal} centered>
          <ModalHeader toggle={toggleModal}>Add Field</ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              {todos.map((todo, index) => (
                <FormGroup key={index} className="mb-3">
                  <Label for={`message-${index}`} className="mt-3 mb-2">
                    Message
                  </Label>
                  <div className="floating-label-container">
                    <Input
                      type="text"
                      id={`message-${index}`}
                      placeholder="Message"
                      name="message"
                      value={todo.message}
                      onChange={(e) => handleTodoChange(e, index)}
                      required
                    />
                    {todo.message && (
                      <span className="form-label">Message</span>
                    )}
                  </div>

                  <Label for={`messageType-${index}`} className="mt-3 mb-2">
                    Message Type
                  </Label>
                  <div className="floating-label-container">
                    <Input
                      type="text"
                      id={`messageType-${index}`}
                      placeholder="Message Type"
                      name="messageType"
                      value={todo.messageType}
                      onChange={(e) => handleTodoChange(e, index)}
                      required
                    />
                    {todo.messageType && (
                      <span className="form-label">Message Type</span>
                    )}
                  </div>
                </FormGroup>
              ))}
            </ModalBody>
            <ModalFooter>
              <div className="hstack gap-2 justify-content-end">
                <Button type="submit" color="success">
                  Submit
                </Button>
                <Button
                  color="danger"
                  onClick={toggleModal}
                >
                  Cancel
                </Button>
              </div>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default MessageRecv;
