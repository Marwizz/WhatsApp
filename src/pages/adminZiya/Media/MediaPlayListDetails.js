import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import noImage from "../../../assets/images/Media/_Image_not_available.png";
import { CardBody } from "reactstrap";

const MediaPlayListDetails = (props) => {
  const mediaItemStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "center",
  };
  return (
    <React.Fragment>
      <Draggable draggableId={props.product._id} index={props.index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
                      >
            <tr className="mt-2 border">
              <td>
                <CardBody className=" m-2 p-2 ">
                  <div className="d-flex">
                    <span className="m-2" > {props.index+1} </span>
                    <div className="flex-shrink-0 avatar-md bg-light rounded p-1 ">
                      <img
                        src={`${process.env.REACT_APP_API_URL_ZIYA}/${props.product.Media}` }
                        alt="image"
                        className="img-fluid d-block"
                        style={{
                          maxWidth: "100%", // Set max-width to 100%
                          height: "auto", // Set height to auto for responsiveness
                        }}
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fs-15">
                        <a href="#" className="link-primary">
                        {props.product.MediaName}
                        </a>
                      </h5>
                      {/* <p className="text-muted mb-0">
                        Duration:{" "}
                        <span className="fw-medium">
                          {props.product.MediaTime} Sec
                        </span>
                      </p> */}
                    </div>
                  </div>
                </CardBody>
              </td>
            </tr>
          </div>
        )}
      </Draggable>
    </React.Fragment>
  );
};

export default MediaPlayListDetails;
