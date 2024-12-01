<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller {
	public function index() {
    	$products = Product::all();
    	return view('products.index', compact('products'));
	}

	public function create() {
    	return view('products.create');
	}

	public function store(Request $request) {
    	$request->validate([
        	'name' => 'required',
        	'category' => 'required',
        	'brand' => 'required',
        	'description' => 'required',
        	'price' => 'required|numeric',
        	'stock' => 'required|integer',
        	'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        	'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        	'color' => 'required',
        	'rating' => 'required|numeric|min:0|max:5',
    	]);

    	$product = new Product($request->all());

    	if ($request->hasFile('image')) {
        	$image = $request->file('image');
        	$imagePath = $image->store('images', 'public');
        	$product->image = $imagePath;
    	}

    	if ($request->hasFile('images')) {
        	$images = [];
        	foreach ($request->file('images') as $image) {
            	$imagePath = $image->store('images', 'public');
            	$images[] = $imagePath;
        	}
        	$product->images = json_encode($images);
    	}

    	$product->save();

    	return redirect()->route('products.index')->with('success', 'Producto agregado exitosamente');
	}
}

