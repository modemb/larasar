<html>
<head>
  <meta charset='utf-8'>
  <title>{{ config('app.name') }}</title>
  <script>
    window.opener.postMessage({
        token: {
          access_token: '{{ $token }}',
          expires_in: '{{ $expires_in }}'
        }
    },  '{{$transfer}}')
    window.close()
  </script>
</head>
<body>
</body>
</html>
