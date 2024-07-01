@component('mail::message')
# {{__($content['title'])}}

{{__($content['body'])}}

@if (isset($content['url']))
  @component('mail::button', ['url' => $content['url']])
    @lang($content['button'])
  @endcomponent
@endif

@if (isset($content['code']))
  @component('mail::panel')
  {{ $content['code'] }}
  @endcomponent
@endif

{{-- @component('mail::button', ['url' => $content['url'], 'color' => 'green'])
LogIn
@endcomponent  --}}

@lang('Thanks'),<br>
{{ config('app.name') }}
@endcomponent


{{-- @component('mail::panel')
This is the panel content.
@endcomponent --}}
