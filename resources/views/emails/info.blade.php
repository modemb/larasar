@component('mail::message')
# {{$content['title']}}

{{$content['body']}}

@component('mail::button', ['url' => $content['url']])
LogIn
@endcomponent

{{-- @component('mail::button', ['url' => $content['url'], 'color' => 'green'])
LogIn
@endcomponent  --}}

Thanks,<br>
{{ config('app.name') }}
@endcomponent


@component('mail::panel')
This is the panel content.
@endcomponent
