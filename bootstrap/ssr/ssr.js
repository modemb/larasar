import { createSSRApp, h as h$1 } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
async function resolvePageComponent(path, pages) {
  for (const p2 of Array.isArray(path) ? path : [path]) {
    const page = pages[p2];
    if (typeof page === 'undefined') {
      continue;
    }
    return typeof page === 'function' ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
function t() {
  return t = Object.assign ? Object.assign.bind() : function(t4) {
    for (var e2 = 1; e2 < arguments.length; e2++) {
      var r2 = arguments[e2];
      for (var n2 in r2)
        Object.prototype.hasOwnProperty.call(r2, n2) && (t4[n2] = r2[n2]);
    }
    return t4;
  }, t.apply(this, arguments);
}
var e = String.prototype.replace, r = /%20/g, n = 'RFC3986', o = { default: n, formatters: { RFC1738: function(t4) {
  return e.call(t4, r, '+');
}, RFC3986: function(t4) {
  return String(t4);
} }, RFC1738: 'RFC1738', RFC3986: n }, i = Object.prototype.hasOwnProperty, u = Array.isArray, a = function() {
  for (var t4 = [], e2 = 0; e2 < 256; ++e2)
    t4.push('%' + ((e2 < 16 ? '0' : '') + e2.toString(16)).toUpperCase());
  return t4;
}(), s = function(t4, e2) {
  for (var r2 = e2 && e2.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, n2 = 0; n2 < t4.length; ++n2)
    void 0 !== t4[n2] && (r2[n2] = t4[n2]);
  return r2;
}, f = { arrayToObject: s, assign: function(t4, e2) {
  return Object.keys(e2).reduce(function(t5, r2) {
    return t5[r2] = e2[r2], t5;
  }, t4);
}, combine: function(t4, e2) {
  return [].concat(t4, e2);
}, compact: function(t4) {
  for (var e2 = [{ obj: { o: t4 }, prop: 'o' }], r2 = [], n2 = 0; n2 < e2.length; ++n2)
    for (var o2 = e2[n2], i2 = o2.obj[o2.prop], a2 = Object.keys(i2), s2 = 0; s2 < a2.length; ++s2) {
      var f2 = a2[s2], c2 = i2[f2];
      'object' == typeof c2 && null !== c2 && -1 === r2.indexOf(c2) && (e2.push({ obj: i2, prop: f2 }), r2.push(c2));
    }
  return function(t5) {
    for (; t5.length > 1; ) {
      var e3 = t5.pop(), r3 = e3.obj[e3.prop];
      if (u(r3)) {
        for (var n3 = [], o3 = 0; o3 < r3.length; ++o3)
          void 0 !== r3[o3] && n3.push(r3[o3]);
        e3.obj[e3.prop] = n3;
      }
    }
  }(e2), t4;
}, decode: function(t4, e2, r2) {
  var n2 = t4.replace(/\+/g, ' ');
  if ('iso-8859-1' === r2)
    return n2.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n2);
  } catch (t5) {
    return n2;
  }
}, encode: function(t4, e2, r2, n2, i2) {
  if (0 === t4.length)
    return t4;
  var u2 = t4;
  if ('symbol' == typeof t4 ? u2 = Symbol.prototype.toString.call(t4) : 'string' != typeof t4 && (u2 = String(t4)), 'iso-8859-1' === r2)
    return escape(u2).replace(/%u[0-9a-f]{4}/gi, function(t5) {
      return '%26%23' + parseInt(t5.slice(2), 16) + '%3B';
    });
  for (var s2 = '', f2 = 0; f2 < u2.length; ++f2) {
    var c2 = u2.charCodeAt(f2);
    45 === c2 || 46 === c2 || 95 === c2 || 126 === c2 || c2 >= 48 && c2 <= 57 || c2 >= 65 && c2 <= 90 || c2 >= 97 && c2 <= 122 || i2 === o.RFC1738 && (40 === c2 || 41 === c2) ? s2 += u2.charAt(f2) : c2 < 128 ? s2 += a[c2] : c2 < 2048 ? s2 += a[192 | c2 >> 6] + a[128 | 63 & c2] : c2 < 55296 || c2 >= 57344 ? s2 += a[224 | c2 >> 12] + a[128 | c2 >> 6 & 63] + a[128 | 63 & c2] : (c2 = 65536 + ((1023 & c2) << 10 | 1023 & u2.charCodeAt(f2 += 1)), s2 += a[240 | c2 >> 18] + a[128 | c2 >> 12 & 63] + a[128 | c2 >> 6 & 63] + a[128 | 63 & c2]);
  }
  return s2;
}, isBuffer: function(t4) {
  return !(!t4 || 'object' != typeof t4 || !(t4.constructor && t4.constructor.isBuffer && t4.constructor.isBuffer(t4)));
}, isRegExp: function(t4) {
  return '[object RegExp]' === Object.prototype.toString.call(t4);
}, maybeMap: function(t4, e2) {
  if (u(t4)) {
    for (var r2 = [], n2 = 0; n2 < t4.length; n2 += 1)
      r2.push(e2(t4[n2]));
    return r2;
  }
  return e2(t4);
}, merge: function t2(e2, r2, n2) {
  if (!r2)
    return e2;
  if ('object' != typeof r2) {
    if (u(e2))
      e2.push(r2);
    else {
      if (!e2 || 'object' != typeof e2)
        return [e2, r2];
      (n2 && (n2.plainObjects || n2.allowPrototypes) || !i.call(Object.prototype, r2)) && (e2[r2] = true);
    }
    return e2;
  }
  if (!e2 || 'object' != typeof e2)
    return [e2].concat(r2);
  var o2 = e2;
  return u(e2) && !u(r2) && (o2 = s(e2, n2)), u(e2) && u(r2) ? (r2.forEach(function(r3, o3) {
    if (i.call(e2, o3)) {
      var u2 = e2[o3];
      u2 && 'object' == typeof u2 && r3 && 'object' == typeof r3 ? e2[o3] = t2(u2, r3, n2) : e2.push(r3);
    } else
      e2[o3] = r3;
  }), e2) : Object.keys(r2).reduce(function(e3, o3) {
    var u2 = r2[o3];
    return e3[o3] = i.call(e3, o3) ? t2(e3[o3], u2, n2) : u2, e3;
  }, o2);
} }, c = Object.prototype.hasOwnProperty, l = { brackets: function(t4) {
  return t4 + '[]';
}, comma: 'comma', indices: function(t4, e2) {
  return t4 + '[' + e2 + ']';
}, repeat: function(t4) {
  return t4;
} }, p = Array.isArray, h = String.prototype.split, y = Array.prototype.push, d = function(t4, e2) {
  y.apply(t4, p(e2) ? e2 : [e2]);
}, b = Date.prototype.toISOString, g = o.default, v = { addQueryPrefix: false, allowDots: false, charset: 'utf-8', charsetSentinel: false, delimiter: '&', encode: true, encoder: f.encode, encodeValuesOnly: false, format: g, formatter: o.formatters[g], indices: false, serializeDate: function(t4) {
  return b.call(t4);
}, skipNulls: false, strictNullHandling: false }, m = function t3(e2, r2, n2, o2, i2, u2, a2, s2, c2, l2, y2, b2, g2, m2) {
  var j2, w2 = e2;
  if ('function' == typeof a2 ? w2 = a2(r2, w2) : w2 instanceof Date ? w2 = l2(w2) : 'comma' === n2 && p(w2) && (w2 = f.maybeMap(w2, function(t4) {
    return t4 instanceof Date ? l2(t4) : t4;
  })), null === w2) {
    if (o2)
      return u2 && !g2 ? u2(r2, v.encoder, m2, 'key', y2) : r2;
    w2 = '';
  }
  if ('string' == typeof (j2 = w2) || 'number' == typeof j2 || 'boolean' == typeof j2 || 'symbol' == typeof j2 || 'bigint' == typeof j2 || f.isBuffer(w2)) {
    if (u2) {
      var $2 = g2 ? r2 : u2(r2, v.encoder, m2, 'key', y2);
      if ('comma' === n2 && g2) {
        for (var O2 = h.call(String(w2), ','), E2 = '', S2 = 0; S2 < O2.length; ++S2)
          E2 += (0 === S2 ? '' : ',') + b2(u2(O2[S2], v.encoder, m2, 'value', y2));
        return [b2($2) + '=' + E2];
      }
      return [b2($2) + '=' + b2(u2(w2, v.encoder, m2, 'value', y2))];
    }
    return [b2(r2) + '=' + b2(String(w2))];
  }
  var R2, x2 = [];
  if (void 0 === w2)
    return x2;
  if ('comma' === n2 && p(w2))
    R2 = [{ value: w2.length > 0 ? w2.join(',') || null : void 0 }];
  else if (p(a2))
    R2 = a2;
  else {
    var N2 = Object.keys(w2);
    R2 = s2 ? N2.sort(s2) : N2;
  }
  for (var T2 = 0; T2 < R2.length; ++T2) {
    var k2 = R2[T2], C = 'object' == typeof k2 && void 0 !== k2.value ? k2.value : w2[k2];
    if (!i2 || null !== C) {
      var _ = p(w2) ? 'function' == typeof n2 ? n2(r2, k2) : r2 : r2 + (c2 ? '.' + k2 : '[' + k2 + ']');
      d(x2, t3(C, _, n2, o2, i2, u2, a2, s2, c2, l2, y2, b2, g2, m2));
    }
  }
  return x2;
}, j = Object.prototype.hasOwnProperty, w = Array.isArray, $ = { allowDots: false, allowPrototypes: false, arrayLimit: 20, charset: 'utf-8', charsetSentinel: false, comma: false, decoder: f.decode, delimiter: '&', depth: 5, ignoreQueryPrefix: false, interpretNumericEntities: false, parameterLimit: 1e3, parseArrays: true, plainObjects: false, strictNullHandling: false }, O = function(t4) {
  return t4.replace(/&#(\d+);/g, function(t5, e2) {
    return String.fromCharCode(parseInt(e2, 10));
  });
}, E = function(t4, e2) {
  return t4 && 'string' == typeof t4 && e2.comma && t4.indexOf(',') > -1 ? t4.split(',') : t4;
}, S = function(t4, e2, r2, n2) {
  if (t4) {
    var o2 = r2.allowDots ? t4.replace(/\.([^.[]+)/g, '[$1]') : t4, i2 = /(\[[^[\]]*])/g, u2 = r2.depth > 0 && /(\[[^[\]]*])/.exec(o2), a2 = u2 ? o2.slice(0, u2.index) : o2, s2 = [];
    if (a2) {
      if (!r2.plainObjects && j.call(Object.prototype, a2) && !r2.allowPrototypes)
        return;
      s2.push(a2);
    }
    for (var f2 = 0; r2.depth > 0 && null !== (u2 = i2.exec(o2)) && f2 < r2.depth; ) {
      if (f2 += 1, !r2.plainObjects && j.call(Object.prototype, u2[1].slice(1, -1)) && !r2.allowPrototypes)
        return;
      s2.push(u2[1]);
    }
    return u2 && s2.push('[' + o2.slice(u2.index) + ']'), function(t5, e3, r3, n3) {
      for (var o3 = n3 ? e3 : E(e3, r3), i3 = t5.length - 1; i3 >= 0; --i3) {
        var u3, a3 = t5[i3];
        if ('[]' === a3 && r3.parseArrays)
          u3 = [].concat(o3);
        else {
          u3 = r3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
          var s3 = '[' === a3.charAt(0) && ']' === a3.charAt(a3.length - 1) ? a3.slice(1, -1) : a3, f3 = parseInt(s3, 10);
          r3.parseArrays || '' !== s3 ? !isNaN(f3) && a3 !== s3 && String(f3) === s3 && f3 >= 0 && r3.parseArrays && f3 <= r3.arrayLimit ? (u3 = [])[f3] = o3 : '__proto__' !== s3 && (u3[s3] = o3) : u3 = { 0: o3 };
        }
        o3 = u3;
      }
      return o3;
    }(s2, e2, r2, n2);
  }
}, R = function(t4, e2) {
  var r2 = function(t5) {
    if (!t5)
      return $;
    if (null != t5.decoder && 'function' != typeof t5.decoder)
      throw new TypeError('Decoder has to be a function.');
    if (void 0 !== t5.charset && 'utf-8' !== t5.charset && 'iso-8859-1' !== t5.charset)
      throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    return { allowDots: void 0 === t5.allowDots ? $.allowDots : !!t5.allowDots, allowPrototypes: 'boolean' == typeof t5.allowPrototypes ? t5.allowPrototypes : $.allowPrototypes, arrayLimit: 'number' == typeof t5.arrayLimit ? t5.arrayLimit : $.arrayLimit, charset: void 0 === t5.charset ? $.charset : t5.charset, charsetSentinel: 'boolean' == typeof t5.charsetSentinel ? t5.charsetSentinel : $.charsetSentinel, comma: 'boolean' == typeof t5.comma ? t5.comma : $.comma, decoder: 'function' == typeof t5.decoder ? t5.decoder : $.decoder, delimiter: 'string' == typeof t5.delimiter || f.isRegExp(t5.delimiter) ? t5.delimiter : $.delimiter, depth: 'number' == typeof t5.depth || false === t5.depth ? +t5.depth : $.depth, ignoreQueryPrefix: true === t5.ignoreQueryPrefix, interpretNumericEntities: 'boolean' == typeof t5.interpretNumericEntities ? t5.interpretNumericEntities : $.interpretNumericEntities, parameterLimit: 'number' == typeof t5.parameterLimit ? t5.parameterLimit : $.parameterLimit, parseArrays: false !== t5.parseArrays, plainObjects: 'boolean' == typeof t5.plainObjects ? t5.plainObjects : $.plainObjects, strictNullHandling: 'boolean' == typeof t5.strictNullHandling ? t5.strictNullHandling : $.strictNullHandling };
  }(e2);
  if ('' === t4 || null == t4)
    return r2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var n2 = 'string' == typeof t4 ? function(t5, e3) {
    var r3, n3 = {}, o3 = (e3.ignoreQueryPrefix ? t5.replace(/^\?/, '') : t5).split(e3.delimiter, Infinity === e3.parameterLimit ? void 0 : e3.parameterLimit), i3 = -1, u3 = e3.charset;
    if (e3.charsetSentinel)
      for (r3 = 0; r3 < o3.length; ++r3)
        0 === o3[r3].indexOf('utf8=') && ('utf8=%E2%9C%93' === o3[r3] ? u3 = 'utf-8' : 'utf8=%26%2310003%3B' === o3[r3] && (u3 = 'iso-8859-1'), i3 = r3, r3 = o3.length);
    for (r3 = 0; r3 < o3.length; ++r3)
      if (r3 !== i3) {
        var a3, s3, c2 = o3[r3], l2 = c2.indexOf(']='), p2 = -1 === l2 ? c2.indexOf('=') : l2 + 1;
        -1 === p2 ? (a3 = e3.decoder(c2, $.decoder, u3, 'key'), s3 = e3.strictNullHandling ? null : '') : (a3 = e3.decoder(c2.slice(0, p2), $.decoder, u3, 'key'), s3 = f.maybeMap(E(c2.slice(p2 + 1), e3), function(t6) {
          return e3.decoder(t6, $.decoder, u3, 'value');
        })), s3 && e3.interpretNumericEntities && 'iso-8859-1' === u3 && (s3 = O(s3)), c2.indexOf('[]=') > -1 && (s3 = w(s3) ? [s3] : s3), n3[a3] = j.call(n3, a3) ? f.combine(n3[a3], s3) : s3;
      }
    return n3;
  }(t4, r2) : t4, o2 = r2.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, i2 = Object.keys(n2), u2 = 0; u2 < i2.length; ++u2) {
    var a2 = i2[u2], s2 = S(a2, n2[a2], r2, 'string' == typeof t4);
    o2 = f.merge(o2, s2, r2);
  }
  return f.compact(o2);
};
class x {
  constructor(t4, e2, r2) {
    var n2, o2;
    this.name = t4, this.definition = e2, this.bindings = null != (n2 = e2.bindings) ? n2 : {}, this.wheres = null != (o2 = e2.wheres) ? o2 : {}, this.config = r2;
  }
  get template() {
    const t4 = `${this.origin}/${this.definition.uri}`.replace(/\/+$/, '');
    return '' === t4 ? '/' : t4;
  }
  get origin() {
    return this.config.absolute ? this.definition.domain ? `${this.config.url.match(/^\w+:\/\//)[0]}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ''}` : this.config.url : '';
  }
  get parameterSegments() {
    var t4, e2;
    return null != (t4 = null == (e2 = this.template.match(/{[^}?]+\??}/g)) ? void 0 : e2.map((t5) => ({ name: t5.replace(/{|\??}/g, ''), required: !/\?}$/.test(t5) }))) ? t4 : [];
  }
  matchesUrl(t4) {
    if (!this.definition.methods.includes('GET'))
      return false;
    const e2 = this.template.replace(/(\/?){([^}?]*)(\??)}/g, (t5, e3, r3, n3) => {
      var o3;
      const i2 = `(?<${r3}>${(null == (o3 = this.wheres[r3]) ? void 0 : o3.replace(/(^\^)|(\$$)/g, '')) || '[^/?]+'})`;
      return n3 ? `(${e3}${i2})?` : `${e3}${i2}`;
    }).replace(/^\w+:\/\//, ''), [r2, n2] = t4.replace(/^\w+:\/\//, '').split('?'), o2 = new RegExp(`^${e2}/?$`).exec(decodeURI(r2));
    if (o2) {
      for (const t5 in o2.groups)
        o2.groups[t5] = 'string' == typeof o2.groups[t5] ? decodeURIComponent(o2.groups[t5]) : o2.groups[t5];
      return { params: o2.groups, query: R(n2) };
    }
    return false;
  }
  compile(t4) {
    return this.parameterSegments.length ? this.template.replace(/{([^}?]+)(\??)}/g, (e2, r2, n2) => {
      var o2, i2;
      if (!n2 && [null, void 0].includes(t4[r2]))
        throw new Error(`Ziggy error: '${r2}' parameter is required for route '${this.name}'.`);
      if (this.wheres[r2] && !new RegExp(`^${n2 ? `(${this.wheres[r2]})?` : this.wheres[r2]}$`).test(null != (i2 = t4[r2]) ? i2 : ''))
        throw new Error(`Ziggy error: '${r2}' parameter does not match required format '${this.wheres[r2]}' for route '${this.name}'.`);
      return encodeURI(null != (o2 = t4[r2]) ? o2 : '').replace(/%7C/g, '|').replace(/%25/g, '%').replace(/\$/g, '%24');
    }).replace(`${this.origin}//`, `${this.origin}/`).replace(/\/+$/, '') : this.template;
  }
}
class N extends String {
  constructor(e2, r2, n2 = true, o2) {
    if (super(), this.t = null != o2 ? o2 : 'undefined' != typeof Ziggy ? Ziggy : null == globalThis ? void 0 : globalThis.Ziggy, this.t = t({}, this.t, { absolute: n2 }), e2) {
      if (!this.t.routes[e2])
        throw new Error(`Ziggy error: route '${e2}' is not in the route list.`);
      this.i = new x(e2, this.t.routes[e2], this.t), this.u = this.l(r2);
    }
  }
  toString() {
    const e2 = Object.keys(this.u).filter((t4) => !this.i.parameterSegments.some(({ name: e3 }) => e3 === t4)).filter((t4) => '_query' !== t4).reduce((e3, r2) => t({}, e3, { [r2]: this.u[r2] }), {});
    return this.i.compile(this.u) + function(t4, e3) {
      var r2, n2 = t4, i2 = function(t5) {
        if (!t5)
          return v;
        if (null != t5.encoder && 'function' != typeof t5.encoder)
          throw new TypeError('Encoder has to be a function.');
        var e4 = t5.charset || v.charset;
        if (void 0 !== t5.charset && 'utf-8' !== t5.charset && 'iso-8859-1' !== t5.charset)
          throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
        var r3 = o.default;
        if (void 0 !== t5.format) {
          if (!c.call(o.formatters, t5.format))
            throw new TypeError('Unknown format option provided.');
          r3 = t5.format;
        }
        var n3 = o.formatters[r3], i3 = v.filter;
        return ('function' == typeof t5.filter || p(t5.filter)) && (i3 = t5.filter), { addQueryPrefix: 'boolean' == typeof t5.addQueryPrefix ? t5.addQueryPrefix : v.addQueryPrefix, allowDots: void 0 === t5.allowDots ? v.allowDots : !!t5.allowDots, charset: e4, charsetSentinel: 'boolean' == typeof t5.charsetSentinel ? t5.charsetSentinel : v.charsetSentinel, delimiter: void 0 === t5.delimiter ? v.delimiter : t5.delimiter, encode: 'boolean' == typeof t5.encode ? t5.encode : v.encode, encoder: 'function' == typeof t5.encoder ? t5.encoder : v.encoder, encodeValuesOnly: 'boolean' == typeof t5.encodeValuesOnly ? t5.encodeValuesOnly : v.encodeValuesOnly, filter: i3, format: r3, formatter: n3, serializeDate: 'function' == typeof t5.serializeDate ? t5.serializeDate : v.serializeDate, skipNulls: 'boolean' == typeof t5.skipNulls ? t5.skipNulls : v.skipNulls, sort: 'function' == typeof t5.sort ? t5.sort : null, strictNullHandling: 'boolean' == typeof t5.strictNullHandling ? t5.strictNullHandling : v.strictNullHandling };
      }(e3);
      'function' == typeof i2.filter ? n2 = (0, i2.filter)('', n2) : p(i2.filter) && (r2 = i2.filter);
      var u2 = [];
      if ('object' != typeof n2 || null === n2)
        return '';
      var a2 = l[e3 && e3.arrayFormat in l ? e3.arrayFormat : e3 && 'indices' in e3 ? e3.indices ? 'indices' : 'repeat' : 'indices'];
      r2 || (r2 = Object.keys(n2)), i2.sort && r2.sort(i2.sort);
      for (var s2 = 0; s2 < r2.length; ++s2) {
        var f2 = r2[s2];
        i2.skipNulls && null === n2[f2] || d(u2, m(n2[f2], f2, a2, i2.strictNullHandling, i2.skipNulls, i2.encode ? i2.encoder : null, i2.filter, i2.sort, i2.allowDots, i2.serializeDate, i2.format, i2.formatter, i2.encodeValuesOnly, i2.charset));
      }
      var h2 = u2.join(i2.delimiter), y2 = true === i2.addQueryPrefix ? '?' : '';
      return i2.charsetSentinel && (y2 += 'iso-8859-1' === i2.charset ? 'utf8=%26%2310003%3B&' : 'utf8=%E2%9C%93&'), h2.length > 0 ? y2 + h2 : '';
    }(t({}, e2, this.u._query), { addQueryPrefix: true, arrayFormat: 'indices', encodeValuesOnly: true, skipNulls: true, encoder: (t4, e3) => 'boolean' == typeof t4 ? Number(t4) : e3(t4) });
  }
  p(e2) {
    e2 ? this.t.absolute && e2.startsWith('/') && (e2 = this.h().host + e2) : e2 = this.v();
    let r2 = {};
    const [n2, o2] = Object.entries(this.t.routes).find(([t4, n3]) => r2 = new x(t4, n3, this.t).matchesUrl(e2)) || [void 0, void 0];
    return t({ name: n2 }, r2, { route: o2 });
  }
  v() {
    const { host: t4, pathname: e2, search: r2 } = this.h();
    return (this.t.absolute ? t4 + e2 : e2.replace(this.t.url.replace(/^\w*:\/\/[^/]+/, ''), '').replace(/^\/+/, '/')) + r2;
  }
  current(e2, r2) {
    const { name: n2, params: o2, query: i2, route: u2 } = this.p();
    if (!e2)
      return n2;
    const a2 = new RegExp(`^${e2.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`).test(n2);
    if ([null, void 0].includes(r2) || !a2)
      return a2;
    const s2 = new x(n2, u2, this.t);
    r2 = this.l(r2, s2);
    const f2 = t({}, o2, i2);
    if (Object.values(r2).every((t4) => !t4) && !Object.values(f2).some((t4) => void 0 !== t4))
      return true;
    const c2 = (t4, e3) => Object.entries(t4).every(([t5, r3]) => Array.isArray(r3) && Array.isArray(e3[t5]) ? r3.every((r4) => e3[t5].includes(r4)) : 'object' == typeof r3 && 'object' == typeof e3[t5] && null !== r3 && null !== e3[t5] ? c2(r3, e3[t5]) : e3[t5] == r3);
    return c2(r2, f2);
  }
  h() {
    var t4, e2, r2, n2, o2, i2;
    const { host: u2 = '', pathname: a2 = '', search: s2 = '' } = 'undefined' != typeof window ? window.location : {};
    return { host: null != (t4 = null == (e2 = this.t.location) ? void 0 : e2.host) ? t4 : u2, pathname: null != (r2 = null == (n2 = this.t.location) ? void 0 : n2.pathname) ? r2 : a2, search: null != (o2 = null == (i2 = this.t.location) ? void 0 : i2.search) ? o2 : s2 };
  }
  get params() {
    const { params: e2, query: r2 } = this.p();
    return t({}, e2, r2);
  }
  has(t4) {
    return Object.keys(this.t.routes).includes(t4);
  }
  l(e2 = {}, r2 = this.i) {
    null != e2 || (e2 = {}), e2 = ['string', 'number'].includes(typeof e2) ? [e2] : e2;
    const n2 = r2.parameterSegments.filter(({ name: t4 }) => !this.t.defaults[t4]);
    return Array.isArray(e2) ? e2 = e2.reduce((e3, r3, o2) => t({}, e3, n2[o2] ? { [n2[o2].name]: r3 } : 'object' == typeof r3 ? r3 : { [r3]: '' }), {}) : 1 !== n2.length || e2[n2[0].name] || !e2.hasOwnProperty(Object.values(r2.bindings)[0]) && !e2.hasOwnProperty('id') || (e2 = { [n2[0].name]: e2 }), t({}, this.m(r2), this.j(e2, r2));
  }
  m(e2) {
    return e2.parameterSegments.filter(({ name: t4 }) => this.t.defaults[t4]).reduce((e3, { name: r2 }, n2) => t({}, e3, { [r2]: this.t.defaults[r2] }), {});
  }
  j(e2, { bindings: r2, parameterSegments: n2 }) {
    return Object.entries(e2).reduce((e3, [o2, i2]) => {
      if (!i2 || 'object' != typeof i2 || Array.isArray(i2) || !n2.some(({ name: t4 }) => t4 === o2))
        return t({}, e3, { [o2]: i2 });
      if (!i2.hasOwnProperty(r2[o2])) {
        if (!i2.hasOwnProperty('id'))
          throw new Error(`Ziggy error: object passed as '${o2}' parameter is missing route model binding key '${r2[o2]}'.`);
        r2[o2] = 'id';
      }
      return t({}, e3, { [o2]: i2[r2[o2]] });
    }, {});
  }
  valueOf() {
    return this.toString();
  }
}
function T(t4, e2, r2, n2) {
  const o2 = new N(t4, e2, r2, n2);
  return t4 ? o2.toString() : o2;
}
const k = { install(t4, e2) {
  const r2 = (t5, r3, n2, o2 = e2) => T(t5, r3, n2, o2);
  parseInt(t4.version) > 2 ? (t4.config.globalProperties.route = r2, t4.provide('route', r2)) : t4.mixin({ methods: { route: r2 } });
} };
const appName = 'Laravel';
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, /* @__PURE__ */ Object.assign({ './Pages/API/Index.vue': () => import('./assets/Index-BTUauQ-2.js'), './Pages/API/Partials/ApiTokenManager.vue': () => import('./assets/ApiTokenManager-D88Qt-PO.js'), './Pages/Auth/ConfirmPassword.vue': () => import('./assets/ConfirmPassword-DsCzMSHO.js'), './Pages/Auth/ForgotPassword.vue': () => import('./assets/ForgotPassword-Cu6WTfk3.js'), './Pages/Auth/Login.vue': () => import('./assets/Login-ChcK8iB_.js'), './Pages/Auth/Register.vue': () => import('./assets/Register-CF-9ZalI.js'), './Pages/Auth/ResetPassword.vue': () => import('./assets/ResetPassword-CXo48qyJ.js'), './Pages/Auth/TwoFactorChallenge.vue': () => import('./assets/TwoFactorChallenge-BFuHyQBG.js'), './Pages/Auth/VerifyEmail.vue': () => import('./assets/VerifyEmail-DujjKN0r.js'), './Pages/Dashboard.vue': () => import('./assets/Dashboard-pnLjovTl.js'), './Pages/PrivacyPolicy.vue': () => import('./assets/PrivacyPolicy-DiqQy98H.js'), './Pages/Profile/Partials/DeleteUserForm.vue': () => import('./assets/DeleteUserForm-CoSFEzPJ.js'), './Pages/Profile/Partials/LogoutOtherBrowserSessionsForm.vue': () => import('./assets/LogoutOtherBrowserSessionsForm-COkCYuYz.js'), './Pages/Profile/Partials/TwoFactorAuthenticationForm.vue': () => import('./assets/TwoFactorAuthenticationForm-D4lOkcly.js'), './Pages/Profile/Partials/UpdatePasswordForm.vue': () => import('./assets/UpdatePasswordForm-DVX3CHcn.js'), './Pages/Profile/Partials/UpdateProfileInformationForm.vue': () => import('./assets/UpdateProfileInformationForm-DCPNO_zT.js'), './Pages/Profile/Show.vue': () => import('./assets/Show-Vb_2ySkq.js'), './Pages/Teams/Create.vue': () => import('./assets/Create-9NFL9P8S.js'), './Pages/Teams/Partials/CreateTeamForm.vue': () => import('./assets/CreateTeamForm-CafrrQm_.js'), './Pages/Teams/Partials/DeleteTeamForm.vue': () => import('./assets/DeleteTeamForm-CBFOj0mL.js'), './Pages/Teams/Partials/TeamMemberManager.vue': () => import('./assets/TeamMemberManager-CqGE9Fq4.js'), './Pages/Teams/Partials/UpdateTeamNameForm.vue': () => import('./assets/UpdateTeamNameForm-BHzGQQ-w.js'), './Pages/Teams/Show.vue': () => import('./assets/Show-BUPUYcmL.js'), './Pages/TermsOfService.vue': () => import('./assets/TermsOfService-qJhf540J.js'), './Pages/Welcome.vue': () => import('./assets/Welcome-fw4BC0B8.js') })),
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h$1(App, props) }).use(plugin).use(k, {
        ...page.props.ziggy,
        location: new URL(page.props.ziggy.location)
      });
    }
  })
);
