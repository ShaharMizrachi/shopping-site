const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");
const app = express();
const BodyParser = require("body-parser");

app.use(cors({ origin: true }));
app.use(BodyParser.json());

const db = mysql.createConnection({
  // conection to mysql
  host: "localhost",
  user: "root",
  password: "19891989",
  database: "shopping_catalog_data",
});

app.get("/allList", async (req, res) => {
  try {
    db.query("SELECT * FROM shopping_catalog_data.products", (error, result) => {
      if (error) {
        return res.status(400).json({ success: false, message: JSON.stringify(error) });
      }
      if (result.length > 0) {
        return res.status(200).json({ success: true, data: result });
        console.log(result);
      }
    });
  } catch (e) {
    console.log(e);
  }
});

app.post("/edit", (req, res) => {
  try {
    const { id, title, description, price, imagePath } = req.body;

    if (!title || !price || !id) {
      return res.status(400).json({ success: false, message: "title of product has reurired" });
    }

    console.log(`update shopping_catalog_data.products set description="${description || ""}", price=${price}, imagePath="${imagePath || ""}", title="${title}" where id="${id}"`);
    db.query(`update shopping_catalog_data.products set description="${description || null}", price=${price}, imagePath="${imagePath || null}", title="${title}" where id="${id}"`, (error, result) => {
      if (error) {
        return res.status(400).json({ success: false, message: error });
      } else {
        return res.status(200).json({ success: true, message: result });
      }
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/add", (req, res) => {
  try {
    const { title, price, description, imagePath } = req.body;

    if (!title && !price) {
      return res.status(400).json({ success: false, message: " Has to be price and title" });
    }

    db.query(`insert into products (title,price,description,imagePath) values ("${title}", ${price},"${description || ""}", "${imagePath || ""}")`, (error, result) => {
      if (error) {
        return res.status(400).json({ success: false, message: error });
      } else {
        return res.status(200).json({ success: true, data: result.insertId });
      }
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.put("/deleteRow", (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: error });
    } else {
      db.query(`DELETE FROM shopping_catalog_data.products WHERE id=${id};`, (error, result) => {
        if (error) {
          return res.status(400).json({ success: false, message: error });
        } else {
          return res.status(200).json({ success: true, message: result });
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
});

app.put("/shop_cart", (req, res) => {
  const cart = req.body.cart;
  console.log(cart);
  let sql = "Insert Into shopping_catalog_data.sales values ";

  cart.forEach(({ orderId, amount, title }, i) => {
    if (i > 0) {
      sql += ",";
    }
    sql += `(${orderId},'${title}',Now(),${amount})`;
  });

  sql = sql + ";";
  console.log(sql);
  db.query(sql, (error, result) => {
    if (error) {
      return res.status(400).json({ success: false, message: error });
    } else {
      return res.status(200).json({ success: true, data: result });
    }
  });
});

app.get("/top5Sold", (req, res) => {
  let sql = `  select productTitle,sum(count) as count from shopping_catalog_data.sales  group by productTitle order by sum(count) desc limit 5`;
  db.query(sql, (error, result) => {
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }
    res.status(200).json({ success: true, data: result });
  });
});

app.get("/top5Unique", (req, res) => {
  let sql = "select productTitle,count(productTitle) as count from shopping_catalog_data.sales  group by productTitle order by count(productTitle) desc limit 5";

  db.query(sql, (error, result) => {
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }
    res.status(200).json({ success: true, data: result });
  });
});

app.get("/pastXDaySales", (req, res) => {
  try {
    let sql = "SELECT DATE_FORMAT(date,'%d/%m/%Y') as date, Sum(price * count) as totalSum FROM (shopping_catalog_data.products inner join shopping_catalog_data.sales on products.title = shopping_catalog_data.sales.productTitle) group by date having datediff(now(),date) <=";
    const days = req.query.day;
    if (!days) res.status(400).json({ success: false, message: error });
    else {
      sql += days + " order by date";
      db.query(sql, (error, result) => {
        if (error) return res.status(400).json({ success: false, message: error });
        return res.status(200).json({ success: true, data: result });
      });
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/userGet", (req, res) => {
  try {
    const { user, password } = req.body;
    console.log(password);

    if (!user && !password) {
      return res.status(400).json({ success: false, message: " Has to be user and password" });
    }

    db.query(`SELECT * FROM shopping_catalog_data.login where user='${user}' And password='${password}'`, (error, result) => {
      if (error) {
        return res.status(400).json({ success: false, message: error });
      } else {
        const isUserExist = result.length > 0 ? true : false;
        return res.status(200).json({ success: isUserExist, data: isUserExist });
      }
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/userRegister", (req, res) => {
  try {
    const { user, password } = req.body;
    console.log(password);
    if (!user && !password) {
      return res.status(400).json({ success: false, message: " Has to be user and password" });
    }
    db.query(` INSERT INTO shopping_catalog_data.login(user, password) VALUES ('${user}', '${password}');`, (error, result) => {
      if (error) {
        return res.status(400).json({ success: false, message: error });
      } else {
        return res.status(200).json({ success: true, data: true });
      }
    });
  } catch (e) {
    console.log("++++++++");
    res.status(500).json(e);
  }
});

app.listen(4000, () => {
  console.log("listening on 4000");
});

// on a daily basis for the
/////
