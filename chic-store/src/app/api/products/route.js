import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import axios from 'axios';
import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';


const getProductImage = async (productId) => {
  try {
    // route to list all images per folder
    const response = await axios.get(`https://${process.env.BASE_HOSTNAME}/chic-store/${productId}/`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        AccessKey: process.env.ACCESS_KEY
      }
    });

    // using the pull-zone url and attach the image name (ObjectName) to it to actually get it
    const image = `https://chic-store-images.b-cdn.net/${productId}/${response.data[0].ObjectName}`;
    console.log("IMAGE", image);
    return image;
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
};


// GET all items
export async function GET(req, res) {
  try {
    const db = await openDatabase();

    const items = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          items.*, 
          group_concat(DISTINCT item_sizes.size) as sizes,
          group_concat(DISTINCT item_colors.color) as colors
        FROM items
        LEFT JOIN item_sizes ON items.id = item_sizes.item_id
        LEFT JOIN item_colors ON items.id = item_colors.item_id
        GROUP BY items.id
      `, async (err, rows) => {
        if (err) {
          reject(err)
        } else {
          const itemsWithImages = await Promise.all(
            rows.map(async (item) => {
              const image = await getProductImage(item.id);
              const sizes = item.sizes ? item.sizes.split(',') : [];
              const colors = item.colors ? item.colors.split(',') : [];
              return { ...item, image, sizes, colors };
            })
          );
          resolve(itemsWithImages);
        }
      });
    });


    console.log("GET ALL ITEMS: ", items);


    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    })

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error retrieving items from database:", error);
    return NextResponse.json({ message: 'Error retrieving items', error: error.message }, { status: 500 });
  }
}





async function deleteStorageItemFolder(productId) {
  const storageZoneName = process.env.STORAGE_ZONE_NAME;
  const accessKey = process.env.ACCESS_KEY;
  const bunnyCDNUrl = `https://storage.bunnycdn.com/${storageZoneName}/${productId}/`;

  try {
    const response = await fetch(bunnyCDNUrl, {
      method: 'DELETE',
      headers: { AccessKey: accessKey }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete folder from BunnyCDN: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting from BunnyCDN:', error);
    throw error;
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('id');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    // First, delete from BunnyCDN
    await deleteStorageItemFolder(productId);

    // Then, delete from the database
    const db = await openDatabase();

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM items WHERE id = ?', [productId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    return NextResponse.json({ message: 'Product and associated files deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: 'Failed to delete product and associated files' }, { status: 500 });
  }
}




