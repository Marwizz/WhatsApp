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
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
// import { Table } from "antd";

import {
  createSilverPrice,
  updateSilverPrice,
  getSilverPrice,
  removeSilverPrice,
} from "../../../functions/PriceTag/SilverPrice";

const SilverPrice = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [_id, set_Id] = useState("");

  const initialState = {
    SilverPrice: "",
    IsActive: false,
  };

  const [remove_id, setRemove_id] = useState("");

  //search and pagination state
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [values, setValues] = useState(initialState);

  const { CategoryName, IsActive } = values;

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const [CategoryForm, setCategoryForm] = useState([]);

  useEffect(() => {
    console.log("length", CategoryForm.length);
  });
  const columns = [
    {
      name: "Gold Price",
      selector: (row) => row.SilverPrice,
      sortable: true,
      sortField: "SilverPrice",
      minWidth: "150px",
    },
    //   {
    //     name: "Gold Price",
    //     selector: (row) => row.SilverPrice,
    //     sortable: true,
    //     sortField: "SilverPrice",
    //     minWidth: "150px",
    //   },
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
              {/* <div className="edit">
                <button
                  className="btn btn-sm btn-success edit-item-btn "
                  data-bs-toggle="modal"
                  data-bs-target="#showModal"
                  onClick={() => handleTog_edit(row._id)}
                >
                  Edit
                </button>
              </div> */}

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
    fetchCategories();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchCategories = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL_MARWIZ}/api/auth/silverPrice-all`,
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
          console.log("res data", res.data);
          setCategoryForm(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setCategoryForm([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const [errSilvePrice, setErrSilvePrice] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (values.SilverPrice === "") {
      errors.SilverPrice = "Silver Price is required";
      setErrSilvePrice(true);
    }

    if (values.SilverPrice !== "") {
      setErrSilvePrice(false);
    }

    return errors;
  };

  const [modal_delete, setmodal_delete] = useState(false);

  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);

  const handlecheck = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, IsActive: e.target.checked });
  };

  const [modal_list, setModalList] = useState(false);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  //   const loadCategoryForm = () => {
  //     listQuotationReference().then((res) => setCategoryForm(res));
  //   };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log("data", values);
    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);
    console.log("error", errors);
    if (Object.keys(errors).length === 0) {
      createSilverPrice(values)
        .then((res) => {
          console.log(res);
          setModalList(!modal_list);
          setValues(initialState);

          // close form
          setIsSubmit(false);
          setFormErrors({});
          fetchCategories();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // fetchCategories();
  };

  // Add this function to your component
  const tog_list = () => {
    setModalList(!modal_list);
    setIsSubmit(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("silver price", remove_id);
    removeSilverPrice(remove_id)
      .then((res) => {
        console.log("deleted", res);
        setmodal_delete(!modal_delete);
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //   const handleUpdate = (e) => {
  //     e.preventDefault();

  //     console.log(validate(values));
  //     let errors = validate(values);
  //     setIsSubmit(true);
  //     setFormErrors(errors);
  //     // console.log(validClassEditReferenceName);
  //     if (Object.keys(errors).length === 0) {
  //       updateComponentCategory(_id, values)
  //         .then((res) => {
  //           console.log(res);
  //           setmodal_edit(!modal_edit);
  //           fetchCategories();
  //           setValues(initialState);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   };

  const handleAddCancel = (e) => {
    e.preventDefault();
    // setShowForm(false);
    setIsSubmit(false);
    // setImage(myImage);
    // setUpdateForm(false);
    setValues(initialState);
  };

  //   const handleTog_edit = (_id) => {
  //     setmodal_edit(!modal_edit);
  //     setIsSubmit(false);
  //     set_Id(_id);
  //     console.log(_id);

  //     // setErrEditDeviceName(false);
  //     // setErrEditDeviceValue(false);
  //     // setErrEditDeviceDesc(false);
  //     setFormErrors(false);
  //     getComponentCategory(_id)
  //       .then((res) => {
  //         console.log("get", res);
  //         // console.log(res.service.DeviceName);
  //         setValues({
  //           ...values,
  //           CategoryName: res.CategoryName,
  //           IsActive: res.IsActive,
  //         });
  //         // console.log(res.IsActive);
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
    // setPageNo(page);
    setPerPage(newPerPage);
  };

  //   const validClassEditDeviceName =
  //     errEditDeviceName && isSubmit ? "form-control is-invalid" : "form-control";
  //   const validClassEditDeviceValue =
  //     errEditDeviceValue && isSubmit ? "form-control is-invalid" : "form-control";
  //   const validClassEditDeviceDesc =
  //     errEditDeviceDesc && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassSilverPrice =
    errSilvePrice && isSubmit ? "form-control is-invalid" : "form-control";

  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };
  document.title = "Silver Price Tag | ZIYA";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <BreadCrumb
            maintitle="Price Tag"
            title="Silver Price"
            pageTitle="Price Tag"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  {/* <div className="h4 mb-0">Manage Quotation Reference</div> */}
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Silver Price Tag
                      </h2>
                    </Col>
                    <Col lg={4} md={6} sm={6}>
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
                    <Col className="col-sm-auto" lg={4} md={12} sm={12}>
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
                            // type="text"
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
                  <div>
                    <div className="table-responsive table-card mt-1 mb-1 text-right">
                      <DataTable
                        columns={columns}
                        data={CategoryForm}
                        progressPending={loading}
                        sortServer
                        // onRowClicked={(row,e)=>{
                        //   debugger
                        // }}
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
            setModalList(false);
          }}
        >
          Add Silver Tag
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <input
                type="text"
                className={validClassSilverPrice}
                placeholder="Device Component Name"
                id="rolefloatingInput"
                required
                name="SilverPrice"
                value={SilverPrice}
                onChange={handleChange}
              />
              {isSubmit && (
                <p className="text-danger">{formErrors.SilverPrice}</p>
              )}

              <label htmlFor="role-field" className="form-label">
                Silver Price
                <span className="text-danger">*</span>
              </label>
            </div>

            <div className="form-check mb-2">
              <Input
                // className={validClassActive}
                type="checkbox"
                name="IsActive"
                value={IsActive}
                onChange={handlecheck}
                // checked={IsActive}
                // defaultChecked
              />
              <Label className="form-check-label" htmlFor="activeCheckBox">
                Is Active
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.IsActive}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              {/* {errBG && <div>REFERENCE NAME REQUIRED</div>} */}
              <button
                type="submit"
                className="btn btn-success  m-1"
                id="add-btn"
                onClick={handleClick}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-danger m-1"
                onClick={() => setModalList(false)}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/*Edit Modal*/}
      {/* <Modal
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
          }}
        >
          Edit Silver Price
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="mb-3">
              <label htmlFor="role-field" className="form-label">
                Silver Price
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={validClassSilverPrice}
                placeholder="Enter Category Name"
                required
                name="SilverPrice"
                value={SilverPrice}
                onChange={handleChange}
              />
              {isSubmit && (
                <p className="text-danger">{formErrors.SilverPrice}</p>
              )}
            </div>

            <div className="form-check mb-2">
              <Input
                // className={validClassActive}
                type="checkbox"
                name="IsActive"
                value={IsActive}
                checked={IsActive}
                onChange={handlecheck}
                // defaultChecked
              />
              <Label className="form-check-label" htmlFor="activeCheckBox">
                Is Active
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.IsActive}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className=" btn btn-success m-1"
                id="add-btn"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-outline-danger m-1"
                onClick={() => setmodal_edit(false)}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal> */}

      {/*Remove Modal*/}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
        }}
        centered
      >
        <ModalHeader className="bg-light p-3">
          <span style={{ marginRight: "210px" }}>Remove Silver Price Tag</span>
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

export default SilverPrice;
