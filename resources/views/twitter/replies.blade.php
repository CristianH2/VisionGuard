<x-app-layout>
    <div class="container">
        <h1>Tweets Publicados</h1>
        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif
        @if(session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif

        @if(!empty($tweets) && count($tweets) > 0)
            @foreach($tweets as $tweet)
                <div class="card mb-3">
                    <div class="card-body">
                        <h5>{{ $tweet->user->name ?? 'Usuario Desconocido' }}</h5>
                        <p>{{ $tweet->text }}</p>
                        <small>Publicado el {{ $tweet->created_at ?? 'Fecha desconocida' }}</small>
                    </div>
                </div>
            @endforeach
        @else
            <p>No hay tweets disponibles para mostrar.</p>
        @endif
    </div>
</x-app-layout>

