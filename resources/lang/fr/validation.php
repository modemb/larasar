<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => ':attribute doit être accepté.',
    'active_url' => ':attribute n\'est pas une URL valide.',
    'after' => ':attribute doit être une date après :date.',
    'after_or_equal' => ':attribute doit être une date après ou égale à :date.',
    'alpha' => ':attribute ne peut contenir que des lettres.',
    'alpha_dash' => ':attribute ne peut contenir que des lettres, des chiffres, des tirets et des traits de soulignement.',
    'alpha_num' => ':attribute ne peut contenir que des lettres et des chiffres.',
    'array' => ':attribute doit être un tableau.',
    'before' => ':attribute doit être une date avant :date.',
    'before_or_equal' => ':attribute doit être une date antérieure ou égale à :date.',
    'between' => [
        'numeric' => ':attribute doit être compris entre :min et :max.',
        'file' => ':attribute doit être compris entre :min et :max kilo-octets.',
        'string' => ':attribute doit être compris entre :min et :max caractères',
        'array' => ':attribute doit avoir entre :min et :max items.',
    ],
    'boolean' => ':attribute Le champ doit être vrai ou faux.',
    'confirmed' => ':attribute la confirmation ne correspond pas.',
    'date' => ':attribute n\'est pas une date valide.',
    'date_equals' => ':attribute doit être une date égale à :date.',
    'date_format' => ':attribute ne correspond pas au format :format.',
    'different' => ':attribute et :other doit être différent.',
    'digits' => ':attribute doit être :digits chiffres.',
    'digits_between' => ':attribute doit être compris entre :min et :max digits.',
    'dimensions' => ':attribute a des dimensions d\'image non valides.',
    'distinct' => ':attribute Le champ a une valeur en double.',
    'email' => ':attribute Doit être une adresse e-mail valide.',
    'ends_with' => ':attribute doit se terminer par l’un des éléments suivants: :values',
    'exists' => 'La sélection :attribute est invalide.',
    'file' => ':attribute doit être un fichier.',
    'filled' => ':attribute le champ doit avoir une valeur.',
    'gt' => [
        'numeric' => ':attribute doit être supérieur à :value.',
        'file' => ':attribute doit être supérieur à :value kilo-octets.',
        'string' => ':attribute doit être supérieur à :value caractères.',
        'array' => ':attribute doit avoir plus de :value items.',
    ],
    'gte' => [
        'numeric' => ':attribute doit être supérieur à ou égal :value.',
        'file' => ':attribute doit être supérieur à ou égal :value kilo-octets.',
        'string' => ':attribute doit être supérieur à ou égal :value caractères.',
        'array' => ':attribute doit avoir :value items ou plus.',
    ],
    'image' => ':attribute doit être une image.',
    'in' => 'La sélection :attribute est invalide.',
    'in_array' => ':attribute field n\'existe pas dans :other.',
    'integer' => ':attribute Doit être un entier.',
    'ip' => ':attribute doit être une adresse IP valide.',
    'ipv4' => ':attribute doit être une valide IPv4 addresse.',
    'ipv6' => ':attribute doit être une valide IPv6 addresse.',
    'json' => ':attribute doit être un valide JSON string.',
    'lt' => [
        'numeric' => ':attribute doit être inférieur à :value.',
        'file' => ':attribute doit être inférieur à :value kilo-octets.',
        'string' => ':attribute doit être inférieur à :value caractères.',
        'array' => ':attribute doit avoir moins de :value items.',
    ],
    'lte' => [
        'numeric' => ':attribute doit être inférieur à ou égal :value.',
        'file' => ':attribute doit être inférieur à ou égal :value kilo-octets.',
        'string' => ':attribute doit être inférieur à ou égal :value caractères.',
        'array' => ':attribute ne doit pas avoir plus de :value items.',
    ],
    'max' => [
        'numeric' => ':attribute ne peut pas être supérieur à :max.',
        'file' => ':attribute ne peut pas être supérieur à :max kilo-octets.',
        'string' => ':attribute ne peut pas être supérieur à :max caractères.',
        'array' => ':attribute ne peut pas avoir plus de :max items.',
    ],
    'mimes' => ':attribute doit être un fichier de type: :values.',
    'mimetypes' => ':attribute doit être un fichier de type: :values.',
    'min' => [
        'numeric' => ':attribute doit être au moins :min.',
        'file' => ':attribute doit être au moins :min kilo-octets.',
        'string' => ':attribute doit être au moins :min caractères.',
        'array' => ':attribute doit avoir au moins :min items.',
    ],
    'not_in' => 'La sélection :attribute est invalide.',
    'not_regex' => ':attribute format est invalide.',
    'numeric' => ':attribute doit être un nombre.',
    'password' => 'Le mot de passe est incorrect.',
    'present' => ':attribute le champ doit être présent.',
    'regex' => ':attribute format est invalide.',
    'required' => ':attribute champ requis.',
    'required_if' => ':attribute champ requis quand :other est :value.',
    'required_unless' => ':attribute champ requis sauf si :other est en :values.',
    'required_with' => ':attribute champ requis quand :values est présent.',
    'required_with_all' => ':attribute champ requis quand :values sont présents.',
    'required_without' => ':attribute champ requis quand :values n\'est pas présent.',
    'required_without_all' => ':attribute champ requis quand aucun des :values sont présents.',
    'same' => ':attribute et :other doivent correspondre.',
    'size' => [
        'numeric' => ':attribute doit être :size.',
        'file' => ':attribute doit être :size kilo-octets.',
        'string' => ':attribute doit être :size caractères.',
        'array' => ':attribute doit contenir :size items.',
    ],
    'starts_with' => ':attribute doit commencer par l’un des éléments suivants: :values',
    'string' => ':attribute doit être un string.',
    'timezone' => ':attribute doit être valide zone.',
    'unique' => ':attribute a déjà été pris.',
    'uploaded' => ':attribute Échec du téléchargement.',
    'url' => ':attribute format est invalide.',
    'uuid' => ':attribute doit être valide UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail addresse" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
