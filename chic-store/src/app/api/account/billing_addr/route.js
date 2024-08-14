// File: app/api/account/billing_addr/route.js
import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';
import openDatabase from '../../../../utils/openDB';

export const POST = async (req, res) => {
  console.log("billing_address POST request");
  let db;
  try {
    db = await openDatabase();

    const {
      email,
      invoiceType,
      billingFirstName,
      billingLastName,
      billingCounty,
      billingCity,
      billingStreet,
      billingZipCode,
      billingPhone,
      billingEmail,
      billingCompanyName,
      billingCUI,
    } = await req.json();

    console.log("Received data:", { email, invoiceType, billingFirstName, billingLastName, billingCounty, billingCity, billingStreet, billingZipCode, billingPhone, billingEmail, billingCompanyName, billingCUI });

    let updateUserQuery;
    let params;

    if (invoiceType === 'personal') {
      updateUserQuery = `
        UPDATE users
        SET invoice_type = ?, billing_first_name = ?, billing_last_name = ?, 
            billing_county = ?, billing_city = ?, billing_street = ?, 
            billing_zip_code = ?, billing_phone = ?, billing_email = ?,
            billing_company_name = NULL, billing_cui = NULL
        WHERE email = ?
      `;
      params = [invoiceType, billingFirstName, billingLastName, billingCounty, billingCity, billingStreet, billingZipCode, billingPhone, billingEmail, email];
    } else if (invoiceType === 'company') {
      updateUserQuery = `
        UPDATE users
        SET invoice_type = ?, billing_first_name = ?, billing_last_name = ?, 
            billing_county = ?, billing_city = ?, billing_street = ?, 
            billing_zip_code = ?, billing_phone = ?, billing_email = ?,
            billing_company_name = ?, billing_cui = ?
        WHERE email = ?
      `;
      params = [invoiceType, billingFirstName, billingLastName, billingCounty, billingCity, billingStreet, billingZipCode, billingPhone, billingEmail, billingCompanyName, billingCUI, email];
    } else {
      return NextResponse.json({ message: 'Invalid invoice type' }, { status: 400 });
    }

    console.log("Query:", updateUserQuery);
    console.log("Params:", params);

    await new Promise((resolve, reject) => {
      db.run(updateUserQuery, params, (err) => {
        if (err) {
          console.error('Error updating billing information:', err.message);
          reject(err);
        } else {
          console.log(`Billing information updated for user with email: ${email}`);
          resolve();
        }
      });
    });

    return new Response(JSON.stringify({ message: "Billing information updated successfully!" }), {
      status: 200,
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  } finally {
    if (db) {
      db.close();
    }
  }
};



export const GET = async (req) => {
  let db;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    db = await openDatabase();

    const query = `
      SELECT 
        invoice_type,
        billing_first_name,
        billing_last_name,
        billing_county,
        billing_city,
        billing_street,
        billing_zip_code,
        billing_phone,
        billing_email,
        CASE 
          WHEN invoice_type = 'company' THEN billing_company_name 
          ELSE NULL 
        END as billing_company_name,
        CASE 
          WHEN invoice_type = 'company' THEN billing_cui 
          ELSE NULL 
        END as billing_cui
      FROM users
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      db.get(query, [userId], (err, row) => {
        if (err) {
          console.error('Error fetching billing information:', err.message);
          reject(NextResponse.json({ message: 'Error fetching billing information' }, { status: 500 }));
        } else if (!row) {
          reject(NextResponse.json({ message: 'User not found' }, { status: 404 }));
        } else {
          const billingInfo = {
            invoiceType: row.invoice_type || '',
            billingFirstName: row.billing_first_name || '',
            billingLastName: row.billing_last_name || '',
            billingCounty: row.billing_county || '',
            billingCity: row.billing_city || '',
            billingStreet: row.billing_street || '',
            billingZipCode: row.billing_zip_code || '',
            billingPhone: row.billing_phone || '',
            billingEmail: row.billing_email || '',
            billingCompanyName: row.billing_company_name || '',
            billingCUI: row.billing_cui || '',
          };
          resolve(NextResponse.json(billingInfo, { status: 200 }));
        }
      });
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  } finally {
    if (db) {
      db.close();
    }
  }
};
