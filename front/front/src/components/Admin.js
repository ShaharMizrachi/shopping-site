import React, { useEffect, useRef, useState } from "react";
import { productsList, addNewProduct, deleteProdactDB, editProductDB } from "../api/api";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";
import "../css/Admin.css";

const Admin = () => {
  const [rows, setRows] = useState([]);

  const dataList = async () => {
    const data = await productsList();
    setRows(data.data.data);
  };

  useEffect(() => {
    dataList();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 150, editable: false },
    { field: "price", headerName: "Price", width: 160, editable: false },
    { field: "description", headerName: "Description", width: 160, editable: false },
    { field: "imagePath", headerName: "Picture", width: 160, editable: false },
    {
      field: "option",
      headerName: "Options",
      width: 190,
      editable: false,
      renderCell: (params) => (
        <div>
          <Button variant="contained" onClick={(e) => editProduct(e, params.row)}>
            Edit
          </Button>
          {"  "}
          <Button variant="contained" onClick={() => deleteProdact(params.row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  //field to new product inside the pop-up
  const [titleNew, setTitleNew] = useState(undefined);
  const [priceNew, setPriceNew] = useState(undefined);
  const [descriptionNew, setDescriptionNew] = useState(undefined);
  const [pictureUrlNew, setPictureUrlNew] = useState(undefined);

  // at the time of editting, holding the id and boolean for edit status (active or not)
  const [editIdStatus, setEditIdStatus] = useState(-1);

  const addingNewProduct = async (e) => {
    e.preventDefault();
    if (editIdStatus > 0) {
      editProductDB(editIdStatus, titleNew, priceNew, descriptionNew, pictureUrlNew);
      setRows(rows.map((row) => (row.id === editIdStatus ? { id: editIdStatus, title: titleNew, price: priceNew, description: descriptionNew, imagePath: pictureUrlNew } : row)));
      setEditIdStatus(-1);
      setAnchorEl(null);
      window.alert("Product has been edit!");
      return;
    }
    await addNewProduct(titleNew, priceNew, descriptionNew, pictureUrlNew);
    dataList();
    window.alert("New product has been submitted!");
    setTitleNew(undefined);
    setPriceNew(undefined);
    setDescriptionNew(undefined);
    setPictureUrlNew(undefined);
    setAnchorEl(false);
  };

  const editProduct = (e, product) => {
    setAnchorEl(e.target);
    setTitleNew(product.title);
    setPriceNew(product.price);
    setDescriptionNew(product.description);
    setPictureUrlNew(product.imagePath);
    setEditIdStatus(product.id);
  };

  const deleteProdact = (id) => {
    deleteProdactDB(id).then(() => {
      const filtedproduct = rows.filter((product) => product.id != id);
      setRows(filtedproduct);
    });
  };

  //pop-up field
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // In case clicking in the background for closing popUp window
  const background = useRef(null);
  const popUp = useRef(null);

  useEffect(() => {
    const listner = (event) => {
      if (popUp.current && !popUp.current.contains(event.target)) {
        setAnchorEl(null);
        setEditIdStatus(-1);
      }
    };

    document.addEventListener("mousedown", listner);

    return () => document.removeEventListener("mousedown", listner);
  }, []);

  return (
    <div>
      <div ref={background} id="background" className="row offset-7">
        <Button variant="contained" style={{ marginTop: 5, width: 200 }} onClick={handleClick} aria-describedby={id} type="button">
          Add
        </Button>
      </div>
      <div style={{ height: 900, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5]} disableSelectionOnClick />{" "}
      </div>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        <div id="popUp" ref={popUp}>
          <Box sx={{ border: 5, p: 1, bgcolor: "background.paper", width: 350, borderColor: "#0d6efd", borderRadius: 2, marginRight: 15 }}>
            <form onSubmit={addingNewProduct}>
              <div className="row  col-12" style={{ marginLeft: 0 }}>
                <TextField onChange={(e) => setTitleNew(e.target.value)} required id="filled-required" label="title" value={titleNew} variant="filled" style={{ marginTop: 5 }} />
                <TextField onChange={(e) => setPriceNew(e.target.value)} required id="filled-required" label="price" value={priceNew} variant="filled" style={{ marginTop: 5 }} />
                <TextField onChange={(e) => setDescriptionNew(e.target.value)} id="filled-required" label="Description" value={descriptionNew} variant="filled" style={{ marginTop: 5 }} />
                <TextField onChange={(e) => setPictureUrlNew(e.target.value)} id="filled-required" label="Picture URL" value={pictureUrlNew} variant="filled" style={{ marginTop: 5 }} />
                <Button variant="contained" type="submit" style={{ marginTop: 5 }}>
                  submit
                </Button>
              </div>
            </form>
          </Box>
        </div>
      </Popper>
    </div>
  );
};

export default Admin;
