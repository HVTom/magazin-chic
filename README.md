# Magazin Chic
Clothes e-commerce website



## Technologies
+ NextJS
+ Tailwind
+ SQLite
+ JWT
+ Bunny Storage
+ [NodeMailer](https://www.nodemailer.com)

## Server Admin
+ Ubuntu Server
+ Nginx



# Application Flow

### 1. Landing page
<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Landing.png" width="300" />

<h5>Has 2 introductory sections to keep the user interested:</h5>
<ul>
    <li><h5>New items (posted at most 15 days old)</h5></li>
    <li><h5>Discounts</h5></li>
</ul>




### 2. Main products page:
<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Products.png">

<ul>
  <li><h5>Search bar</h5></li>
  <li><h5>Filtering and sorting side bar - uses additional arrays so user gets to see the previous results after deleting a sort/filter criteria</h5></li>
  <li><h5>Show more - progressive loading (increments of 5)</h5></li>
</ul>






### 3. Product details page:



<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Product_Detail.png">

##### Default state, when the user is not logged in



<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Product_Details_Logged_In.png">

##### Logged-in state, now the button for adding a product to cart is available



<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Add_To_Cart_Popup.png">

##### User is directed to choose a size-color combination before adding a product to cart.
##### A popup shown when a user wants to add to cart the product.
##### Adding to cart function is not triggered unless the user chooses "OK".



# Customer Side


### 4. Customer dashboard

##### Customer Dashboard has 3 menu section to manage orders (history and current, 2 colors to indicate their status, thumbnail for each product, total price, date)

<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Customer_Dashboard_Orders.png">


##### The personal data section has 2 forms: one for editing the delivery information, and one for managing billing data
<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Customer_Dashboard_Personal_Data.png">
<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Customer_Dashboard_Personal_Data_Delivery_Address.png">
<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Customer_Dashboard_Personal_Data_Billing_Address.png">

##### The last section lets the user change the account email address, logout, or delete the whole account

<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Customer_Dashboard_Account_Actions.png">


##### The cart page contains the whole order summary: products with thumbnails for each of them, billing information, 2 payment options

<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Cart.png">




# Admin Side
##### Originally thought-out as a website to be used by a small, local merchant, the admin page has all the managing operations a store owner would need. 

<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Admin_Dashboard_Product_Upload.png">
<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Admin_Dashboard_Size_Color_Editing.png">


##### The data management section has a main collapsible form at the top, where the admin inputs the repetitive data for a product and its stock. Then the generate button, when it's pressed, shows the summary for the products, and lets the admin choose for each item the size-color combination. On upload, the photos are sent to Bunny Storage, and then the product data is stored sequentially in the SQLite database (the product's general details and stock in 1 table, then in separate tables each individual item and the color (item_color table), and each item with the size (item_size). A final table links the items table with the size and color db tables.

<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Admin_Dashboard_Stock_Management.png">

##### Under the product uploading form there's a stock table. The stock table is color coded so the owner sees easily which type of product has a healthy stock (green), less than 10 products (yellow), sold out (red). The sold out products have a button to manually clean the product entry from the DB. 
##### The data management section also contains a stock management table. Above it it has a product price updater with 2 inputs that require the product id and the newly desired price.

<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Admin_Dashboard_Order_Management_1.png">
<img src="https://github.com/HVTom/magazin-chic/blob/main/UI/Admin_Dashboard_Orders_Full_Order_Details_Card.png">


##### The last menu sections is account management which looks like the customer's Actions but contains only a logout button.
