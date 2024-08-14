import { NextResponse } from 'next/server';
import openDatabase from '../../../../utils/openDB';
import uploadFile from '../../../../utils/bunnyStorageUpload';

const validateItemData = (item) => {
  if (item.type !== 'accesorii') {
    if (!item.selectedSize || item.selectedSize === 'null') {
      throw new Error(`Invalid size for item: ${item.name}`);
    }
    if (!item.selectedColor || item.selectedColor === 'null') {
      throw new Error(`Invalid color for item: ${item.name}`);
    }
  }
  // Add any other validation rules here
};

export const PUT = async (req, res) => {
  console.log("Bulk_Item_Upload PUT request");
  let db;
  try {
    const formData = await req.formData();
    console.log("FORM DATA: ", formData);
    const bulkItemsData = [];

    for (const [key, value] of formData.entries()) {
      const match = key.match(/items\[(\d+)\]\[(\w+)\](?:\[(\d+)\])?/);
      if (match) {
        const [, index, field, subIndex] = match;
        if (!bulkItemsData[index]) {
          bulkItemsData[index] = {};
        }
        if (field === 'photos') {
          if (!bulkItemsData[index].photos) {
            bulkItemsData[index].photos = [];
          }
          bulkItemsData[index].photos.push(value);
        } else {
          bulkItemsData[index][field] = value;
        }
      }
    }

    console.log('Received bulk items data:', bulkItemsData);

    // Validate all items before starting the transaction
    bulkItemsData.forEach(validateItemData);

    db = await openDatabase();

    // Start transaction
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Insert common item data into the items table ONCE
    const insertItemQuery = `
      INSERT INTO items (name, price, description, type, material, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertItemID = await new Promise((resolve, reject) => {
      db.run(
        insertItemQuery,
        [
          bulkItemsData[0].name,
          bulkItemsData[0].price,
          bulkItemsData[0].description,
          bulkItemsData[0].type,
          bulkItemsData[0].material,
          bulkItemsData.length
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
    console.log(`Item with id ${insertItemID} successfully inserted into "items" table`);

    // Upload photos to BunnyCDN storage using the inserted item ID as the folder name
    for (const photo of bulkItemsData[0].photos) {
      console.log(photo);
      const fileName = `photo-${Date.now()}.jpg`; // Generate a unique file name
      const path = `${insertItemID}/${fileName}`; // Use insertItemID as the folder name
      await uploadFile(path, photo);
    }

    // Insert sizes, colors, and relationships for each item variation
    for (const item of bulkItemsData) {
      if (item.type !== 'accesorii') {
        const size = item.selectedSize;
        const color = item.selectedColor;

        // Insert size
        const insertSizeQuery = `INSERT INTO item_sizes (item_id, size) VALUES (?, ?)`;
        await new Promise((resolve, reject) => {
          db.run(insertSizeQuery, [insertItemID, size], function (err) {
            if (err) reject(err);
            else resolve();
          });
        });

        // Get the size ID
        const getSizeIdQuery = `SELECT id FROM item_sizes WHERE item_id = ? AND size = ?`;
        const sizeId = await new Promise((resolve, reject) => {
          db.get(getSizeIdQuery, [insertItemID, size], (err, row) => {
            if (err) reject(err);
            else resolve(row.id);
          });
        });

        console.log(`Size ${size} with id ${sizeId} inserted into "item_sizes" table`);

        // Insert color
        const insertColorQuery = `INSERT INTO item_colors (item_id, color) VALUES (?, ?)`;
        await new Promise((resolve, reject) => {
          db.run(insertColorQuery, [insertItemID, color], function (err) {
            if (err) reject(err);
            else resolve();
          });
        });

        // Get the color ID
        const getColorIdQuery = `SELECT id FROM item_colors WHERE item_id = ? AND color = ?`;
        const colorId = await new Promise((resolve, reject) => {
          db.get(getColorIdQuery, [insertItemID, color], (err, row) => {
            if (err) reject(err);
            else resolve(row.id);
          });
        });

        console.log(`Color ${color} with id ${colorId} inserted into "item_colors" table`);

        // Insert relationship into the item_size_color table
        const insertRelationshipQuery = `INSERT INTO item_size_color (item_id, size_id, color_id) VALUES (?, ?, ?)`;
        await new Promise((resolve, reject) => {
          db.run(insertRelationshipQuery, [insertItemID, sizeId, colorId], function (err) {
            if (err) reject(err);
            else resolve();
          });
        });
        console.log(`Relationship between item ${insertItemID}, size ${sizeId}, and color ${colorId} inserted into "item_size_color" table`);
      }
    }

    // Commit transaction
    await new Promise((resolve, reject) => {
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Return response
    return new Response(JSON.stringify({ message: "Bulk items data inserted successfully!" }), { status: 200 });
  } catch (err) {
    console.error('Error:', err);

    // Rollback transaction if an error occurred
    if (db) {
      await new Promise((resolve) => {
        db.run('ROLLBACK', resolve);
      });
    }

    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  } finally {
    if (db) {
      db.close();
    }
  }
};






// import { NextResponse } from 'next/server';
// import openDatabase from '../../../../utils/openDB';
// import uploadFile from '../../../../utils/bunnyStorageUpload';

// export const PUT = async (req, res) => {
//   console.log("Bulk_Item_Upload PUT request");
//   let db;
//   try {
//     db = await openDatabase();


//     const formData = await req.formData();
//     console.log("FORM DATA: ", formData);
//     const bulkItemsData = [];

//     for (const [key, value] of formData.entries()) {
//       const match = key.match(/items\[(\d+)\]\[(\w+)\](?:\[(\d+)\])?/);
//       if (match) {
//         const [, index, field, subIndex] = match;
//         if (!bulkItemsData[index]) {
//           bulkItemsData[index] = {};
//         }
//         if (field === 'photos') {
//           if (!bulkItemsData[index].photos) {
//             bulkItemsData[index].photos = [];
//           }
//           bulkItemsData[index].photos.push(value);
//         } else {
//           bulkItemsData[index][field] = value;
//         }
//       }
//     }

//     console.log('Received bulk items data:', bulkItemsData);

//     // Insert common item data into the items table ONCE
//     const insertItemQuery = `
//       INSERT INTO items (name, price, description, type, material, quantity)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     const insertItemID = await new Promise((resolve, reject) => {
//       db.run(
//         insertItemQuery,
//         [
//           bulkItemsData[0].name,
//           bulkItemsData[0].price,
//           bulkItemsData[0].description,
//           bulkItemsData[0].type,
//           bulkItemsData[0].material,
//           bulkItemsData.length
//         ],
//         function (err) {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(this.lastID);
//           }
//         }
//       );
//     });
//     console.log(`Item with id ${insertItemID} successfully inserted into "items" table`);


//     // Upload photos to BunnyCDN storage using the inserted item ID as the folder name
//     for (const photo of bulkItemsData[0].photos) {
//       console.log(photo);
//       const fileName = `photo-${Date.now()}.jpg`; // Generate a unique file name
//       const path = `${insertItemID}/${fileName}`; // Use insertItemID as the folder name
//       await uploadFile(path, photo);
//     }

//     // Insert sizes, colors, and relationships for each item variation
//     for (const item of bulkItemsData) {
//       const selectedSizes = [item.selectedSize];
//       const selectedColors = [item.selectedColor];

//       for (let i = 0; i < selectedSizes.length; i++) {
//         const size = selectedSizes[i];
//         const color = selectedColors[i];

//         // Insert or get size ID from the item_sizes table
//         const insertSizeQuery = `INSERT INTO item_sizes (item_id, size) VALUES (?, ?)`;
//         const sizeResult = await new Promise((resolve, reject) => {
//           db.run(insertSizeQuery, [insertItemID, size], function (err) {
//             if (err) {
//               reject(err);
//             } else {
//               resolve({ lastID: this.lastID, changes: this.changes });
//             }
//           });
//         });
//         const sizeId = sizeResult.lastID;
//         console.log(`Size ${size} with id ${sizeId} inserted into or already exists in "item_sizes" table`);

//         // Insert or get color ID from the item_colors table
//         const insertColorQuery = `INSERT INTO item_colors (item_id, color) VALUES (?, ?)`;
//         const colorResult = await new Promise((resolve, reject) => {
//           db.run(insertColorQuery, [insertItemID, color], function (err) {
//             if (err) {
//               reject(err);
//             } else {
//               resolve({ lastID: this.lastID, changes: this.changes });
//             }
//           });
//         });
//         const colorId = colorResult.lastID;
//         console.log(`Color ${color} with id ${colorId} inserted into or already exists in "item_colors" table`);

//         // Insert relationship into the item_size_color table
//         const insertRelationshipQuery = `INSERT INTO item_size_color (item_id, size_id, color_id) VALUES (?, ?, ?)`;
//         await new Promise((resolve, reject) => {
//           db.run(insertRelationshipQuery, [insertItemID, sizeId, colorId], function (err) {
//             if (err) {
//               reject(err);
//             } else {
//               resolve();
//             }
//           });
//         });
//         console.log(`Relationship between item ${insertItemID}, size ${sizeId}, and color ${colorId} inserted into "item_size_color" table`);
//       }
//     }

//     // Return response
//     return new Response(JSON.stringify({ message: "Bulk items data inserted successfully!" }), { status: 200, });
//   } catch (err) {
//     console.error('Error:', err);
//     return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
//   } finally {
//     db.close();
//   }
// };
