({
  145: function () {
    var t = this;
    function e(t, e) {
      (null == e || e > t.length) && (e = t.length);
      for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
      return r;
    }
    var n = new Intl.DateTimeFormat("en-us", { month: "long" }),
      r = (new Intl.DateTimeFormat("en-us", { weekday: "long" }), []);
    (r[0] = new Date()), (r[1] = s(r[0], 31));
    var a = 0,
      o = 1;
    function c() {
      var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        e = $("#date-picker"),
        n = r[a],
        c = (function () {
          var t = !1;
          return (
            a !== o &&
              ((r[0].getMonth() === r[1].getMonth() &&
                r[0].getYear() === r[1].getYear()) ||
                (t = !0)),
            t
          );
        })();
      if (!1 !== t || !1 !== c) {
        i(),
          e.contents().remove(),
          e.append(
            '\n    <tr id="date-picker-weekdays">\n      <th>S</th>\n      <th>M</th>\n      <th>T</th>\n      <th>W</th>\n      <th>T</th>\n      <th>F</th>\n      <th>S</th>\n    </tr>'
          );
        var l = n.getDate(),
          d = new Date(n.getFullYear(), n.getMonth(), 1),
          f = d.getDay(),
          v = f,
          g = s(h(d, 1), -1).getDate(),
          m = "<tr class='date-picker-calendar-row'>",
          p = "</tr>",
          y = m;
        if (v > 0) {
          var D = s(d, -1).getDate();
          w(D - v + 1, D, 0, "previous-month");
        }
        w(1, 7 - v, v, !0), (y = m);
        var k = 7;
        w(7 - f + 1, g, k, !0),
          w(1, (k = v + g) % 7 == 0 ? 0 : 7 - (k % 7), k, "next-month"),
          u();
      }
      function w(t, n, r, a) {
        for (var o = !0 === a, c = t; c <= n; c++)
          (r += 1),
            (y +=
              c === l && o
                ? '<td class="active">'.concat(c, "</td>")
                : a && !o
                ? '<td class="'.concat(a, '">').concat(c, "</td>")
                : "<td>".concat(c, "</td>")),
            r % 7 == 0 && (e.append(y + p), (y = m));
      }
    }
    function i() {
      var t = n.format(r[a]) + " " + r[a].getFullYear();
      $("#date-picker-month").text(t);
    }
    function l(t) {
      var e = "Next" === t ? 1 : -1;
      (r[a] = h(r[a], e)), i(), r[a].setDate(1), c(!0);
    }
    function u() {
      $("#date-picker td").click(function () {
        $("#date-picker td").removeClass("active"),
          $(this).addClass("active"),
          (currentDay = $(this).text()),
          (function (t) {
            r[a].setDate(t);
          })(currentDay),
          $(this).hasClass("previous-month")
            ? l("Previous")
            : $(this).hasClass("next-month") && l("Next");
      });
    }
    function s(t, e) {
      var n = new Date(t);
      return n.setDate(n.getDate() + e), n;
    }
    function h(t, e) {
      var n = new Date(t);
      return n.setMonth(n.getMonth() + e), n;
    }
    $(document).ready(function () {
      return c();
    }),
      $(document).ready(function () {
        u(),
          $(".date-picker-date").click(function (e) {
            $(t).hasClass("active")
              ? $(t).removeClass("active")
              : ($(".date-picker-date").removeClass("active"),
                $(t).addClass("active"),
                (o = a),
                (a = 0),
                c());
          }),
          $("#date-picker-next-month").click(function () {
            l("Next");
          }),
          $("#date-picker-previous-month").click(function () {
            l("Previous");
          }),
          $("#reserve-btn").click(function () {
            var t,
              n,
              o = (function (t) {
                var e = t.getFullYear(),
                  n = (1 + t.getMonth()).toString();
                n = n.length > 1 ? n : "0" + n;
                var r = t.getDate().toString();
                return (r = r.length > 1 ? r : "0" + r) + "/" + n + "/" + e;
              })(r[a]),
              c =
                ((t = o.split("/")),
                (n = 3),
                (function (t) {
                  if (Array.isArray(t)) return t;
                })(t) ||
                  (function (t, e) {
                    var n =
                      null == t
                        ? null
                        : ("undefined" != typeof Symbol &&
                            t[Symbol.iterator]) ||
                          t["@@iterator"];
                    if (null != n) {
                      var r,
                        a,
                        o,
                        c,
                        i = [],
                        l = !0,
                        u = !1;
                      try {
                        if (((o = (n = n.call(t)).next), 0 === e)) {
                          if (Object(n) !== n) return;
                          l = !1;
                        } else
                          for (
                            ;
                            !(l = (r = o.call(n)).done) &&
                            (i.push(r.value), i.length !== e);
                            l = !0
                          );
                      } catch (t) {
                        (u = !0), (a = t);
                      } finally {
                        try {
                          if (
                            !l &&
                            null != n.return &&
                            ((c = n.return()), Object(c) !== c)
                          )
                            return;
                        } finally {
                          if (u) throw a;
                        }
                      }
                      return i;
                    }
                  })(t, n) ||
                  (function (t, n) {
                    if (t) {
                      if ("string" == typeof t) return e(t, n);
                      var r = Object.prototype.toString.call(t).slice(8, -1);
                      return (
                        "Object" === r &&
                          t.constructor &&
                          (r = t.constructor.name),
                        "Map" === r || "Set" === r
                          ? Array.from(t)
                          : "Arguments" === r ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                          ? e(t, n)
                          : void 0
                      );
                    }
                  })(t, n) ||
                  (function () {
                    throw new TypeError(
                      "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                  })()),
              i = c[0],
              l = c[1],
              u = c[2],
              s = new Date(u, l - 1, i).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              h =
                "Hello Tours en Bici CDMX! I would schedule to reserve a tour for ".concat(
                  s
                ),
              d = "https://wa.me/"
                .concat("5215583333677", "?text=")
                .concat(encodeURI(h));
            window.open(d, "_blank");
          }),
          $("#reset-btn").click(function () {
            var t = new Date();
            r[a].setDate(t.getDate()),
              r[a].setMonth(t.getMonth()),
              r[a].setFullYear(t.getFullYear()),
              c(!0);
          });
      });
  },
}[145]());
