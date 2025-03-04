//
// LESS - Leaner CSS v1.3.3
// http://lesscss.org
//
// Copyright (c) 2009-2013, Alexis Sellier
// Licensed under the Apache 2.0 License.
//
(function (e, t) {
  function n(t) {
    return e.less[t.split('/')[1]];
  }
  function f() {
    r.env === 'development'
      ? ((r.optimization = 0),
        (r.watchTimer = setInterval(function () {
          r.watchMode &&
            g(function (e, t, n, r, i) {
              t && S(t.toCSS(), r, i.lastModified);
            });
        }, r.poll)))
      : (r.optimization = 3);
  }
  function m() {
    var e = document.getElementsByTagName('style');
    for (var t = 0; t < e.length; t++)
      e[t].type.match(p) &&
        new r.Parser({
          filename: document.location.href.replace(/#.*$/, ''),
          dumpLineNumbers: r.dumpLineNumbers,
        }).parse(e[t].innerHTML || '', function (n, r) {
          var i = r.toCSS(),
            s = e[t];
          (s.type = 'text/css'),
            s.styleSheet ? (s.styleSheet.cssText = i) : (s.innerHTML = i);
        });
  }
  function g(e, t) {
    for (var n = 0; n < r.sheets.length; n++)
      w(r.sheets[n], e, t, r.sheets.length - (n + 1));
  }
  function y(e, t) {
    var n = b(e),
      r = b(t),
      i,
      s,
      o,
      u,
      a = '';
    if (n.hostPart !== r.hostPart) return '';
    s = Math.max(r.directories.length, n.directories.length);
    for (i = 0; i < s; i++) if (r.directories[i] !== n.directories[i]) break;
    (u = r.directories.slice(i)), (o = n.directories.slice(i));
    for (i = 0; i < u.length - 1; i++) a += '../';
    for (i = 0; i < o.length - 1; i++) a += o[i] + '/';
    return a;
  }
  function b(e, t) {
    var n = /^((?:[a-z-]+:)?\/\/(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/,
      r = e.match(n),
      i = {},
      s = [],
      o,
      u;
    if (!r) throw new Error("Could not parse sheet href - '" + e + "'");
    if (!r[1] || r[2]) {
      u = t.match(n);
      if (!u) throw new Error("Could not parse page url - '" + t + "'");
      (r[1] = u[1]), r[2] || (r[3] = u[3] + r[3]);
    }
    if (r[3]) {
      s = r[3].replace('\\', '/').split('/');
      for (o = 0; o < s.length; o++)
        s[o] === '..' && o > 0 && (s.splice(o - 1, 2), (o -= 2));
    }
    return (
      (i.hostPart = r[1]),
      (i.directories = s),
      (i.path = r[1] + s.join('/')),
      (i.fileUrl = i.path + (r[4] || '')),
      (i.url = i.fileUrl + (r[5] || '')),
      i
    );
  }
  function w(t, n, i, s) {
    var o = t.contents || {},
      u = t.files || {},
      a = b(t.href, e.location.href),
      f = a.url,
      c = l && l.getItem(f),
      h = l && l.getItem(f + ':timestamp'),
      p = { css: c, timestamp: h },
      d;
    r.relativeUrls
      ? r.rootpath
        ? t.entryPath
          ? (d = b(r.rootpath + y(a.path, t.entryPath)).path)
          : (d = r.rootpath)
        : (d = a.path)
      : r.rootpath
      ? (d = r.rootpath)
      : t.entryPath
      ? (d = t.entryPath)
      : (d = a.path),
      x(
        f,
        t.type,
        function (e, l) {
          v += e.replace(/@import .+?;/gi, '');
          if (
            !i &&
            p &&
            l &&
            new Date(l).valueOf() === new Date(p.timestamp).valueOf()
          )
            S(p.css, t), n(null, null, e, t, { local: !0, remaining: s }, f);
          else
            try {
              (o[f] = e),
                new r.Parser({
                  optimization: r.optimization,
                  paths: [a.path],
                  entryPath: t.entryPath || a.path,
                  mime: t.type,
                  filename: f,
                  rootpath: d,
                  relativeUrls: t.relativeUrls,
                  contents: o,
                  files: u,
                  dumpLineNumbers: r.dumpLineNumbers,
                }).parse(e, function (r, i) {
                  if (r) return k(r, f);
                  try {
                    n(
                      r,
                      i,
                      e,
                      t,
                      { local: !1, lastModified: l, remaining: s },
                      f
                    ),
                      N(document.getElementById('less-error-message:' + E(f)));
                  } catch (r) {
                    k(r, f);
                  }
                });
            } catch (c) {
              k(c, f);
            }
        },
        function (e, t) {
          throw new Error("Couldn't load " + t + ' (' + e + ')');
        }
      );
  }
  function E(e) {
    return e
      .replace(/^[a-z]+:\/\/?[^\/]+/, '')
      .replace(/^\//, '')
      .replace(/\.[a-zA-Z]+$/, '')
      .replace(/[^\.\w-]+/g, '-')
      .replace(/\./g, ':');
  }
  function S(e, t, n) {
    var r,
      i = t.href || '',
      s = 'less:' + (t.title || E(i));
    if ((r = document.getElementById(s)) === null) {
      (r = document.createElement('style')),
        (r.type = 'text/css'),
        t.media && (r.media = t.media),
        (r.id = s);
      var o = (t && t.nextSibling) || null;
      (o || document.getElementsByTagName('head')[0]).parentNode.insertBefore(
        r,
        o
      );
    }
    if (r.styleSheet)
      try {
        r.styleSheet.cssText = e;
      } catch (u) {
        throw new Error("Couldn't reassign styleSheet.cssText.");
      }
    else
      (function (e) {
        r.childNodes.length > 0
          ? r.firstChild.nodeValue !== e.nodeValue &&
            r.replaceChild(e, r.firstChild)
          : r.appendChild(e);
      })(document.createTextNode(e));
    if (n && l) {
      C('saving ' + i + ' to cache.');
      try {
        l.setItem(i, e), l.setItem(i + ':timestamp', n);
      } catch (u) {
        C('failed to save');
      }
    }
  }
  function x(e, t, n, i) {
    function a(t, n, r) {
      t.status >= 200 && t.status < 300
        ? n(t.responseText, t.getResponseHeader('Last-Modified'))
        : typeof r == 'function' && r(t.status, e);
    }
    var s = T(),
      u = o ? r.fileAsync : r.async;
    typeof s.overrideMimeType == 'function' && s.overrideMimeType('text/css'),
      s.open('GET', e, u),
      s.setRequestHeader(
        'Accept',
        t || 'text/x-less, text/css; q=0.9, */*; q=0.5'
      ),
      s.send(null),
      o && !r.fileAsync
        ? s.status === 0 || (s.status >= 200 && s.status < 300)
          ? n(s.responseText)
          : i(s.status, e)
        : u
        ? (s.onreadystatechange = function () {
            s.readyState == 4 && a(s, n, i);
          })
        : a(s, n, i);
  }
  function T() {
    if (e.XMLHttpRequest) return new XMLHttpRequest();
    try {
      return new ActiveXObject('MSXML2.XMLHTTP.3.0');
    } catch (t) {
      return C("browser doesn't support AJAX."), null;
    }
  }
  function N(e) {
    return e && e.parentNode.removeChild(e);
  }
  function C(e) {
    r.env == 'development' &&
      typeof console != 'undefined' &&
      console.log('less: ' + e);
  }
  function k(e, t) {
    var n = 'less-error-message:' + E(t),
      i = '<li><label>{line}</label><pre class="{class}">{content}</pre></li>',
      s = document.createElement('div'),
      o,
      u,
      a = [],
      f = e.filename || t,
      l = f.match(/([^\/]+(\?.*)?)$/)[1];
    (s.id = n),
      (s.className = 'less-error-message'),
      (u =
        '<h3>' +
        (e.message || 'There is an error in your .less file') +
        '</h3>' +
        '<p>in <a href="' +
        f +
        '">' +
        l +
        '</a> ');
    var c = function (e, t, n) {
      e.extract[t] &&
        a.push(
          i
            .replace(/\{line\}/, parseInt(e.line) + (t - 1))
            .replace(/\{class\}/, n)
            .replace(/\{content\}/, e.extract[t])
        );
    };
    e.stack
      ? (u += '<br/>' + e.stack.split('\n').slice(1).join('<br/>'))
      : e.extract &&
        (c(e, 0, ''),
        c(e, 1, 'line'),
        c(e, 2, ''),
        (u +=
          'on line ' +
          e.line +
          ', column ' +
          (e.column + 1) +
          ':</p>' +
          '<ul>' +
          a.join('') +
          '</ul>')),
      (s.innerHTML = u),
      S(
        [
          '.less-error-message ul, .less-error-message li {',
          'list-style-type: none;',
          'margin-right: 15px;',
          'padding: 4px 0;',
          'margin: 0;',
          '}',
          '.less-error-message label {',
          'font-size: 12px;',
          'margin-right: 15px;',
          'padding: 4px 0;',
          'color: #cc7777;',
          '}',
          '.less-error-message pre {',
          'color: #dd6666;',
          'padding: 4px 0;',
          'margin: 0;',
          'display: inline-block;',
          '}',
          '.less-error-message pre.line {',
          'color: #ff0000;',
          '}',
          '.less-error-message h3 {',
          'font-size: 20px;',
          'font-weight: bold;',
          'padding: 15px 0 5px 0;',
          'margin: 0;',
          '}',
          '.less-error-message a {',
          'color: #10a',
          '}',
          '.less-error-message .error {',
          'color: red;',
          'font-weight: bold;',
          'padding-bottom: 2px;',
          'border-bottom: 1px dashed red;',
          '}',
        ].join('\n'),
        { title: 'error-message' }
      ),
      (s.style.cssText = [
        'font-family: Arial, sans-serif',
        'border: 1px solid #e00',
        'background-color: #eee',
        'border-radius: 5px',
        '-webkit-border-radius: 5px',
        '-moz-border-radius: 5px',
        'color: #e00',
        'padding: 15px',
        'margin-bottom: 15px',
      ].join(';')),
      r.env == 'development' &&
        (o = setInterval(function () {
          document.body &&
            (document.getElementById(n)
              ? document.body.replaceChild(s, document.getElementById(n))
              : document.body.insertBefore(s, document.body.firstChild),
            clearInterval(o));
        }, 10));
  }
  Array.isArray ||
    (Array.isArray = function (e) {
      return (
        Object.prototype.toString.call(e) === '[object Array]' ||
        e instanceof Array
      );
    }),
    Array.prototype.forEach ||
      (Array.prototype.forEach = function (e, t) {
        var n = this.length >>> 0;
        for (var r = 0; r < n; r++) r in this && e.call(t, this[r], r, this);
      }),
    Array.prototype.map ||
      (Array.prototype.map = function (e) {
        var t = this.length >>> 0,
          n = new Array(t),
          r = arguments[1];
        for (var i = 0; i < t; i++)
          i in this && (n[i] = e.call(r, this[i], i, this));
        return n;
      }),
    Array.prototype.filter ||
      (Array.prototype.filter = function (e) {
        var t = [],
          n = arguments[1];
        for (var r = 0; r < this.length; r++)
          e.call(n, this[r]) && t.push(this[r]);
        return t;
      }),
    Array.prototype.reduce ||
      (Array.prototype.reduce = function (e) {
        var t = this.length >>> 0,
          n = 0;
        if (t === 0 && arguments.length === 1) throw new TypeError();
        if (arguments.length >= 2) var r = arguments[1];
        else
          do {
            if (n in this) {
              r = this[n++];
              break;
            }
            if (++n >= t) throw new TypeError();
          } while (!0);
        for (; n < t; n++) n in this && (r = e.call(null, r, this[n], n, this));
        return r;
      }),
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = function (e) {
        var t = this.length,
          n = arguments[1] || 0;
        if (!t) return -1;
        if (n >= t) return -1;
        n < 0 && (n += t);
        for (; n < t; n++) {
          if (!Object.prototype.hasOwnProperty.call(this, n)) continue;
          if (e === this[n]) return n;
        }
        return -1;
      }),
    Object.keys ||
      (Object.keys = function (e) {
        var t = [];
        for (var n in e)
          Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
        return t;
      }),
    String.prototype.trim ||
      (String.prototype.trim = function () {
        return String(this)
          .replace(/^\s\s*/, '')
          .replace(/\s\s*$/, '');
      });
  var r, i, s;
  typeof environment == 'object' &&
  {}.toString.call(environment) === '[object Environment]'
    ? (typeof e == 'undefined' ? (r = {}) : (r = e.less = {}),
      (i = r.tree = {}),
      (r.mode = 'rhino'))
    : typeof e == 'undefined'
    ? ((r = exports), (i = n('./tree')), (r.mode = 'node'))
    : (typeof e.less == 'undefined' && (e.less = {}),
      (r = e.less),
      (i = e.less.tree = {}),
      (r.mode = 'browser')),
    (r.Parser = function (t) {
      function g() {
        (a = c[u]), (f = o), (h = o);
      }
      function y() {
        (c[u] = a), (o = f), (h = o);
      }
      function b() {
        o > h && ((c[u] = c[u].slice(o - h)), (h = o));
      }
      function w(e) {
        var t = e.charCodeAt(0);
        return t === 32 || t === 10 || t === 9;
      }
      function E(e) {
        var t, n, r, i, a;
        if (e instanceof Function) return e.call(p.parsers);
        if (typeof e == 'string')
          (t = s.charAt(o) === e ? e : null), (r = 1), b();
        else {
          b();
          if (!(t = e.exec(c[u]))) return null;
          r = t[0].length;
        }
        if (t)
          return S(r), typeof t == 'string' ? t : t.length === 1 ? t[0] : t;
      }
      function S(e) {
        var t = o,
          n = u,
          r = o + c[u].length,
          i = (o += e);
        while (o < r) {
          if (!w(s.charAt(o))) break;
          o++;
        }
        return (
          (c[u] = c[u].slice(e + (o - i))),
          (h = o),
          c[u].length === 0 && u < c.length - 1 && u++,
          t !== o || n !== u
        );
      }
      function x(e, t) {
        var n = E(e);
        if (!!n) return n;
        T(
          t ||
            (typeof e == 'string'
              ? "expected '" + e + "' got '" + s.charAt(o) + "'"
              : 'unexpected token')
        );
      }
      function T(e, t) {
        var n = new Error(e);
        throw ((n.index = o), (n.type = t || 'Syntax'), n);
      }
      function N(e) {
        return typeof e == 'string'
          ? s.charAt(o) === e
          : e.test(c[u])
          ? !0
          : !1;
      }
      function C(e, t) {
        return e.filename && t.filename && e.filename !== t.filename
          ? p.imports.contents[e.filename]
          : s;
      }
      function k(e, t) {
        for (var n = e, r = -1; n >= 0 && t.charAt(n) !== '\n'; n--) r++;
        return {
          line:
            typeof e == 'number'
              ? (t.slice(0, e).match(/\n/g) || '').length
              : null,
          column: r,
        };
      }
      function L(e) {
        return r.mode === 'browser' || r.mode === 'rhino'
          ? e.filename
          : n('path').resolve(e.filename);
      }
      function A(e, t, n) {
        return { lineNumber: k(e, t).line + 1, fileName: L(n) };
      }
      function O(e, t) {
        var n = C(e, t),
          r = k(e.index, n),
          i = r.line,
          s = r.column,
          o = n.split('\n');
        (this.type = e.type || 'Syntax'),
          (this.message = e.message),
          (this.filename = e.filename || t.filename),
          (this.index = e.index),
          (this.line = typeof i == 'number' ? i + 1 : null),
          (this.callLine = e.call && k(e.call, n).line + 1),
          (this.callExtract = o[k(e.call, n).line]),
          (this.stack = e.stack),
          (this.column = s),
          (this.extract = [o[i - 1], o[i], o[i + 1]]);
      }
      var s,
        o,
        u,
        a,
        f,
        l,
        c,
        h,
        p,
        d = this,
        t = t || {};
      t.contents || (t.contents = {}),
        (t.rootpath = t.rootpath || ''),
        t.files || (t.files = {});
      var v = function () {},
        m = (this.imports = {
          paths: t.paths || [],
          queue: [],
          files: t.files,
          contents: t.contents,
          mime: t.mime,
          error: null,
          push: function (e, n) {
            var i = this;
            this.queue.push(e),
              r.Parser.importer(
                e,
                this.paths,
                function (t, r, s) {
                  i.queue.splice(i.queue.indexOf(e), 1);
                  var o = s in i.files;
                  (i.files[s] = r),
                    t && !i.error && (i.error = t),
                    n(t, r, o),
                    i.queue.length === 0 && v(i.error);
                },
                t
              );
          },
        });
      return (
        (this.env = t = t || {}),
        (this.optimization =
          'optimization' in this.env ? this.env.optimization : 1),
        (this.env.filename = this.env.filename || null),
        (p = {
          imports: m,
          parse: function (e, a) {
            var f,
              d,
              m,
              g,
              y,
              b,
              w = [],
              S,
              x = null;
            (o = u = h = l = 0),
              (s = e.replace(/\r\n/g, '\n')),
              (s = s.replace(/^\uFEFF/, '')),
              (c = (function (e) {
                var n = 0,
                  r = /(?:@\{[\w-]+\}|[^"'`\{\}\/\(\)\\])+/g,
                  i = /\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/.*/g,
                  o = /"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'|`((?:[^`]|\\.)*)`/g,
                  u = 0,
                  a,
                  f = e[0],
                  l;
                for (var c = 0, h, p; c < s.length; ) {
                  (r.lastIndex = c),
                    (a = r.exec(s)) &&
                      a.index === c &&
                      ((c += a[0].length), f.push(a[0])),
                    (h = s.charAt(c)),
                    (i.lastIndex = o.lastIndex = c);
                  if ((a = o.exec(s)))
                    if (a.index === c) {
                      (c += a[0].length), f.push(a[0]);
                      continue;
                    }
                  if (!l && h === '/') {
                    p = s.charAt(c + 1);
                    if (p === '/' || p === '*')
                      if ((a = i.exec(s)))
                        if (a.index === c) {
                          (c += a[0].length), f.push(a[0]);
                          continue;
                        }
                  }
                  switch (h) {
                    case '{':
                      if (!l) {
                        u++, f.push(h);
                        break;
                      }
                    case '}':
                      if (!l) {
                        u--, f.push(h), (e[++n] = f = []);
                        break;
                      }
                    case '(':
                      if (!l) {
                        (l = !0), f.push(h);
                        break;
                      }
                    case ')':
                      if (l) {
                        (l = !1), f.push(h);
                        break;
                      }
                    default:
                      f.push(h);
                  }
                  c++;
                }
                return (
                  u != 0 &&
                    (x = new O(
                      {
                        index: c - 1,
                        type: 'Parse',
                        message:
                          u > 0 ? 'missing closing `}`' : 'missing opening `{`',
                        filename: t.filename,
                      },
                      t
                    )),
                  e.map(function (e) {
                    return e.join('');
                  })
                );
              })([[]]));
            if (x) return a(x, t);
            try {
              (f = new i.Ruleset([], E(this.parsers.primary))), (f.root = !0);
            } catch (T) {
              return a(new O(T, t));
            }
            f.toCSS = (function (e) {
              var s, o, u;
              return function (s, o) {
                var u = [],
                  a;
                (s = s || {}),
                  typeof o == 'object' &&
                    !Array.isArray(o) &&
                    ((o = Object.keys(o).map(function (e) {
                      var t = o[e];
                      return (
                        t instanceof i.Value ||
                          (t instanceof i.Expression ||
                            (t = new i.Expression([t])),
                          (t = new i.Value([t]))),
                        new i.Rule('@' + e, t, !1, 0)
                      );
                    })),
                    (u = [new i.Ruleset(null, o)]));
                try {
                  var f = e
                    .call(this, { frames: u })
                    .toCSS([], {
                      compress: s.compress || !1,
                      dumpLineNumbers: t.dumpLineNumbers,
                    });
                } catch (l) {
                  throw new O(l, t);
                }
                if ((a = p.imports.error))
                  throw a instanceof O ? a : new O(a, t);
                return s.yuicompress && r.mode === 'node'
                  ? n('ycssmin').cssmin(f)
                  : s.compress
                  ? f.replace(/(\s)+/g, '$1')
                  : f;
              };
            })(f.eval);
            if (o < s.length - 1) {
              (o = l),
                (b = s.split('\n')),
                (y = (s.slice(0, o).match(/\n/g) || '').length + 1);
              for (var N = o, C = -1; N >= 0 && s.charAt(N) !== '\n'; N--) C++;
              x = {
                type: 'Parse',
                message: 'Syntax Error on line ' + y,
                index: o,
                filename: t.filename,
                line: y,
                column: C,
                extract: [b[y - 2], b[y - 1], b[y]],
              };
            }
            this.imports.queue.length > 0
              ? (v = function (e) {
                  (e = x || e), e ? a(e) : a(null, f);
                })
              : a(x, f);
          },
          parsers: {
            primary: function () {
              var e,
                t = [];
              while (
                (e =
                  E(this.mixin.definition) ||
                  E(this.rule) ||
                  E(this.ruleset) ||
                  E(this.mixin.call) ||
                  E(this.comment) ||
                  E(this.directive)) ||
                E(/^[\s\n]+/) ||
                E(/^;+/)
              )
                e && t.push(e);
              return t;
            },
            comment: function () {
              var e;
              if (s.charAt(o) !== '/') return;
              if (s.charAt(o + 1) === '/')
                return new i.Comment(E(/^\/\/.*/), !0);
              if ((e = E(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/)))
                return new i.Comment(e);
            },
            entities: {
              quoted: function () {
                var e,
                  t = o,
                  n;
                s.charAt(t) === '~' && (t++, (n = !0));
                if (s.charAt(t) !== '"' && s.charAt(t) !== "'") return;
                n && E('~');
                if ((e = E(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/)))
                  return new i.Quoted(e[0], e[1] || e[2], n);
              },
              keyword: function () {
                var e;
                if ((e = E(/^[_A-Za-z-][_A-Za-z0-9-]*/)))
                  return i.colors.hasOwnProperty(e)
                    ? new i.Color(i.colors[e].slice(1))
                    : new i.Keyword(e);
              },
              call: function () {
                var e,
                  n,
                  r,
                  s,
                  a = o;
                if (!(e = /^([\w-]+|%|progid:[\w\.]+)\(/.exec(c[u]))) return;
                (e = e[1]), (n = e.toLowerCase());
                if (n === 'url') return null;
                o += e.length;
                if (n === 'alpha') {
                  s = E(this.alpha);
                  if (typeof s != 'undefined') return s;
                }
                E('('), (r = E(this.entities.arguments));
                if (!E(')')) return;
                if (e) return new i.Call(e, r, a, t.filename);
              },
              arguments: function () {
                var e = [],
                  t;
                while (
                  (t = E(this.entities.assignment) || E(this.expression))
                ) {
                  e.push(t);
                  if (!E(',')) break;
                }
                return e;
              },
              literal: function () {
                return (
                  E(this.entities.ratio) ||
                  E(this.entities.dimension) ||
                  E(this.entities.color) ||
                  E(this.entities.quoted) ||
                  E(this.entities.unicodeDescriptor)
                );
              },
              assignment: function () {
                var e, t;
                if ((e = E(/^\w+(?=\s?=)/i)) && E('=') && (t = E(this.entity)))
                  return new i.Assignment(e, t);
              },
              url: function () {
                var e;
                if (s.charAt(o) !== 'u' || !E(/^url\(/)) return;
                return (
                  (e =
                    E(this.entities.quoted) ||
                    E(this.entities.variable) ||
                    E(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) ||
                    ''),
                  x(')'),
                  new i.URL(
                    e.value != null || e instanceof i.Variable
                      ? e
                      : new i.Anonymous(e),
                    t.rootpath
                  )
                );
              },
              variable: function () {
                var e,
                  n = o;
                if (s.charAt(o) === '@' && (e = E(/^@@?[\w-]+/)))
                  return new i.Variable(e, n, t.filename);
              },
              variableCurly: function () {
                var e,
                  n,
                  r = o;
                if (s.charAt(o) === '@' && (n = E(/^@\{([\w-]+)\}/)))
                  return new i.Variable('@' + n[1], r, t.filename);
              },
              color: function () {
                var e;
                if (
                  s.charAt(o) === '#' &&
                  (e = E(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))
                )
                  return new i.Color(e[1]);
              },
              dimension: function () {
                var e,
                  t = s.charCodeAt(o);
                if (t > 57 || t < 43 || t === 47 || t == 44) return;
                if (
                  (e = E(
                    /^([+-]?\d*\.?\d+)(px|%|em|pc|ex|in|deg|s|ms|pt|cm|mm|rad|grad|turn|dpi|dpcm|dppx|rem|vw|vh|vmin|vm|ch)?/
                  ))
                )
                  return new i.Dimension(e[1], e[2]);
              },
              ratio: function () {
                var e,
                  t = s.charCodeAt(o);
                if (t > 57 || t < 48) return;
                if ((e = E(/^(\d+\/\d+)/))) return new i.Ratio(e[1]);
              },
              unicodeDescriptor: function () {
                var e;
                if ((e = E(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/)))
                  return new i.UnicodeDescriptor(e[0]);
              },
              javascript: function () {
                var e,
                  t = o,
                  n;
                s.charAt(t) === '~' && (t++, (n = !0));
                if (s.charAt(t) !== '`') return;
                n && E('~');
                if ((e = E(/^`([^`]*)`/))) return new i.JavaScript(e[1], o, n);
              },
            },
            variable: function () {
              var e;
              if (s.charAt(o) === '@' && (e = E(/^(@[\w-]+)\s*:/))) return e[1];
            },
            shorthand: function () {
              var e, t;
              if (!N(/^[@\w.%-]+\/[@\w.-]+/)) return;
              g();
              if ((e = E(this.entity)) && E('/') && (t = E(this.entity)))
                return new i.Shorthand(e, t);
              y();
            },
            mixin: {
              call: function () {
                var e = [],
                  n,
                  r,
                  u = [],
                  a = [],
                  f,
                  l,
                  c,
                  h,
                  p,
                  d,
                  v,
                  m = o,
                  b = s.charAt(o),
                  w,
                  S,
                  C = !1;
                if (b !== '.' && b !== '#') return;
                g();
                while (
                  (n = E(
                    /^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/
                  ))
                )
                  e.push(new i.Element(r, n, o)), (r = E('>'));
                if (E('(')) {
                  p = [];
                  while ((c = E(this.expression))) {
                    (h = null), (S = c);
                    if (c.value.length == 1) {
                      var k = c.value[0];
                      k instanceof i.Variable &&
                        E(':') &&
                        (p.length > 0 &&
                          (d && T('Cannot mix ; and , as delimiter types'),
                          (v = !0)),
                        (S = x(this.expression)),
                        (h = w = k.name));
                    }
                    p.push(S), a.push({ name: h, value: S });
                    if (E(',')) continue;
                    if (E(';') || d)
                      v && T('Cannot mix ; and , as delimiter types'),
                        (d = !0),
                        p.length > 1 && (S = new i.Value(p)),
                        u.push({ name: w, value: S }),
                        (w = null),
                        (p = []),
                        (v = !1);
                  }
                  x(')');
                }
                (f = d ? u : a), E(this.important) && (C = !0);
                if (e.length > 0 && (E(';') || N('}')))
                  return new i.mixin.Call(e, f, m, t.filename, C);
                y();
              },
              definition: function () {
                var e,
                  t = [],
                  n,
                  r,
                  u,
                  a,
                  f,
                  c = !1;
                if (
                  (s.charAt(o) !== '.' && s.charAt(o) !== '#') ||
                  N(/^[^{]*\}/)
                )
                  return;
                g();
                if (
                  (n = E(
                    /^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/
                  ))
                ) {
                  e = n[1];
                  do {
                    E(this.comment);
                    if (s.charAt(o) === '.' && E(/^\.{3}/)) {
                      (c = !0), t.push({ variadic: !0 });
                      break;
                    }
                    if (
                      !(u =
                        E(this.entities.variable) ||
                        E(this.entities.literal) ||
                        E(this.entities.keyword))
                    )
                      break;
                    if (u instanceof i.Variable)
                      if (E(':'))
                        (a = x(this.expression, 'expected expression')),
                          t.push({ name: u.name, value: a });
                      else {
                        if (E(/^\.{3}/)) {
                          t.push({ name: u.name, variadic: !0 }), (c = !0);
                          break;
                        }
                        t.push({ name: u.name });
                      }
                    else t.push({ value: u });
                  } while (E(',') || E(';'));
                  E(')') || ((l = o), y()),
                    E(this.comment),
                    E(/^when/) &&
                      (f = x(this.conditions, 'expected condition')),
                    (r = E(this.block));
                  if (r) return new i.mixin.Definition(e, t, r, f, c);
                  y();
                }
              },
            },
            entity: function () {
              return (
                E(this.entities.literal) ||
                E(this.entities.variable) ||
                E(this.entities.url) ||
                E(this.entities.call) ||
                E(this.entities.keyword) ||
                E(this.entities.javascript) ||
                E(this.comment)
              );
            },
            end: function () {
              return E(';') || N('}');
            },
            alpha: function () {
              var e;
              if (!E(/^\(opacity=/i)) return;
              if ((e = E(/^\d+/) || E(this.entities.variable)))
                return x(')'), new i.Alpha(e);
            },
            element: function () {
              var e, t, n, r;
              (n = E(this.combinator)),
                (e =
                  E(/^(?:\d+\.\d+|\d+)%/) ||
                  E(
                    /^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/
                  ) ||
                  E('*') ||
                  E('&') ||
                  E(this.attribute) ||
                  E(/^\([^()@]+\)/) ||
                  E(/^[\.#](?=@)/) ||
                  E(this.entities.variableCurly)),
                e ||
                  (E('(') &&
                    (r =
                      E(this.entities.variableCurly) ||
                      E(this.entities.variable) ||
                      E(this.selector)) &&
                    E(')') &&
                    (e = new i.Paren(r)));
              if (e) return new i.Element(n, e, o);
            },
            combinator: function () {
              var e,
                t = s.charAt(o);
              if (t === '>' || t === '+' || t === '~' || t === '|') {
                o++;
                while (s.charAt(o).match(/\s/)) o++;
                return new i.Combinator(t);
              }
              return s.charAt(o - 1).match(/\s/)
                ? new i.Combinator(' ')
                : new i.Combinator(null);
            },
            selector: function () {
              var e,
                t,
                n = [],
                r,
                u;
              if (E('('))
                return (
                  (e = E(this.entity)),
                  E(')') ? new i.Selector([new i.Element('', e, o)]) : null
                );
              while ((t = E(this.element))) {
                (r = s.charAt(o)), n.push(t);
                if (
                  r === '{' ||
                  r === '}' ||
                  r === ';' ||
                  r === ',' ||
                  r === ')'
                )
                  break;
              }
              if (n.length > 0) return new i.Selector(n);
            },
            attribute: function () {
              var e = '',
                t,
                n,
                r;
              if (!E('[')) return;
              if ((t = E(/^(?:[_A-Za-z0-9-]|\\.)+/) || E(this.entities.quoted)))
                (r = E(/^[|~*$^]?=/)) &&
                (n = E(this.entities.quoted) || E(/^[\w-]+/))
                  ? (e = [t, r, n.toCSS ? n.toCSS() : n].join(''))
                  : (e = t);
              if (!E(']')) return;
              if (e) return '[' + e + ']';
            },
            block: function () {
              var e;
              if (E('{') && (e = E(this.primary)) && E('}')) return e;
            },
            ruleset: function () {
              var e = [],
                n,
                r,
                u,
                a;
              g(), t.dumpLineNumbers && (a = A(o, s, t));
              while ((n = E(this.selector))) {
                e.push(n), E(this.comment);
                if (!E(',')) break;
                E(this.comment);
              }
              if (e.length > 0 && (r = E(this.block))) {
                var f = new i.Ruleset(e, r, t.strictImports);
                return t.dumpLineNumbers && (f.debugInfo = a), f;
              }
              (l = o), y();
            },
            rule: function () {
              var e,
                t,
                n = s.charAt(o),
                r,
                a;
              g();
              if (n === '.' || n === '#' || n === '&') return;
              if ((e = E(this.variable) || E(this.property))) {
                e.charAt(0) != '@' && (a = /^([^@+\/'"*`(;{}-]*);/.exec(c[u]))
                  ? ((o += a[0].length - 1), (t = new i.Anonymous(a[1])))
                  : e === 'font'
                  ? (t = E(this.font))
                  : (t = E(this.value)),
                  (r = E(this.important));
                if (t && E(this.end)) return new i.Rule(e, t, r, f);
                (l = o), y();
              }
            },
            import: function () {
              var e,
                n,
                r = o;
              g();
              var s = E(/^@import(?:-(once))?\s+/);
              if (s && (e = E(this.entities.quoted) || E(this.entities.url))) {
                n = E(this.mediaFeatures);
                if (E(';'))
                  return new i.Import(e, m, n, s[1] === 'once', r, t.rootpath);
              }
              y();
            },
            mediaFeature: function () {
              var e,
                t,
                n = [];
              do
                if ((e = E(this.entities.keyword))) n.push(e);
                else if (E('(')) {
                  (t = E(this.property)), (e = E(this.entity));
                  if (!E(')')) return null;
                  if (t && e)
                    n.push(new i.Paren(new i.Rule(t, e, null, o, !0)));
                  else {
                    if (!e) return null;
                    n.push(new i.Paren(e));
                  }
                }
              while (e);
              if (n.length > 0) return new i.Expression(n);
            },
            mediaFeatures: function () {
              var e,
                t = [];
              do
                if ((e = E(this.mediaFeature))) {
                  t.push(e);
                  if (!E(',')) break;
                } else if ((e = E(this.entities.variable))) {
                  t.push(e);
                  if (!E(',')) break;
                }
              while (e);
              return t.length > 0 ? t : null;
            },
            media: function () {
              var e, n, r, u;
              t.dumpLineNumbers && (u = A(o, s, t));
              if (E(/^@media/)) {
                e = E(this.mediaFeatures);
                if ((n = E(this.block)))
                  return (
                    (r = new i.Media(n, e)),
                    t.dumpLineNumbers && (r.debugInfo = u),
                    r
                  );
              }
            },
            directive: function () {
              var e, n, r, u, a, f, l, c, h, p;
              if (s.charAt(o) !== '@') return;
              if ((n = E(this['import']) || E(this.media))) return n;
              g(), (e = E(/^@[a-z-]+/));
              if (!e) return;
              (l = e),
                e.charAt(1) == '-' &&
                  e.indexOf('-', 2) > 0 &&
                  (l = '@' + e.slice(e.indexOf('-', 2) + 1));
              switch (l) {
                case '@font-face':
                  c = !0;
                  break;
                case '@viewport':
                case '@top-left':
                case '@top-left-corner':
                case '@top-center':
                case '@top-right':
                case '@top-right-corner':
                case '@bottom-left':
                case '@bottom-left-corner':
                case '@bottom-center':
                case '@bottom-right':
                case '@bottom-right-corner':
                case '@left-top':
                case '@left-middle':
                case '@left-bottom':
                case '@right-top':
                case '@right-middle':
                case '@right-bottom':
                  c = !0;
                  break;
                case '@page':
                case '@document':
                case '@supports':
                case '@keyframes':
                  (c = !0), (h = !0);
                  break;
                case '@namespace':
                  p = !0;
              }
              h && (e += ' ' + (E(/^[^{]+/) || '').trim());
              if (c) {
                if ((r = E(this.block))) return new i.Directive(e, r);
              } else if (
                (n = p ? E(this.expression) : E(this.entity)) &&
                E(';')
              ) {
                var d = new i.Directive(e, n);
                return t.dumpLineNumbers && (d.debugInfo = A(o, s, t)), d;
              }
              y();
            },
            font: function () {
              var e = [],
                t = [],
                n,
                r,
                s,
                o;
              while ((o = E(this.shorthand) || E(this.entity))) t.push(o);
              e.push(new i.Expression(t));
              if (E(','))
                while ((o = E(this.expression))) {
                  e.push(o);
                  if (!E(',')) break;
                }
              return new i.Value(e);
            },
            value: function () {
              var e,
                t = [],
                n;
              while ((e = E(this.expression))) {
                t.push(e);
                if (!E(',')) break;
              }
              if (t.length > 0) return new i.Value(t);
            },
            important: function () {
              if (s.charAt(o) === '!') return E(/^! *important/);
            },
            sub: function () {
              var e;
              if (E('(') && (e = E(this.expression)) && E(')')) return e;
            },
            multiplication: function () {
              var e, t, n, r;
              if ((e = E(this.operand))) {
                while (
                  !N(/^\/[*\/]/) &&
                  (n = E('/') || E('*')) &&
                  (t = E(this.operand))
                )
                  r = new i.Operation(n, [r || e, t]);
                return r || e;
              }
            },
            addition: function () {
              var e, t, n, r;
              if ((e = E(this.multiplication))) {
                while (
                  (n =
                    E(/^[-+]\s+/) ||
                    (!w(s.charAt(o - 1)) && (E('+') || E('-')))) &&
                  (t = E(this.multiplication))
                )
                  r = new i.Operation(n, [r || e, t]);
                return r || e;
              }
            },
            conditions: function () {
              var e,
                t,
                n = o,
                r;
              if ((e = E(this.condition))) {
                while (E(',') && (t = E(this.condition)))
                  r = new i.Condition('or', r || e, t, n);
                return r || e;
              }
            },
            condition: function () {
              var e,
                t,
                n,
                r,
                s = o,
                u = !1;
              E(/^not/) && (u = !0), x('(');
              if (
                (e =
                  E(this.addition) ||
                  E(this.entities.keyword) ||
                  E(this.entities.quoted))
              )
                return (
                  (r = E(/^(?:>=|=<|[<=>])/))
                    ? (t =
                        E(this.addition) ||
                        E(this.entities.keyword) ||
                        E(this.entities.quoted))
                      ? (n = new i.Condition(r, e, t, s, u))
                      : T('expected expression')
                    : (n = new i.Condition(
                        '=',
                        e,
                        new i.Keyword('true'),
                        s,
                        u
                      )),
                  x(')'),
                  E(/^and/) ? new i.Condition('and', n, E(this.condition)) : n
                );
            },
            operand: function () {
              var e,
                t = s.charAt(o + 1);
              s.charAt(o) === '-' && (t === '@' || t === '(') && (e = E('-'));
              var n =
                E(this.sub) ||
                E(this.entities.dimension) ||
                E(this.entities.color) ||
                E(this.entities.variable) ||
                E(this.entities.call);
              return e ? new i.Operation('*', [new i.Dimension(-1), n]) : n;
            },
            expression: function () {
              var e,
                t,
                n = [],
                r;
              while ((e = E(this.addition) || E(this.entity))) n.push(e);
              if (n.length > 0) return new i.Expression(n);
            },
            property: function () {
              var e;
              if ((e = E(/^(\*?-?[_a-z0-9-]+)\s*:/))) return e[1];
            },
          },
        })
      );
    });
  if (r.mode === 'browser' || r.mode === 'rhino')
    r.Parser.importer = function (e, t, n, r) {
      !/^([a-z-]+:)?\//.test(e) && t.length > 0 && (e = t[0] + e),
        w(
          {
            href: e,
            title: e,
            type: r.mime,
            contents: r.contents,
            files: r.files,
            rootpath: r.rootpath,
            entryPath: r.entryPath,
            relativeUrls: r.relativeUrls,
          },
          function (e, i, s, o, u, a) {
            e && typeof r.errback == 'function'
              ? r.errback.call(null, a, t, n, r)
              : n.call(null, e, i, a);
          },
          !0
        );
    };
  (function (e) {
    function t(t) {
      return e.functions.hsla(t.h, t.s, t.l, t.a);
    }
    function n(t, n) {
      return t instanceof e.Dimension && t.unit == '%'
        ? parseFloat((t.value * n) / 100)
        : r(t);
    }
    function r(t) {
      if (t instanceof e.Dimension)
        return parseFloat(t.unit == '%' ? t.value / 100 : t.value);
      if (typeof t == 'number') return t;
      throw {
        error: 'RuntimeError',
        message: 'color functions take numbers as parameters',
      };
    }
    function i(e) {
      return Math.min(1, Math.max(0, e));
    }
    e.functions = {
      rgb: function (e, t, n) {
        return this.rgba(e, t, n, 1);
      },
      rgba: function (t, i, s, o) {
        var u = [t, i, s].map(function (e) {
          return n(e, 256);
        });
        return (o = r(o)), new e.Color(u, o);
      },
      hsl: function (e, t, n) {
        return this.hsla(e, t, n, 1);
      },
      hsla: function (e, t, n, i) {
        function u(e) {
          return (
            (e = e < 0 ? e + 1 : e > 1 ? e - 1 : e),
            e * 6 < 1
              ? o + (s - o) * e * 6
              : e * 2 < 1
              ? s
              : e * 3 < 2
              ? o + (s - o) * (2 / 3 - e) * 6
              : o
          );
        }
        (e = (r(e) % 360) / 360), (t = r(t)), (n = r(n)), (i = r(i));
        var s = n <= 0.5 ? n * (t + 1) : n + t - n * t,
          o = n * 2 - s;
        return this.rgba(u(e + 1 / 3) * 255, u(e) * 255, u(e - 1 / 3) * 255, i);
      },
      hsv: function (e, t, n) {
        return this.hsva(e, t, n, 1);
      },
      hsva: function (e, t, n, i) {
        (e = ((r(e) % 360) / 360) * 360), (t = r(t)), (n = r(n)), (i = r(i));
        var s, o;
        (s = Math.floor((e / 60) % 6)), (o = e / 60 - s);
        var u = [n, n * (1 - t), n * (1 - o * t), n * (1 - (1 - o) * t)],
          a = [
            [0, 3, 1],
            [2, 0, 1],
            [1, 0, 3],
            [1, 2, 0],
            [3, 1, 0],
            [0, 1, 2],
          ];
        return this.rgba(
          u[a[s][0]] * 255,
          u[a[s][1]] * 255,
          u[a[s][2]] * 255,
          i
        );
      },
      hue: function (t) {
        return new e.Dimension(Math.round(t.toHSL().h));
      },
      saturation: function (t) {
        return new e.Dimension(Math.round(t.toHSL().s * 100), '%');
      },
      lightness: function (t) {
        return new e.Dimension(Math.round(t.toHSL().l * 100), '%');
      },
      red: function (t) {
        return new e.Dimension(t.rgb[0]);
      },
      green: function (t) {
        return new e.Dimension(t.rgb[1]);
      },
      blue: function (t) {
        return new e.Dimension(t.rgb[2]);
      },
      alpha: function (t) {
        return new e.Dimension(t.toHSL().a);
      },
      luma: function (t) {
        return new e.Dimension(
          Math.round(
            (0.2126 * (t.rgb[0] / 255) +
              0.7152 * (t.rgb[1] / 255) +
              0.0722 * (t.rgb[2] / 255)) *
              t.alpha *
              100
          ),
          '%'
        );
      },
      saturate: function (e, n) {
        var r = e.toHSL();
        return (r.s += n.value / 100), (r.s = i(r.s)), t(r);
      },
      desaturate: function (e, n) {
        var r = e.toHSL();
        return (r.s -= n.value / 100), (r.s = i(r.s)), t(r);
      },
      lighten: function (e, n) {
        var r = e.toHSL();
        return (r.l += n.value / 100), (r.l = i(r.l)), t(r);
      },
      darken: function (e, n) {
        var r = e.toHSL();
        return (r.l -= n.value / 100), (r.l = i(r.l)), t(r);
      },
      fadein: function (e, n) {
        var r = e.toHSL();
        return (r.a += n.value / 100), (r.a = i(r.a)), t(r);
      },
      fadeout: function (e, n) {
        var r = e.toHSL();
        return (r.a -= n.value / 100), (r.a = i(r.a)), t(r);
      },
      fade: function (e, n) {
        var r = e.toHSL();
        return (r.a = n.value / 100), (r.a = i(r.a)), t(r);
      },
      spin: function (e, n) {
        var r = e.toHSL(),
          i = (r.h + n.value) % 360;
        return (r.h = i < 0 ? 360 + i : i), t(r);
      },
      mix: function (t, n, r) {
        r || (r = new e.Dimension(50));
        var i = r.value / 100,
          s = i * 2 - 1,
          o = t.toHSL().a - n.toHSL().a,
          u = ((s * o == -1 ? s : (s + o) / (1 + s * o)) + 1) / 2,
          a = 1 - u,
          f = [
            t.rgb[0] * u + n.rgb[0] * a,
            t.rgb[1] * u + n.rgb[1] * a,
            t.rgb[2] * u + n.rgb[2] * a,
          ],
          l = t.alpha * i + n.alpha * (1 - i);
        return new e.Color(f, l);
      },
      greyscale: function (t) {
        return this.desaturate(t, new e.Dimension(100));
      },
      contrast: function (e, t, n, r) {
        return e.rgb
          ? (typeof n == 'undefined' && (n = this.rgba(255, 255, 255, 1)),
            typeof t == 'undefined' && (t = this.rgba(0, 0, 0, 1)),
            typeof r == 'undefined' ? (r = 0.43) : (r = r.value),
            (0.2126 * (e.rgb[0] / 255) +
              0.7152 * (e.rgb[1] / 255) +
              0.0722 * (e.rgb[2] / 255)) *
              e.alpha <
            r
              ? n
              : t)
          : null;
      },
      e: function (t) {
        return new e.Anonymous(t instanceof e.JavaScript ? t.evaluated : t);
      },
      escape: function (t) {
        return new e.Anonymous(
          encodeURI(t.value)
            .replace(/=/g, '%3D')
            .replace(/:/g, '%3A')
            .replace(/#/g, '%23')
            .replace(/;/g, '%3B')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
        );
      },
      '%': function (t) {
        var n = Array.prototype.slice.call(arguments, 1),
          r = t.value;
        for (var i = 0; i < n.length; i++)
          r = r.replace(/%[sda]/i, function (e) {
            var t = e.match(/s/i) ? n[i].value : n[i].toCSS();
            return e.match(/[A-Z]$/) ? encodeURIComponent(t) : t;
          });
        return (r = r.replace(/%%/g, '%')), new e.Quoted('"' + r + '"', r);
      },
      unit: function (t, n) {
        return new e.Dimension(t.value, n ? n.toCSS() : '');
      },
      round: function (e, t) {
        var n = typeof t == 'undefined' ? 0 : t.value;
        return this._math(function (e) {
          return e.toFixed(n);
        }, e);
      },
      ceil: function (e) {
        return this._math(Math.ceil, e);
      },
      floor: function (e) {
        return this._math(Math.floor, e);
      },
      _math: function (t, n) {
        if (n instanceof e.Dimension)
          return new e.Dimension(t(parseFloat(n.value)), n.unit);
        if (typeof n == 'number') return t(n);
        throw { type: 'Argument', message: 'argument must be a number' };
      },
      argb: function (t) {
        return new e.Anonymous(t.toARGB());
      },
      percentage: function (t) {
        return new e.Dimension(t.value * 100, '%');
      },
      color: function (t) {
        if (t instanceof e.Quoted) return new e.Color(t.value.slice(1));
        throw { type: 'Argument', message: 'argument must be a string' };
      },
      iscolor: function (t) {
        return this._isa(t, e.Color);
      },
      isnumber: function (t) {
        return this._isa(t, e.Dimension);
      },
      isstring: function (t) {
        return this._isa(t, e.Quoted);
      },
      iskeyword: function (t) {
        return this._isa(t, e.Keyword);
      },
      isurl: function (t) {
        return this._isa(t, e.URL);
      },
      ispixel: function (t) {
        return t instanceof e.Dimension && t.unit === 'px' ? e.True : e.False;
      },
      ispercentage: function (t) {
        return t instanceof e.Dimension && t.unit === '%' ? e.True : e.False;
      },
      isem: function (t) {
        return t instanceof e.Dimension && t.unit === 'em' ? e.True : e.False;
      },
      _isa: function (t, n) {
        return t instanceof n ? e.True : e.False;
      },
      multiply: function (e, t) {
        var n = (e.rgb[0] * t.rgb[0]) / 255,
          r = (e.rgb[1] * t.rgb[1]) / 255,
          i = (e.rgb[2] * t.rgb[2]) / 255;
        return this.rgb(n, r, i);
      },
      screen: function (e, t) {
        var n = 255 - ((255 - e.rgb[0]) * (255 - t.rgb[0])) / 255,
          r = 255 - ((255 - e.rgb[1]) * (255 - t.rgb[1])) / 255,
          i = 255 - ((255 - e.rgb[2]) * (255 - t.rgb[2])) / 255;
        return this.rgb(n, r, i);
      },
      overlay: function (e, t) {
        var n =
            e.rgb[0] < 128
              ? (2 * e.rgb[0] * t.rgb[0]) / 255
              : 255 - (2 * (255 - e.rgb[0]) * (255 - t.rgb[0])) / 255,
          r =
            e.rgb[1] < 128
              ? (2 * e.rgb[1] * t.rgb[1]) / 255
              : 255 - (2 * (255 - e.rgb[1]) * (255 - t.rgb[1])) / 255,
          i =
            e.rgb[2] < 128
              ? (2 * e.rgb[2] * t.rgb[2]) / 255
              : 255 - (2 * (255 - e.rgb[2]) * (255 - t.rgb[2])) / 255;
        return this.rgb(n, r, i);
      },
      softlight: function (e, t) {
        var n = (t.rgb[0] * e.rgb[0]) / 255,
          r =
            n +
            (e.rgb[0] *
              (255 - ((255 - e.rgb[0]) * (255 - t.rgb[0])) / 255 - n)) /
              255;
        n = (t.rgb[1] * e.rgb[1]) / 255;
        var i =
          n +
          (e.rgb[1] * (255 - ((255 - e.rgb[1]) * (255 - t.rgb[1])) / 255 - n)) /
            255;
        n = (t.rgb[2] * e.rgb[2]) / 255;
        var s =
          n +
          (e.rgb[2] * (255 - ((255 - e.rgb[2]) * (255 - t.rgb[2])) / 255 - n)) /
            255;
        return this.rgb(r, i, s);
      },
      hardlight: function (e, t) {
        var n =
            t.rgb[0] < 128
              ? (2 * t.rgb[0] * e.rgb[0]) / 255
              : 255 - (2 * (255 - t.rgb[0]) * (255 - e.rgb[0])) / 255,
          r =
            t.rgb[1] < 128
              ? (2 * t.rgb[1] * e.rgb[1]) / 255
              : 255 - (2 * (255 - t.rgb[1]) * (255 - e.rgb[1])) / 255,
          i =
            t.rgb[2] < 128
              ? (2 * t.rgb[2] * e.rgb[2]) / 255
              : 255 - (2 * (255 - t.rgb[2]) * (255 - e.rgb[2])) / 255;
        return this.rgb(n, r, i);
      },
      difference: function (e, t) {
        var n = Math.abs(e.rgb[0] - t.rgb[0]),
          r = Math.abs(e.rgb[1] - t.rgb[1]),
          i = Math.abs(e.rgb[2] - t.rgb[2]);
        return this.rgb(n, r, i);
      },
      exclusion: function (e, t) {
        var n = e.rgb[0] + (t.rgb[0] * (255 - e.rgb[0] - e.rgb[0])) / 255,
          r = e.rgb[1] + (t.rgb[1] * (255 - e.rgb[1] - e.rgb[1])) / 255,
          i = e.rgb[2] + (t.rgb[2] * (255 - e.rgb[2] - e.rgb[2])) / 255;
        return this.rgb(n, r, i);
      },
      average: function (e, t) {
        var n = (e.rgb[0] + t.rgb[0]) / 2,
          r = (e.rgb[1] + t.rgb[1]) / 2,
          i = (e.rgb[2] + t.rgb[2]) / 2;
        return this.rgb(n, r, i);
      },
      negation: function (e, t) {
        var n = 255 - Math.abs(255 - t.rgb[0] - e.rgb[0]),
          r = 255 - Math.abs(255 - t.rgb[1] - e.rgb[1]),
          i = 255 - Math.abs(255 - t.rgb[2] - e.rgb[2]);
        return this.rgb(n, r, i);
      },
      tint: function (e, t) {
        return this.mix(this.rgb(255, 255, 255), e, t);
      },
      shade: function (e, t) {
        return this.mix(this.rgb(0, 0, 0), e, t);
      },
    };
  })(n('./tree')),
    (function (e) {
      e.colors = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgrey: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        grey: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgrey: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370d8',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#d87093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
      };
    })(n('./tree')),
    (function (e) {
      (e.Alpha = function (e) {
        this.value = e;
      }),
        (e.Alpha.prototype = {
          toCSS: function () {
            return (
              'alpha(opacity=' +
              (this.value.toCSS ? this.value.toCSS() : this.value) +
              ')'
            );
          },
          eval: function (e) {
            return this.value.eval && (this.value = this.value.eval(e)), this;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Anonymous = function (e) {
        this.value = e.value || e;
      }),
        (e.Anonymous.prototype = {
          toCSS: function () {
            return this.value;
          },
          eval: function () {
            return this;
          },
          compare: function (e) {
            if (!e.toCSS) return -1;
            var t = this.toCSS(),
              n = e.toCSS();
            return t === n ? 0 : t < n ? -1 : 1;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Assignment = function (e, t) {
        (this.key = e), (this.value = t);
      }),
        (e.Assignment.prototype = {
          toCSS: function () {
            return (
              this.key +
              '=' +
              (this.value.toCSS ? this.value.toCSS() : this.value)
            );
          },
          eval: function (t) {
            return this.value.eval
              ? new e.Assignment(this.key, this.value.eval(t))
              : this;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Call = function (e, t, n, r) {
        (this.name = e), (this.args = t), (this.index = n), (this.filename = r);
      }),
        (e.Call.prototype = {
          eval: function (t) {
            var n = this.args.map(function (e) {
                return e.eval(t);
              }),
              r;
            if (this.name in e.functions)
              try {
                r = e.functions[this.name].apply(e.functions, n);
                if (r != null) return r;
              } catch (i) {
                throw {
                  type: i.type || 'Runtime',
                  message:
                    'error evaluating function `' +
                    this.name +
                    '`' +
                    (i.message ? ': ' + i.message : ''),
                  index: this.index,
                  filename: this.filename,
                };
              }
            return new e.Anonymous(
              this.name +
                '(' +
                n
                  .map(function (e) {
                    return e.toCSS(t);
                  })
                  .join(', ') +
                ')'
            );
          },
          toCSS: function (e) {
            return this.eval(e).toCSS();
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Color = function (e, t) {
        Array.isArray(e)
          ? (this.rgb = e)
          : e.length == 6
          ? (this.rgb = e.match(/.{2}/g).map(function (e) {
              return parseInt(e, 16);
            }))
          : (this.rgb = e.split('').map(function (e) {
              return parseInt(e + e, 16);
            })),
          (this.alpha = typeof t == 'number' ? t : 1);
      }),
        (e.Color.prototype = {
          eval: function () {
            return this;
          },
          toCSS: function () {
            return this.alpha < 1
              ? 'rgba(' +
                  this.rgb
                    .map(function (e) {
                      return Math.round(e);
                    })
                    .concat(this.alpha)
                    .join(', ') +
                  ')'
              : '#' +
                  this.rgb
                    .map(function (e) {
                      return (
                        (e = Math.round(e)),
                        (e = (e > 255 ? 255 : e < 0 ? 0 : e).toString(16)),
                        e.length === 1 ? '0' + e : e
                      );
                    })
                    .join('');
          },
          operate: function (t, n) {
            var r = [];
            n instanceof e.Color || (n = n.toColor());
            for (var i = 0; i < 3; i++)
              r[i] = e.operate(t, this.rgb[i], n.rgb[i]);
            return new e.Color(r, this.alpha + n.alpha);
          },
          toHSL: function () {
            var e = this.rgb[0] / 255,
              t = this.rgb[1] / 255,
              n = this.rgb[2] / 255,
              r = this.alpha,
              i = Math.max(e, t, n),
              s = Math.min(e, t, n),
              o,
              u,
              a = (i + s) / 2,
              f = i - s;
            if (i === s) o = u = 0;
            else {
              u = a > 0.5 ? f / (2 - i - s) : f / (i + s);
              switch (i) {
                case e:
                  o = (t - n) / f + (t < n ? 6 : 0);
                  break;
                case t:
                  o = (n - e) / f + 2;
                  break;
                case n:
                  o = (e - t) / f + 4;
              }
              o /= 6;
            }
            return { h: o * 360, s: u, l: a, a: r };
          },
          toARGB: function () {
            var e = [Math.round(this.alpha * 255)].concat(this.rgb);
            return (
              '#' +
              e
                .map(function (e) {
                  return (
                    (e = Math.round(e)),
                    (e = (e > 255 ? 255 : e < 0 ? 0 : e).toString(16)),
                    e.length === 1 ? '0' + e : e
                  );
                })
                .join('')
            );
          },
          compare: function (e) {
            return e.rgb
              ? e.rgb[0] === this.rgb[0] &&
                e.rgb[1] === this.rgb[1] &&
                e.rgb[2] === this.rgb[2] &&
                e.alpha === this.alpha
                ? 0
                : -1
              : -1;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Comment = function (e, t) {
        (this.value = e), (this.silent = !!t);
      }),
        (e.Comment.prototype = {
          toCSS: function (e) {
            return e.compress ? '' : this.value;
          },
          eval: function () {
            return this;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Condition = function (e, t, n, r, i) {
        (this.op = e.trim()),
          (this.lvalue = t),
          (this.rvalue = n),
          (this.index = r),
          (this.negate = i);
      }),
        (e.Condition.prototype.eval = function (e) {
          var t = this.lvalue.eval(e),
            n = this.rvalue.eval(e),
            r = this.index,
            i,
            i = (function (e) {
              switch (e) {
                case 'and':
                  return t && n;
                case 'or':
                  return t || n;
                default:
                  if (t.compare) i = t.compare(n);
                  else {
                    if (!n.compare)
                      throw {
                        type: 'Type',
                        message: 'Unable to perform comparison',
                        index: r,
                      };
                    i = n.compare(t);
                  }
                  switch (i) {
                    case -1:
                      return e === '<' || e === '=<';
                    case 0:
                      return e === '=' || e === '>=' || e === '=<';
                    case 1:
                      return e === '>' || e === '>=';
                  }
              }
            })(this.op);
          return this.negate ? !i : i;
        });
    })(n('../tree')),
    (function (e) {
      (e.Dimension = function (e, t) {
        (this.value = parseFloat(e)), (this.unit = t || null);
      }),
        (e.Dimension.prototype = {
          eval: function () {
            return this;
          },
          toColor: function () {
            return new e.Color([this.value, this.value, this.value]);
          },
          toCSS: function () {
            var e = this.value + this.unit;
            return e;
          },
          operate: function (t, n) {
            return new e.Dimension(
              e.operate(t, this.value, n.value),
              this.unit || n.unit
            );
          },
          compare: function (t) {
            return t instanceof e.Dimension
              ? t.value > this.value
                ? -1
                : t.value < this.value
                ? 1
                : t.unit && this.unit !== t.unit
                ? -1
                : 0
              : -1;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Directive = function (t, n) {
        (this.name = t),
          Array.isArray(n)
            ? ((this.ruleset = new e.Ruleset([], n)),
              (this.ruleset.allowImports = !0))
            : (this.value = n);
      }),
        (e.Directive.prototype = {
          toCSS: function (e, t) {
            return this.ruleset
              ? ((this.ruleset.root = !0),
                this.name +
                  (t.compress ? '{' : ' {\n  ') +
                  this.ruleset.toCSS(e, t).trim().replace(/\n/g, '\n  ') +
                  (t.compress ? '}' : '\n}\n'))
              : this.name + ' ' + this.value.toCSS() + ';\n';
          },
          eval: function (t) {
            var n = this;
            return (
              this.ruleset &&
                (t.frames.unshift(this),
                (n = new e.Directive(this.name)),
                (n.ruleset = this.ruleset.eval(t)),
                t.frames.shift()),
              n
            );
          },
          variable: function (t) {
            return e.Ruleset.prototype.variable.call(this.ruleset, t);
          },
          find: function () {
            return e.Ruleset.prototype.find.apply(this.ruleset, arguments);
          },
          rulesets: function () {
            return e.Ruleset.prototype.rulesets.apply(this.ruleset);
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Element = function (t, n, r) {
        (this.combinator = t instanceof e.Combinator ? t : new e.Combinator(t)),
          typeof n == 'string'
            ? (this.value = n.trim())
            : n
            ? (this.value = n)
            : (this.value = ''),
          (this.index = r);
      }),
        (e.Element.prototype.eval = function (t) {
          return new e.Element(
            this.combinator,
            this.value.eval ? this.value.eval(t) : this.value,
            this.index
          );
        }),
        (e.Element.prototype.toCSS = function (e) {
          var t = this.value.toCSS ? this.value.toCSS(e) : this.value;
          return t == '' && this.combinator.value.charAt(0) == '&'
            ? ''
            : this.combinator.toCSS(e || {}) + t;
        }),
        (e.Combinator = function (e) {
          e === ' ' ? (this.value = ' ') : (this.value = e ? e.trim() : '');
        }),
        (e.Combinator.prototype.toCSS = function (e) {
          return {
            '': '',
            ' ': ' ',
            ':': ' :',
            '+': e.compress ? '+' : ' + ',
            '~': e.compress ? '~' : ' ~ ',
            '>': e.compress ? '>' : ' > ',
            '|': e.compress ? '|' : ' | ',
          }[this.value];
        });
    })(n('../tree')),
    (function (e) {
      (e.Expression = function (e) {
        this.value = e;
      }),
        (e.Expression.prototype = {
          eval: function (t) {
            return this.value.length > 1
              ? new e.Expression(
                  this.value.map(function (e) {
                    return e.eval(t);
                  })
                )
              : this.value.length === 1
              ? this.value[0].eval(t)
              : this;
          },
          toCSS: function (e) {
            return this.value
              .map(function (t) {
                return t.toCSS ? t.toCSS(e) : '';
              })
              .join(' ');
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Import = function (t, n, r, i, s, o) {
        var u = this;
        (this.once = i),
          (this.index = s),
          (this._path = t),
          (this.features = r && new e.Value(r)),
          (this.rootpath = o),
          t instanceof e.Quoted
            ? (this.path = /(\.[a-z]*$)|([\?;].*)$/.test(t.value)
                ? t.value
                : t.value + '.less')
            : (this.path = t.value.value || t.value),
          (this.css = /css([\?;].*)?$/.test(this.path)),
          this.css ||
            n.push(this.path, function (t, n, r) {
              t && (t.index = s),
                r && u.once && (u.skip = r),
                (u.root = n || new e.Ruleset([], []));
            });
      }),
        (e.Import.prototype = {
          toCSS: function (e) {
            var t = this.features ? ' ' + this.features.toCSS(e) : '';
            return this.css
              ? (typeof this._path.value == 'string' &&
                  !/^(?:[a-z-]+:|\/)/.test(this._path.value) &&
                  (this._path.value = this.rootpath + this._path.value),
                '@import ' + this._path.toCSS() + t + ';\n')
              : '';
          },
          eval: function (t) {
            var n,
              r = this.features && this.features.eval(t);
            return this.skip
              ? []
              : this.css
              ? this
              : ((n = new e.Ruleset([], this.root.rules.slice(0))),
                n.evalImports(t),
                this.features
                  ? new e.Media(n.rules, this.features.value)
                  : n.rules);
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.JavaScript = function (e, t, n) {
        (this.escaped = n), (this.expression = e), (this.index = t);
      }),
        (e.JavaScript.prototype = {
          eval: function (t) {
            var n,
              r = this,
              i = {},
              s = this.expression.replace(/@\{([\w-]+)\}/g, function (n, i) {
                return e.jsify(new e.Variable('@' + i, r.index).eval(t));
              });
            try {
              s = new Function('return (' + s + ')');
            } catch (o) {
              throw {
                message: 'JavaScript evaluation error: `' + s + '`',
                index: this.index,
              };
            }
            for (var u in t.frames[0].variables())
              i[u.slice(1)] = {
                value: t.frames[0].variables()[u].value,
                toJS: function () {
                  return this.value.eval(t).toCSS();
                },
              };
            try {
              n = s.call(i);
            } catch (o) {
              throw {
                message:
                  "JavaScript evaluation error: '" +
                  o.name +
                  ': ' +
                  o.message +
                  "'",
                index: this.index,
              };
            }
            return typeof n == 'string'
              ? new e.Quoted('"' + n + '"', n, this.escaped, this.index)
              : Array.isArray(n)
              ? new e.Anonymous(n.join(', '))
              : new e.Anonymous(n);
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Keyword = function (e) {
        this.value = e;
      }),
        (e.Keyword.prototype = {
          eval: function () {
            return this;
          },
          toCSS: function () {
            return this.value;
          },
          compare: function (t) {
            return t instanceof e.Keyword
              ? t.value === this.value
                ? 0
                : 1
              : -1;
          },
        }),
        (e.True = new e.Keyword('true')),
        (e.False = new e.Keyword('false'));
    })(n('../tree')),
    (function (e) {
      (e.Media = function (t, n) {
        var r = this.emptySelectors();
        (this.features = new e.Value(n)),
          (this.ruleset = new e.Ruleset(r, t)),
          (this.ruleset.allowImports = !0);
      }),
        (e.Media.prototype = {
          toCSS: function (e, t) {
            var n = this.features.toCSS(t);
            return (
              (this.ruleset.root = e.length === 0 || e[0].multiMedia),
              '@media ' +
                n +
                (t.compress ? '{' : ' {\n  ') +
                this.ruleset.toCSS(e, t).trim().replace(/\n/g, '\n  ') +
                (t.compress ? '}' : '\n}\n')
            );
          },
          eval: function (t) {
            t.mediaBlocks || ((t.mediaBlocks = []), (t.mediaPath = []));
            var n = new e.Media([], []);
            return (
              this.debugInfo &&
                ((this.ruleset.debugInfo = this.debugInfo),
                (n.debugInfo = this.debugInfo)),
              (n.features = this.features.eval(t)),
              t.mediaPath.push(n),
              t.mediaBlocks.push(n),
              t.frames.unshift(this.ruleset),
              (n.ruleset = this.ruleset.eval(t)),
              t.frames.shift(),
              t.mediaPath.pop(),
              t.mediaPath.length === 0 ? n.evalTop(t) : n.evalNested(t)
            );
          },
          variable: function (t) {
            return e.Ruleset.prototype.variable.call(this.ruleset, t);
          },
          find: function () {
            return e.Ruleset.prototype.find.apply(this.ruleset, arguments);
          },
          rulesets: function () {
            return e.Ruleset.prototype.rulesets.apply(this.ruleset);
          },
          emptySelectors: function () {
            var t = new e.Element('', '&', 0);
            return [new e.Selector([t])];
          },
          evalTop: function (t) {
            var n = this;
            if (t.mediaBlocks.length > 1) {
              var r = this.emptySelectors();
              (n = new e.Ruleset(r, t.mediaBlocks)), (n.multiMedia = !0);
            }
            return delete t.mediaBlocks, delete t.mediaPath, n;
          },
          evalNested: function (t) {
            var n,
              r,
              i = t.mediaPath.concat([this]);
            for (n = 0; n < i.length; n++)
              (r =
                i[n].features instanceof e.Value
                  ? i[n].features.value
                  : i[n].features),
                (i[n] = Array.isArray(r) ? r : [r]);
            return (
              (this.features = new e.Value(
                this.permute(i).map(function (t) {
                  t = t.map(function (t) {
                    return t.toCSS ? t : new e.Anonymous(t);
                  });
                  for (n = t.length - 1; n > 0; n--)
                    t.splice(n, 0, new e.Anonymous('and'));
                  return new e.Expression(t);
                })
              )),
              new e.Ruleset([], [])
            );
          },
          permute: function (e) {
            if (e.length === 0) return [];
            if (e.length === 1) return e[0];
            var t = [],
              n = this.permute(e.slice(1));
            for (var r = 0; r < n.length; r++)
              for (var i = 0; i < e[0].length; i++)
                t.push([e[0][i]].concat(n[r]));
            return t;
          },
          bubbleSelectors: function (t) {
            this.ruleset = new e.Ruleset(t.slice(0), [this.ruleset]);
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.mixin = {}),
        (e.mixin.Call = function (t, n, r, i, s) {
          (this.selector = new e.Selector(t)),
            (this.arguments = n),
            (this.index = r),
            (this.filename = i),
            (this.important = s);
        }),
        (e.mixin.Call.prototype = {
          eval: function (t) {
            var n,
              r,
              i,
              s = [],
              o = !1,
              u,
              a,
              f,
              l,
              c;
            i =
              this.arguments &&
              this.arguments.map(function (e) {
                return { name: e.name, value: e.value.eval(t) };
              });
            for (u = 0; u < t.frames.length; u++)
              if ((n = t.frames[u].find(this.selector)).length > 0) {
                c = !0;
                for (a = 0; a < n.length; a++) {
                  (r = n[a]), (l = !1);
                  for (f = 0; f < t.frames.length; f++)
                    if (
                      !(r instanceof e.mixin.Definition) &&
                      r === (t.frames[f].originalRuleset || t.frames[f])
                    ) {
                      l = !0;
                      break;
                    }
                  if (l) continue;
                  if (r.matchArgs(i, t)) {
                    if (!r.matchCondition || r.matchCondition(i, t))
                      try {
                        Array.prototype.push.apply(
                          s,
                          r.eval(t, i, this.important).rules
                        );
                      } catch (h) {
                        throw {
                          message: h.message,
                          index: this.index,
                          filename: this.filename,
                          stack: h.stack,
                        };
                      }
                    o = !0;
                  }
                }
                if (o) return s;
              }
            throw c
              ? {
                  type: 'Runtime',
                  message:
                    'No matching definition was found for `' +
                    this.selector.toCSS().trim() +
                    '(' +
                    (i
                      ? i
                          .map(function (e) {
                            var t = '';
                            return (
                              e.name && (t += e.name + ':'),
                              e.value.toCSS
                                ? (t += e.value.toCSS())
                                : (t += '???'),
                              t
                            );
                          })
                          .join(', ')
                      : '') +
                    ')`',
                  index: this.index,
                  filename: this.filename,
                }
              : {
                  type: 'Name',
                  message: this.selector.toCSS().trim() + ' is undefined',
                  index: this.index,
                  filename: this.filename,
                };
          },
        }),
        (e.mixin.Definition = function (t, n, r, i, s) {
          (this.name = t),
            (this.selectors = [new e.Selector([new e.Element(null, t)])]),
            (this.params = n),
            (this.condition = i),
            (this.variadic = s),
            (this.arity = n.length),
            (this.rules = r),
            (this._lookups = {}),
            (this.required = n.reduce(function (e, t) {
              return !t.name || (t.name && !t.value) ? e + 1 : e;
            }, 0)),
            (this.parent = e.Ruleset.prototype),
            (this.frames = []);
        }),
        (e.mixin.Definition.prototype = {
          toCSS: function () {
            return '';
          },
          variable: function (e) {
            return this.parent.variable.call(this, e);
          },
          variables: function () {
            return this.parent.variables.call(this);
          },
          find: function () {
            return this.parent.find.apply(this, arguments);
          },
          rulesets: function () {
            return this.parent.rulesets.apply(this);
          },
          evalParams: function (t, n, r, i) {
            var s = new e.Ruleset(null, []),
              o,
              u,
              a = this.params.slice(0),
              f,
              l,
              c,
              h,
              p,
              d;
            if (r) {
              r = r.slice(0);
              for (f = 0; f < r.length; f++) {
                u = r[f];
                if ((h = u && u.name)) {
                  p = !1;
                  for (l = 0; l < a.length; l++)
                    if (!i[l] && h === a[l].name) {
                      (i[l] = u.value.eval(t)),
                        s.rules.unshift(new e.Rule(h, u.value.eval(t))),
                        (p = !0);
                      break;
                    }
                  if (p) {
                    r.splice(f, 1), f--;
                    continue;
                  }
                  throw {
                    type: 'Runtime',
                    message:
                      'Named argument for ' +
                      this.name +
                      ' ' +
                      r[f].name +
                      ' not found',
                  };
                }
              }
            }
            d = 0;
            for (f = 0; f < a.length; f++) {
              if (i[f]) continue;
              u = r && r[d];
              if ((h = a[f].name))
                if (a[f].variadic && r) {
                  o = [];
                  for (l = d; l < r.length; l++) o.push(r[l].value.eval(t));
                  s.rules.unshift(new e.Rule(h, new e.Expression(o).eval(t)));
                } else {
                  c = u && u.value;
                  if (c) c = c.eval(t);
                  else {
                    if (!a[f].value)
                      throw {
                        type: 'Runtime',
                        message:
                          'wrong number of arguments for ' +
                          this.name +
                          ' (' +
                          r.length +
                          ' for ' +
                          this.arity +
                          ')',
                      };
                    c = a[f].value.eval(n);
                  }
                  s.rules.unshift(new e.Rule(h, c)), (i[f] = c);
                }
              if (a[f].variadic && r)
                for (l = d; l < r.length; l++) i[l] = r[l].value.eval(t);
              d++;
            }
            return s;
          },
          eval: function (t, n, r) {
            var i = [],
              s = this.frames.concat(t.frames),
              o = this.evalParams(t, { frames: s }, n, i),
              u,
              a,
              f,
              l;
            return (
              o.rules.unshift(
                new e.Rule('@arguments', new e.Expression(i).eval(t))
              ),
              (a = r
                ? this.parent.makeImportant.apply(this).rules
                : this.rules.slice(0)),
              (l = new e.Ruleset(null, a).eval({
                frames: [this, o].concat(s),
              })),
              (l.originalRuleset = this),
              l
            );
          },
          matchCondition: function (e, t) {
            return this.condition &&
              !this.condition.eval({
                frames: [
                  this.evalParams(
                    t,
                    { frames: this.frames.concat(t.frames) },
                    e,
                    []
                  ),
                ].concat(t.frames),
              })
              ? !1
              : !0;
          },
          matchArgs: function (e, t) {
            var n = (e && e.length) || 0,
              r,
              i;
            if (!this.variadic) {
              if (n < this.required) return !1;
              if (n > this.params.length) return !1;
              if (this.required > 0 && n > this.params.length) return !1;
            }
            r = Math.min(n, this.arity);
            for (var s = 0; s < r; s++)
              if (
                !this.params[s].name &&
                !this.params[s].variadic &&
                e[s].value.eval(t).toCSS() !=
                  this.params[s].value.eval(t).toCSS()
              )
                return !1;
            return !0;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Operation = function (e, t) {
        (this.op = e.trim()), (this.operands = t);
      }),
        (e.Operation.prototype.eval = function (t) {
          var n = this.operands[0].eval(t),
            r = this.operands[1].eval(t),
            i;
          if (n instanceof e.Dimension && r instanceof e.Color) {
            if (this.op !== '*' && this.op !== '+')
              throw {
                name: 'OperationError',
                message: "Can't substract or divide a color from a number",
              };
            (i = r), (r = n), (n = i);
          }
          if (!n.operate)
            throw {
              name: 'OperationError',
              message: 'Operation on an invalid type',
            };
          return n.operate(this.op, r);
        }),
        (e.operate = function (e, t, n) {
          switch (e) {
            case '+':
              return t + n;
            case '-':
              return t - n;
            case '*':
              return t * n;
            case '/':
              return t / n;
          }
        });
    })(n('../tree')),
    (function (e) {
      (e.Paren = function (e) {
        this.value = e;
      }),
        (e.Paren.prototype = {
          toCSS: function (e) {
            return '(' + this.value.toCSS(e) + ')';
          },
          eval: function (t) {
            return new e.Paren(this.value.eval(t));
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Quoted = function (e, t, n, r) {
        (this.escaped = n),
          (this.value = t || ''),
          (this.quote = e.charAt(0)),
          (this.index = r);
      }),
        (e.Quoted.prototype = {
          toCSS: function () {
            return this.escaped
              ? this.value
              : this.quote + this.value + this.quote;
          },
          eval: function (t) {
            var n = this,
              r = this.value
                .replace(/`([^`]+)`/g, function (r, i) {
                  return new e.JavaScript(i, n.index, !0).eval(t).value;
                })
                .replace(/@\{([\w-]+)\}/g, function (r, i) {
                  var s = new e.Variable('@' + i, n.index).eval(t);
                  return s instanceof e.Quoted ? s.value : s.toCSS();
                });
            return new e.Quoted(
              this.quote + r + this.quote,
              r,
              this.escaped,
              this.index
            );
          },
          compare: function (e) {
            if (!e.toCSS) return -1;
            var t = this.toCSS(),
              n = e.toCSS();
            return t === n ? 0 : t < n ? -1 : 1;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Ratio = function (e) {
        this.value = e;
      }),
        (e.Ratio.prototype = {
          toCSS: function (e) {
            return this.value;
          },
          eval: function () {
            return this;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Rule = function (t, n, r, i, s) {
        (this.name = t),
          (this.value = n instanceof e.Value ? n : new e.Value([n])),
          (this.important = r ? ' ' + r.trim() : ''),
          (this.index = i),
          (this.inline = s || !1),
          t.charAt(0) === '@' ? (this.variable = !0) : (this.variable = !1);
      }),
        (e.Rule.prototype.toCSS = function (e) {
          return this.variable
            ? ''
            : this.name +
                (e.compress ? ':' : ': ') +
                this.value.toCSS(e) +
                this.important +
                (this.inline ? '' : ';');
        }),
        (e.Rule.prototype.eval = function (t) {
          return new e.Rule(
            this.name,
            this.value.eval(t),
            this.important,
            this.index,
            this.inline
          );
        }),
        (e.Rule.prototype.makeImportant = function () {
          return new e.Rule(
            this.name,
            this.value,
            '!important',
            this.index,
            this.inline
          );
        }),
        (e.Shorthand = function (e, t) {
          (this.a = e), (this.b = t);
        }),
        (e.Shorthand.prototype = {
          toCSS: function (e) {
            return this.a.toCSS(e) + '/' + this.b.toCSS(e);
          },
          eval: function () {
            return this;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Ruleset = function (e, t, n) {
        (this.selectors = e),
          (this.rules = t),
          (this._lookups = {}),
          (this.strictImports = n);
      }),
        (e.Ruleset.prototype = {
          eval: function (t) {
            var n =
                this.selectors &&
                this.selectors.map(function (e) {
                  return e.eval(t);
                }),
              r = new e.Ruleset(n, this.rules.slice(0), this.strictImports),
              i;
            (r.originalRuleset = this),
              (r.root = this.root),
              (r.allowImports = this.allowImports),
              this.debugInfo && (r.debugInfo = this.debugInfo),
              t.frames.unshift(r),
              (r.root || r.allowImports || !r.strictImports) &&
                r.evalImports(t);
            for (var s = 0; s < r.rules.length; s++)
              r.rules[s] instanceof e.mixin.Definition &&
                (r.rules[s].frames = t.frames.slice(0));
            var o = (t.mediaBlocks && t.mediaBlocks.length) || 0;
            for (var s = 0; s < r.rules.length; s++)
              r.rules[s] instanceof e.mixin.Call &&
                ((i = r.rules[s].eval(t)),
                r.rules.splice.apply(r.rules, [s, 1].concat(i)),
                (s += i.length - 1),
                r.resetCache());
            for (var s = 0, u; s < r.rules.length; s++)
              (u = r.rules[s]),
                u instanceof e.mixin.Definition ||
                  (r.rules[s] = u.eval ? u.eval(t) : u);
            t.frames.shift();
            if (t.mediaBlocks)
              for (var s = o; s < t.mediaBlocks.length; s++)
                t.mediaBlocks[s].bubbleSelectors(n);
            return r;
          },
          evalImports: function (t) {
            var n, r;
            for (n = 0; n < this.rules.length; n++)
              this.rules[n] instanceof e.Import &&
                ((r = this.rules[n].eval(t)),
                typeof r.length == 'number'
                  ? (this.rules.splice.apply(this.rules, [n, 1].concat(r)),
                    (n += r.length - 1))
                  : this.rules.splice(n, 1, r),
                this.resetCache());
          },
          makeImportant: function () {
            return new e.Ruleset(
              this.selectors,
              this.rules.map(function (e) {
                return e.makeImportant ? e.makeImportant() : e;
              }),
              this.strictImports
            );
          },
          matchArgs: function (e) {
            return !e || e.length === 0;
          },
          resetCache: function () {
            (this._rulesets = null),
              (this._variables = null),
              (this._lookups = {});
          },
          variables: function () {
            return this._variables
              ? this._variables
              : (this._variables = this.rules.reduce(function (t, n) {
                  return (
                    n instanceof e.Rule && n.variable === !0 && (t[n.name] = n),
                    t
                  );
                }, {}));
          },
          variable: function (e) {
            return this.variables()[e];
          },
          rulesets: function () {
            return this._rulesets
              ? this._rulesets
              : (this._rulesets = this.rules.filter(function (t) {
                  return (
                    t instanceof e.Ruleset || t instanceof e.mixin.Definition
                  );
                }));
          },
          find: function (t, n) {
            n = n || this;
            var r = [],
              i,
              s,
              o = t.toCSS();
            return o in this._lookups
              ? this._lookups[o]
              : (this.rulesets().forEach(function (i) {
                  if (i !== n)
                    for (var o = 0; o < i.selectors.length; o++)
                      if ((s = t.match(i.selectors[o]))) {
                        t.elements.length > i.selectors[o].elements.length
                          ? Array.prototype.push.apply(
                              r,
                              i.find(new e.Selector(t.elements.slice(1)), n)
                            )
                          : r.push(i);
                        break;
                      }
                }),
                (this._lookups[o] = r));
          },
          toCSS: function (t, n) {
            var r = [],
              i = [],
              s = [],
              o = [],
              u = [],
              a,
              f,
              l;
            this.root || this.joinSelectors(u, t, this.selectors);
            for (var c = 0; c < this.rules.length; c++) {
              l = this.rules[c];
              if (l.rules || l instanceof e.Media) o.push(l.toCSS(u, n));
              else if (l instanceof e.Directive) {
                var h = l.toCSS(u, n);
                if (l.name === '@charset') {
                  if (n.charset) {
                    l.debugInfo &&
                      (o.push(e.debugInfo(n, l)),
                      o.push(
                        new e.Comment(
                          '/* ' + h.replace(/\n/g, '') + ' */\n'
                        ).toCSS(n)
                      ));
                    continue;
                  }
                  n.charset = !0;
                }
                o.push(h);
              } else
                l instanceof e.Comment
                  ? l.silent ||
                    (this.root ? o.push(l.toCSS(n)) : i.push(l.toCSS(n)))
                  : l.toCSS && !l.variable
                  ? i.push(l.toCSS(n))
                  : l.value && !l.variable && i.push(l.value.toString());
            }
            o = o.join('');
            if (this.root) r.push(i.join(n.compress ? '' : '\n'));
            else if (i.length > 0) {
              (f = e.debugInfo(n, this)),
                (a = u
                  .map(function (e) {
                    return e
                      .map(function (e) {
                        return e.toCSS(n);
                      })
                      .join('')
                      .trim();
                  })
                  .join(n.compress ? ',' : ',\n'));
              for (var c = i.length - 1; c >= 0; c--)
                s.indexOf(i[c]) === -1 && s.unshift(i[c]);
              (i = s),
                r.push(
                  f +
                    a +
                    (n.compress ? '{' : ' {\n  ') +
                    i.join(n.compress ? '' : '\n  ') +
                    (n.compress ? '}' : '\n}\n')
                );
            }
            return r.push(o), r.join('') + (n.compress ? '\n' : '');
          },
          joinSelectors: function (e, t, n) {
            for (var r = 0; r < n.length; r++) this.joinSelector(e, t, n[r]);
          },
          joinSelector: function (t, n, r) {
            var i, s, o, u, a, f, l, c, h, p, d, v, m, g, y;
            for (i = 0; i < r.elements.length; i++)
              (f = r.elements[i]), f.value === '&' && (u = !0);
            if (!u) {
              if (n.length > 0)
                for (i = 0; i < n.length; i++) t.push(n[i].concat(r));
              else t.push([r]);
              return;
            }
            (g = []), (a = [[]]);
            for (i = 0; i < r.elements.length; i++) {
              f = r.elements[i];
              if (f.value !== '&') g.push(f);
              else {
                (y = []), g.length > 0 && this.mergeElementsOnToSelectors(g, a);
                for (s = 0; s < a.length; s++) {
                  l = a[s];
                  if (n.length == 0)
                    l.length > 0 &&
                      ((l[0].elements = l[0].elements.slice(0)),
                      l[0].elements.push(new e.Element(f.combinator, '', 0))),
                      y.push(l);
                  else
                    for (o = 0; o < n.length; o++)
                      (c = n[o]),
                        (h = []),
                        (p = []),
                        (v = !0),
                        l.length > 0
                          ? ((h = l.slice(0)),
                            (m = h.pop()),
                            (d = new e.Selector(m.elements.slice(0))),
                            (v = !1))
                          : (d = new e.Selector([])),
                        c.length > 1 && (p = p.concat(c.slice(1))),
                        c.length > 0 &&
                          ((v = !1),
                          d.elements.push(
                            new e.Element(
                              f.combinator,
                              c[0].elements[0].value,
                              0
                            )
                          ),
                          (d.elements = d.elements.concat(
                            c[0].elements.slice(1)
                          ))),
                        v || h.push(d),
                        (h = h.concat(p)),
                        y.push(h);
                }
                (a = y), (g = []);
              }
            }
            g.length > 0 && this.mergeElementsOnToSelectors(g, a);
            for (i = 0; i < a.length; i++) t.push(a[i]);
          },
          mergeElementsOnToSelectors: function (t, n) {
            var r, i;
            if (n.length == 0) {
              n.push([new e.Selector(t)]);
              return;
            }
            for (r = 0; r < n.length; r++)
              (i = n[r]),
                i.length > 0
                  ? (i[i.length - 1] = new e.Selector(
                      i[i.length - 1].elements.concat(t)
                    ))
                  : i.push(new e.Selector(t));
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Selector = function (e) {
        this.elements = e;
      }),
        (e.Selector.prototype.match = function (e) {
          var t = this.elements,
            n = t.length,
            r,
            i,
            s,
            o;
          (r = e.elements.slice(
            e.elements.length && e.elements[0].value === '&' ? 1 : 0
          )),
            (i = r.length),
            (s = Math.min(n, i));
          if (i === 0 || n < i) return !1;
          for (o = 0; o < s; o++) if (t[o].value !== r[o].value) return !1;
          return !0;
        }),
        (e.Selector.prototype.eval = function (t) {
          return new e.Selector(
            this.elements.map(function (e) {
              return e.eval(t);
            })
          );
        }),
        (e.Selector.prototype.toCSS = function (e) {
          return this._css
            ? this._css
            : (this.elements[0].combinator.value === ''
                ? (this._css = ' ')
                : (this._css = ''),
              (this._css += this.elements
                .map(function (t) {
                  return typeof t == 'string' ? ' ' + t.trim() : t.toCSS(e);
                })
                .join('')),
              this._css);
        });
    })(n('../tree')),
    (function (e) {
      (e.UnicodeDescriptor = function (e) {
        this.value = e;
      }),
        (e.UnicodeDescriptor.prototype = {
          toCSS: function (e) {
            return this.value;
          },
          eval: function () {
            return this;
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.URL = function (e, t) {
        (this.value = e), (this.rootpath = t);
      }),
        (e.URL.prototype = {
          toCSS: function () {
            return 'url(' + this.value.toCSS() + ')';
          },
          eval: function (t) {
            var n = this.value.eval(t),
              r;
            return (
              typeof n.value == 'string' &&
                !/^(?:[a-z-]+:|\/)/.test(n.value) &&
                ((r = this.rootpath),
                n.quote ||
                  (r = r.replace(/[\(\)'"\s]/g, function (e) {
                    return '\\' + e;
                  })),
                (n.value = r + n.value)),
              new e.URL(n, this.rootpath)
            );
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Value = function (e) {
        (this.value = e), (this.is = 'value');
      }),
        (e.Value.prototype = {
          eval: function (t) {
            return this.value.length === 1
              ? this.value[0].eval(t)
              : new e.Value(
                  this.value.map(function (e) {
                    return e.eval(t);
                  })
                );
          },
          toCSS: function (e) {
            return this.value
              .map(function (t) {
                return t.toCSS(e);
              })
              .join(e.compress ? ',' : ', ');
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.Variable = function (e, t, n) {
        (this.name = e), (this.index = t), (this.file = n);
      }),
        (e.Variable.prototype = {
          eval: function (t) {
            var n,
              r,
              i = this.name;
            i.indexOf('@@') == 0 &&
              (i = '@' + new e.Variable(i.slice(1)).eval(t).value);
            if (this.evaluating)
              throw {
                type: 'Name',
                message: 'Recursive variable definition for ' + i,
                filename: this.file,
                index: this.index,
              };
            this.evaluating = !0;
            if (
              (n = e.find(t.frames, function (e) {
                if ((r = e.variable(i))) return r.value.eval(t);
              }))
            )
              return (this.evaluating = !1), n;
            throw {
              type: 'Name',
              message: 'variable ' + i + ' is undefined',
              filename: this.file,
              index: this.index,
            };
          },
        });
    })(n('../tree')),
    (function (e) {
      (e.debugInfo = function (t, n) {
        var r = '';
        if (t.dumpLineNumbers && !t.compress)
          switch (t.dumpLineNumbers) {
            case 'comments':
              r = e.debugInfo.asComment(n);
              break;
            case 'mediaquery':
              r = e.debugInfo.asMediaQuery(n);
              break;
            case 'all':
              r = e.debugInfo.asComment(n) + e.debugInfo.asMediaQuery(n);
          }
        return r;
      }),
        (e.debugInfo.asComment = function (e) {
          return (
            '/* line ' +
            e.debugInfo.lineNumber +
            ', ' +
            e.debugInfo.fileName +
            ' */\n'
          );
        }),
        (e.debugInfo.asMediaQuery = function (e) {
          return (
            '@media -sass-debug-info{filename{font-family:' +
            ('file://' + e.debugInfo.fileName).replace(/[\/:.]/g, '\\$&') +
            '}line{font-family:\\00003' +
            e.debugInfo.lineNumber +
            '}}\n'
          );
        }),
        (e.find = function (e, t) {
          for (var n = 0, r; n < e.length; n++)
            if ((r = t.call(e, e[n]))) return r;
          return null;
        }),
        (e.jsify = function (e) {
          return Array.isArray(e.value) && e.value.length > 1
            ? '[' +
                e.value
                  .map(function (e) {
                    return e.toCSS(!1);
                  })
                  .join(', ') +
                ']'
            : e.toCSS(!1);
        });
    })(n('./tree'));
  var o = /^(file|chrome(-extension)?|resource|qrc|app):/.test(
    location.protocol
  );
  (r.env =
    r.env ||
    (location.hostname == '127.0.0.1' ||
    location.hostname == '0.0.0.0' ||
    location.hostname == 'localhost' ||
    location.port.length > 0 ||
    o
      ? 'development'
      : 'production')),
    (r.async = r.async || !1),
    (r.fileAsync = r.fileAsync || !1),
    (r.poll = r.poll || (o ? 1e3 : 1500));
  if (r.functions)
    for (var u in r.functions) r.tree.functions[u] = r.functions[u];
  var a = /!dumpLineNumbers:(comments|mediaquery|all)/.exec(location.hash);
  a && (r.dumpLineNumbers = a[1]),
    (r.watch = function () {
      return (
        r.watchMode || ((r.env = 'development'), f()), (this.watchMode = !0)
      );
    }),
    (r.unwatch = function () {
      return clearInterval(r.watchTimer), (this.watchMode = !1);
    }),
    /!watch/.test(location.hash) && r.watch();
  var l = null;
  if (r.env != 'development')
    try {
      l = typeof e.localStorage == 'undefined' ? null : e.localStorage;
    } catch (c) {}
  var h = document.getElementsByTagName('link'),
    p = /^text\/(x-)?less$/;
  r.sheets = [];
  for (var d = 0; d < h.length; d++)
    (h[d].rel === 'stylesheet/less' ||
      (h[d].rel.match(/stylesheet/) && h[d].type.match(p))) &&
      r.sheets.push(h[d]);
  var v = '';
  (r.modifyVars = function (e) {
    var t = v;
    for (name in e)
      t +=
        (name.slice(0, 1) === '@' ? '' : '@') +
        name +
        ': ' +
        (e[name].slice(-1) === ';' ? e[name] : e[name] + ';');
    new r.Parser().parse(t, function (e, t) {
      S(t.toCSS(), r.sheets[r.sheets.length - 1]);
    });
  }),
    (r.refresh = function (e) {
      var t, n;
      (t = n = new Date()),
        g(function (e, r, i, s, o) {
          o.local
            ? C('loading ' + s.href + ' from cache.')
            : (C('parsed ' + s.href + ' successfully.'),
              S(r.toCSS(), s, o.lastModified)),
            C('css for ' + s.href + ' generated in ' + (new Date() - n) + 'ms'),
            o.remaining === 0 &&
              C('css generated in ' + (new Date() - t) + 'ms'),
            (n = new Date());
        }, e),
        m();
    }),
    (r.refreshStyles = m),
    r.refresh(r.env === 'development'),
    typeof define == 'function' &&
      define.amd &&
      define('less', [], function () {
        return r;
      });
})(window);
