<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'url',
    'color' => 'primary',
    'align' => 'center',
]));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter(([
    'url',
    'color' => 'primary',
    'align' => 'center',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars); ?>
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