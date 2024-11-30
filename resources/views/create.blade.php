@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Agregar Nuevo Producto</h2>
    <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="form-group">
            <label for="name">Nombre del Producto</label>
            <input type="text" class="form-control" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="category">Categoría</label>
            <input type="text" class="form-control" id="category" name="category" required>
        </div>
        <div class="form-group">
            <label for="brand">Marca</label>
            <input type="text" class="form-control" id="brand" name="brand" required>
        </div>
        <div class="form-group">
            <label for="description">Descripción</label>
            <textarea class="form-control" id="description" name="description" required></textarea>
        </div>
        <div class="form-group">
            <label for="price">Precio</label>
            <input type="number" class="form-control" id="price" name="price" step="0.01" required>
        </div>
        <div class="form-group">
            <label for="stock">Stock</label>
            <input type="number" class="form-control" id="stock" name="stock" required>
        </div>
        <div class="form-group">
            <label for="images">Imágenes</label>
            <input type="file" class="form-control" id="images" name="images[]" multiple>
        </div>
        <div class="form-group">
            <label for="color">Color</label>
            <input type="text" class="form-control" id="color" name="color" required>
        </div>
        <div class="form-group">
            <label for="rating">Calificación</label>
            <input type="number" class="form-control" id="rating" name="rating" step="0.1" required>
        </div>
        <div class="form-group">
            <label for="image">Imagen Principal</label>
            <input type="file" class="form-control" id="image" name="image">
        </div>
        <button type="submit" class="btn btn-primary">Agregar Producto</button>
    </form>
</div>
@endsection

