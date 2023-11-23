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
import {
  createManageMedia,
  getManageMedia,
  removeManageMedia,
  updateManageMedia,
} from "../../../functions/Media/ManageMedia";

const ManageMedia = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [_id, set_Id] = useState("");

  const initialState = {
    MediaName: "",
    Media: "",
    Description: "",
    isActive: false,
  };

  const [remove_id, setRemove_id] = useState("");

  //search and pagination state
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [values, setValues] = useState(initialState);

  const { Category, CategoryImage, Description, isActive } = values;

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const [mediaData, setMediaData] = useState([]);

  const columns = [
    {
      name: "Media Name",
      selector: (row) => row.MediaName,
      sortable: true,
      sortField: "MediaName",
      minWidth: "150px",
    },
    {
      name: "Status",
      selector: (row) => {
        return <p>{row.isActive ? "Active" : "InActive"}</p>;
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
    fetchData();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchData = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-media-by-params`,
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
          setMediaData(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setMediaData([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const [errCN, setErrCN] = useState(false);
  const [errPI, setErrPI] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (values.MediaName === "") {
      errors.MediaName = "Media Name is required";
      setErrCN(true);
    }
    if (values.MediaName !== "") {
      setErrCN(false);
    }

    if (values.Media === "") {
      errors.Media = "Media is required";
      setErrPI(true);
    }

    if (values.Media !== "") {
      setErrPI(false);
    }

    return errors;
  };

  const validClassName =
    errCN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassMedia =
    errPI && isSubmit ? "form-control is-invalid" : "form-control";

  const [modal_delete, setmodal_delete] = useState(false);

  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);

  const handlecheck = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, isActive: e.target.checked });
  };

  const [modal_list, setModalList] = useState(false);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log("submit data", values);
    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);
    // console.log("error", errors);
    if (Object.keys(errors).length === 0) {
      const formdata = new FormData();

      formdata.append("MediaName", values.MediaName);
      formdata.append("Description", values.Description);
      formdata.append("Media", values.Media);
      formdata.append("isActive", values.isActive);

      createManageMedia(formdata)
        .then((res) => {
          console.log(res);
          setModalList(!modal_list);
          setValues(initialState);
          setCheckImagePhoto(false);
          //   setCheckImageCV(false);
          //   setCVAdd("");
          setPhotoAdd("");
          //   setImage("");
          // close form
          setIsSubmit(false);
          setFormErrors({});
          fetchData();
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
    removeManageMedia(remove_id)
      .then((res) => {
        console.log("deleted", res);
        setmodal_delete(!modal_delete);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUpdate = (e) => {
    e.preventDefault();

    console.log("update", values);
    let errors = validate(values);
    setIsSubmit(true);
    setFormErrors(errors);
    // console.log(validClassEditReferenceName);
    if (Object.keys(errors).length === 0) {
      const formdata = new FormData();

      formdata.append("MediaName", values.MediaName);
      formdata.append("Description", values.Description);
      formdata.append("Media", values.Media);
      formdata.append("isActive", values.isActive);
      //   console.log("form",formdata);

      updateManageMedia(_id, formdata)
        .then((res) => {
          console.log(res);
          setmodal_edit(!modal_edit);

          setPhotoAdd("");
          fetchData();
          setCheckImagePhoto(false);
          setValues(initialState);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddCancel = (e) => {
    e.preventDefault();
    setIsSubmit(false);

    setPhotoAdd("");
    setCheckImagePhoto(false);
    // setCheckImageCV(false);
    setModalList(false);
    setValues(initialState);
  };

  const handleUpdateCancel = (e) => {
    e.preventDefault();
    setIsSubmit(false);

    setPhotoAdd("");
    setCheckImagePhoto(false);
    setmodal_edit(false);
    setValues(initialState);
  };

  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    setIsSubmit(false);
    set_Id(_id);
    console.log(_id);
    setFormErrors(false);
    getManageMedia(_id)
      .then((res) => {
        console.log("get", res);
        setValues({
          ...values,
          MediaName: res.MediaName,
          Media: res.Media,
          Description: res.Description,
          isActive: res.isActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const [photoAdd, setPhotoAdd] = useState();
  const [checkImagePhoto, setCheckImagePhoto] = useState(false);

  const PhotoUpload = (e) => {
    if (e.target.files.length > 0) {
      console.log(e.target.files);
      const image = new Image();

      let imageurl = URL.createObjectURL(e.target.files[0]);
      console.log("img", e.target.files[0]);

      image.onload = () => {
        const width = image.width;
        const height = image.height;

        // Now, you have the image width and height available.
        // You can use this information when sending the image to the backend.
      };
      console.log("width", image.width);

      setPhotoAdd(imageurl);
      setValues({ ...values, Media: e.target.files[0] });
      //   console.log("img add", ProductImage);
      console.log("photoAdd", photoAdd);
      setCheckImagePhoto(true);
    }
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };

  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };
  document.title = "Manage Media | ZIYA";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <BreadCrumb
            maintitle="Media"
            title="Manage Media "
            pageTitle="Media "
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Manage Media
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
                        data={mediaData}
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
            setValues([]);
          }}
        >
          Add Manage Media
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <input
                type="text"
                className={validClassName}
                placeholder="Media Name"
                required
                name="MediaName"
                value={values.MediaName}
                onChange={handleChange}
              />

              <label htmlFor="role-field" className="form-label">
                Media Name
                <span className="text-danger">*</span>
              </label>
              {isSubmit && (
                <p className="text-danger">{formErrors.MediaName}</p>
              )}
            </div>

            <div className="form-floating mb-3">
              <input
                type="textarea"
                className="form-control"
                placeholder="Description"
                name="Description"
                value={values.Description}
                onChange={handleChange}
              />

              <label htmlFor="role-field" className="form-label">
                Description
              </label>
            </div>

            <Col lg={6}>
              <label>
                Media Image <span className="text-danger">*</span>
              </label>

              <input
                type="file"
                name="CategoryImage"
                className={validClassMedia}
                accept=".jpg, .jpeg, .png"
                onChange={PhotoUpload}
              />
              {isSubmit && <p className="text-danger">{formErrors.Media}</p>}
              {checkImagePhoto ? (
                <img src={photoAdd} alt="Profile" width="200" height="160" />
              ) : null}
            </Col>

            <div className="form-check mb-2 mt-2">
              <Input
                // className={validClassActive}
                type="checkbox"
                name="isActive"
                value={isActive}
                onChange={handlecheck}
                checked={isActive}
              />
              <Label className="form-check-label" htmlFor="activeCheckBox">
                Is Active
              </Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
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
                onClick={handleAddCancel}
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
          setValues([]);
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_edit(false);
          }}
        >
          Edit Manage Media
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <input
                type="text"
                className={validClassMedia}
                placeholder="Media Name"
                required
                name="MediaName"
                value={values.MediaName}
                onChange={handleChange}
              />

              <label htmlFor="role-field" className="form-label">
                Media Name
                <span className="text-danger">*</span>
              </label>
              {isSubmit && (
                <p className="text-danger">{formErrors.MediaName}</p>
              )}
            </div>

            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                name="Description"
                value={values.Description}
                onChange={handleChange}
                rows="5"
                style={{ height: "150px" }}
                placeholder="Enter description"
                required
              ></textarea>

              <label htmlFor="role-field" className="form-label">
                Description
              </label>
            </div>

            <Col lg={6}>
              <label>
                Media Image <span className="text-danger">*</span>
              </label>
              <input
                key={"Media" + _id}
                type="file"
                name="Media"
                className={validClassMedia}
                // accept="images/*"
                accept=".jpg, .jpeg, .png"
                onChange={PhotoUpload}
              />
              {isSubmit && <p className="text-danger">{formErrors.Media}</p>}

              {values.Media || photoAdd ? (
                <img
                  // key={photoAdd}
                  src={
                    checkImagePhoto
                      ? photoAdd
                      : `${process.env.REACT_APP_API_URL_ZIYA}/${values.Media}`
                  }
                  width="180"
                  height="180"
                />
              ) : null}
            </Col>

            <div className="form-check mb-2 mt-2">
              <Input
                type="checkbox"
                name="isActive"
                value={isActive}
                checked={isActive}
                onChange={handlecheck}
              />
              <Label className="form-check-label" htmlFor="activeCheckBox">
                Is Active
              </Label>
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
                onClick={handleUpdateCancel}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
      {/*Remove Modal*/}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
          setValues([]);
        }}
        centered
      >
        <ModalHeader className="bg-light p-3">
          <span style={{ marginRight: "210px" }}>Remove Manage Media</span>
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

export default ManageMedia;
