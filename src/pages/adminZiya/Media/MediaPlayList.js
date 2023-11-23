import React, { useState, useEffect, useContext } from "react";
import {
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
  Label,
  Input,
  Row,
  CardFooter,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Select } from "antd";

import MediaPlayListDetails from "./MediaPlayListDetails";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  getManageMedia,
  listManageMedia,
} from "../../../functions/Media/ManageMedia";
import {
  createMediaPlayList,
  getMediaPlayList,
  removeMediaPlayList,
  updateMediaPlayList,
} from "../../../functions/Media/MediaPlayList";

const initialState = {
  playListName: "",
  // device_id: "",
  // multipleDeviceIds: [],
  ad_ids: [],
  IsActive: false,
};

const MediaPlayList = () => {
  const [values, setValues] = useState(initialState);
  const { playListName, ad_ids, IsActive } = values;

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [errAds, setErrAds] = useState(false);
  const [errPN, setErrPN] = useState(false);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [playLists, setPlayLists] = useState([]);
  const [listOfAds, setListofAds] = useState([]);

  const [mediaData, setMediaData] = useState([]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  useEffect(() => {
    console.log(ad_ids);
    if (ad_ids.length > 0) {
      loadAdsData();
    }
  }, [ad_ids]);

  const loadAdsData = () => {
    Promise.all(
      ad_ids.map((a) =>
        getManageMedia(a)
          .then((res) => {
            return res;
          })
          .catch((err) => console.log(err))
      )
    )
      .then((data) => {
        setMediaData(data);
      })
      .catch((err) => console.log(err));
  };

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
    getMediaPlayList(_id)
      .then((res) => {
        // console.log(res);
        setValues({
          ...values,
          playListName: res.playListName,
          ad_ids: res.ad_ids,
          IsActive: res.IsActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadAllAds();
    if (!modal_list) {
      setMediaData([]);
    }
    if (!modal_edit) {
      setMediaData([]);
    }
  }, [modal_list, modal_delete, modal_edit]);

  const loadAllAds = () => {
    listManageMedia().then((res) => {
        console.log(res);
      setListofAds(res);
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleActiveCheck = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, [e.target.name]: e.target.checked });
  };

  const handleClick = (e) => {
    e.preventDefault();

    console.log("playlist ", values);
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);
    if (Object.keys(erros).length === 0) {
      setLoadingSubmit(true);
      createMediaPlayList(values)
        .then((res) => {
          console.log(res);
          setLoadingSubmit(false);
          setmodal_list(!modal_list);
          setValues(initialState);
          fetchAllData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("remove id", remove_id);
    removeMediaPlayList(remove_id)
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
    console.log("update", values);
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);
    if (Object.keys(erros).length === 0) {
      setLoadingSubmit(true);
      updateMediaPlayList(_id, values)
        .then((res) => {
          console.log(res);
          setmodal_edit(!modal_edit);
          fetchAllData();
          setLoadingSubmit(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    console.log("drag and drop", result);
    console.log("mediadata", mediaData);

    const reorderedMediaData = Array.from(mediaData);
    const [reorderedItem] = reorderedMediaData.splice(result.source.index, 1);
    reorderedMediaData.splice(result.destination.index, 0, reorderedItem);
    console.log("media data", reorderedMediaData);

    setMediaData(reorderedMediaData);

    // Update the selected media array (ad_ids) to match the new order
    const reorderedAdIds = Array.from(ad_ids);
    const [reorderedAdItems] = reorderedAdIds.splice(result.source.index, 1);
    reorderedAdIds.splice(result.destination.index, 0, reorderedAdItems);
    console.log("adids ", reorderedAdIds);

    setValues({
      ...values,
      ad_ids: reorderedAdIds,
    });
  };

  const validate = (values) => {
    const errors = {};

    if (values.playListName == "") {
      errors.playListName = "Playlist name is required.";
      setErrPN(true);
    }
    if (values.playListName !== "") {
      setErrPN(false);
    }

    if (values.ad_ids.length == 0) {
      errors.ad_ids = "Media Selection is required!";
      setErrAds(true);
    } else {
      setErrAds(false);
    }

    return errors;
  };

  const validClassPN =
    errPN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassAds =
    errAds && isSubmit ? "form-control is-invalid" : "form-control";

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
        `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-playlist-by-params`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          isActive: filter,
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setPlayLists(res.data);
          console.log(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setPlayLists([]);
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

  const mediaGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr)", // Adjust the column width as needed
    gap: "20px", // Adjust the gap between items as needed
  };

  const col = [
    {
      name: "Playlist Name",
      cell: (row) => row.playListName,
      sortable: true,
      sortField: "playListName",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <React.Fragment>
            <div className="d-flex gap-1">
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
      minWidth: "190px",
    },
  ];

  document.title = "Manage Playlist | Marwiz";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Media Management"
            pageTitle="Playlist"
            title="Manage Playlist"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Manage Playlist
                      </h2>
                    </Col>

                    <Col lg={4} md={6} sm={6}>
                      <div className="text-end mt-2">
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
                        data={playLists}
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
        className="modal-dialog modal-lg"
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
            setValues(initialState);
            setFormErrors({});
          }}
        >
          Add Playlist
        </ModalHeader>
        <form>
          <ModalBody>
            <Col md={6}>
              <div className="form-floating mb-3 m-1">
                <Input
                  type="text"
                  className={validClassPN}
                  name="playListName"
                  value={playListName}
                  onChange={handleChange}
                />
                <Label className="form-label">
                  Playlist Name
                  <span className="text-danger">*</span>
                </Label>
                {isSubmit && (
                  <p className="text-danger">{formErrors.playListName}</p>
                )}
              </div>
            </Col>

            <div className=" mb-3">
              <Label>
                Media
                <span className="text-danger">*</span>
              </Label>
              <Select
                mode="multiple"
                allowClear
                // className={validClassAssDevice}
                className="form-control"
                placeholder="Select media"
                value={ad_ids}
                onChange={(value) =>
                  setValues({
                    ...values,
                    ad_ids: value,
                  })
                }
              >
                {listOfAds.map((d) => {
                  return (
                    <React.Fragment key={d._id}>
                      {d.isActive && (
                        <option value={d._id}>{d.MediaName}</option>
                      )}
                    </React.Fragment>
                  );
                })}
              </Select>
              {isSubmit && <p className="text-danger">{formErrors.ad_ids}</p>}
            </div>

            <div className="form-check mb-2">
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

            <div className=" mb-3 h6">
              {" "}
              {ad_ids.length} Media added in Playlist{" "}
            </div>

            {ad_ids.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={mediaData}>
                  {(provided) => (
                    <div ref={provided.innerRef}>
                      {mediaData.map((product, index) => (
                        <MediaPlayListDetails
                          product={product}
                          key={product._id}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : null}

            <Row>
              {loadingSubmit && (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <h6 className="p-2">
                    Wait for a few seconds.This process might take some time.
                  </h6>
                </div>
              )}
            </Row>
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
                  setMediaData([]);
                  setLoadingSubmit(false);
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
        className="modal-dialog modal-lg"
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
            setValues(initialState);
          }}
        >
          Edit Playlist
        </ModalHeader>
        <form>
          <ModalBody>
            {/* <CardBody> */}
            <Col md={6}>
              <div className="form-floating mb-3 m-1">
                <Input
                  type="text"
                  className={validClassPN}
                  name="playListName"
                  value={playListName}
                  onChange={handleChange}
                />
                <Label className="form-label">
                  Playlist Name
                  <span className="text-danger">*</span>
                </Label>
                {isSubmit && (
                  <p className="text-danger">{formErrors.playListName}</p>
                )}
              </div>
            </Col>

            <div className=" mb-3">
              <Label>
                Media
                <span className="text-danger">*</span>
              </Label>
              <Select
                mode="multiple"
                allowClear
                // className={validClassAssDevice}
                className="form-control"
                placeholder="Select media"
                value={ad_ids}
                onChange={(value) =>
                  setValues({
                    ...values,
                    ad_ids: value,
                  })
                }
              >
                {listOfAds.map((d) => {
                  return (
                    <React.Fragment key={d._id}>
                      {d.isActive && (
                        <option value={d._id}>{d.MediaName}</option>
                      )}
                    </React.Fragment>
                  );
                })}
              </Select>
              {isSubmit && <p className="text-danger">{formErrors.ad_ids}</p>}
            </div>
            {/* </CardBody> */}
            <div className="form-check mb-2">
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

            <div className=" mb-3 h6">
              {" "}
              {ad_ids.length} Media added in Playlist{" "}
            </div>

            {ad_ids.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={mediaData}>
                  {(provided) => (
                    <div ref={provided.innerRef}>
                      {mediaData.map((product, index) => (
                        <MediaPlayListDetails
                          product={product}
                          key={product._id}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : null}

<Row>
              {loadingSubmit && (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <h6 className="p-2">
                    Wait for a few seconds.This process might take some time.
                  </h6>
                </div>
              )}
            </Row>
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
                  setValues(initialState);
                  setLoadingSubmit(false);
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
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_delete(false);
          }}
        >
          Remove Playlist
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

export default MediaPlayList;
