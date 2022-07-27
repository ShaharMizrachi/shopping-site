import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { productsList } from "../api/api";
import "../css/HomePage.css";
import Popper from "@mui/material/Popper";
import { DataGrid } from "@mui/x-data-grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import CartIcon from "@mui/icons-material/ShoppingCart";
import { addNewShopCart } from "../api/api";

const HomePage = () => {
  const [itemList, setitemList] = useState(null); // holding all list of product pulling from the server
  const [productsIdInCart, setProductsIdInCart] = useState([{ id: 0, title: "", price: 0, amount: 0 }]); // array all products bought and send to the cart
  const [totalSumCart, setTotalSumCart] = useState(0); // the sum bill in the cart
  const [shoppingCart, setShoppingCart] = useState([]); // array of json that hold all products that user put in the cart, connected to the rows in DataGrid tag(the input of the row)

  //pop-up field
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    console.log(event);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // In case clicking in the background for closing popUp window
  const popUp = useRef(null);

  // pop-up filled shooping finish massage
  const [shoopingFinishAnchorEl, setShoopingFinishAnchorEl] = useState(null);
  const idshoopingFinish = open ? "simple-popper" : undefined;

  useEffect(() => {
    const listner = (event) => {
      if (popUp.current && !popUp.current.contains(event.target)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener("mousedown", listner);

    return () => document.removeEventListener("mousedown", listner);
  }, []);

  const dataList = async () => {
    const data = await productsList();
    setitemList(data.data.data);
    // console.log(data.data.data);
  };

  useEffect(() => {
    dataList();
  }, []);

  const OnClickBuy = (item) => {
    const isItemInCart = shoppingCart.findIndex((product) => item.id === product.id) > -1;
    if (isItemInCart) {
      return minusPlusInCart(item, 1);
    }

    setShoppingCart([...shoppingCart, { title: item.title, id: item.id, amount: 1, price: item.price, unitPrice: item.price, orderId: 0 }]);
    setTotalSumCart(totalSumCart + item.price);
  };

  const columns = [
    { field: "title", headerName: "Title", width: 150, editable: false },
    { field: "price", headerName: "Price", width: 100, editable: false },
    { field: "amount", headerName: "Amount", width: 100, editable: false },
    {
      field: "option",
      headerName: "Options",
      width: 190,
      editable: false,
      renderCell: (params) => (
        <div>
          <ButtonGroup disableElevation variant="contained">
            <Button onClick={(e) => minusPlusInCart(params.row, 1)}>+</Button>
            <Button onClick={(e) => minusPlusInCart(params.row, -1)}>-</Button>
            <Button startIcon={<DeleteIcon />} onClick={(e) => deleteFromCart(params.row)}></Button>
          </ButtonGroup>
        </div>
      ),
    },
  ];

  const shoopingCartPop = () => {
    // my pop-up of shooping cart
    return (
      <div>
        <Popper placement={"right"} id={id} open={open} anchorEl={anchorEl} transition>
          <div id="popUp" ref={popUp}>
            <Box sx={{ border: 5, p: 1, bgcolor: "white", width: 750, height: 500, borderColor: "#0d6efd", borderRadius: 2, marginLeft: 5 }}>
              <Typography align="center" variant="h4" color="#0d6efd">
                shooping cart
              </Typography>
              <div className="col-8  mt-1 mb-1" style={{ display: "inline-flex" }}>
                <div className="offset-1">
                  <Typography variant="h6">Total:</Typography>
                </div>
                <div style={{ marginLeft: 5 }}>
                  <Typography variant="h6">{totalSumCart == null ? null : totalSumCart}</Typography>
                </div>
                <div className="offset-11">
                  <Button variant="contained" onClick={subbmitCart}>
                    Subbmit
                  </Button>
                </div>
              </div>
              <DataGrid rows={shoppingCart} columns={columns} pageSize={5} rowsPerPageOptions={[5]} disableSelectionOnClick />{" "}
            </Box>
          </div>
        </Popper>
      </div>
    );
  };

  const minusPlusInCart = (row, sign) => {
    setShoppingCart(
      shoppingCart.map((product) => {
        if (product.id !== row.id) return product;
        const amount = product.amount + sign >= 0 ? product.amount + sign : 0;
        const price = amount * product.unitPrice;
        if (sign > 0) setTotalSumCart(product.unitPrice + totalSumCart);
        else product.amount != 0 ? setTotalSumCart(totalSumCart - product.unitPrice) : console.log("it is zero");

        return { ...product, amount, price };
      })
    );
  };

  const deleteFromCart = (item) => {
    const productsLeft = shoppingCart.filter((product) => product.id != item.id);
    setTotalSumCart(totalSumCart - item.unitPrice * item.amount);
    setShoppingCart(productsLeft);
  };

  const subbmitCart = async () => {
    if (shoppingCart == 0) return;
    const orderId = Math.floor(Math.random() * 10000) + 1;
    shoppingCart.map((item) => (item.orderId = orderId));
    console.log(shoppingCart);
    await addNewShopCart(shoppingCart);
    setShoppingCart([]);
    setAnchorEl(false);
    setShoopingFinishAnchorEl(true);
    setTotalSumCart(0);
    window.alert("Shopping has submitted, have a great day!");
  };

  const itemsOnScreen = () => {
    return (
      <div className="container">
        <div>
          {itemList == null
            ? null
            : itemList.map((item) => {
                return (
                  <div style={{ display: "inline-block" }} key={item.id}>
                    <Box sx={{ border: 5, p: 1, bgcolor: "white", width: 250, height: 400, borderColor: "#0d6efd", borderRadius: 2, marginLeft: 5, marginTop: 3 }}>
                      <div className="row mb-4 ">
                        <img className="imgCatalog" src={!!item.imagePath ? item.imagePath : "https://productmanagementfestival.com/wp-content/uploads/2017/01/sell-your-product-online.jpg"} />
                      </div>
                      <Typography variant="h6">
                        Title:{""}
                        {item.title} <br />
                        Description:{""}
                        {!!item.description ? item.description : " No Desc"}
                        <br />
                        Price:{""}
                        {item.price} <br />
                      </Typography>
                      <div className="row mt-4 col-8 offset-2">
                        <Button style={{ border: "solid" }} color="primary" onClick={() => OnClickBuy(item)}>
                          Buy
                        </Button>
                      </div>
                    </Box>
                  </div>
                );
              })}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="row offset-9 mt-2 col-2">
        <Button variant="contained" color="primary" onClick={handleClick} startIcon={<CartIcon />}>
          shooping Cart ({shoppingCart.reduce((prev, product) => prev + product.amount, 0)})
        </Button>
      </div>
      <div>{shoopingCartPop()}</div>
      <div className="row col-12 mt-3">{itemsOnScreen()}</div>
    </React.Fragment>
  );
};

export default HomePage;
