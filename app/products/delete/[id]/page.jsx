'use client' // Add this to indicate that this is a Client Component

import Link from "next/link";
import { useRouter } from "next/navigation"; // Make sure to import useRouter
import { use, useState } from "react";
import axios from "axios"; // Don't forget to import axios

export default function DeleteProduct({ params }) {
    const router = useRouter();  // Now useRouter will work
    const [success, setSuccess] = useState('');
    const { id } = use(params); // Directly access the `id` from params

    async function handleDelete() {
        try {
            // Call the DELETE API endpoint with the product ID
            await axios.delete(`/api/products?id=${id}`);
            setSuccess('Product deleted successfully!');
            setTimeout(() => {
                // Use router.push to redirect after deletion
                router.push('/products');
            }, 1500); // Wait 1.5 seconds before redirecting
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete product.");
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-blue-700 text-2xl">
                Do you want to delete this product?
            </h1>

            {success && <div className="text-green-600 mb-4">{success}</div>} {/* Show success message */}

            <div className="flex gap-4">
                <button
                    onClick={handleDelete}
                    className="bg-red-700 text-white px-3 py-1 rounded-md"
                >
                    Yes
                </button>

                <Link href="/products">
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-md cursor-pointer">
                        No
                    </span>
                </Link>
            </div>
        </div>
    );
}
