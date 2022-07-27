import React from "react";
import axios from "axios";

export const url = axios.create({
  baseURL: "http://localhost:4000/",
});

export const productsList = async () => {
  try {
    const allList = await url.get("/allList");
    return allList;
  } catch (e) {
    console.log(e);
  }
};

export const addNewProduct = async (title, price, description, imagePath) => {
  await url.post("/add", { title, price, description, imagePath });
};

export const deleteProdactDB = async (id) => {
  await url.put("/deleteRow", { id });
};

export const editProductDB = async (id, title, price, description, imagePath) => await url.post("/edit", { id, title, description, price, imagePath });

export const addNewShopCart = async (cart) => {
  await url.put("/shop_cart", { cart });
};

export const top5Sold = async () => {
  try {
    const top5 = await url.get("/top5Sold");
    return top5;
  } catch (e) {
    console.log(e);
  }
};

export const top5Unique = async () => {
  try {
    const top5U = await url.get("/top5Unique");
    return top5U;
  } catch (e) {
    console.log(e);
  }
};

export const pastXDaySales = async (days) => {
  try {
    const Sales = await url.get(`/pastXDaySales?day=${days}`);
    return Sales;
  } catch (e) {
    console.log(e);
  }
};
