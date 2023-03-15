<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag; ?>
<?php foreach($attributes->onlyProps([
    'url',
    'color' => 'primary',
    'align' => 'center',
]) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
} ?>
<?php $attributes = $attributes->exceptProps([
    'url',
    'color' => 'primary',
    'align' => 'center',
]); ?>
<?php foreach (array_filter(([
    'url',
    'color' => 'primary',
    'align' => 'center',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
} ?>
<?php $__defined_vars = get_defined_vars(); ?>
<?php foreach ($attributes as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
} ?>
<?php unset($__defined_vars); ?>
<table class="action" align="<?php echo e($align); ?>" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="<?php echo e($align); ?>">
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="<?php echo e($align); ?>">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td>
<a href="<?php echo e($url); ?>" class="button button-<?php echo e($color); ?>" target="_blank" rel="noopener"><?php echo e($slot); ?></a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
<?php /**PATH /Applications/MAMP/htdocs/www/suguffie/vendor/laravel/framework/src/Illuminate/Mail/resources/views/html/button.blade.php ENDPATH**/ ?>