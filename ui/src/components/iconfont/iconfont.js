!(function(h) {
  var l,
    a,
    v,
    p,
    t,
    F,
    z =
    i = (i = document.getElementsByTagName("script"))[
      i.length - 1
    ].getAttribute("data-injectcss");
  if (i && !h.__iconfont__svg__cssinject__) {
    h.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (h) {
      console && console.log(h);
    }
  }
  function M() {
    t || ((t = !0), v());
  }
  (l = function() {
    var h, l, a;
    ((a = document.createElement("div")).innerHTML = z),
      (z = null),
      (l = a.getElementsByTagName("svg")[0]) &&
        (l.setAttribute("aria-hidden", "true"),
        (l.style.position = "absolute"),
        (l.style.width = 0),
        (l.style.height = 0),
        (l.style.overflow = "hidden"),
        (h = l),
        (a = document.body).firstChild
          ? (l = a.firstChild).parentNode.insertBefore(h, l)
          : a.appendChild(h));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(l, 0)
        : ((a = function() {
            document.removeEventListener("DOMContentLoaded", a, !1), l();
          }),
          document.addEventListener("DOMContentLoaded", a, !1))
      : document.attachEvent &&
        ((v = l),
        (p = h.document),
        (t = !1),
        (F = function() {
          try {
            p.documentElement.doScroll("left");
          } catch (h) {
            return void setTimeout(F, 50);
          }
          M();
        })(),
        (p.onreadystatechange = function() {
          "complete" == p.readyState && ((p.onreadystatechange = null), M());
        }));
})(window);