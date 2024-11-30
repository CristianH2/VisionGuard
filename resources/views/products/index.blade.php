<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Catálogo de Productos') }}
        </h2>
        <a href="{{ route('products.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded">Agregar Nuevo Producto</a>
    </x-slot>

    <div class="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($products as $product)
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <img src="{{ asset('storage/' . $product->image) }}" class="w-full h-48 object-cover" alt="{{ $product->name }}">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold">{{ $product->name }}</h3>
                        <p class="text-gray-600">{{ $product->description }}</p>
                        <p class="text-gray-800 font-bold">Precio: ${{ $product->price }}</p>
                        <a href="{{ route('products.show', $product->id) }}" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Ver Detalles</a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</x-app-layout>

