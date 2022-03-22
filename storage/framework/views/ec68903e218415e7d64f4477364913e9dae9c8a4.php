<html>
<head>
  <meta charset='utf-8'>
  <title><?php echo e(config('app.name')); ?></title>
  <script>
    window.opener.postMessage(<?php echo json_encode(['token' => $token], 15, 512) ?>, "<?php echo e(url('/')); ?>")
    window.close()
  </script>
</head>
<body>
</body>
</html>
<?php /**PATH E:\Apps\xampp\htdocs\www\suguffie\resources\views/oauth/callback.blade.php ENDPATH**/ ?>