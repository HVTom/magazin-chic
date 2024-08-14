// endpoint for upload single item into items table
// maybe can make it work for bulk upload also
// aprt from images, most of the data
// goes to items table
// images go to heck knows where


import { NextResponse } from 'next/server';
import openDatabase from '../../../../utils/openDB';



export const POST = async (req, res) => {
  console.log("Single_Item_Upload POST request");
  let db;
  try {
    db = await openDatabase();

    const formData = await req.formData();

    // Get the values from the form data
    const photos = formData.getAll('photos');
    const name = formData.get('name');
    const price = formData.get('price');
    const material = formData.get('material');
    const selectedSize = formData.get('selectedSize');
    const selectedType = formData.get('selectedType');
    const selectedColor = formData.get('selectedColor');
    const description = formData.get('description');

    console.log('Photos:', photos);
    console.log('Name:', name);
    console.log('Price:', price);
    console.log('Material:', material);
    console.log('Selected Size:', selectedSize);
    console.log('Selected Type:', selectedType);
    console.log('Selected Color:', selectedColor);
    console.log('Description:', description);

    // Insert item data into the items table
    const insertItemQuery = `
      INSERT INTO items (name, price, description, type, material)
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertItemID = await new Promise((resolve, reject) => {
      db.run(
        insertItemQuery,
        [name, price, description, selectedType, material], // check the order
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
    console.log(`Item with id ${insertItemID} successfully inserted into "items" table`)



    // Insert or get size ID from the item_sizes table
    const insertSizeQuery = `INSERT OR IGNORE INTO item_sizes (item_id, size) VALUES (?, ?)`;
    const sizeId = await new Promise((resolve, reject) => {
      db.run(insertSizeQuery, [insertItemID, selectedSize], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
    console.log(`Size with id ${insertItemID} successfully inserted into "item_sizes" table`)



    // Insert or get color ID from the item_colors table
    const insertColorQuery = `INSERT OR IGNORE INTO item_colors (item_id, color) VALUES (?, ?)`;
    const colorId = await new Promise((resolve, reject) => {
      db.run(insertColorQuery, [insertItemID, selectedColor], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
    console.log(`Color with id ${insertItemID} successfully inserted into "item_colors" table`)




    // Insert relationship into the item_color_size table
    const insertRelationshipQuery = `INSERT INTO item_size_color (item_id, size_id, color_id) VALUES (?, ?, ?)`;
    await new Promise((resolve, reject) => {
      db.run(
        insertRelationshipQuery,
        [insertItemID, sizeId, colorId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
    console.log(`Color - Size with id ${insertItemID} successfully inserted into "item_color_size" table`)


    // Return response
    return new Response(JSON.stringify({ message: "User data inserted successfully!" }), {
      status: 200,
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  } finally {
    db.close();
  }
};