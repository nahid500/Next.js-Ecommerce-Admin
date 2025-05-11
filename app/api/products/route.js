import { Product } from "@/app/models/Product";
import { mongooseConnect } from "@/app/lib/mongoose";
import { NextResponse } from "next/server";

// GET /api/products OR /api/products?id=123
export async function GET(req) {
    await mongooseConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    try {
        if (id) {
            const product = await Product.findById(id);
            if (!product) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }
            return NextResponse.json(product);
        } else {
            const products = await Product.find();
            return NextResponse.json(products);
        }
    } catch (error) {
        console.error("Error fetching product(s):", error);
        return NextResponse.json({ error: "Failed to fetch product(s)" }, { status: 500 });
    }
}

// POST /api/products
export async function POST(req) {
    await mongooseConnect();

    try {
        const { title, description, price, images} = await req.json();

        if (typeof price !== 'number' || price <= 0) {
            return NextResponse.json({ error: "Price must be a positive number." }, { status: 400 });
        }

        const product = await Product.create({ title, description, price, images });
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error.stack);
        return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
    }
}

// PUT /api/products?id=123
export async function PUT(req) {
    await mongooseConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Product ID is required in query (?id=...)" }, { status: 400 });
    }

    try {
        const { title, description, price, images } = await req.json();

        const updated = await Product.findByIdAndUpdate(
            id,
            { title, description, price, images },
            { new: true }
        );

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE /api/products?id=123
export async function DELETE(req) {
    await mongooseConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Product ID is required in query (?id=...)" }, { status: 400 });
    }

    try {
        await Product.findByIdAndDelete(id);
        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
