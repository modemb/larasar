@component('mail::message')
# {{__($content['title'])}}

{{__($content['body'])}}

@component('mail::button', ['url' => $content['url']])
@lang('LogIn')
@endcomponent

{{-- @component('mail::button', ['url' => $content['url'], 'color' => 'green'])
LogIn
@endcomponent  --}}

Thanks,<br>
{{ config('app.name') }}
@endcomponent


{{-- @component('mail::panel')
This is the panel content.
@endcomponent --}}
