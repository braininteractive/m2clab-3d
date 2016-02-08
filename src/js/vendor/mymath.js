var Mymath = new function() {
    this.EdgeNumber = 0;
    this.Norm = function(a) {
        var b = 0;
        return b = Math.pow(Math.abs(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]), 0.5)
    };
    this.normalise = function(a) {
        for (var b = this.Norm(a), c = 0; c < a.length; c++) a[c] /= b;
        return a
    };
    this.pointtoVect = function(a, b) {
        return [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    };
    this.verticeToVect = function(a, b) {
        return this.pointtoVect(a.coordinates, b.coordinates)
    };
    this.PointDist = function(a, b) {
        return this.Norm(this.pointtoVect(a, b))
    };
    this.Prodvect = function(a, b) {
        var c = [0, 0, 0];
        c[0] = a[1] *
            b[2] - a[2] * b[1];
        c[1] = a[2] * b[0] - a[0] * b[2];
        c[2] = a[0] * b[1] - a[1] * b[0];
        return c
    };
    this.DotProduct = function(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    };
    this.Angle = function(a, b) {
        var c = this.Norm(this.Prodvect(a, b)) / (this.Norm(a) * this.Norm(b)),
            h = this.DotProduct(a, b) / (this.Norm(a) * this.Norm(b)),
            d = 0;
        1 < c && (c = 1); - 1 > c && (c = -1);
        0 < h && 0 < c ? d = 180 * Math.asin(c) / Math.PI : 0 > h && 0 < c ? d = 180 - 180 * Math.asin(c) / Math.PI : 0 > h && 0 > c ? d = 180 - 180 * Math.asin(c) / Math.PI : 0 < h && 0 > c ? d = 360 + 180 * Math.asin(c) / Math.PI : 0 === h ? 0 < c ? d = 90 : 0 > c && (d = 270) : 0 === c &&
        (0 < h ? d = 0 : 0 > h && (d = 180));
        return d
    };
    this.CreateNormal = function(a, b, c) {
        a = this.Prodvect([c[0] - b[0], c[1] - b[1], c[2] - b[2]], [a[0] - b[0], a[1] - b[1], a[2] - b[2]]);
        b = this.Norm(a);
        a[0] /= b;
        a[1] /= b;
        a[2] /= b;
        return a
    };
    this.Det3 = function(a, b, c) {
        var h = 0;
        return h = a[0] * b[1] * c[2] + b[0] * c[1] * a[2] + c[0] * a[1] * b[2] - a[2] * b[1] * c[0] - a[1] * b[0] * c[2] - a[0] * b[2] * c[1]
    };
    this.Det4 = function(a, b, c, h) {
        var d = [a[0], a[1], a[2]],
            g = [c[0], c[1], c[2]],
            f = [h[0], h[1], h[2]],
            e = [a[0], a[1], a[2]],
            j = [b[0], b[1], b[2]],
            k = [h[0], h[1], h[2]],
            l = [a[0], a[1], a[2]],
            m = [b[0],
                b[1], b[2]
            ],
            r = [c[0], c[1], c[2]];
        return -a[3] * this.Det3([b[0], b[1], b[2]], [c[0], c[1], c[2]], [h[0], h[1], h[2]]) + b[3] * this.Det3(d, g, f) - c[3] * this.Det3(e, j, k) + h[3] * this.Det3(l, m, r)
    };
    this.transpose = function(a) {
        for (var b = a.length, c = a[0].length, h = [], d = 0; d < c; d++) {
            for (var g = [], f = 0; f < b; f++) g.push(a[f][d]);
            h.push(g)
        }
        return h
    };
    this.inverseMatrix3 = function(a) {
        var b = [],
            c = [],
            b = [],
            h = a[0].length;
        if (3 !== a.length || 3 !== h) return consolelog("wrong matrix size"), b;
        if (0 === this.Det3(a[0], a[1], a[2])) return consolelog("the matrix can't be inversed"),
            b;
        b = this.transpose(a);
        c.push([b[1][1] * b[2][2] - b[2][1] * b[1][2], -1 * (b[1][0] * b[2][2] - b[2][0] * b[1][2]), b[1][0] * b[2][1] - b[2][0] * b[1][1]]);
        c.push([-1 * (b[0][1] * b[2][2] - b[2][1] * b[0][2]), b[0][0] * b[2][2] - b[2][0] * b[0][2], -1 * (b[0][0] * b[2][1] - b[2][0] * b[0][1])]);
        c.push([b[0][1] * b[1][2] - b[1][1] * b[0][2], -1 * (b[0][0] * b[1][2] - b[1][0] * b[0][2]), b[0][0] * b[1][1] - b[1][0] * b[0][1]]);
        return c
    };
    this.addOnesColumn = function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var h = [];
            h.push(1);
            for (var d = 0; d < a[0].length; d++) h.push(a[c][d]);
            b.push(h)
        }
        return b
    };
    this.MaxVector = function(a) {
        for (var b = [], c = a.length, h = -Number.MAX_VALUE, d = -1, g = 0; g < c; g++) a[g] >= h && (h = a[g], d = g);
        b.push(d);
        b.push(h);
        return b
    };
    this.MatrixProd = function(a, b) {
        var c = a.length,
            h = b[0].length,
            d = a[0].length,
            g = [];
        if (d != b.length) consolelog("Wrong Matrix Size!!!!");
        else
            for (var f = 0; f < c; f++) {
                for (var e = [], j = 0; j < h; j++) {
                    for (var k = 0, l = 0; l < d; l++) k += a[f][l] * b[l][j];
                    e.push(k)
                }
                g.push(e)
            }
        return g
    };
    this.sigmoid = function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            for (var h = [], d = 0; d < a[0].length; d++) {
                var g = 1 / (1 + Math.exp(a[c][d]));
                h.push(g)
            }
            b.push(h)
        }
        return b
    };
    this.MatrixVectProd = function(a, b) {
        var c = a[0].length,
            h = b.length,
            d = [0, 0, 0];
        if (c !== h) consolelog("Wrong Matrix Size vector!!!!\n p= " + c + " p2= " + h);
        else
            for (h = 0; 3 > h; h++)
                for (var g = 0; g < c; g++) d[h] += a[h][g] * b[g];
        return d
    };
    this.readTrainedNN = function(a) {
        var b = getXhr();
        b.open("POST", "/viewer/Request/T" + a + ".txt", !1);
        b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        b.send(null);
        a = b.responseText.split("\n");
        for (var b = a[3].split(" "), c = parseInt(b[2]), b = a[4].split(" "),
                 h = parseInt(b[2]), d = [], g = 0; g < c; g++) {
            for (var b = a[g + 5].split(" "), f = [], e = 0; e < h; e++) f.push(parseFloat(b[e + 1]));
            d.push(f)
        }
        return d
    };
    this.Matrix4VectProd = function(a, b) {
        var c = a.length,
            h = a[0].length,
            d = b.length,
            g = [0, 0, 0, 0];
        d === h - 1 && (b[d] = 1, d++);
        if (h !== d) consolelog("Wrong Matrix Size vector!!!!\n p= " + h + " p2= " + d);
        else
            for (d = 0; d < c; d++)
                for (var f = 0; f < h; f++) g[d] += a[d][f] * b[f];
        return [g[0], g[1], g[2]]
    };
    this.FacetInsideCube = function(a, b, c, h, d, g, f, e, j) {
        var k = !1;
        if (a[0] >= h && b[0] <= d || a[0] >= h && c[0] <= d || b[0] >= h && a[0] <=
            d || b[0] >= h && c[0] <= d || c[0] >= h && a[0] <= d || c[0] >= h && b[0] <= d)
            if (a[1] >= g && b[1] <= f || a[1] >= g && c[1] <= f || b[1] >= g && a[1] <= f || b[1] >= g && c[1] <= f || c[1] >= g && b[1] <= f || c[1] >= g && a[1] <= f)
                if (a[2] >= e && b[2] <= j || a[2] >= e && c[2] <= j || b[2] >= e && a[2] <= j || b[2] >= e && c[2] <= j || c[2] >= e && b[2] <= j || c[2] >= e && a[2] <= j) k = !0;
        return k
    };
    this.InsideTriangle2 = function(a, b, c, h) {
        var d = !1,
            g = [],
            f = [],
            e = [],
            j = [];
        g[0] = a[0];
        g[1] = a[1];
        f[0] = b[0];
        f[1] = b[1];
        e[0] = c[0];
        j[1] = h[1];
        a = [];
        a[0] = f[0] - g[0];
        a[1] = f[1] - g[1];
        b = [];
        b[0] = e[0] - f[0];
        b[1] = e[1] - f[1];
        c = [];
        c[0] = g[0] -
            e[0];
        c[1] = g[1] - e[1];
        h = -a[1] * g[0] - a[0] * g[1];
        var k = -b[1] * f[0] - b[0] * f[1],
            l = -c[1] * e[0] - c[0] * e[1];
        0 <= (a[1] * j[0] + a[0] * j[1] + h) * (a[1] * e[0] + a[0] * e[1] + h) && 0 <= (b[1] * j[0] + b[0] * j[1] + k) * (b[1] * g[0] + b[0] * g[1] + k) && 0 <= (c[1] * j[0] + c[0] * j[1] + l) * (c[1] * f[0] + c[0] * f[1] + l) && (d = !0);
        return d
    };
    this.inthemiddle = function(a, b, c) {
        return b < c ? a >= b && a <= c ? !0 : !1 : a <= b && a >= c ? !0 : !1
    };
    this.addVect = function(a, b) {
        for (var c = [], h = 0; h < a.length; h++) c[h] = a[h] + b[h];
        return c
    };
    this.multiplyScalar = function(a, b) {
        for (var c = [], h = 0; h < a.length; h++) c[h] = b *
            a[h];
        return c
    };
    this.pointInFace3 = function(a, b, c, h) {
        h = this.pointtoVect(b, h);
        c = this.pointtoVect(b, c);
        var d = this.pointtoVect(b, a);
        a = this.DotProduct(h, h);
        b = this.DotProduct(h, c);
        h = this.DotProduct(h, d);
        var g = this.DotProduct(c, c);
        c = this.DotProduct(c, d);
        d = 1 / (a * g - b * b);
        g = (g * h - b * c) * d;
        a = (a * c - b * h) * d;
        return 0 <= g && 0 <= a && 1 > g + a
    }
};

module.exports = Mymath;