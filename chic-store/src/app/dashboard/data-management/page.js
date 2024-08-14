'use client';
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import SingleItemUpload from '../../../components/SingleItemUpload';
import BulkItemUpload from '../../../components/BulkItemUpload';
import { useRouter } from 'next/navigation';
import ItemUploadConfirmationPopup from "../../../components/ItemUploadConfirmationPopup";


// rename sizes to clothes_sizes
const sizes = ['36', '38', '40', '42', '44', '46', '48', '50'];
// add 'paltoane' to types; remove type check in the items table(since we have predefined strings) and make it simple TEXT;
const types = ['bluza', 'rochie', 'fusta', 'pantaloni', 'camasa', 'palton', 'pulover', 'incaltaminte', 'poseta', 'accesorii'];
// shoe_sizes (applies only when type 'incaltaminte' is selected)
const shoe_sizes = ['35', '36', '37', '38', '39', '40', '41'];



//  ADD LOGOUT BUTTON FOR THE ADMIN TOO
const DataManagement = () => {
  const router = useRouter();
  const [toggled, setToggle] = useState(false);
  const [toggled2, setToggle2] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [bulkItems, setBulkItems] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [commonAttributes, setCommonAttributes] = useState({
    photos: [],
    name: '',
    price: '',
    material: '',
    type: types[0],
    description: ''
  });
  const [bulkItemData, setBulkItemData] = useState([]);
  const [uploadedItemResume, setUploadedItemResume] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [tableItems, setTableItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState('');
  const [newPrice, setNewPrice] = useState('');




  const handleEditPrice = async () => {
    if (!editingItemId || !newPrice) {
      alert('Vă rugăm să completați ambele câmpuri.');
      return;
    }

    const updatedItem = {
      editingItemId,
      newPrice
    }

    try {
      const response = await axios.put(`../../api/dashboard/get_all_items`, updatedItem);

      if (response.status === 200) {
        alert('Preț actualizat cu succes!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating item price:', error.response ? error.response.data : error.message);
      alert(`Eroare la actualizarea prețului: ${error.response ? error.response.data.message : error.message}`);
    }
  };



  useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await axios.get("../../api/dashboard/get_all_items");
        console.log("Dashboard table all items: ", response.data);
        setTableItems(response.data);
      } catch (error) {
        console.error("Could not fetch all items: ", error);
        setTableItems([]);
      }
    }
    getAllItems();
  }, [setTableItems]);



  // Handle change for input box
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handle change for common attributes
  const handleCommonAttributeChange = (event) => {
    const { name, value } = event.target;
    setCommonAttributes((prevAttributes) => ({
      ...prevAttributes,
      [name]: value,
    }));
  };

  // Handle image additions to bulk items
  const handleAddBulkImage = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(prevImages => [...prevImages, ...files]);
    setCommonAttributes(prevAttributes => ({
      ...prevAttributes,
      photos: [...prevAttributes.photos, ...files]
    }));
  };


  // handle image deletion from bulk items
  const handleDeleteBulkImage = (index) => {
    setSelectedImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });

    setCommonAttributes((prevAttributes) => ({
      ...prevAttributes,
      photos: prevAttributes.photos.filter((_, i) => i != index)
    }));
  }




  // Generate N numbers of upload items for bulk upload
  const handleGenerateItems = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value) && value > 0) {
      setNumberOfItems(value);
      const itemsArray = Array(value).fill().map(() => ({ ...commonAttributes }));
      setBulkItems(itemsArray);
    }
  };



  // single item upload form
  // see whats the diff if you put the upload btn here 
  // or in the component
  const handleSingleItemUpload = async (uploadedItem) => {
    console.log("Dashboard SingleItemUpload data: ", uploadedItem);
    try {
      const formData = new FormData();
      uploadedItem.photos.forEach((photo) => {
        formData.append('photos', photo);
      });
      formData.append('name', uploadedItem.name);
      formData.append('price', uploadedItem.price);
      formData.append('material', uploadedItem.material);
      formData.append('selectedSize', uploadedItem.selectedSize);
      formData.append('selectedType', uploadedItem.selectedType);
      formData.append('selectedColor', uploadedItem.selectedColor);
      formData.append('description', uploadedItem.description);


      const response = await axios.post("../api/dashboard/item_upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === "200") {
        console.log('Single item uploaded successfully');
        window.confirm("Produs incarcat cu succes!");
        // You can perform additional actions here, such as resetting the form or displaying a success message
      } else {
        console.error('Failed to upload single item');
      }
    } catch (error) {
      console.error('Error uploading single item:', error);
    }
  };


  // bulk item upload
  const handleBulkItemUpload = async () => {
    console.log(bulkItemData);
    try {
      const formData = new FormData();

      bulkItemData.forEach((item, index) => {
        item.photos.forEach((photo, photoIndex) => {
          formData.append(`items[${index}][photos][${photoIndex}]`, photo);
        });
        formData.append(`items[${index}][name]`, item.name);
        formData.append(`items[${index}][price]`, item.price);
        formData.append(`items[${index}][material]`, item.material);
        formData.append(`items[${index}][description]`, item.description);
        formData.append(`items[${index}][selectedSize]`, item.selectedSize);
        formData.append(`items[${index}][selectedColor]`, item.selectedColor);
        formData.append(`items[${index}][type]`, item.type);
      });

      const response = await axios.put("../api/dashboard/bulk_item_upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Bulk items uploaded successfully');
        const responseData = response.data; // Obține datele din răspuns
        setUploadedItemResume({
          name: bulkItemData[0].name,
          quantity: bulkItemData.length,
          price: bulkItemData.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2),
          thumbnail: bulkItemData[0].photos[0] // Add this line
        });
        setShowPopup(true);

        //alert(responseData.message); // Afișează mesajul din răspuns într-un alert
        //        router.push("/dashboard");
        // Poți efectua acțiuni suplimentare aici, cum ar fi resetarea formularului sau afișarea unui mesaj de succes
      } else {
        console.error('Failed to upload bulk items');
      }
    } catch (error) {
      console.error('Error uploading bulk items:', error);
    }
  };



  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest produs și toate fișierele asociate?")) {
      try {
        // Call the API to delete the product and its associated files
        const response = await axios.delete(`../../api/products/?id=${productId}`);

        if (response.status === 200) {
          // Refresh the product list
          const updatedItems = tableItems.filter(item => item.id !== productId);
          setTableItems(updatedItems);

          alert("Produsul și toate fișierele asociate au fost șterse cu succes din storage și baza de date.");
        } else {
          throw new Error('Eroare la ștergere');
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("A apărut o eroare la ștergerea produsului: " + error.message);
      }
    }
  };


  return (
    <div className="flex flex-col items-start mt-8 mx-8 mb-4 overflow-x-auto">
      {showPopup && uploadedItemResume && (
        <ItemUploadConfirmationPopup
          itemName={uploadedItemResume.name}
          quantity={uploadedItemResume.quantity}
          price={uploadedItemResume.price}
          thumbnail={uploadedItemResume.thumbnail}
          onClose={() => {
            setShowPopup(false);
            setUploadedItemResume(null);
            router.push("/dashboard/data-management");
          }}
        />
      )}
      {/* <div className="flex flex-row">
        <h1 className="text-2xl font-sb mb-2">Adauga articol vestimentar</h1>
        <button
          onClick={() => setToggle(!toggled)}
          className="hover:cursor-pointer"
        >
          {toggled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
              />
            </svg>
          )}
        </button>
      </div> */}
      {/* {toggled && <SingleItemUpload sizes={sizes} shoe_sizes={shoe_sizes} types={types} onUpload={handleSingleItemUpload} />} */}

      <div className="mt-8">
        <div className="flex flex-row">
          <h1 className="text-2xl font-sb mb-2">Adauga articole multiple</h1>
          <button
            onClick={() => setToggle2(!toggled2)}
            className="hover:cursor-pointer"
          >
            {toggled2 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                />
              </svg>
            )}
          </button>
        </div>
        {toggled2 && (
          <div>
            <div>
              <input
                type="number"
                min="0"
                placeholder="Număr de articole (min 1)"
                value={inputValue}
                onChange={handleInputChange}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                }}
                className="border rounded-md px-4 py-2 mb-4 appearance-none"
              />
              <div className="flex flex-col mb-4">
                <p className="text-xl font-sb mb-2">Poze</p>
                <input type="file" multiple onChange={handleAddBulkImage} />
                <div className="flex flex-wrap mt-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(image)} alt={`selected-${index}`} className="w-32 h-32 object-cover mr-2 mb-2" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => handleDeleteBulkImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mb-2 font-sb text-xl">Nume:</p>
                <input
                  type="text"
                  name="name"
                  value={commonAttributes.name}
                  onChange={handleCommonAttributeChange}
                  className="border rounded-md px-4 py-2 mb-2"
                />
                <p className="mb-2 font-sb text-xl">Pret:</p>
                <input
                  type="number"
                  name="price"
                  value={commonAttributes.price}
                  onChange={handleCommonAttributeChange}
                  className="border rounded-md px-4 py-2 mb-2"
                />
                <p className="mb-2 font-sb text-xl">Material:</p>
                <input
                  type="text"
                  name="material"
                  value={commonAttributes.material}
                  onChange={handleCommonAttributeChange}
                  className="border rounded-md px-4 py-2 mb-2"
                />
                <p className="mb-2 font-sb text-xl">Tip:</p>
                <select
                  name="type"
                  value={commonAttributes.type}
                  onChange={handleCommonAttributeChange}
                  className="border rounded-md px-4 py-2 mb-2"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <p className="font-sb text-xl mb-2">Descriere:</p>
                <textarea
                  name="description"
                  value={commonAttributes.description}
                  onChange={handleCommonAttributeChange}
                  className="border rounded-md px-4 py-2 mb-4"
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateItems}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-yellow-500 hover:text-black"
              >
                Genereaza {inputValue} articole
              </button>
            </div>
            {bulkItems.map((attributes, index) => (
              <div key={index} className="w-full mt-12">
                <BulkItemUpload
                  photos={attributes.photos}
                  name={attributes.name}
                  price={attributes.price}
                  material={attributes.material}
                  description={attributes.description}
                  type={attributes.type}
                  sizes={attributes.type === 'incaltaminte' ? shoe_sizes : sizes}
                  onDataChange={(data) => {
                    setBulkItemData((prevData) => {
                      const updatedData = [...prevData];
                      updatedData[index] = data;
                      return updatedData;
                    });
                  }}
                />
                {index < bulkItems.length - 1 && (
                  <div>
                    {(index + 1) % 10 == 0 ? (<p className="text-red-500 font-bold text-2xl">{index + 1}</p>) : (<p className="text-green-500 font-bold text-2xl">{index + 1}</p>)}
                    <hr className="my-8 border-t border-gray-300" />
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleBulkItemUpload}
              className="bg-black text-white mt-12 px-6 py-2 rounded-md hover:bg-yellow-500 hover:text-black"
            >
              Adauga produse
            </button>
            {/*see how can you extract all this data;
             also, modify some fields (material)*/}
          </div>
        )}
      </div>


      <div className="mt-12 overflow-x-auto">
        <h1 className="text-2xl font-semibold mb-4">Setare Preț nou</h1>
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex flex-col space-y-4 items-start">
            <input
              type="number"
              placeholder="ID Articol"
              className="border rounded-md px-4 py-2 w-64"
              value={editingItemId}
              onChange={(e) => setEditingItemId(e.target.value)}
              onWheel={(e) => e.target.blur()}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.preventDefault();
                }
              }}
            />
            <input
              type="number"
              placeholder="Preț nou"
              className="border rounded-md px-4 py-2 w-64"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              onWheel={(e) => e.target.blur()}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.preventDefault();
                }
              }}
            />
            <button
              onClick={handleEditPrice}
              className="bg-[#FFD700] text-black hover:bg-black hover:text-[#FFD700]  font-bold py-2 px-4 rounded w-64"
            >
              Editează
            </button>
          </div>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Articole</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preț</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preț Nou</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantitate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(tableItems) && tableItems.length > 0 ? (
                tableItems.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      item.quantity > 10
                        ? 'bg-green-100'
                        : item.quantity > 0
                          ? 'bg-yellow-100'
                          : 'bg-red-100'
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.new_price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity === 0 && (
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Șterge produsul
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;