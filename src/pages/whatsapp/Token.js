import React, { useState, useEffect } from "react";
import {
  Input,
  Label,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
  Form,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
import { listMessageType } from "../../functions/Whatsapp/MessageType";
// import {
//   createMessageSend,
//   getMessageSend,
//   listCustomer,
//   removeMessageSend,
//   updateMessageSend,
// } from "../../functions/Whatsapp/MessageSend";
import {
  createWhatsappTokens,
  deleteWhatsappTokens,
} from "../../functions/Whatsapp/Token";
import {
  createMessageOption,
  getMessageOption,
  listMessageOption,
  removeMessageOption,
  updateMessageOption,
} from "../../functions/Whatsapp/MessageOption";
import { listCustomer } from "../../functions/Whatsapp/MessageSend";

const Token = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [_id, set_Id] = useState("");
  const [Op_id, setOp_Id] = useState("");
  const [customers, setCustomers] = useState([]);

  const initialState = {
    CustomerId: "",
    PhoneNumberId: "",
    Token: "",
    WebhookURL: "",
  };

  const initialOption = {
    optionTitle: "",
    optionDescription: "",
  };

  const [remove_id, setRemove_id] = useState("");

  //search and pagination state
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [values, setValues] = useState(initialState);
  const [optionValues, setOptionValues] = useState(initialOption);

  const { CustomerId, PhoneNumberId, Token, WebhookURL } = values;

  const { optionTitle, optionDescription } = optionValues;

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const [allData, setAllData] = useState([]);
  const [optionData, setOptionData] = useState([]);

  const [submitClicked, setSubmitClicked] = useState(false);

  const columns = [
    {
      name: "Phone Number ID",
      selector: (row) => row.PhoneNumberId,
      sortable: true,
      sortField: "PhoneNumberId",
      minWidth: "150px",
    },
    {
      name: "Customer",
      selector: (row) => {
        // Assuming customers is an array containing customer objects with _id and BusinessName properties
        const customer = customers.find(
          (customer) => customer._id === row.CustomerId
        );
        return customer ? customer.BusinessName : row.CustomerId;
      },
      sortable: true,
      sortField: "CustomerId",
      minWidth: "150px",
    },

    {
      name: "Action",
      selector: (row) => {
        return (
          <React.Fragment>
            <div className="d-flex gap-2">
              {/* {row.IsActive ? ( */}
              {/* <div className="edit">
                <button
                  className="btn btn-sm btn-success edit-item-btn "
                  data-bs-toggle="modal"
                  data-bs-target="#showModal"
                  //onClick={() => handleTog_edit(row._id)}
                >
                  Edit
                </button>
              </div> */}
              {/* ) : null} */}

              <div className="remove">
                <button
                  className="btn btn-sm btn-danger remove-item-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteRecordModal"
                  onClick={() => tog_delete(row._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </React.Fragment>
        );
      },
      sortable: false,
      minWidth: "180px",
    },
  ];

  useEffect(() => {
    fetchAllData();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchAllData = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/whatsapp-token-by-params`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          //IsActive: filter,
        }
      )
      .then((response) => {
        console.log("res", response);
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setAllData(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setAllData([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const [modal_delete, setmodal_delete] = useState(false);

  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const handlecheck = (e) => {
    setValues({ ...values, IsActive: e.target.checked });
  };

  const [showForm, setShowForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);

  const [modal_list, setModalList] = useState(false);
  const [modal_edit, setmodal_edit] = useState(false);
  const [modal_editOption, setmodal_editOption] = useState(false);
  const [addOptionModal, setAddOptionModal] = useState(false);

  const [messageTypes, setMessageTypes] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [token, setToken] = useState("");
  const [webhookURL, setWebhookURL] = useState("");

  const [toastErrorMessage, setToastErrorMessage] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  //   useEffect(() => {
  //     loadAllMsgOptionData();
  //   }, [options]);

  //   console.log("mcc njnjc", customers);

  const loadMessages = () => {
    listCustomer().then((res) => setCustomers(res));
  };

  //   const loadAllMsgOptionData = () => {
  //     listMessageOption().then((res) => {
  //       if (Array.isArray(options)) {
  //         const filteredOptions = res.filter((option) =>
  //           options.some((item) => item == option._id)
  //         );
  //         setOptionData(filteredOptions);
  //       } else {
  //         console.error("options is not an array");
  //       }
  //     });
  //   };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const handleChange = (e) => {
    // Reset the validation error for the field being changed
    // setErrors({ ...errors, [e.target.name]: "" });

    // // Update state variables
    // if (e.target.name === "title") {
    //   setTitles(e.target.value);
    // } else if (e.target.name === "type") {
    //   setSelectedType(e.target.value);
    // } else if (e.target.name === "CustomerId") {
    //   setSelectedCustomer(e.target.value);
    // }

    // Update values object
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (e) => {
    setOptionValues({ ...optionValues, [e.target.name]: e.target.value });
  };

  const [titles, setTitles] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [addOptionClicked, setAddOptionClicked] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkSubmit, setCheckSubmit] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Assuming you have performed any necessary validations before submitting

    console.log("send data", values);
    setIsSubmit(true);
    setSubmitClicked(true);
    createWhatsappTokens(values)
      .then((res) => {
        console.log("res", res);

        if (!res.isOk) {
          // Display a toast error message to the user
          toast.error("Customer already exists");
          setToastErrorMessage(true);
        } else {
          setCheckSubmit(true);
          setToken(res.data.Token);
          setWebhookURL(res.data.WebhookURL);

          // Assuming you want to keep the form values after successful submission
          setIsSubmit(false);
          setErrors({});
          //fetchAllData();
        }

        // If the response does not contain an error, proceed with setting state variables
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const tog_list = () => {
    setModalList(!modal_list);
    setIsSubmit(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deleteWhatsappTokens(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchAllData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   const handleUpdate = (e) => {
  //     e.preventDefault();
  //     // let errors = validate(values);
  //     setIsSubmit(true);
  //     // setFormErrors(errors);
  //     // if (Object.keys(errors).length === 0) {
  //     updateMessageSend(_id, values)
  //       .then((res) => {
  //         setUpdateForm(false);
  //         fetchAllData();
  //         setValues(initialState);
  //         setOptionValues(initialOption);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //     // }
  //   };

  //   const handleTog_edit = (_id) => {
  //     setUpdateForm(true);
  //     setIsSubmit(false);
  //     set_Id(_id);

  //     // setFormErrors(false);
  //     getMessageSend(_id)
  //       .then((res) => {
  //         setValues({
  //           ...values,
  //           title: res.title,
  //           header: res.header,
  //           body: res.body,
  //           footer: res.footer,
  //           action: res.action,
  //           type: res.type,
  //           options: res.options,
  //           latitude: res.latitude,
  //           longitude: res.longitude,
  //           LocationName: res.LocationName,
  //           LocationAddress: res.LocationAddress,
  //           IsActive: res.IsActive,
  //           CustomerId: res.CustomerId,
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  //   const handleAddMsgOption = (e) => {
  //     e.preventDefault();
  //     setIsSubmit(true);
  //     // if (Object.keys(errors).length === 0) {
  //     createMessageOption(optionValues)
  //       .then((res) => {
  //         // setModalList(!modal_list);

  //         setAddOptionModal(false);
  //         setOptionValues(initialOption);
  //         // setFormErrors({});
  //         // fetchAllData();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  //   const handleDeleteOption = (id) => {
  //     // e.preventDefault();
  //     removeMessageOption(id)
  //       .then((res) => {
  //         // setmodal_delete(!modal_delete);
  //         loadAllMsgOptionData();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  const handleUpdateOption = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    // if (Object.keys(errors).length === 0) {
    updateMessageOption(Op_id, optionValues)
      .then((res) => {
        // setmodal_edit(!modal_edit);
        //loadAllMsgOptionData();
        setOptionValues(initialOption);
        setmodal_editOption(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  //   const handleTog_editOption = (id) => {
  //     setmodal_editOption(true);
  //     // setIsSubmit(false);
  //     setOp_Id(id);

  //     // setFormErrors(false);
  //     getMessageOption(id)
  //       .then((res) => {
  //         setOptionValues({
  //           ...optionValues,
  //           optionTitle: res.optionTitle,
  //           optionDescription: res.optionDescription,
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };
  document.title = "Message Send | ZIYA";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Tokens"
            pageTitle="Tokens"
            title="Tokens"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={6} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        {" "}
                        Tokens
                      </h2>
                    </Col>

                    <Col className="col-sm-auto" lg={6} md={12} sm={12}>
                      <div className="d-flex justify-content-sm-end">
                        {/* add btn */}
                        <div
                          style={{
                            display: showForm || updateForm ? "none" : "",
                          }}
                        >
                          <Row>
                            <Col lg={12}>
                              <div className="text-end">
                                <Button
                                  color="success"
                                  className="add-btn me-1"
                                  onClick={() => {
                                    setShowForm(!showForm);
                                    setValues(initialState);
                                  }}
                                >
                                  <i className="ri-add-line align-bottom me-1"></i>{" "}
                                  Add
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        {/*  list btn */}
                        <div
                          style={{
                            display: showForm || updateForm ? "" : "none",
                          }}
                        >
                          <Row>
                            <Col lg={12}>
                              <div className="text-end">
                                <button
                                  className="btn bg-success text-light mb-3 "
                                  onClick={() => {
                                    setValues(initialState);
                                    setFormErrors({});
                                    setShowForm(false);
                                    setUpdateForm(false);
                                  }}
                                >
                                  <i class="ri-list-check align-bottom me-1"></i>{" "}
                                  List
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        {/* search */}
                        <div
                          className="search-box ms-2"
                          style={{
                            display: showForm || updateForm ? "none" : "",
                          }}
                        >
                          <input
                            type="text"
                            className="form-control search"
                            placeholder="Search..."
                            onChange={(e) => setQuery(e.target.value)}
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                {/* add form */}
                <div
                  style={{
                    display: showForm || updateForm ? "block" : "none",
                  }}
                >
                  <CardBody>
                    <React.Fragment>
                      <Col xxl={12}>
                        <Card className="">
                          <CardBody>
                            <div className="live-preview">
                              <Form>
                                <Row>
                                  <Row>
                                    <Col lg={3}>
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter title"
                                          name="PhoneNumberId"
                                          value={PhoneNumberId}
                                          onChange={handleChange}
                                        />
                                        <label
                                          htmlFor="role-field"
                                          className="form-label"
                                        >
                                          Phone Number{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        {/* {errors.title && (
                                          <span className="text-danger">
                                            {errors.title}
                                          </span>
                                        )} */}
                                      </div>
                                    </Col>

                                    <Col lg={3}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="select"
                                          className="form-control"
                                          name="CustomerId" // This should match the property in your `values` state
                                          value={values.CustomerId} // Use the `CustomerId` from your `values` state
                                          onChange={handleChange} // Reuse the existing handleChange to update state
                                        >
                                          <option value="">
                                            Select Customer
                                          </option>
                                          {customers.map((customer) => (
                                            <React.Fragment key={customer._id}>
                                              <option value={customer._id}>
                                                {customer.BusinessName}
                                              </option>
                                            </React.Fragment>
                                          ))}
                                        </Input>
                                        <Label>
                                          Customer{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {errors.CustomerId && (
                                          <span className="text-danger">
                                            {errors.CustomerId}
                                          </span>
                                        )}
                                      </div>
                                    </Col>

                                    {/* Conditional Rendering for Form Fields */}
                                  </Row>

                                  {/* option table */}

                                  {checkSubmit && (
                                    <div>
                                      <label
                                        htmlFor="token-field"
                                        className="form-label"
                                      >
                                        Token{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter token"
                                        name="token"
                                        value={token}
                                        onChange={(e) =>
                                          setToken(e.target.value)
                                        }
                                      />
                                    </div>
                                  )}
                                  {checkSubmit && (
                                    <div>
                                      <label
                                        htmlFor="webhook-url-field"
                                        className="form-label"
                                      >
                                        Webhook URL{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter webhook URL"
                                        name="webhookURL"
                                        value={webhookURL}
                                        onChange={(e) =>
                                          setWebhookURL(e.target.value)
                                        }
                                      />
                                    </div>
                                  )}

                                  {
                                    <Row>
                                      <Col lg={12}>
                                        <div className="text-end">
                                          <button
                                            onClick={handleSubmit}
                                            className="btn btn-success  m-1"
                                          >
                                            Submit
                                          </button>

                                          <button
                                            className="btn btn-outline-danger m-1"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setShowForm(false);
                                              setUpdateForm(false);
                                              setIsSubmit(false);
                                              setOptionData(initialOption);
                                              setValues(initialState);
                                            }}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </Col>
                                    </Row>
                                  }

                                  {updateForm && !showForm && (
                                    <React.Fragment>
                                      <Row>
                                        <Col lg={12}>
                                          <div className=" text-end">
                                            {/* <button
                                              type="submit"
                                              className="btn btn-success  m-1"
                                              onClick={handleUpdate}
                                            >
                                              Update
                                            </button> */}

                                            <button
                                              className="btn btn-outline-danger m-1"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                setShowForm(false);
                                                setUpdateForm(false);
                                                setIsSubmit(false);
                                                setOptionData(initialOption);
                                                setValues(initialState);
                                              }}
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </Col>
                                      </Row>
                                    </React.Fragment>
                                  )}
                                  {loadingSubmit && (
                                    <div className="d-flex justify-content-center">
                                      <div
                                        className="spinner-border"
                                        role="status"
                                      >
                                        <span className="sr-only">
                                          Loading...
                                        </span>
                                      </div>
                                      <h6 className="p-2">
                                        Wait for a few seconds.This process
                                        might take some time.
                                      </h6>
                                    </div>
                                  )}
                                </Row>
                              </Form>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </React.Fragment>
                  </CardBody>
                </div>

                {/* list */}
                <div
                  style={{
                    display: showForm || updateForm ? "none" : "block",
                  }}
                >
                  <CardBody>
                    <div>
                      <div className="table-responsive table-card mt-1 mb-1 text-right">
                        <DataTable
                          columns={columns}
                          data={allData}
                          progressPending={loading}
                          sortServer
                          onSort={(column, sortDirection, sortedRows) => {
                            handleSort(column, sortDirection);
                          }}
                          pagination
                          paginationServer
                          paginationTotalRows={totalRows}
                          paginationRowsPerPageOptions={[
                            10,
                            50,
                            100,
                            totalRows,
                          ]}
                          onChangeRowsPerPage={handlePerRowsChange}
                          onChangePage={handlePageChange}
                        />
                      </div>
                    </div>
                  </CardBody>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* add options */}
      <Modal
        isOpen={addOptionModal}
        toggle={() => {
          setAddOptionModal(!addOptionModal);
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setAddOptionModal(false);
          }}
        >
          Add Option
        </ModalHeader>
        <form>
          <ModalBody>
            
          </ModalBody>
          <ModalFooter>
            {/* <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success  m-1"
                id="add-btn"
                onClick={handleAddMsgOption}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-outline-danger m-1"
                onClick={() => {
                  setAddOptionModal(false);
                  setOptionValues(initialOption);
                }}
              >
                Cancel
              </button>
            </div> */}
          </ModalFooter>
        </form>
      </Modal>

      {/*Edit options*/}
      <Modal
        isOpen={modal_editOption}
        toggle={() => {
          setmodal_editOption(!modal_editOption);
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_editOption(false);
          }}
        >
          Edit Option
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Title"
                required
                name="optionTitle"
                value={optionTitle}
                onChange={handleOptionChange}
              />
              <label htmlFor="role-field" className="form-label">
                Title
                <span className="text-danger">*</span>
              </label>
            </div>

            <div className="form-floating mb-3">
              <Input
                type="textarea"
                className="form-control"
                style={{ height: "80px" }}
                placeholder="Enter Description"
                required
                name="optionDescription"
                value={optionDescription}
                onChange={handleOptionChange}
              />
              <label htmlFor="role-field" className="form-label">
                Description
              </label>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className=" btn btn-success m-1"
                id="add-btn"
                onClick={handleUpdateOption}
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-outline-danger m-1"
                onClick={() => {
                  setAddOptionModal(false);
                  setmodal_editOption(false);
                  setOptionValues(initialOption);
                }}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/* remove message send */}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
        }}
        centered
      >
        <ModalHeader className="bg-light p-3">
          <span style={{ marginRight: "210px" }}>Remove Message Send</span>
          <Button
            type="button"
            onClick={() => {
              setmodal_delete(false);
            }}
            className="btn-close"
            aria-label="Close"
          ></Button>
        </ModalHeader>

        <form>
          <ModalBody>
            <div className="mt-2 text-center">
              <lord-icon
                src="https://cdn.lordicon.com/gsqxdxog.json"
                trigger="loop"
                colors="primary:#f7b84b,secondary:#f06548"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
              <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                <h4>Are you sure ?</h4>
                <p className="text-muted mx-4 mb-0">
                  Are you Sure You want to Remove this Record ?
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-danger"
                id="add-btn"
                onClick={handleDelete}
              >
                Remove
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setmodal_delete(false)}
              >
                Close
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default Token;
