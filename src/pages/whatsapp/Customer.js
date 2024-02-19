import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";

import {
//   createAppServer,
//   updateAppServer,
//   removeAppServer,
//   getAppServer,
createCustomer,
listCustomer,
updateCustomer,
DeleteCustomer,
getCustomer
} from "../../../src/functions/Whatsapp/customer";

const initialState = {
    BusinessName :"",
    ClientName:"",
    ClientNumber:"",
    Email:"",
    Password:"",
    IsActive:"false"
};

const Customer = () => {
  const [values, setValues] = useState(initialState);
  const {
    BusinessName,
    ClientName,
    ClientNumber,
    Email,
    Password,
    IsActive,
  } = values;

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  //validation check
  const [errPORT, setErrPORT] = useState(false);
  const [errHOST, setErrHOST] = useState(false);
  const [errCNUM, setErrCNUM] = useState(false);
  const [errConFig, setErrConFig] = useState(false);
  const [errLogin, setErrLogin] = useState(false);
  const [errIP, setErrIP] = useState(false);
  const [errPass, setErrPass] = useState(false);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [AppServers, setAppServers] = useState([]);

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
    setIsSubmit(false);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    setIsSubmit(false);
    set_Id(_id);
    getCustomer(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          BusinessName: res.BusinessName,
          ClientName: res.ClientName,
          ClientNumber: res.ClientNumber,
          Password: res.Password,
          Email: res.Email,
         IsActive: res.IsActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleActiveCheck = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, IsActive: e.target.checked });
  };

  const handleClick = (e) => {
    e.preventDefault();

    console.log("menu", values);
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(formErrors).length === 0) {
      createCustomer(values)
        .then((res) => {
          console.log(res);
          if (res === "This app server number is already in use.") {
            toast.error(res);
          } else {
            setmodal_list(!modal_list);
            setValues(initialState);
            fetchAllData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("remove id", remove_id);
    DeleteCustomer(remove_id)
      .then((res) => {
        console.log("deleted", res);
        setmodal_delete(!modal_delete);
        fetchAllData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("update tag", values);
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      updateCustomer(_id, values)
        .then((res) => {
          console.log(res);
          setmodal_edit(!modal_edit);
          fetchAllData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const validate = (values) => {
    const errors = {};

    if (values.BusinessName === "") {
      errors.BusinessName = "Business Name is required!";
      setErrPORT(true);
    }
    if (values.BusinessName !== "") {
      setErrPORT(false);
    }
    if (values.ClientName === "") {
      errors.ClientName = "Client Name is required!";
      setErrHOST(true);
    }
    if (values.ClientName !== "") {
      setErrHOST(false);
    }

    if (values.ClientNumber === "") {
      errors.ClientNumber = "   Client number is required!";
      setErrCNUM(true);
    }
    if (values.ClientNumber !== "") {
      setErrCNUM(false);
    }

    if (values.Email === "") {
      errors.Email = "Email is required!";
      setErrIP(true);
    }
    if (values.Email !== "") {
      setErrIP(false);
    }

    if (values.Password === "") {
      errors.Password = "Password is required!";
      setErrConFig(true);
    }
    if (values.Password !== "") {
      setErrConFig(false);
    }


    return errors;
  };

  const validClassServerPort =
    errPORT && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassServerHost =
    errHOST && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassServerNumber =
    errCNUM && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassIP =
    errIP && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassConfig =
    errConFig && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLogin =
    errLogin && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPass =
    errPass && isSubmit ? "form-control is-invalid" : "form-control";

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

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
        `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/customer-by-params`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          IsActive: filter,
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setAppServers(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setAppServers([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };
  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };

  const col = [
    {
      name: "Client Number",
      selector: (row) => row.ClientNumber,
      sortable: true,
      sortField: "ClientNumber",
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
      sortField: "Email",
    },
    {
      name: "Business Name",
      selector: (row) => row.BusinessName,
      sortable: true,
      sortField: "BusinessName",
    },
    {
      name: "Client Name",
      selector: (row) => row.ClientName,
      sortable: true,
      sortField: "ClientName",
    },
    {
      name: "Password",
      selector: (row) => row.Password,
      sortable: true,
      sortField: "Password",
    },
    {
      name: "Status",
      selector: (row) => {
        return <p>{row.IsActive ? "Active" : "InActive"}</p>;
      },
      sortable: false,
      sortField: "Status",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <React.Fragment>
            <div className="d-flex gap-2">
              <div className="edit">
                <button
                  className="btn btn-sm btn-success edit-item-btn "
                  data-bs-toggle="modal"
                  data-bs-target="#showModal"
                  onClick={() => handleTog_edit(row._id)}
                >
                  Edit
                </button>
              </div>

              <div className="remove">
                <button
                  className="btn btn-sm btn-danger remove-item-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteRecordModal"
                  // disabled={row.IsActive === false}
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
      minWidth: "150px",
    },
  ];

  document.title = "Customer | Marwiz";

  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <BreadCrumb maintitle="IT" pageTitle="App Infra" title="Customers" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm">
                      <h2 className="card-title mb-0 fs-4 mt-2">Customers</h2>
                    </Col>
                    <Col>
                      <div className="text-end mt-1">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          name="filter"
                          value={filter}
                          defaultChecked={true}
                          onChange={handleFilter}
                        />
                        <Label className="form-check-label ms-2">Active</Label>
                      </div>
                    </Col>

                    <Col className="col-sm-auto">
                      <div className="d-flex justify-content-sm-end">
                        <div>
                          <Button
                            color="success"
                            className="add-btn me-1"
                            onClick={() => tog_list()}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            Add
                          </Button>
                        </div>
                        <div className="search-box ms-2">
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

                <CardBody>
                  <div id="customerList">
                    <div className="table-responsive table-card mt-1 mb-1 text-right">
                      <DataTable
                        columns={col}
                        data={AppServers}
                        progressPending={loading}
                        sortServer
                        onSort={(column, sortDirection, sortedRows) => {
                          handleSort(column, sortDirection);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationRowsPerPageOptions={[10, 50, 100, totalRows]}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={modal_list}
        toggle={() => {
          tog_list();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_list(false);
            setIsSubmit(false);
          }}
        >
          Add App Server
          {/* <Button
            type="button"
            onClick={() => {
              setmodal_list(false);
              setIsSubmit(false);
            }}
            className="btn-close"
            aria-label="Close"
          ></Button> */}
        </ModalHeader>
        <form>
          <ModalBody>
            {/*  server number */}

            <Row>
              <Col lg={12}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassServerNumber}
                    placeholder="Enter Client number"
                    required
                    name="ClientNumber"
                    value={ClientNumber}
                    onChange={handleChange}
                  />
                  <Label>
                    Client Number.
                    <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.ClientNumber}</p>
                  )}
                </div>
              </Col>

              <Col lg={12}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassIP}
                    placeholder="Enter Your Email"
                    required
                    name="Email"
                    value={Email}
                    onChange={handleChange}
                  />
                  <Label>
                    Email
                    <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.Email}</p>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassServerPort}
                    placeholder="Enter Business Name"
                    required
                    name="BusinessName"
                    value={BusinessName}
                    onChange={handleChange}
                  />
                  <Label>
                    Bussiness Name
                    <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.BusinessName}</p>
                  )}
                </div>
              </Col>
              <Col lg={12}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassServerHost}
                    placeholder="Enter Client Name"
                    required
                    name="ClientName"
                    value={ClientName}
                    onChange={handleChange}
                  />
                  <Label>
                    Client Name
                    <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.ClientName}</p>
                  )}
                </div>
              </Col>
            </Row>

            {/*  server config */}
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassConfig}
                placeholder="Enter Your Password"
                required
                name="Password"
                value={Password}
                onChange={handleChange}
              />
              <Label>
                Password
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.Password}</p>
              )}
            </div>

           

            <div className="mb-3">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                onChange={handleActiveCheck}
              />
              <Label className="form-check-label ms-1">Is Active</Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleClick}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_list(false);
                  setValues(initialState);
                  setIsSubmit(false);
                }}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modal_edit}
        toggle={() => {
          handleTog_edit();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_edit(false);
            setIsSubmit(false);
          }}
        >
          Edit App Server
          {/* <Button
            type="button"
            onClick={() => {
              setmodal_edit(false);
              setIsSubmit(false);
            }}
            className="btn-close"
            aria-label="Close"
          ></Button> */}
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassServerPort}
                placeholder="Enter Business Name"
                required
                name="BusinessName"
                value={BusinessName}
                onChange={handleChange}
              />
              <Label>
                    Business Name
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.BusinessName}</p>
              )}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassServerHost}
                placeholder="Enter Client Name"
                required
                name="ClientName"
                value={ClientName}
                onChange={handleChange}
              />
              <Label>
                Client Name
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.ClientName}</p>
              )}
            </div>
            {/*  server number */}
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassServerNumber}
                placeholder="Enter app server number"
                required
                name="ClientNumber"
                value={ClientNumber}
                onChange={handleChange}
              />
              <Label>
                Client Number 
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.ClientNumber}</p>
              )}
            </div>

            {/*  server ip */}
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassIP}
                placeholder="Enter your Email"
                required
                name="Email"
                value={Email}
                onChange={handleChange}
              />
              <Label>
                Email
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Email}</p>}
            </div>

            {/*  server config */}
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassConfig}
                placeholder="Enter Your Password"
                required
                name="Password"
                value={Password}
                onChange={handleChange}
              />
              <Label>
                Password
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.Password}</p>
              )}
            </div>

            {/*  server login */}
            

            <div className="mb-3">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                checked={IsActive}
                onChange={handleActiveCheck}
              />
              <Label className="form-check-label ">Is Active</Label>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleUpdate}
              >
                Update
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_edit(false);
                  setIsSubmit(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/* Remove Modal */}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
        }}
        centered
      >
        <ModalHeader className="bg-light p-3">
          Remove App Server
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
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default Customer;
