<x-app-layout>
    <div class="container">
        <h1>Publicar un Tweet</h1>

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        @if (session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif

        <form action="{{ route('twitter.tweet') }}" method="POST">
            @csrf
            <div class="form-group">
                <textarea name="message" rows="3" class="form-control" placeholder="Escribe tu tweet"></textarea>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Publicar</button>
        </form>
    </div>
</x-app-layout>

