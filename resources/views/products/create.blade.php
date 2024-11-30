<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Agregar Nuevo Producto') }}
        </h2>
    </x-slot>

    <div class="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" name="name" id="name" class="mt-1 block w-full" required>
            </div>
            <div class="mb-4">
                <label for="category" class="block text-sm font-medium text-gray-700">Categoría</label>
                <input type="text" name="category" id="category" class="mt-1 block w-full" required>
            </div>
            <div class="mb-4">
                <label for="brand" class="block text-sm font-medium text-gray-700">Marca</label>
                <input type="text" name="brand" id="brand" class="mt-1 block w-full" required>
            </div>
            <div class="mb-4">
                <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" id="description" class="mt-1 block w-full" required></textarea>
            </div>
            <div class="mb-4">
                <label for="price" class="block text-sm font-medium text-gray-700">Precio</label>
                <input type="number" name="price" id="price" class="mt-1 block w-full" step="0.01" required>
            </div>
            <div class="mb-4">
                <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" id="stock" class="mt-1 block w-full" required>
            </div>
            <div class="mb-4">
                <label for="images" class="block text-sm font-medium text-gray-700">Imágenes</label>
                <input type="file" name="images[]" id="images" class="mt-1 block w-full" multiple>
            </div>
            <div class="mb-4">
                <label for="color" class="block text-sm font-medium text-gray-700">Color</label>
                <input type="text" name="color" id="color" class="mt-1 block w-full" required>
            </div>
            <div class="mb-4">
                <label for="rating" class="block text-sm font-medium text-gray-700">Calificación</label>
                <input type="number" name="rating" id="rating" class="mt-1 block w-full" step="0.1" required>
            </div>
            <div class="mb-4">
                <label for="image" class="block text-sm font-medium text-gray-700">Imagen Principal</label>
                <input type="file" name="image" id="image" class="mt-1 block w-full">
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Agregar Producto</button>
        </form>
    </div>
</x-app-layout>

