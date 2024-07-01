<?php
  // $config = [
  //     'appName' => config('app.name'),
  //     'locale' => str_replace('_', '-', app()->getLocale()),
  //     'locales' => config('app.locales'),
  //     'data' => [
  //       'user' => Auth::user(),
  //     ],
  // ]; // https://laravel.com/docs/10.x/helpers#paths-method-list
  // require base_path('dist/pwa/index.html')
  // require base_path('dist/spa/index.html')
  // require base_path('dist/capacitor/index.html')
  // require base_path('src-capacitor/www/index.html')
  // require public_path('pwa/index.html')
  // require public_path('capacitor/index.html')
  require public_path(config('mode').'/index.html')
?>


<script>
  // alert(window.config.githubAuth)
  // alert(window.config.githubAuth)
</script>
<?php /**PATH /Applications/MAMP/htdocs/www/larasar/resources/views/index.blade.php ENDPATH**/ ?>