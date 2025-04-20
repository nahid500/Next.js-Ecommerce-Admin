'use client'
import ProductForm from "@/app/components/ProductForm";
import axios from "axios";
import { use, useEffect, useState } from "react";

export default function EditProductPage ({params}) {


    const [productInfo, setProductInfo] = useState(null)
    const {id} = use(params);

    useEffect(() => {
        if(!id)
        {return

        }

        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
            
        })
    }, [id])    

    return(
        <>
            <h1 className="text-blue-900 text-2xl mb-3">Edit Product</h1>
            {productInfo && (

                <ProductForm {...productInfo}/>
            )}
        </>
    )
}