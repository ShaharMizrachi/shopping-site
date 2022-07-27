# shopping-site
Application of a shopping site with a back office for stats and product management.

**technology used**:

    front: React.js
    back:Express.js
    DB: MySQL 

Web-site with 3 routes pages:


1./admin: 
    
    Admin disboard allow to add new products, delete, edit, as for each of them to use pictures, descriptions and set a price .
   
2./home:

     Home that the first screen for the user, show list of products as ability to buy each of them and add them in the cart,
     while in the cart as option of delete and changing the amount of products from each type.
  
  3./stats:
  
    This page will display stats of sales in 3 boxes:
    • Display the top 5 sold products
    • Display the top 5 Unique sold products.(if a shopping cart contained more than one ofthe same product, count as one).
    • Display the sales on a daily basis for the past X days (ability to choose amount of days going back) 
    
    
  **DataBase:**
  Using Two tables 
    1.shopping_catalog_data.products => {id,title,description,price,imagePath}
    2.shopping_catalog_data.sales => {orderId,productTitle,date,count}
    
