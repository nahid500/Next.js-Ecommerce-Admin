'use client'
import axios from "axios"
import { useState } from "react"
import Spinner from "./Spinner"
import { ReactSortable } from "react-sortablejs"

export default function ProductForm(
    {   _id,
        title: existingTitle,
        description: existingDescription,
        price: existingPrice,
        images: existingImages}) {

    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState( existingDescription || '')
    const [price, setPrice] = useState( existingPrice || '')
    const [images, setImages] = useState(existingImages || []);
    const [loading, setLoading] = useState(false) 
    const [isUploading, setisUpLoading] = useState(false) 
    const [error, setError] = useState('')         
    const [success, setSuccess] = useState('')   


    async function saveProduct(ev) {
        ev.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
    
        const parsedPrice = parseFloat(price);
    
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            setError("Price must be a positive number.");
            setLoading(false);
            return;
        }
    
        const data = { title, description, price: parsedPrice, images }; 
    
        try {
            if (_id) {
                await axios.put('/api/products?id='+_id, { ...data, _id });
                setSuccess('Product updated successfully!');
            } else {
                await axios.post('/api/products', data);
                setSuccess('Product created successfully!');
                setTitle('');
                setDescription('');
                setPrice('');
            }
        } catch (err) {
            // console.error("API Error:", err?.response?.data || err);
            setError(err?.response?.data?.error || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setisUpLoading(true)
          const data = new FormData();
          for (const file of files) {
            data.append('file', file);
          }
      
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: data,
          });
      
          const result = await res.json();
        //   console.log(result);
      
          if (result.url) {
            setImages(prev => [...prev, result.url]);
          }
          setisUpLoading(false)

        }
      }
      
      function updateImagesOrder(){
        console.log(arguments);
        
      }

    return (
        <form onSubmit={saveProduct} className="flex flex-col space-y-4 m-3">


            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-500 mb-2">{success}</div>}

            <label className="text-blue-900 text-xl">Product Name</label>
            <input 
                type="text" 
                className="ml-2 border-2 border-blue-500 p-2" 
                placeholder="Enter Product Name" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} 
                required
            />

            <label className="text-blue-900 text-xl">
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
                
                <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap">

                {!!images?.length && images.map(link => (
                    <div key={link} className="h-24">
                        <img src={link} alt="" className="rounded-lg"/>
                    </div>
                ))}
                </ReactSortable>

                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner/>
                    </div>
                )}
                <label className="w-24 h-24 border text-center flex g-1 text-gray-500 rounded-md bg-gray-200 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>

                <div>
                    Upload
                </div>

                <input type="file" onChange={uploadImages} className="hidden"></input>
                </label>

                {!images?.length && (
                    <div> No photos available for this product </div>
                )}
            </div>

            <label className="text-blue-900 text-xl">Description</label>
            <textarea 
                className="ml-2 border-2 border-blue-500 p-2" 
                placeholder="Enter Description" 
                value={description} 
                onChange={ev => setDescription(ev.target.value)} 
                required
            ></textarea>

            <label className="text-blue-900 text-xl">Price</label>
            <input 
                className="ml-2 border-2 border-blue-500 p-2" 
                type="number" 
                value={price} 
                onChange={ev => setPrice(ev.target.value)} 
                placeholder="Enter Price" 
                required 
            />

            <button 
                type="submit" 
                className={`bg-blue-900 mt-5 text-white p-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                disabled={loading} // Disable button while loading
            >
                {loading ? 'Saving...' : 'Save Product'}
            </button>

        </form>
    )
}