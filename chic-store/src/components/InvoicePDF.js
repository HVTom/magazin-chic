import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  heading: { fontSize: 18, marginBottom: 10 },
  subheading: { fontSize: 14, marginBottom: 5 },
  text: { fontSize: 12, marginBottom: 5 },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 }
});

const InvoicePDF = ({ invoice, companyDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Factura</Text>
        <Text style={styles.text}>Cod Factura: {invoice.order_id}</Text>
        <Text style={styles.text}>Data: {new Date(invoice.order_date).toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Detalii Companie</Text>
        <Text style={styles.text}>{companyDetails.name}</Text>
        <Text style={styles.text}>{companyDetails.address}</Text>
        <Text style={styles.text}>Telefon: {companyDetails.phone}</Text>
        <Text style={styles.text}>Email: {companyDetails.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Detalii Client:</Text>
        <Text style={styles.text}>{invoice.first_name} {invoice.last_name}</Text>
        <Text style={styles.text}>{invoice.shipping_address}</Text>
        <Text style={styles.text}>Phone: {invoice.phone}</Text>
        {/* <Text style={styles.text}>Email: {invoice.email}</Text> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Produse Comandate</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Produs</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Pret</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Marime</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Culoare</Text></View>
          </View>
          {invoice.order_items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.item_name}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.price.toFixed(2)} LEI</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.size}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.color}</Text></View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Pret Total: {invoice.total_price.toFixed(2)} LEI</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;