function getXhr() {
    return new XMLHttpRequest
}

function contains(a, b) {
    for (var c = 0; c < a.length; c++)
        if (a[c] === b) return !0;
    return !1
}
Array.prototype.contains = function(a) {
    for (var b = this.length; b--;)
        if (this[b] === a) return !0;
    return !1
};
BinaryReader = function(a) {
    this._buffer = a;
    this._pos = 0
};
BinaryReader.prototype = {
    readInt8: function() {
        return this._decodeInt(8, !0)
    },
    readUInt8: function() {
        return this._decodeInt(8, !1)
    },
    readInt16: function() {
        return this._decodeInt(16, !0)
    },
    readUInt16: function() {
        return this._decodeInt(16, !1)
    },
    readInt32: function() {
        return this._decodeInt(32, !0)
    },
    readUInt32: function() {
        return this._decodeInt(32, !1)
    },
    readFloat: function() {
        return this._decodeFloat(23, 8)
    },
    readDouble: function() {
        return this._decodeFloat(52, 11)
    },
    readChar: function() {
        return this.readString(1)
    },
    readString: function(a) {
        this._checkSize(8 *
            a);
        var b = this._buffer.substr(this._pos, a);
        this._pos += a;
        return b
    },
    seek: function(a) {
        this._pos = a;
        this._checkSize(0)
    },
    getPosition: function() {
        return this._pos
    },
    getSize: function() {
        return this._buffer.length
    },
    _decodeFloat: function(a, b) {
        var c = a + b + 1,
            h = c >> 3;
        this._checkSize(c);
        var c = Math.pow(2, b - 1) - 1,
            d = this._readBits(a + b, 1, h),
            g = this._readBits(a, b, h),
            f = 0,
            e = 2,
            j = 0;
        do
            for (var k = this._readByte(++j, h), l = a % 8 || 8, m = 1 << l; m >>= 1;) k & m && (f += 1 / e), e *= 2; while (a -= l);
        this._pos += h;
        return g == (c << 1) + 1 ? f ? NaN : d ? -Infinity : Infinity :
        (1 + -2 * d) * (g || f ? !g ? Math.pow(2, -c + 1) * f : Math.pow(2, g - c) * (1 + f) : 0)
    },
    _decodeInt: function(a, b) {
        var c = this._readBits(0, a, a / 8),
            h = Math.pow(2, a);
        this._pos += a / 8;
        return b && c >= h / 2 ? c - h : c
    },
    _shl: function(a, b) {
        for (++b; --b; a = 1073741824 == ((a %= 2147483648) & 1073741824) ? 2 * a : 2 * (a - 1073741824) + 2147483648);
        return a
    },
    _readByte: function(a, b) {
        return this._buffer.charCodeAt(this._pos + b - a - 1) & 255
    },
    _readBits: function(a, b, c) {
        var h = (a + b) % 8,
            d = a % 8,
            g = c - (a >> 3) - 1;
        a = c + (-(a + b) >> 3);
        var f = g - a;
        b = this._readByte(g, c) >> d & (1 << (f ? 8 - d : b)) - 1;
        for (f &&
             h && (b += (this._readByte(a++, c) & (1 << h) - 1) << (f-- << 3) - d); f;) b += this._shl(this._readByte(a++, c), (f-- << 3) - d);
        return b
    },
    _checkSize: function(a) {
        if (!(this._pos + Math.ceil(a / 8) < this._buffer.length)) throw Error("Index out of bound");
    }
};
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

function Cube(a, b, c, h) {
    this.x = b;
    this.y = c;
    this.z = h;
    this.facets = [];
    this.Vertices = []
}

function Vertex(a, b, c) {
    this.coordinates = [a, b, c];
    this.cube;
    this.facets = [];
    this.number = 0;
    this.Edges = [];
    this.x = a;
    this.y = b;
    this.z = c;
    this.Init = function() {
        this.facets = []
    };
    this.isEqual = function(h, c, a) {
        var b = !1;
        this.coordinates[0] === h && (this.coordinates[1] === c && this.coordinates[2] === a) && (b = !0);
        return b
    };
    this.isSame = function(h) {
        var c = !1;
        this.coordinates[0] === h.coordinates[0] && (this.coordinates[1] === h.coordinates[1] && this.coordinates[2] === h.coordinates[2]) && (c = !0);
        return c
    };
    this.toJSON = function() {
        return {
            coordinates: this.coordinates,
            number: this.number
        }
    }
}

function Facet(a, b, c) {
    this.number = 0;
    this.vertices = [a, b, c];
    this.normal = [];
    this.area = 0;
    this.cubes = [];
    this.biggerCube = [];
    this.center = [];
    this.xmin = Number.MAX_VALUE;
    this.xmax = -Number.MAX_VALUE;
    this.ymin = Number.MAX_VALUE;
    this.ymax = -Number.MAX_VALUE;
    this.zmin = Number.MAX_VALUE;
    this.zmax = -Number.MAX_VALUE;
    this.BelongToSurface = null;
    this.Supported = !1;
    this.contactFacets = [];
    this.Edges = [];
    this.distChecked = this.thinWall = this.facing = !1;
    this.lines = {};
    this.setNormal = function(c) {
        this.normal = c
    };
    this.GenerateNormal = function() {
        return this.normal =
            Mymath.CreateNormal(this.vertices[0].coordinates, this.vertices[1].coordinates, this.vertices[2].coordinates)
    };
    this.minmax = function() {
        this.xmin = Number.MAX_VALUE;
        this.xmax = -Number.MAX_VALUE;
        this.ymin = Number.MAX_VALUE;
        this.ymax = -Number.MAX_VALUE;
        this.zmin = Number.MAX_VALUE;
        this.zmax = -Number.MAX_VALUE;
        for (var c = 0; 3 > c; c++) this.xmin = this.vertices[c].coordinates[0] < this.xmin ? this.vertices[c].coordinates[0] : this.xmin, this.xmax = this.vertices[c].coordinates[0] > this.xmax ? this.vertices[c].coordinates[0] : this.xmax,
            this.ymin = this.vertices[c].coordinates[1] < this.ymin ? this.vertices[c].coordinates[1] : this.ymin, this.ymax = this.vertices[c].coordinates[1] > this.ymax ? this.vertices[c].coordinates[1] : this.ymax, this.zmin = this.vertices[c].coordinates[2] < this.zmin ? this.vertices[c].coordinates[2] : this.zmin, this.zmax = this.vertices[c].coordinates[2] > this.zmax ? this.vertices[c].coordinates[2] : this.zmax
    };
    this.calculateCenter = function() {
        this.center = [0, 0, 0];
        for (var c = 0; 3 > c; c++) this.center[0] += this.vertices[c].coordinates[0] / 3, this.center[1] +=
            this.vertices[c].coordinates[1] / 3, this.center[2] += this.vertices[c].coordinates[2] / 3;
        return this.center
    };
    this.CalculateArea = function() {
        var c = 0,
            c = Mymath.pointtoVect(this.vertices[1].coordinates, this.vertices[0].coordinates),
            a = Mymath.pointtoVect(this.vertices[2].coordinates, this.vertices[0].coordinates);
        return this.area = c = 0.5 * Mymath.Norm(Mymath.Prodvect(c, a))
    };
    this.Angle = function(c) {
        return this.AngleVector(c.GenerateNormal())
    };
    this.AngleVector = function(c) {
        return Math.abs(Mymath.Angle(c, this.GenerateNormal()))
    };
    this.shareSide = function(c) {
        var a = !1,
            b = [],
            f = 0,
            e = 0,
            j = 0,
            k = 0;
        this !== c && this.vertices[0].isSame(c.vertices[0]) && this.vertices[1].isSame(c.vertices[1]) ? (a = !0, f = 1, e = 2, j = 1, k = 2) : this !== c && this.vertices[0].isSame(c.vertices[0]) && this.vertices[2].isSame(c.vertices[1]) ? (a = !0, f = 1, e = 3, j = 1, k = 2) : this !== c && this.vertices[2].isSame(c.vertices[0]) && this.vertices[1].isSame(c.vertices[1]) ? (a = !0, f = 3, e = 2, j = 1, k = 2) : this !== c && this.vertices[2].isSame(c.vertices[0]) && this.vertices[0].isSame(c.vertices[1]) ? (a = !0, f = 3, j = e = 1, k = 2) :
            this !== c && this.vertices[1].isSame(c.vertices[0]) && this.vertices[2].isSame(c.vertices[1]) ? (a = !0, f = 2, e = 3, j = 1, k = 2) : this !== c && this.vertices[1].isSame(c.vertices[0]) && this.vertices[0].isSame(c.vertices[1]) ? (a = !0, f = 2, j = e = 1, k = 2) : this !== c && this.vertices[0].isSame(c.vertices[0]) && this.vertices[1].isSame(c.vertices[2]) ? (a = !0, f = 1, e = 2, j = 1, k = 3) : this !== c && this.vertices[0].isSame(c.vertices[0]) && this.vertices[2].isSame(c.vertices[2]) ? (a = !0, f = 1, e = 3, j = 1, k = 3) : this !== c && this.vertices[2].isSame(c.vertices[0]) && this.vertices[1].isSame(c.vertices[2]) ?
                (a = !0, f = 3, e = 2, j = 1, k = 3) : this !== c && this.vertices[2].isSame(c.vertices[0]) && this.vertices[0].isSame(c.vertices[2]) ? (a = !0, f = 3, j = e = 1, k = 3) : this !== c && this.vertices[1].isSame(c.vertices[0]) && this.vertices[2].isSame(c.vertices[2]) ? (a = !0, f = 2, e = 3, j = 1, k = 3) : this !== c && this.vertices[1].isSame(c.vertices[0]) && this.vertices[0].isSame(c.vertices[2]) ? (a = !0, f = 2, j = e = 1, k = 3) : this !== c && this.vertices[0].isSame(c.vertices[2]) && this.vertices[1].isSame(c.vertices[1]) ? (a = !0, f = 1, e = 2, j = 3, k = 2) : this !== c && this.vertices[0].isSame(c.vertices[2]) &&
            this.vertices[2].isSame(c.vertices[1]) ? (a = !0, f = 1, j = e = 3, k = 2) : this !== c && this.vertices[2].isSame(c.vertices[2]) && this.vertices[1].isSame(c.vertices[1]) ? (a = !0, f = 3, e = 2, j = 3, k = 2) : this !== c && this.vertices[2].isSame(c.vertices[2]) && this.vertices[0].isSame(c.vertices[1]) ? (a = !0, f = 3, e = 1, j = 3, k = 2) : this !== c && this.vertices[1].isSame(c.vertices[2]) && this.vertices[2].isSame(c.vertices[1]) ? (a = !0, f = 2, j = e = 3, k = 2) : this !== c && (this.vertices[1].isSame(c.vertices[2]) && this.vertices[0].isSame(c.vertices[1])) && (a = !0, f = 2, e = 1, j =
                3, k = 2);
        b.push(a);
        b.push(f);
        b.push(e);
        b.push(j);
        b.push(k);
        return b
    };
    this.toJSON = function() {
        return {
            vertices: this.vertices,
            normal: this.normal,
            number: this.number,
            facing: this.facing,
            thinWall: this.thinWall,
            zmin: this.zmin,
            zmax: this.zmax
        }
    };
    this.slice = function() {};
    this.CalculateArea()
}

function Edge(a, b, c, h) {
    this.Vertex = [a, b];
    this.Facets = [c, h];
    this.length = Mymath.PointDist(a.coordinates, b.coordinates);
    this.SurfacesList = [];
    this.number = Mymath.EdgeNumber;
    Mymath.EdgeNumber++;
    this.setFacets = function(c, a) {
        this.Facets = [c, a]
    };
    this.toJSON = function() {
        return {
            number: this.number,
            length: this.length,
            Vertex: this.Vertex
        }
    }
}

function Surface() {
    this.nbfacet = 0;
    this.Vertex = [];
    this.Normals = [];
    this.contour = [];
    this.Area = 0;
    this.Facets = [];
    this.VertexUnique = [];
    this.Edges = [];
    this.S = [];
    this.buildable = !0;
    this.NeedSupport = !1;
    this.NormalSomme = null;
    this.type = 0;
    this.K = [];
    this.Kmax = -Number.MAX_VALUE;
    this.Kmin = Number.MAX_VALUE;
    this.GaussCurvS = null;
    this.H = [];
    this.Hmax = -Number.MAX_VALUE;
    this.Hmin = Number.MAX_VALUE;
    this.MeanCurvS = null;
    this.X = [];
    this.toJSON = function() {
        return {
            buildable: this.buildable,
            NeedSupport: this.NeedSupport,
            contour: this.contour,
            X: this.X,
            K: this.K,
            Kmax: this.Kmax,
            Kmin: this.Kmin,
            H: this.H,
            Hmax: this.Hmax,
            Hmin: this.Hmin,
            type: this.type,
            MeanCurvS: this.MeanCurvS,
            GaussCurvS: this.GaussCurvS,
            NormalSomme: this.NormalSomme,
            Facets: this.Facets,
            Area: this.Area,
            Vertex: this.Vertex,
            Normals: this.Normals,
            nbfacet: this.Normals.length
        }
    };
    this.addContourLine = function(a, b) {
        this.contour.push([a, b])
    };
    this.calculateBoundingBox = function() {
        this.xmin = Number.MAX_VALUE;
        this.xmax = -Number.MAX_VALUE;
        this.ymin = Number.MAX_VALUE;
        this.ymax = -Number.MAX_VALUE;
        this.zmin =
            Number.MAX_VALUE;
        this.zmax = -Number.MAX_VALUE;
        for (var a = 1; a <= 3 * this.Normals.length; a++) this.xmin = this.Vertex[a - 1][0] > this.xmin ? this.xmin : this.Vertex[a - 1][0], this.xmax = this.Vertex[a - 1][0] < this.xmax ? this.xmax : this.Vertex[a - 1][0], this.ymin = this.Vertex[a - 1][1] > this.ymin ? this.ymin : this.Vertex[a - 1][1], this.ymax = this.Vertex[a - 1][1] < this.ymax ? this.ymax : this.Vertex[a - 1][1], this.zmin = this.Vertex[a - 1][2] > this.zmin ? this.zmin : this.Vertex[a - 1][2], this.zmax = this.Vertex[a - 1][0] < this.zmax ? this.zmax : this.Vertex[a - 1][2]
    };
    this.sortVertice = function() {
        if (void 0 === this.VerticeSorted) {
            for (var a = [], b = 0; b < this.VertexUnique.length; b++) {
                for (var c = !0, h = 0; h < a.length; h++) a[h] === this.VertexUnique[b] && (c = !1);
                c && a.push(this.VertexUnique[b])
            }
            this.VertexUnique = a;
            this.VerticeSorted = !0
        }
    };
    this.calculateArea = function() {
        this.Area = 0;
        var a = [],
            b = [];
        this.S = [];
        for (var c = 1; c <= this.Normals.length; c++) a[0] = this.Vertex[3 * c - 2][0] - this.Vertex[3 * c - 3][0], a[1] = this.Vertex[3 * c - 2][1] - this.Vertex[3 * c - 3][1], a[2] = this.Vertex[3 * c - 2][2] - this.Vertex[3 * c - 3][2],
            b[0] = this.Vertex[3 * c - 1][0] - this.Vertex[3 * c - 3][0], b[1] = this.Vertex[3 * c - 1][1] - this.Vertex[3 * c - 3][1], b[2] = this.Vertex[3 * c - 1][2] - this.Vertex[3 * c - 3][2], this.S.push(0.5 * Mymath.Norm(Mymath.Prodvect(a, b))), this.Area += this.S[c - 1];
        return this.Area
    };
    this.GaussCurvature = function() {
        this.Kmax = -Number.MAX_VALUE;
        this.Kmin = Number.MAX_VALUE;
        this.K = [];
        this.Euler = 0;
        this.sortVertice();
        for (var a = 0; a < this.VertexUnique.length; a++) {
            for (var b = this.VertexUnique[a], c = 0, h = 0, d = 0; d < b.facets.length; d++) {
                var g = b.facets[d];
                if (this ===
                    g.BelongToSurface) {
                    var f = 0;
                    b === g.vertices[0] ? f = Math.abs(Mymath.Angle(Mymath.pointtoVect(g.vertices[0].coordinates, g.vertices[1].coordinates), Mymath.pointtoVect(g.vertices[0].coordinates, g.vertices[2].coordinates))) : b === g.vertices[1] ? f = Math.abs(Mymath.Angle(Mymath.pointtoVect(g.vertices[1].coordinates, g.vertices[0].coordinates), Mymath.pointtoVect(g.vertices[1].coordinates, g.vertices[2].coordinates))) : b === g.vertices[2] ? f = Math.abs(Mymath.Angle(Mymath.pointtoVect(g.vertices[2].coordinates, g.vertices[0].coordinates),
                        Mymath.pointtoVect(g.vertices[2].coordinates, g.vertices[1].coordinates))) : consolelog("should never happen");
                    f = f * Math.PI / 180;
                    c += f;
                    h += g.CalculateArea()
                }
            }
            b = 3 * (2 * Math.PI - c) / h;
            1E-6 > b && -1E-6 < b && (b = 0);
            this.K.push(b);
            this.Kmax = this.K[a] >= this.Kmax ? this.K[a] : this.Kmax;
            this.Kmin = this.K[a] <= this.Kmin ? this.K[a] : this.Kmin;
            this.Euler += this.K[a]
        }
        this.Euler /= 2 * Math.PI
    };
    this.GaussCurvStats = function() {
        var a = {
                median: 0,
                min: 0,
                max: 0,
                Dev: 0
            },
            b = this.K.slice(0);
        b.sort(function(c, a) {
            return c - a
        });
        var c;
        c = 1 === b.length % 2 ? b[(b.length +
        1) / 2] : 0.5 * (b[b.length / 2] + b[b.length / 2 + 1]);
        a.median = c;
        a.min = b[0];
        a.max = b[b.length - 1];
        for (var h = Math.round(b.length - 0.1 * b.length), d = Math.round(0.1 * b.length), g = 0, f = d; f < h; f++) g += Math.pow(b[f] - c, 2);
        g = Math.pow(g / (h - d), 0.5);
        a.Dev = g;
        return this.GaussCurvS = a
    };
    this.calculateCenter = function() {
        for (var a = [0, 0, 0], b = 0; b < this.VertexUnique.length; b++) a[0] += this.VertexUnique[b].coordinates[0] / this.VertexUnique.length, a[1] += this.VertexUnique[b].coordinates[1] / this.VertexUnique.length, a[2] += this.VertexUnique[b].coordinates[2] /
            this.VertexUnique.length;
        return a
    };
    this.testMove = function() {
        var a = [0, 1];
        this.calculateBoundingBox();
        for (var b = (this.xmax - this.xmin + (this.ymax - this.ymin) + (this.zmax - this.zmin)) / 3, c = this.calculateCenter(), h, d, g, f = 0; f < this.Facets.length; f++) {
            h = this.Facets[f].vertices[0].coordinates.slice(0);
            d = this.Facets[f].vertices[1].coordinates.slice(0);
            g = this.Facets[f].vertices[2].coordinates.slice(0);
            var e = this.Facets[f].GenerateNormal().slice(0);
            e[0] /= b;
            e[1] /= b;
            e[2] /= b;
            h[0] += e[0];
            h[1] += e[1];
            h[2] += e[2];
            d[0] += e[0];
            d[1] += e[1];
            d[2] += e[2];
            g[0] += e[0];
            g[1] += e[1];
            g[2] += e[2];
            h = Mymath.PointDist(h, c) < Mymath.PointDist(this.Facets[f].vertices[0].coordinates, c) ? !0 : !1;
            d = Mymath.PointDist(d, c) < Mymath.PointDist(this.Facets[f].vertices[1].coordinates, c) ? !0 : !1;
            g = Mymath.PointDist(g, c) < Mymath.PointDist(this.Facets[f].vertices[2].coordinates, c) ? !0 : !1;
            h && a[0]++;
            d && a[0]++;
            g && a[0]++;
            a[1] += 3
        }
        return a[0] / a[1]
    };
    this.MeanCurvature = function() {
        this.H = [];
        this.sortVertice();
        this.testMove();
        this.Hmax = -Number.MAX_VALUE;
        this.Hmin = Number.MAX_VALUE;
        for (var a = 0; a < this.VertexUnique.length; a++) {
            for (var b = this.VertexUnique[a], c = 0, h = this.H[a] = 0; h < b.Edges.length; h++) {
                var d = b.Edges[h];
                if (d.SurfacesList.contains(this)) {
                    var g = d.Facets[0],
                        f = d.Facets[1];
                    if (this.Facets.contains(g) && this.Facets.contains(f)) {
                        var e = 0,
                            j = 0,
                            j = d.Vertex[0] === b ? d.Vertex[1] : d.Vertex[0],
                            e = g.vertices[0] != b && g.vertices[0] != j ? g.vertices[0] : g.vertices[1] != b && g.vertices[1] != j ? g.vertices[1] : g.vertices[2],
                            k;
                        k = f.vertices[0] != b && f.vertices[0] != j ? f.vertices[0] : f.vertices[1] != b && f.vertices[1] !=
                        j ? f.vertices[1] : f.vertices[2];
                        e = Math.PI / 180 * Mymath.Angle(Mymath.verticeToVect(b, e), Mymath.verticeToVect(j, e));
                        j = Math.PI / 180 * Mymath.Angle(Mymath.verticeToVect(b, k), Mymath.verticeToVect(j, k));
                        this.H[a] += 0.5 * (1 / Math.tan(e) + 1 / Math.tan(j)) * d.length;
                        c += 0.5 * (g.CalculateArea() + f.CalculateArea())
                    }
                }
            }
            0 === c && (c = 1);
            this.H[a] /= -4 * c;
            this.Hmax = this.H[a] >= this.Hmax ? this.H[a] : this.Hmax;
            this.Hmin = this.H[a] <= this.Hmin ? this.H[a] : this.Hmin
        }
    };
    this.MeanCurvStats = function() {
        var a = {
                median: 0,
                min: 0,
                max: 0,
                Dev: 0
            },
            b = this.H.slice(0);
        b.sort(function(c, a) {
            return c - a
        });
        var c;
        c = 1 === b.length % 2 ? b[(b.length + 1) / 2] : 0.5 * (b[b.length / 2] + b[b.length / 2 + 1]);
        a.median = c;
        a.min = b[0];
        a.max = b[b.length - 1];
        for (var h = Math.round(b.length - 0.1 * b.length), d = Math.round(0.1 * b.length), g = 0, f = d; f < h; f++) g += Math.pow(b[f] - c, 2);
        g = Math.pow(g / (h - d), 0.5);
        a.Dev = g;
        return this.MeanCurvS = a
    };
    this.NormalCurvature = function() {
        this.VertexNormal = [];
        this.normalCurv = [];
        this.sortVertice();
        for (var a = 0; a < this.VertexUnique.length; a++) {
            var b = this.VertexUnique[a],
                c = 0;
            this.VertexNormal[a] = [];
            this.VertexNormal[a].push(0);
            this.VertexNormal[a].push(0);
            this.VertexNormal[a].push(0);
            for (c = 0; c < b.facets.length; c++) {
                var h = b.facets[c];
                h.BelongToSurface === this && (this.VertexNormal[a][0] += h.CalculateArea() * h.GenerateNormal()[0], this.VertexNormal[a][1] += h.area * h.normal[1], this.VertexNormal[a][2] += h.area * h.normal[2])
            }
            c = Mymath.Norm(this.VertexNormal[a]);
            this.VertexNormal[a][0] /= c;
            this.VertexNormal[a][1] /= c;
            this.VertexNormal[a][2] /= c;
            for (var d = 0, c = 0; c < b.facets.length; c++) h = b.facets[c], h.BelongToSurface ===
            this && (h = Math.PI / 180 * Mymath.Angle(h.normal, this.VertexNormal[a]), d += h * h);
            this.normalCurv[a] = Math.pow(d / b.facets.length, 0.5)
        }
    };
    this.sortContour = function() {
        var a = [],
            b = this.contour,
            c = [],
            h = 0,
            d = 1;
        a.push(b[0][0]);
        var g = !0,
            f = !0,
            e, j;
        for (this.groupsize = []; f;) {
            for (f = !1; g;) {
                g = !1;
                e = b[h][d];
                a.push(e);
                c[h] = !0;
                for (var k = 0; k < b.length; k++) j = b[k], k != h && !0 != c[k] && e.coordinates[0] == j[0].coordinates[0] && e.coordinates[1] == j[0].coordinates[1] && e.coordinates[2] == j[0].coordinates[2] ? (h = k, d = 1, g = c[k] = !0) : k != h && (!0 != c[k] && e.coordinates[0] ==
                j[1].coordinates[0] && e.coordinates[1] == j[1].coordinates[1] && e.coordinates[2] == j[1].coordinates[2]) && (h = k, d = 0, g = c[k] = !0)
            }
            for (k = 0; k < c.length; k++) !0 != c[k] && (h = k, this.groupsize.push(a.length), d = 0, g = f = !0, k = c.length, e = b[h][d], a.push(e), d = 1);
            f || this.groupsize.push(a.length)
        }
        this.ContourSorted = a
    };
    this.findAxis2 = function() {
        var a = [],
            b = !1,
            c = [0, 0, 0],
            h = 0;
        if (1 < this.groupsize.length)
            for (var d = 0; d < this.groupsize.length; d++)
                for (var g = d + 1; g < this.groupsize.length; g++) {
                    var f = [0, 0, 0],
                        e = [0, 0, 0];
                    if (0 < d)
                        for (b = this.groupsize[d -
                        1]; b < this.groupsize[d]; b++) f[1] += this.ContourSorted[b].coordinates[1] / (this.groupsize[d] - this.groupsize[d - 1]), f[2] += this.ContourSorted[b].coordinates[2] / (this.groupsize[d] - this.groupsize[d - 1]);
                    else
                        for (b = 0; b < this.groupsize[d]; b++) f[0] += this.ContourSorted[b].coordinates[0] / this.groupsize[d], f[1] += this.ContourSorted[b].coordinates[1] / this.groupsize[d], f[2] += this.ContourSorted[b].coordinates[2] / this.groupsize[d];
                    for (b = this.groupsize[g - 1]; b < this.groupsize[g]; b++) e[0] += this.ContourSorted[b].coordinates[0] /
                        (this.groupsize[g] - this.groupsize[g - 1]), e[1] += this.ContourSorted[b].coordinates[1] / (this.groupsize[g] - this.groupsize[g - 1]), e[2] += this.ContourSorted[b].coordinates[2] / (this.groupsize[g] - this.groupsize[g - 1]);
                    c[0] = e[0] - f[0];
                    c[1] = e[1] - f[1];
                    c[2] = e[2] - f[2];
                    b = !0;
                    d = g = this.groupsize.length;
                    h += Mymath.PointDist(f, e)
                } else c[2] = 0;
        g = [0, 0, 0];
        for (d = 0; d < this.VertexUnique.length; d++) g[0] += this.VertexUnique[d].coordinates[0], g[1] += this.VertexUnique[d].coordinates[1], g[2] += this.VertexUnique[d].coordinates[2];
        g[0] /= this.VertexUnique.length;
        g[1] /= this.VertexUnique.length;
        g[2] /= this.VertexUnique.length;
        a.push(b);
        a.push(g);
        a.push(c);
        a.push(h);
        return a
    };
    this.getGeometrieData = function() {
        this.buildable = !0;
        if (2 == this.type || 3 == this.type) this.type = 0.5 > this.testMove() ? 3 : 2;
        if (2 == this.type) {
            this.sortContour();
            var a = this.findAxis2();
            if (a[0]) {
                for (var b = a[1], c = a[2], h = 0, d = 0; d < this.VertexUnique.length; d++) var g = this.VertexUnique[d].coordinates,
                    g = Mymath.Prodvect(Mymath.pointtoVect(b, g), c),
                    h = h + Mymath.Norm(g) / Mymath.Norm(c);
                h /= this.VertexUnique.length;
                a = 2 * h / a[3];
                2 * h <= StlFile.Features.minimumCylinderDiameter ? this.buildable = !1 : a <= StlFile.Features.AspectRatioCylinder && (this.buildable = !1)
            } else this.type = 0
        } else if (3 == this.type)
            if (this.sortContour(), a = this.findAxis2(), a[0]) {
                b = a[1];
                c = a[2];
                for (d = h = 0; d < this.VertexUnique.length; d++) g = this.VertexUnique[d].coordinates, h += Mymath.Norm(Mymath.Prodvect(Mymath.pointtoVect(b, g), c)) / Mymath.Norm(c);
                h /= this.VertexUnique.length;
                a = Mymath.Angle([0, 0, 1], c);
                45 >= a || 135 <= a ? 2 * h <= StlFile.Features.minimumHoleDiameterVertical &&
                (this.buildable = !1) : 2 * h <= StlFile.Features.minimumHoleDiameterHorizontal ? this.buildable = !1 : 2 * h > StlFile.Features.maxDiameterWithoutSupport && (this.NeedSupport = !0)
            } else this.type = 0
    }
}
var StlFile = new function() {
    this.name = "";
    this.machine = {
        width: 0,
        height: 0,
        length: 0
    };
    this.BuildTime = 0;
    this.BuildTimes = {
        prebuild: 0,
        layertime: 0,
        finishtime: 0
    };
    this.Features = {
        minimumWallThickness: 0,
        minimumFacingDistance: 0,
        minimumCylinderDiameter: 0,
        AspectRatioCylinder: 0,
        AspectRatioWall: 0,
        minimumHoleDiameterHorizontal: 0,
        minimumHoleDiameterVertical: 0,
        maxDiameterWithoutSupport: 0,
        hasData: !1
    };
    this.Cost = 0;
    this.Costs = {};
    this.slices = {};
    this.nickname = "";
    this.vertex = [];
    this.facets = [];
    this.VertexUnique = [];
    this.normal = [];
    this.Cubes = [];
    this.biggerCube = [];
    this.closeList = [];
    this.facingList = [];
    this.nbfacet = 0;
    this.xmin = Number.MAX_VALUE;
    this.xmax = -Number.MAX_VALUE;
    this.ymin = Number.MAX_VALUE;
    this.ymax = -Number.MAX_VALUE;
    this.zmin = Number.MAX_VALUE;
    this.zmax = -Number.MAX_VALUE;
    this.Rmax = 0;
    this.Rmin = Number.MAX_VALUE;
    this.isSeparated = this.isCut = !1;
    this.SupportArea = this.SupportVol = this.Volume = 0;
    this.V = [];
    this.Area = 0;
    this.S = [];
    this.R = [];
    this.totalRoughness = 0;
    this.Support = [];
    this.SupportHeight = this.SupportArea = this.SupportVol =
        0;
    this.SupportData = [];
    this.EdgesList = [];
    this.SurfaceList = [];
    this.scenario = 0;
    this.centroid = [0, 0, 0];
    this.LayerThickness = 0;
    var a = this;
    this.New = function() {
        this.name = "";
        this.machine = {
            width: 0,
            height: 0,
            length: 0
        };
        this.vertex = [];
        this.facets = [];
        this.VertexUnique = [];
        this.normal = [];
        this.Cubes = [];
        this.biggerCube = [];
        this.closeList = [];
        this.facingList = [];
        this.nbfacet = 0;
        this.xmin = Number.MAX_VALUE;
        this.xmax = -Number.MAX_VALUE;
        this.ymin = Number.MAX_VALUE;
        this.ymax = -Number.MAX_VALUE;
        this.zmin = Number.MAX_VALUE;
        this.zmax = -Number.MAX_VALUE;
        this.Rmax = 0;
        this.Rmin = Number.MAX_VALUE;
        this.isCut = !1;
        this.SupportArea = this.SupportVol = this.Volume = 0;
        this.V = [];
        this.Area = 0;
        this.S = [];
        this.R = [];
        this.totalRoughness = 0;
        this.Support = [];
        this.SupportHeight = this.SupportArea = this.SupportVol = 0;
        this.SupportData = [];
        this.Cost = this.BuildTime = this.scenario = 0;
        this.EdgesList = [];
        this.SurfaceList = [];
        this.isSeparated = !1;
        this.Features = {
            minimumWallThickness: 0,
            minimumFacingDistance: 0,
            minimumCylinderDiameter: 0,
            AspectRatioCylinder: 0,
            AspectRatioWall: 0,
            minimumHoleDiameterHorizontal: 0,
            minimumHoleDiameterVertical: 0,
            maxDiameterWithoutSupport: 0,
            hasData: !1
        }
    };
    this.Init = function(c) {
        this.scenario = c;
        var h = getXhr();
        h.onreadystatechange = function() {
            if (4 == h.readyState && 200 == h.status) {
                var c = h.responseText.substring(1, h.responseText.length - 1).split(",");
                a.SupportData = c;
                a.SupportHeight = parseFloat(c[1]);
                a.machine.length = parseFloat(c[7]);
                a.machine.width = parseFloat(c[8]);
                a.machine.height = parseFloat(c[9])
            }
        };
        h.open("POST", "/viewer/Request/support.php", !1);
        h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        h.send("scenario=" + this.scenario)
    };
    this.getFeatureData = function() {
        if (!this.Features.hasData) {
            var c = getXhr();
            c.onreadystatechange = function() {
                if (4 == c.readyState && 200 == c.status) {
                    var h = c.responseText.substring(1, c.responseText.length - 1).split(",");
                    a.Features.minimumWallThickness = parseFloat(h[0]);
                    a.Features.minimumFacingDistance = parseFloat(h[1]);
                    a.Features.minimumCylinderDiameter = parseFloat(h[2]);
                    a.Features.AspectRatioCylinder = parseFloat(h[3]);
                    a.Features.AspectRatioWall = parseFloat(h[4]);
                    a.Features.minimumHoleDiameterHorizontal =
                        parseFloat(h[5]);
                    a.Features.minimumHoleDiameterVertical = parseFloat(h[6]);
                    a.Features.maxDiameterWithoutSupport = parseFloat(h[7]);
                    a.Features.hasData = !0
                }
            };
            c.open("POST", "/viewer/Request/features.php", !1);
            c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            c.send("scenario=" + this.scenario)
        }
    };
    this.Rotate = function(c, a, d) {
        c *= Math.PI / 180;
        a *= Math.PI / 180;
        d *= Math.PI / 180;
        c = [
            [1, 0, 0, 0],
            [0, Math.cos(c), -Math.sin(c), 0],
            [0, Math.sin(c), Math.cos(c), 0],
            [0, 0, 0, 1]
        ];
        a = [
            [Math.cos(a), 0, Math.sin(a), 0],
            [0,
                1, 0, 0
            ],
            [-Math.sin(a), 0, Math.cos(a), 0],
            [0, 0, 0, 1]
        ];
        d = [
            [Math.cos(d), -Math.sin(d), 0, 0],
            [Math.sin(d), Math.cos(d), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        var b = this.vertex.length + this.normal.length + this.VertexUnique.length;
        progressBar("start", b, "The part is being reorientated");
        for (var f = 0; f < this.vertex.length; f++) progressBar("update", f), this.vertex[f] = Mymath.Matrix4VectProd(a, this.vertex[f]), this.vertex[f] = Mymath.Matrix4VectProd(d, this.vertex[f]), this.vertex[f] = Mymath.Matrix4VectProd(c, this.vertex[f]);
        for (f = 0; f < this.normal.length; f++) b =
            this.vertex.length + f, progressBar("update", b), this.normal[f] = Mymath.Matrix4VectProd(a, this.normal[f]), this.normal[f] = Mymath.Matrix4VectProd(d, this.normal[f]), this.normal[f] = Mymath.Matrix4VectProd(c, this.normal[f]);
        for (f = 0; f < this.VertexUnique.length; f++) {
            var e = this.VertexUnique[f],
                b = this.vertex.length + this.normal.length + f;
            progressBar("update", b);
            e.coordinates = Mymath.Matrix4VectProd(a, e.coordinates);
            e.coordinates = Mymath.Matrix4VectProd(d, e.coordinates);
            e.coordinates = Mymath.Matrix4VectProd(c, e.coordinates)
        }
        progressBar("dispose")
    };
    this.merge = function(c) {
        !(0 >= this.vertex[this.vertex.length - 3][0]) && !(0 <= this.vertex[this.vertex.length - 3][0]) && (this.vertex.splice(this.vertex.length - 3, 3), this.nbfacet -= 1);
        this.nbfacet += c.nbfacet;
        for (var a = 0; a < c.nbfacet; a++) this.vertex.push(c.vertex[3 * a]), this.vertex.push(c.vertex[3 * a + 1]), this.vertex.push(c.vertex[3 * a + 2])
    };
    this.cutPart = function(c, a, d) {
        this.calculateBoundingBox();
        var b = (this.xmax - this.xmin + 0.01) / c,
            f = (this.ymax - this.ymin + 0.01) / a,
            e = (this.zmax - this.zmin + 0.01) / d;
        this.cutPart.xsize = b;
        this.cutPart.ysize =
            f;
        this.cutPart.zsize = e;
        this.cutPart.xnb = c;
        this.cutPart.ynb = a;
        this.cutPart.znb = d;
        this.Cubes = [];
        this.biggerCube = [];
        for (var j = 1; j <= c; j++) {
            for (var k = [], l = [], m = 1; m <= a; m++) {
                for (var r = [], n = [], t = 1; t <= d; t++) r.push(new Cube(this, j, m, t)), n.push(new Cube(this, j, m, t));
                k.push(r);
                l.push(n)
            }
            this.Cubes.push(k);
            this.biggerCube.push(l)
        }
        progressBar("start", this.nbfacet, "The part is beeing cut");
        for (c = 1; c <= this.nbfacet; c++) {
            progressBar("update", c);
            a = [];
            for (d = 1; 3 >= d; d++) {
                j = Math.floor((this.vertex[3 * c - d][0] - this.xmin) /
                    b);
                m = Math.floor((this.vertex[3 * c - d][1] - this.ymin) / f);
                t = Math.floor((this.vertex[3 * c - d][2] - this.zmin) / e);
                k = this.Cubes[j][m][t].Vertices;
                l = !0;
                for (r = 0; r < k.length; r++) k[r].isEqual(this.vertex[3 * c - d][0], this.vertex[3 * c - d][1], this.vertex[3 * c - d][2]) && (l = !1, a.push(k[r]), r = k.length);
                l && (a.push(new Vertex(this.vertex[3 * c - d][0], this.vertex[3 * c - d][1], this.vertex[3 * c - d][2])), this.VertexUnique.push(a[a.length - 1]), a[a.length - 1].number = this.VertexUnique.length, a[a.length - 1].cube = this.Cubes[j][m][t], this.Cubes[j][m][t].Vertices.push(a[a.length -
                1]))
            }
            j = new Facet(a[0], a[1], a[2]);
            j.number = c;
            j.cubes.push(a[0].cube);
            j.cubes.push(a[1].cube);
            j.cubes.push(a[2].cube);
            a[0].facets.push(j);
            a[1].facets.push(j);
            a[2].facets.push(j);
            this.facets.push(j);
            m = a[0].cube.x;
            t = a[1].cube.x;
            d = a[2].cube.x;
            var k = a[0].cube.y,
                l = a[1].cube.y,
                r = a[2].cube.y,
                n = a[0].cube.z,
                s = a[1].cube.z;
            a = a[2].cube.z;
            for (var p = Math.min(m, Math.min(t, d)); p <= Math.max(m, Math.max(t, d)); p++)
                for (var q = Math.min(k, Math.min(l, r)); q <= Math.max(k, Math.max(l, r)); q++)
                    for (var w = Math.min(n, Math.min(s, a)); w <=
                    Math.max(n, Math.max(s, a)); w++) Mymath.FacetInsideCube(this.vertex[3 * c - 3], this.vertex[3 * c - 2], this.vertex[3 * c - 1], (p - 1) * b + this.xmin, p * b + this.xmin, (q - 1) * f + this.ymin, q * f + this.ymin, (w - 1) * e + this.zmin, w * e + this.zmin) && (this.biggerCube[p - 1][q - 1][w - 1].facets.push(j), j.biggerCube.push(this.biggerCube[p - 1][q - 1][w - 1]))
        }
        this.isCut = !0;
        progressBar("dispose")
    };
    this.cutPartSmall = function(c, a, d) {
        this.calculateBoundingBox();
        var b = (this.xmax - this.xmin + 0.01) / c,
            f = (this.ymax - this.ymin + 0.01) / a,
            e = (this.zmax - this.zmin + 0.01) /
                d;
        this.cutPart.xsize = b;
        this.cutPart.ysize = f;
        this.cutPart.zsize = e;
        this.cutPart.xnb = c;
        this.cutPart.ynb = a;
        this.cutPart.znb = d;
        this.Cubes = [];
        for (var j = 1; j <= c; j++) {
            for (var k = [], l = 1; l <= a; l++) {
                for (var m = [], r = 1; r <= d; r++) m.push(new Cube(this, j, l, r));
                k.push(m)
            }
            this.Cubes.push(k)
        }
        progressBar("start", this.nbfacet, "The part is beeing cut");
        for (c = 1; c <= this.nbfacet; c++) {
            progressBar("update", c);
            a = [];
            for (d = 1; 3 >= d; d++) {
                for (var j = Math.floor((this.vertex[3 * c - d][0] - this.xmin) / b), l = Math.floor((this.vertex[3 * c - d][1] - this.ymin) /
                    f), r = Math.floor((this.vertex[3 * c - d][2] - this.zmin) / e), k = this.Cubes[j][l][r].Vertices, m = !0, n = 0; n < k.length; n++) k[n].isEqual(this.vertex[3 * c - d][0], this.vertex[3 * c - d][1], this.vertex[3 * c - d][2]) && (m = !1, a.push(k[n]), n = k.length);
                m && (a.push(new Vertex(this.vertex[3 * c - d][0], this.vertex[3 * c - d][1], this.vertex[3 * c - d][2])), this.VertexUnique.push(a[a.length - 1]), a[a.length - 1].number = this.VertexUnique.length, a[a.length - 1].cube = this.Cubes[j][l][r], this.Cubes[j][l][r].Vertices.push(a[a.length - 1]))
            }
            j = new Facet(a[0], a[1],
                a[2]);
            j.number = c;
            j.cubes.push(a[0].cube);
            j.cubes.push(a[1].cube);
            j.cubes.push(a[2].cube);
            a[0].facets.push(j);
            a[1].facets.push(j);
            a[2].facets.push(j);
            this.facets.push(j)
        }
        this.isCutSmall = !0;
        progressBar("dispose")
    };
    this.calculateBoundingBox = function() {
        this.xmin = Number.MAX_VALUE;
        this.xmax = -Number.MAX_VALUE;
        this.ymin = Number.MAX_VALUE;
        this.ymax = -Number.MAX_VALUE;
        this.zmin = Number.MAX_VALUE;
        this.zmax = -Number.MAX_VALUE;
        for (var c = 0; c < 3 * this.nbfacet; c++) {
            var a = this.vertex[c][0];
            this.xmax = a > this.xmax ? a : this.xmax;
            this.xmin = a < this.xmin ? a : this.xmin;
            a = this.vertex[c][1];
            this.ymax = a > this.ymax ? a : this.ymax;
            this.ymin = a < this.ymin ? a : this.ymin;
            a = this.vertex[c][2];
            this.zmax = a > this.zmax ? a : this.zmax;
            this.zmin = a < this.zmin ? a : this.zmin
        }
        this.centroid = [(this.xmax - this.xmin) / 2 + this.xmin, (this.ymax - this.ymin) / 2 + this.ymin, (this.zmax - this.zmin) / 2 + this.zmin]
    };
    this.generateNormals = function() {
        this.normal = [];
        for (var c = 1; c <= this.nbfacet; c++) {
            var a = Mymath.pointtoVect(this.vertex[3 * c - 2], this.vertex[3 * c - 1]),
                d = Mymath.pointtoVect(this.vertex[3 *
                c - 2], this.vertex[3 * c - 3]);
            this.normal[c - 1] = Mymath.normalise(Mymath.Prodvect(a, d))
        }
    };
    this.calculateArea = function() {
        this.Area = 0;
        var c = [],
            a = [];
        this.S = [];
        for (var d = 1; d <= this.nbfacet; d++) c[0] = this.vertex[3 * d - 2][0] - this.vertex[3 * d - 3][0], c[1] = this.vertex[3 * d - 2][1] - this.vertex[3 * d - 3][1], c[2] = this.vertex[3 * d - 2][2] - this.vertex[3 * d - 3][2], a[0] = this.vertex[3 * d - 1][0] - this.vertex[3 * d - 3][0], a[1] = this.vertex[3 * d - 1][1] - this.vertex[3 * d - 3][1], a[2] = this.vertex[3 * d - 1][2] - this.vertex[3 * d - 3][2], this.S[d - 1] = 0.5 * Mymath.Norm(Mymath.Prodvect(c,
                a)), 0 <= this.S[d - 1] || (consolelog("facet: " + d), consolelog(this.S[d - 1]), this.S[d - 1] = 0), this.Area += this.S[d - 1];
        return this.Area
    };
    this.moveCentroid = function(c) {
        var a = [];
        a.x = c[0];
        a.y = c[1];
        a.z = c[2];
        this.calculateBoundingBox();
        for (c = 0; c < 3 * this.nbfacet; c++) this.vertex[c][0] += -this.centroid[0] + a.x, this.vertex[c][1] += -this.centroid[1] + a.y, this.vertex[c][2] += -this.centroid[2] + a.z;
        for (c = 0; c < this.VertexUnique.length; c++) {
            var d = this.VertexUnique[c];
            d.coordinates[0] += -this.centroid[0] + a.x;
            d.coordinates[1] += -this.centroid[1] +
                a.y;
            d.coordinates[2] += -this.centroid[2] + a.z
        }
        this.calculateBoundingBox()
    };
    this.move = function(c, a, d) {
        var b = this.vertex.length + this.VertexUnique.length;
        progressBar("start", b, "The part is being moved");
        c = [c, a, d];
        for (a = 0; a < 3 * this.nbfacet; a++) progressBar("update", a), this.vertex[a][0] += c[0], this.vertex[a][1] += c[1], this.vertex[a][2] += c[2];
        for (a = 0; a < this.VertexUnique.length; a++) b = this.vertex.length + a, progressBar("update", b), b = this.VertexUnique[a], b.coordinates[0] += c[0], b.coordinates[1] += c[1], b.coordinates[2] +=
            c[2];
        this.calculateBoundingBox()
    };
    this.scale = function(c) {
        var a = this.vertex.length + this.VertexUnique.length;
        progressBar("start", a, "The part is being rescaled");
        for (var b = 0; b < 3 * this.nbfacet; b++) progressBar("update", b), this.vertex[b][0] *= c, this.vertex[b][1] *= c, this.vertex[b][2] *= c;
        for (b = 0; b < this.VertexUnique.length; b++) a = this.vertex.length + b, progressBar("update", a), a = this.VertexUnique[b], a.coordinates[0] *= c, a.coordinates[1] *= c, a.coordinates[2] *= c
    };
    this.moveToOrigin = function() {
        this.calculateBoundingBox();
        for (var c = this.SupportHeight, a = 0; a < 3 * this.nbfacet; a++) this.vertex[a][0] += -this.xmin - (this.xmax - this.xmin) / 2, this.vertex[a][1] += -this.ymin - (this.ymax - this.ymin) / 2, this.vertex[a][2] += -this.zmin + c;
        for (a = 0; a < this.VertexUnique.length; a++) {
            var b = this.VertexUnique[a];
            b.coordinates[0] += -this.xmin - (this.xmax - this.xmin) / 2;
            b.coordinates[1] += -this.ymin - (this.ymax - this.ymin) / 2;
            b.coordinates[2] += -this.zmin + c
        }
        this.calculateBoundingBox()
    };
    this.calculateVolume = function() {
        this.calculateBoundingBox();
        var c = [0, 0, 0],
            a = [0, 0, 0],
            b = [0, 0, 0],
            g = [],
            f = this.vertex;
        this.Volume = 0;
        progressBar("start", this.nbfacet, "Part volume is beeing calculated");
        for (var e = 1; e <= this.nbfacet; e++) {
            progressBar("update", e);
            this.vertex[3 * e - 3][2] >= this.vertex[3 * e - 2][2] && this.vertex[3 * e - 3][2] >= this.vertex[3 * e - 1][2] ? f[3 * e - 2][2] >= f[3 * e - 1][2] ? (c[0] = f[3 * e - 3][0], c[1] = f[3 * e - 3][1], c[2] = f[3 * e - 3][2], a[0] = f[3 * e - 2][0], a[1] = f[3 * e - 2][1], a[2] = f[3 * e - 2][2], b[0] = f[3 * e - 1][0], b[1] = f[3 * e - 1][1], b[2] = f[3 * e - 1][2]) : (c[0] = f[3 * e - 3][0], c[1] = f[3 * e - 3][1], c[2] = f[3 * e - 3][2],
                a[0] = f[3 * e - 1][0], a[1] = f[3 * e - 1][1], a[2] = f[3 * e - 1][2], b[0] = f[3 * e - 2][0], b[1] = f[3 * e - 2][1], b[2] = f[3 * e - 2][2]) : f[3 * e - 2][2] >= f[3 * e - 3][2] && f[3 * e - 2][2] >= f[3 * e - 1][2] ? f[3 * e - 3][2] >= f[3 * e - 1][2] ? (c[0] = f[3 * e - 2][0], c[1] = f[3 * e - 2][1], c[2] = f[3 * e - 2][2], a[0] = f[3 * e - 3][0], a[1] = f[3 * e - 3][1], a[2] = f[3 * e - 3][2], b[0] = f[3 * e - 1][0], b[1] = f[3 * e - 1][1], b[2] = f[3 * e - 1][2]) : (c[0] = f[3 * e - 2][0], c[1] = f[3 * e - 2][1], c[2] = f[3 * e - 2][2], a[0] = f[3 * e - 1][0], a[1] = f[3 * e - 1][1], a[2] = f[3 * e - 1][2], b[0] = f[3 * e - 3][0], b[1] = f[3 * e - 3][1], b[2] = f[3 * e - 3][2]) : f[3 * e - 3][2] >=
            f[3 * e - 2][2] ? (c[0] = f[3 * e - 1][0], c[1] = f[3 * e - 1][1], c[2] = f[3 * e - 1][2], a[0] = f[3 * e - 3][0], a[1] = f[3 * e - 3][1], a[2] = f[3 * e - 3][2], b[0] = f[3 * e - 2][0], b[1] = f[3 * e - 2][1], b[2] = f[3 * e - 2][2]) : (c[0] = f[3 * e - 1][0], c[1] = f[3 * e - 1][1], c[2] = f[3 * e - 1][2], a[0] = f[3 * e - 2][0], a[1] = f[3 * e - 2][1], a[2] = f[3 * e - 2][2], b[0] = f[3 * e - 3][0], b[1] = f[3 * e - 3][1], b[2] = f[3 * e - 3][2]);
            var j = 0,
                k = 0,
                l = 0,
                j = 0.5 * b[2] * Mymath.Det3([c[0], c[1], 1], [a[0], a[1], 1], [b[0], b[1], 1]),
                k = 0.16666666666666666 * Mymath.Det4([c[0], c[1], c[2], 1], [a[0], a[1], b[2], 1], [c[0], c[1], b[2], 1], [b[0],
                        b[1], b[2], 1
                    ]),
                l = 0.16666666666666666 * Mymath.Det4([c[0], c[1], c[2], 1], [a[0], a[1], a[2], 1], [a[0], a[1], b[2], 1], [b[0], b[1], b[2], 1]);
            g[e - 1] = Math.abs(j) + Math.abs(k) + Math.abs(l);
            0 <= g[e - 1] || (consolelog("facet: " + e), consolelog(g[e - 1]), g[e - 1] = 0);
            this.Volume = 0 < this.normal[e - 1][2] ? this.Volume + g[e - 1] : this.Volume - g[e - 1]
        }
        this.V = g;
        progressBar("dispose");
        consolelog(this.Volume);
        return this.Volume
    };
    this.SurfaceRecognition = function() {
        this.getFeatureData();
        progressBar("start", this.SurfaceList.length, "The surfaces are being recognised");
        Theta1 = Mymath.readTrainedNN(1);
        Theta2 = Mymath.readTrainedNN(2);
        for (var a = [], b = 0; b < this.SurfaceList.length; b++) {
            var d = this.SurfaceList[b];
            progressBar("update", b);
            d.GaussCurvature();
            d.GaussCurvStats();
            d.MeanCurvature();
            d.MeanCurvStats();
            d.NormalCurvature();
            for (var g = 0, f = 0; f < d.VertexUnique.length; f++) g += d.normalCurv[f];
            g /= d.VertexUnique.length;
            d.NormalSomme = g;
            d.X = [];
            d.X.push(1);
            d.X.push(d.Area);
            d.X.push(d.Normals.length);
            d.X.push(d.VertexUnique.length);
            d.X.push(d.GaussCurvS.min);
            d.X.push(d.GaussCurvS.max);
            d.X.push(d.GaussCurvS.median);
            d.X.push(d.GaussCurvS.Dev);
            d.X.push(d.MeanCurvS.min);
            d.X.push(d.MeanCurvS.max);
            d.X.push(d.MeanCurvS.median);
            d.X.push(d.MeanCurvS.Dev);
            d.X.push(d.NormalSomme);
            a.push(d.X)
        }
        b = Mymath.MatrixProd(a, Mymath.transpose(Theta1));
        b = Mymath.sigmoid(b);
        b = Mymath.addOnesColumn(b);
        b = Mymath.MatrixProd(b, Mymath.transpose(Theta2));
        a = Mymath.sigmoid(b);
        d = [];
        for (b = 0; b < this.SurfaceList.length; b++) d.push(Mymath.MaxVector(a[b])), this.SurfaceList[b].type = 0.5 <= d[b][1] ? d[b][0] + 1 : 0;
        this.RecognitionDone = !0;
        progressBar("dispose")
    };
    this.calculateRoughness = function(a) {
        var b = getXhr();
        b.open("POST", "/viewer/Request/ltandroughness.php", !1);
        b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        b.send("scenario=" + a);
        a = b.responseText.documentElement.childNodes[0];
        this.Ra0 = a.getElementsByTagName("Ra30")[0].childNodes[0].nodeValue;
        this.Ra30 = a.getElementsByTagName("Ra30")[0].childNodes[0].nodeValue;
        this.Ra60 = a.getElementsByTagName("Ra60")[0].childNodes[0].nodeValue;
        this.Ra90 = a.getElementsByTagName("Ra90")[0].childNodes[0].nodeValue;
        this.lt = a.getElementsByTagName("LayerTickness")[0].childNodes[0].nodeValue;
        var d = [0, 0, 1];
        this.R = [];
        a = -2 * (this.Ra30 - 1.732 * this.Ra60) / this.lt;
        b = -2 * (this.Ra60 - 1.732 * this.Ra30) / this.lt;
        document.getElementById("info").innerHTML = "nbfacet: " + this.nbfacet;
        for (var g = 1; g <= this.nbfacet; g++) {
            var f = Math.abs(Mymath.Angle(d, [this.normal[g - 1][0], this.normal[g - 1][1], this.normal[g - 1][2]]));
            this.R[g - 1] = 0.01 >= f ? this.Ra0 : 0.01 < f && 180 >= f ? this.lt / 2 * Math.abs(a * Math.sin(f * Math.PI / 180) + b * Math.cos(f * Math.PI / 180)) : 179.99 <= f ?
                this.Ra0 : 0
        }
        this.Rmax = 0;
        this.Rmin = Number.MAX_VALUE;
        for (g = 0; 180 >= g; g++) d = 0.5 * this.lt * Math.abs(a * Math.sin(g * Math.PI / 180) + b * Math.cos(g * Math.PI / 180)), this.Rmax = d > this.Rmax ? d : this.Rmax, this.Rmin = d < this.Rmin ? d : this.Rmin
    };
    this.calculateRoughnessInterpolation = function() {
        var a = getXhr();
        a.open("POST", "/viewer/Request/allroughness.php", !1);
        a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        a.send("scenario=" + this.scenario);
        var b = a.responseText.substring(1, a.responseText.length - 1).split(","),
            a = [];
        this.Rmax = 0;
        this.Rmin = Number.MAX_VALUE;
        for (var d = 0; d < 0.5 * b.length; d++) a.push([parseFloat(b[2 * d]), parseFloat(b[2 * d + 1])]), this.Rmax = parseFloat(b[2 * d + 1]) > this.Rmax ? parseFloat(b[2 * d + 1]) : this.Rmax, this.Rmin = parseFloat(b[2 * d + 1]) < this.Rmin ? parseFloat(b[2 * d + 1]) : this.Rmin;
        b = [0, 0, 1];
        this.R = [];
        this.totalRoughness = 0;
        progressBar("start", this.nbfacet, "Roughness is beeing calculated");
        for (var g = 1; g <= this.nbfacet; g++) {
            progressBar("update", g);
            for (var f = Math.abs(Mymath.Angle(b, this.normal[g - 1])), e = 0; e < a.length -
            1; e++) f === a[e][0] ? (this.R[g - 1] = a[e][1], e = a.length) : f > a[e][0] && f < a[e + 1][0] && (this.R[g - 1] = a[e][1] + (a[e + 1][0] - f) * (a[e + 1][1] - a[e][1]) / (a[e + 1][0] - a[e][0]), e = a.length);
            f === a[a.length - 1][0] && (this.R[g - 1] = a[a.length - 1][1]);
            f > a[a.length - 1][0] && (this.R[g - 1] = -1);
            this.totalRoughness += this.R[g - 1] * this.S[d - 1] / this.Area
        }
        progressBar("dispose")
    };
    this.calculateSupport = function() {
        this.SupportArea = this.SupportVol = 0;
        this.Support = [];
        var a = [0, 0, 1],
            b = getXhr();
        b.open("POST", "/viewer/Request/support.php", !1);
        b.setRequestHeader("Content-Type",
            "application/x-www-form-urlencoded");
        b.send("scenario=" + this.scenario);
        var d = b.responseText.substring(1, b.responseText.length - 1).split(",");
        this.SupportData = d;
        b = parseFloat(d[0]);
        this.SupportHeight = parseFloat(d[1]);
        d = parseFloat(d[6]);
        progressBar("start", this.nbfacet, "Support is beeing calculated");
        for (var g = 0; g < this.nbfacet; g++) progressBar("update", g), this.Support[g] = 0, 0 > this.normal[g][2] && Math.abs(Mymath.Angle(a, this.normal[g])) >= b + 90 && (this.Support[g] = 1, this.SupportVol += this.V[g] * d, this.SupportArea +=
            this.S[g]);
        progressBar("dispose")
    };
    this.CalculateBuildTime = function(a) {
        if (a) {
            var b = getXhr();
            b.open("POST", "/viewer/Request/geomdata.php", !1);
            b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            b.send("scenario=" + this.scenario);
            a = b.responseText.substring(1, b.responseText.length - 1).split(",");
            0 == this.SupportData.length && (b.open("POST", "/viewer/Request/support.php", !1), b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), b.send("scenario=" + this.scenario), this.SupportData =
                b.responseText.substring(1, b.responseText.length - 1).split(","));
            this.LayerThickness = b = a[2];
            var d = this.zmax - this.zmin + parseFloat(this.SupportData[1]),
                g = Math.floor(d / b),
                f = this.Area,
                e = this.Volume,
                j = e / (g * b),
                k = this.SupportVol,
                l = k / (g * b),
                m = [1, a[1], f, e, a[0] * (this.zmax - this.zmin), (this.xmax - this.xmin) * (this.ymax - this.ymin) * (this.zmax - this.zmin), j, f / (g * b), 1, (this.xmax - this.xmin) * (this.ymax - this.ymin), this.ymax - this.ymin, this.xmax - this.xmin, k, this.SupportArea, l, l / this.SupportData[2], j, 0, d],
                r = 0,
                n = 0,
                t = 0,
                s = this,
                p = getXhr();
            p.onreadystatechange = function() {
                if (4 == p.readyState && 200 == p.status) {
                    for (var a = JSON.parse(p.responseText), c = [2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], b = 0; b < a.length; b++) {
                        var d = a[b].dependency,
                            e = parseInt(a[b].id_type);
                        if (1 == e || 5 == e || 4 == e || 8 == e || 6 == e || 2 == e) {
                            var f = parseFloat(a[b].Value);
                            if (0 != d.length)
                                for (var h = 0; h < d.length; h++) {
                                    var j = d[h],
                                        k = j.operation,
                                        l = j.type;
                                    "2" == l ? f = "1" == k ? f * parseFloat(j.Value) : f / parseFloat(j.Value) : (j = parseInt(j.id_geom), c.contains(j), f = 1 == k ? f * m[j] : f / m[j])
                                }
                            if (1 == e || 5 == e) r += f;
                            else if (4 == e || 8 == e) t += f;
                            else if (6 == e || 2 == e) f *= g, n += f
                        }
                        if (3 == e || 7 == e || 9 == e) {
                            f = parseFloat(a[b].Value);
                            if (0 != d.length)
                                for (h = 0; h < d.length; h++) j = d[h], k = j.operation, l = j.type, "2" == l ? f = "1" == k ? f * parseFloat(j.Value) : f / parseFloat(j.Value) : (j = parseInt(j.id_geom), c.contains(j), f = 1 == k ? f * m[j] : f / m[j]);
                            d = parseFloat(a[b].Frequency);
                            h = 0;
                            if (1 == e || 5 == e) h = Math.round(r / d), r += h * f;
                            else if (4 == e || 8 == e) h = Math.round(t / d), t += h * f;
                            else if (6 == e || 2 == e) h = Math.round(n / d), f *= g, n += h * f
                        }
                    }
                    a = r + n + t;
                    s.BuildTimes = {
                        prebuild: r,
                        layertime: n,
                        finishtime: t
                    };
                    s.BuildTime = a
                }
            };
            p.open("POST", "/viewer/Request/getTimes.php", !1);
            p.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            p.send("scenario=" + this.scenario)
        }
    };
    this.CalculateCost = function() {
        var a = [1, this.BuildTime / 3600, this.Volume, Math.min(this.xmax - this.xmin, this.ymax - this.ymin, this.zmax - this.zmin), Math.max(this.xmax - this.xmin, this.ymax - this.ymin), this.SupportArea, this.SupportArea, this.SupportVol, this.Area, this.totalRoughness],
            b = this,
            d = getXhr();
        d.onreadystatechange = function() {
            if (4 == d.readyState &&
                200 == d.status) {
                var g = 0,
                    f = JSON.parse(d.responseText);
                b.Costs = f;
                for (var f = f.Costs, e = 0; e < f.length; e++) {
                    for (var j = parseFloat(f[e].Value), k = f[e].dependency, l = 0; l < k.length; l++) var m = k[l],
                        r = m.id_dependency,
                        j = 1 == m.operation ? j * a[r] : j / a[r];
                    g += j
                }
                b.Cost = g
            }
        };
        d.open("POST", "/viewer/Request/getCosts.php", !1);
        d.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        d.send("scenario=" + this.scenario)
    };
    this.nbrecognised = 0;
    var b = [];
    this.SurfaceSeparation = function(a, h) {
        b = [];
        for (var d = this.nbrecognised = Mymath.EdgeNumber =
            0; d < this.nbfacet; d++) b.push(!1);
        void 0 === a && (a = 7);
        void 0 === h && (h = 70);
        d = !0;
        this.SurfaceList = [];
        progressBar("start", this.nbfacet, "The surfaces are being separated");
        for (var g = 1; d;) {
            var d = !1,
                f = this.SurfaceGet(g, a, h);
            1 < f.Vertex.length && (f.calculateArea(), this.SurfaceList.push(f));
            for (f = 1; f <= this.nbfacet; f++) !1 == b[f - 1] && (g = f, deb = 1 + f, f = this.nbfacet, d = !0)
        }
        progressBar("dispose");
        this.isSeparated = !0
    };
    this.SurfaceGet = function(a, h, d) {
        var g = [],
            f, e = new Surface(this);
        e.Vertex.push(this.vertex[3 * a - 3]);
        e.Vertex.push(this.vertex[3 *
        a - 2]);
        e.Vertex.push(this.vertex[3 * a - 1]);
        e.Normals.push(this.facets[a - 1].normal);
        e.Facets.push(this.facets[a - 1]);
        e.VertexUnique.push(this.facets[a - 1].vertices[0]);
        e.VertexUnique.push(this.facets[a - 1].vertices[1]);
        e.VertexUnique.push(this.facets[a - 1].vertices[2]);
        var j = b[a - 1] = !0,
            k = 1;
        for (g.push(a); j;) {
            progressBar("update", this.nbrecognised);
            j = !1;
            a = 0;
            var l, m, r = [],
                n = this.facets[g[k - 1] - 1];
            n.BelongToSurface = e;
            for (var t = 0; t < n.biggerCube.length; t++) {
                for (var s = 0; s < n.biggerCube[t].facets.length; s++) {
                    var p = n.biggerCube[t].facets[s],
                        q;
                    q = this.calculatingSupport && !p.Supported() ? !0 : !1;
                    if (n !== p && (!q && !contains(r, p)) && (q = n.shareSide(p), q[0])) {
                        r.push(p);
                        var w = n.Angle(p);
                        f = q[1];
                        var v = q[2],
                            u = q[3],
                            z = q[4],
                            x = 1 == f && 2 == v ? 3 : 1 == f && 3 == v ? 2 : 2 == f && 3 == v ? 1 : 2 == f && 1 == v ? 3 : 3 == f && 1 == v ? 2 : 3 == f && 2 == v ? 1 : 0,
                            y = 1 == u && 2 == z ? 3 : 1 == u && 3 == z ? 2 : 2 == u && 3 == z ? 1 : 2 == u && 1 == z ? 3 : 3 == u && 1 == z ? 2 : 3 == u && 2 == z ? 1 : 0;
                        f = Mymath.PointDist(n.vertices[f - 1].coordinates, n.vertices[x - 1].coordinates);
                        var v = Mymath.PointDist(n.vertices[v - 1].coordinates, n.vertices[x - 1].coordinates),
                            C = Mymath.PointDist(p.vertices[u -
                            1].coordinates, p.vertices[y - 1].coordinates),
                            D = Mymath.PointDist(p.vertices[z - 1].coordinates, p.vertices[y - 1].coordinates);
                        f = 1.15 > f / C && 0.85 < f / C && 1.15 > v / D && 0.85 < v / D || 1.15 > f / D && 1.15 > v / C && 0.85 < f / D && 0.85 < v / C ? d : h;
                        w < f ? b[p.number - 1] || (e.Vertex.push(p.vertices[2].coordinates), e.Vertex.push(p.vertices[1].coordinates), e.Vertex.push(p.vertices[0].coordinates), e.Normals.push(p.normal), e.Facets.push(p), e.VertexUnique.push(p.vertices[0]), e.VertexUnique.push(p.vertices[1]), e.VertexUnique.push(p.vertices[2]), p.BelongToSurface =
                            e, g.push(p.number), b[p.number - 1] = !0, this.nbrecognised++, j = !0) : e.addContourLine(p.vertices[u - 1], p.vertices[z - 1]);
                        a++;
                        1 === a ? (l = q, n.contactFacets[0] = p) : 2 === a ? (m = q, n.contactFacets[1] = p) : 3 === a && (n.contactFacets[2] = p, s = n.biggerCube[t].facets.length);
                        w = 1 == x ? 2 : 2 == x ? 3 : 1;
                        u = 1 == y ? 2 : 2 == y ? 3 : 1;
                        void 0 === n.Edges[w - 1] && void 0 === p.Edges[u - 1] ? (y = new Edge(n.vertices[q[1] - 1], n.vertices[q[2] - 1], n, p), this.EdgesList.push(y), n.Edges[w - 1] = y, p.Edges[u - 1] = y, n.vertices[q[1] - 1].Edges.push(y), n.vertices[q[2] - 1].Edges.push(y)) : y =
                            void 0 != n.Edges[w - 1] ? n.Edges[w - 1] : p.Edges[u - 1];
                        e.Edges.push(y);
                        y.SurfacesList.push(e)
                    }
                }
                3 === a && (t = n.biggerCube.length)
            }
            if (2 == a) l[1] === m[1] ? e.addContourLine(n.vertices[l[2] - 1], n.vertices[m[2] - 1]) : l[1] === m[2] ? e.addContourLine(n.vertices[l[2] - 1], n.vertices[m[1] - 1]) : l[2] === m[1] ? e.addContourLine(n.vertices[l[1] - 1], n.vertices[m[2] - 1]) : l[2] == m[2] && e.addContourLine(n.vertices[l[1] - 1], n.vertices[m[1] - 1]);
            else if (1 == a)
                if (1 == l[1] && 2 == l[2] || 2 == l[1] && 1 == l[2]) e.addContourLine(n.vertices[0], n.vertices[2]), e.addContourLine(n.vertices[1],
                    n.vertices[2]);
                else if (2 == l[1] && 3 == l[2] || 3 == l[1] && 2 == l[2]) e.addContourLine(n.vertices[1], n.vertices[0]), e.addContourLine(n.vertices[2], n.vertices[0]);
                else if (1 == l[1] && 3 == l[2] || 3 == l[1] && 1 == l[2]) e.addContourLine(n.vertices[0], n.vertices[1]), e.addContourLine(n.vertices[2], n.vertices[1]);
            k++;
            k <= e.Facets.length && (j = !0)
        }
        return e
    };
    this.SliceZ = function() {};
    this.Slice = function(a) {
        void 0 === a && (a = this.LayerThickness);
        a = Math.abs(a);
        this.slices = {};
        progressBar("start", this.nbfacet, "Part is being sliced");
        for (var b =
            0; b < this.facets.length; b++) {
            progressBar("update", b);
            var d = this.facets[b];
            d.minmax();
            var g, f, e;
            d.vertices[0].coordinates[2] >= d.vertices[1].coordinates[2] && d.vertices[0].coordinates[2] >= d.vertices[2].coordinates[2] ? d.vertices[1].coordinates[2] >= d.vertices[2].coordinates[2] ? (g = d.vertices[0].coordinates, f = d.vertices[1].coordinates, e = d.vertices[2].coordinates) : (g = d.vertices[0].coordinates, f = d.vertices[2].coordinates, e = d.vertices[1].coordinates) : d.vertices[1].coordinates[2] >= d.vertices[0].coordinates[2] &&
            d.vertices[1].coordinates[2] >= d.vertices[2].coordinates[2] ? d.vertices[0].coordinates[2] >= d.vertices[2].coordinates[2] ? (g = d.vertices[1].coordinates, f = d.vertices[0].coordinates, e = d.vertices[2].coordinates) : (g = d.vertices[1].coordinates, f = d.vertices[2].coordinates, e = d.vertices[0].coordinates) : d.vertices[0].coordinates[2] >= d.vertices[1].coordinates[2] ? (g = d.vertices[2].coordinates, f = d.vertices[0].coordinates, e = d.vertices[1].coordinates) : (g = d.vertices[2].coordinates, f = d.vertices[1].coordinates, e = d.vertices[0].coordinates);
            for (var j = Math.ceil(d.zmin / a) * a; j <= d.zmax; j += a)
                if (j = Math.round(1E4 * j) / 1E4, void 0 === this.slices[j] && (this.slices[j] = []), d.lines[j] = [], j < g[2] && j > f[2]) {
                    var k = {},
                        l = f[0] + (j - f[2]) / (g[2] - f[2]) * (g[0] - f[0]);
                    k.x = l;
                    k.y = f[1] + (j - f[2]) / (g[2] - f[2]) * (g[1] - f[1]);
                    k.z = j;
                    k.facet = d;
                    var m = {},
                        l = e[0] + (j - e[2]) / (g[2] - e[2]) * (g[0] - e[0]);
                    m.x = l;
                    m.y = e[1] + (j - e[2]) / (g[2] - e[2]) * (g[1] - e[1]);
                    m.z = j;
                    m.facet = d;
                    k = [k, m];
                    this.slices[j].push(k);
                    d.lines[j].push(k)
                } else j < f[2] && j > e[2] ? (k = {}, l = e[0] + (j - e[2]) / (f[2] - e[2]) * (f[0] - e[0]), k.x = l, k.y =
                    e[1] + (j - e[2]) / (f[2] - e[2]) * (f[1] - e[1]), k.z = j, k.facet = d, m = {}, l = e[0] + (j - e[2]) / (g[2] - e[2]) * (g[0] - e[0]), m.x = l, m.y = e[1] + (j - e[2]) / (g[2] - e[2]) * (g[1] - e[1]), m.z = j, m.facet = d, k = [k, m], this.slices[j].push(k), d.lines[j].push(k)) : j == g[2] && j == f[2] && j == e[2] ? (k = {}, k.x = g[0], k.y = g[1], k.z = j, k.facet = d, m = {}, m.x = f[0], m.y = f[1], m.z = j, m.facet = d, l = {}, l.x = e[0], l.y = e[1], l.z = j, l.facet = d, k = [k, m], this.slices[j].push(k), d.lines[j].push(k), k = [m, l], this.slices[j].push(k), d.lines[j].push(k)) : j == g[2] ? (k = {}, k.x = g[0], k.y = g[1], k.z = j, k.facet =
                    d, k = [k], this.slices[j].push(k), d.lines[j].push(k)) : j == f[2] ? (k = {}, k.x = f[0], k.y = f[1], k.z = j, k.facet = d, m = {}, l = e[0] + (j - e[2]) / (g[2] - e[2]) * (g[0] - e[0]), m.x = l, m.y = e[1] + (j - e[2]) / (g[2] - e[2]) * (g[1] - e[1]), m.z = j, m.facet = d, k = [k, m], this.slices[j].push(k), d.lines[j].push(k)) : j == e[2] && (k = {}, k.x = e[0], k.y = e[1], k.z = j, k.facet = d, k = [k], this.slices[j].push(k), d.lines[j].push(k))
        }
        progressBar("dispose")
    };
    this.Facet2FacetreNew = function() {
        this.getFeatureData();
        var a = Math.max(this.Features.minimumWallThickness, this.Features.minimumFacingDistance) +
            10;
        progressBar("start", this.nbfacet, "distances between facets are calculated");
        for (var b = Math.floor(a / this.cutPart.xsize) + 1, d = Math.floor(a / this.cutPart.ysize) + 1, a = Math.floor(a / this.cutPart.zsize) + 1, g = 0; g < this.nbfacet; g++)
            if (progressBar("update", g), !(this.facets[g].thinWall && this.facets[g].facing || this.facets[g].distChecked)) {
                for (var f = this.facets[g].GenerateNormal(), e = Mymath.pointtoVect(this.facets[g].vertices[0].coordinates, this.facets[g].vertices[1].coordinates), j = Mymath.Prodvect(f, e), e = Mymath.normalise(e),
                         j = Mymath.normalise(j), f = [f, e, j], f = Mymath.transpose(f), f = Mymath.inverseMatrix3(f), e = Mymath.MatrixVectProd(f, this.facets[g].vertices[0].coordinates), j = Mymath.MatrixVectProd(f, this.facets[g].vertices[1].coordinates), k = Mymath.MatrixVectProd(f, this.facets[g].vertices[2].coordinates), l = (j[2] - e[2]) / (j[1] - e[1]), m = (k[2] - j[2]) / (k[1] - j[1]), r = (e[2] - k[2]) / (e[1] - k[1]), n = [l, m, r], l = [e[2] - l * e[2], j[2] - m * j[2], k[2] - r * k[2]], m = [e[1], j[1], k[1]], r = [j[1], k[1], e[1]], t = 0; t < this.facets[g].biggerCube.length; t++)
                    for (var s = this.facets[g].biggerCube[t],
                             p = s.x, q = s.y, s = s.z, w = p - b - 1; w < p + b - 1; w++)
                        for (var v = q - d - 1; v < q + d - 1; v++)
                            for (var u = s - a - 1; u < s + a - 1; u++)
                                if (!(0 > w || 0 > v || 0 > u))
                                    if (!(w >= this.cutPart.xnb || v >= this.cutPart.ynb || u >= this.cutPart.znb))
                                        for (var z = this.biggerCube[w][v][u], x = 0; x < z.facets.length; x++) {
                                            var y = z.facets[x];
                                            if (!y.thinWall || !y.facing) {
                                                var C = this.facets[g].Angle(y),
                                                    D = Mymath.PointDist(this.facets[g].calculateCenter(), y.calculateCenter());
                                                if (120 <= C && D < this.Features.minimumWallThickness + 10 && D < this.Features.minimumFacingDistance + 10) {
                                                    var F = Mymath.MatrixVectProd(f,
                                                        y.vertices[0].coordinates),
                                                        A = Mymath.MatrixVectProd(f, y.vertices[1].coordinates),
                                                        B = Mymath.MatrixVectProd(f, y.vertices[2].coordinates),
                                                        H = Mymath.MatrixVectProd(f, y.center),
                                                        E = C = !1,
                                                        E = Mymath.InsideTriangle2(e, j, k, F) || Mymath.InsideTriangle2(e, j, k, A) || Mymath.InsideTriangle2(e, j, k, B) || Mymath.InsideTriangle2(e, j, k, H);
                                                    if (!E)
                                                        for (var I = (A[2] - F[2]) / (A[1] - F[1]), G = (B[2] - A[2]) / (B[1] - A[1]), J = (F[2] - B[2]) / (F[1] - B[1]), H = [I, G, J], I = [F[2] - I * F[2], A[2] - G * A[2], B[2] - J * B[2]], F = [F[1], A[1], B[1]], A = 0; 3 > A; A++)
                                                            for (B = 0; 3 > B; B++) n[A] !==
                                                            H[B] && (G = (I[B] - l[A]) / (n[A] - H[B]), Mymath.inthemiddle(G, m[A], r[A]) && Mymath.inthemiddle(G, F[B], r[B]) && (C = !0, B = A = 3));
                                                    if (C || E) C = !0, E = y.calculateCenter(), E[0] += y.GenerateNormal()[0] / D, E[1] += y.normal[1] / D, E[2] += y.normal[2] / D, Mymath.PointDist(this.facets[g].calculateCenter(), E) < D && (C = !1), D < this.Features.minimumWallThickness + 10 && !C && (this.facets[g].thinWall = !0, y.thinWall = !0), D < this.Features.minimumFacingDistance + 10 && C && (this.facets[g].facing = !0, y.facing = !0)
                                                }
                                            }
                                        }
                this.facets[g].distChecked = !0
            }
        this.FacetDistanceDone = !0;
        progressBar("dispose")
    };
    this.Facet2Facetnew = function() {
        this.getFeatureData();
        progressBar("start", this.nbfacet, "distances between facets are calculated");
        for (i = 0; i < this.nbfacet; i++)
            if (progressBar("update", i), !this.facets[i].thinWall || !this.facets[i].facing)
                for (var a = 0; a < this.facets[i].biggerCube.length; a++)
                    for (var b = this.facets[i].biggerCube[a], d = 0; d < b.facets.length; d++) {
                        var g = b.facets[d];
                        if (!(g.number > this.facets[i].number)) {
                            var f = Mymath.PointDist(this.facets[i].calculateCenter(), g.calculateCenter()),
                                e = Mymath.DotProduct(this.facets[i].GenerateNormal(), g.GenerateNormal()),
                                j = Mymath.pointtoVect(this.facets[i].center, g.center);
                            if (!(0.01 > Math.abs(e)) && 1 !== e) {
                                var k = Mymath.DotProduct(g.normal, j) / e;
                                if (!(0 > k) && f < this.Features.minimumWallThickness + 15 && f < this.Features.minimumFacingDistance + 15 && 91 < this.facets[i].Angle(g)) {
                                    var e = g.vertices[0].coordinates,
                                        j = g.vertices[1].coordinates,
                                        l = g.vertices[2].coordinates,
                                        k = Mymath.addVect(this.facets[i].center, Mymath.multiplyScalar(this.facets[i].normal, k));
                                    Mymath.pointInFace3(k,
                                        e, j, l) && (e = !0, j = g.calculateCenter(), j[0] += g.GenerateNormal()[0] / f, j[1] += g.normal[1] / f, j[2] += g.normal[2] / f, Mymath.PointDist(this.facets[i].calculateCenter(), j) < f && (e = !1), f < this.Features.minimumWallThickness + 5 && !e && (this.facets[i].thinWall = !0, g.thinWall = !0), f < this.Features.minimumFacingDistance && e && (this.facets[i].facing = !0, g.facing = !0))
                                }
                            }
                        }
                    }
        this.FacetDistanceDone = !0;
        progressBar("dispose")
    };
    this.Facet2Facet = function() {
        this.getFeatureData();
        progressBar("start", this.nbfacet, "distances between facets are calculated");
        for (i = 0; i < this.nbfacet; i++) {
            progressBar("update", i);
            for (var a = this.facets[i].GenerateNormal(), b = Mymath.pointtoVect(this.facets[i].vertices[0].coordinates, this.facets[i].vertices[1].coordinates), d = Mymath.Prodvect(a, b), b = Mymath.normalise(b), d = Mymath.normalise(d), a = [a, b, d], a = Mymath.transpose(a), a = Mymath.inverseMatrix3(a), b = Mymath.MatrixVectProd(a, this.facets[i].vertices[0].coordinates), d = Mymath.MatrixVectProd(a, this.facets[i].vertices[1].coordinates), g = Mymath.MatrixVectProd(a, this.facets[i].vertices[2].coordinates),
                     f = (d[2] - b[2]) / (d[1] - b[1]), e = (g[2] - d[2]) / (g[1] - d[1]), j = (b[2] - g[2]) / (b[1] - g[1]), k = [f, e, j], f = [b[2] - f * b[2], d[2] - e * d[2], g[2] - j * g[2]], e = [b[1], d[1], g[1]], j = [d[1], g[1], b[1]], l = 0; l < this.facets[i].biggerCube.length; l++)
                for (var m = this.facets[i].biggerCube[l], r = 0; r < m.facets.length; r++) {
                    var n = m.facets[r];
                    if (120 <= this.facets[i].Angle(n) && n.number > this.facets[i].number) {
                        var t = Mymath.MatrixVectProd(a, n.vertices[0].coordinates),
                            s = Mymath.MatrixVectProd(a, n.vertices[1].coordinates),
                            p = Mymath.MatrixVectProd(a, n.vertices[2].coordinates),
                            q = !1,
                            w = !1,
                            w = Mymath.InsideTriangle2(b, d, g, t) || Mymath.InsideTriangle2(b, d, g, s) || Mymath.InsideTriangle2(b, d, g, p);
                        if (!w)
                            for (var v = (s[2] - t[2]) / (s[1] - t[1]), u = (p[2] - s[2]) / (p[1] - s[1]), z = (t[2] - p[2]) / (t[1] - p[1]), x = [v, u, z], v = [t[2] - v * t[2], s[2] - u * s[2], p[2] - z * p[2]], t = [t[1], s[1], p[1]], s = 0; 3 > s; s++)
                                for (p = 0; 3 > p; p++) k[s] !== x[p] && (u = (v[p] - f[s]) / (k[s] - x[p]), Mymath.inthemiddle(u, e[s], j[s]) && Mymath.inthemiddle(u, t[p], j[p]) && (q = !0, p = s = 3));
                        if (q || w) q = Mymath.PointDist(this.facets[i].calculateCenter(), n.calculateCenter()), w = !0, x = n.calculateCenter(), x[0] += n.GenerateNormal()[0] / q, x[1] += n.normal[1] / q, x[2] += n.normal[2] / q, Mymath.PointDist(this.facets[i].calculateCenter(), x) < q && (w = !1), q < this.Features.minimumWallThickness && !w && (this.facets[i].thinWall = !0, n.thinWall = !0), q < this.Features.minimumFacingDistance && w && (this.facets[i].facing = !0, n.facing = !0)
                    }
                }
        }
        this.FacetDistanceDone = !0;
        progressBar("dispose")
    };
    this.setNbfacet = function(a) {
        this.nbfacet = a
    };
    this.getNbfacet = function() {
        return this.nbfacet
    };
    this.setName = function(a) {
        this.name =
            a
    };
    this.getName = function() {
        return this.name
    };
    this.setistext = function(a) {
        this.istext = a
    };
    this.getistext = function() {
        return this.istext
    };
    this.setVertice = function(a) {
        this.vertex = a
    };
    this.getVertice = function() {
        return this.vertex
    };
    this.setNormal = function(a) {
        this.normal = a
    };
    this.getNormal = function() {
        return this.normal
    };
    this.toJSON = function() {
        return {
            slices: this.slices,
            nickname: this.nickname,
            Features: this.Features,
            LayerThickness: this.LayerThickness,
            centroid: this.centroid,
            Costs: this.Costs,
            BuildTimes: this.BuildTimes,
            buildtime: this.BuildTime,
            Cost: this.Cost,
            machine: this.machine,
            SurfaceList: this.SurfaceList,
            Scenario: this.scenario,
            VertexUnique: this.VertexUnique,
            facets: this.facets,
            xmin: this.xmin,
            xmax: this.xmax,
            ymin: this.ymin,
            ymax: this.ymax,
            zmin: this.zmin,
            zmax: this.zmax,
            Rmin: this.Rmin,
            Rmax: this.Rmax,
            name: this.name,
            vertex: this.vertex,
            closeList: this.closeList,
            facingList: this.facingList,
            nbfacet: this.nbfacet,
            Volume: this.Volume,
            SupportVol: this.SupportVol,
            SupportArea: this.SupportArea,
            V: this.V,
            Area: this.Area,
            R: this.R,
            totalRoughness: this.totalRoughness,
            Support: this.Support,
            SupportHeight: this.SupportHeight,
            length: this.xmax - this.xmin,
            width: this.ymax - this.ymin,
            height: this.zmax - this.zmin
        }
    }
};

function testifbin(a) {
    var b = getXhr();
    b.open("GET", a, !1);
    b.overrideMimeType && b.overrideMimeType("text/plain; charset=x-user-defined");
    b.send(null);
    b = new BinaryReader(b.responseText);
    b.seek(80);
    var c = 84 + 50 * b.readUInt32(),
        c = b.getSize() == c;
    StlFile.setistext(!c);
    c ? readfilebin(b) : (b = getXhr(), b.open("GET", a, !1), b.overrideMimeType("text/plain; charset=x-user-defined"), b.send(null), readfileascii(b.responseText));
    self.postMessage({
        status: "startwebgl"
    });
    self.postMessage({
        status: "fileloaded"
    })
}
LoadBinaryResource = function(a) {
    var b = new XMLHttpRequest;
    b.open("GET", a, !1);
    b.overrideMimeType && b.overrideMimeType("text/plain; charset=x-user-defined");
    b.send(null);
    return 200 != b.status ? "" : "undefined" !== typeof b.responseBody ? (readfileascii(b.responseText), self.postMessage({
        status: "startwebgl"
    }), self.postMessage({
        status: "fileloaded"
    }), null) : b.responseText
};

function binRead(a) {
    a = new BinaryReader(a);
    a.seek(80);
    var b = 84 + 50 * a.readUInt32(),
        b = a.getSize() == b;
    StlFile.setistext(!b);
    if (b) readfilebin(a);
    else return null;
    self.postMessage({
        status: "startwebgl"
    });
    self.postMessage({
        status: "fileloaded"
    })
}

function testifbinUrl(a) {
    var b = LoadBinaryResource(a);
    if (null != b) b = new BinaryReader(b);
    else return null;
    b.seek(80);
    var c = 84 + 50 * b.readUInt32(),
        c = b.getSize() == c;
    StlFile.setistext(!c);
    c ? readfilebin(b) : (b = getXhr(), b.open("GET", a, !1), b.overrideMimeType("text/plain; charset=x-user-defined"), b.send(null), readfileascii(b.responseText));
    self.postMessage({
        status: "startwebgl"
    });
    self.postMessage({
        status: "fileloaded"
    })
}

function testifbinUrlout(a) {
    var b = getXhr();
    b.onreadystatechange = function() {
        4 == b.readyState && 200 == b.status && (consolelog(b.responseText), testifbinUrl("../Export/" + b.responseText))
    };
    b.open("POST", "/viewer/Request/getSTLout.php", !1);
    b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    b.overrideMimeType("text/plain; charset=x-user-defined");
    b.send("url=" + a)
}

function readfilebin(a) {
    a.seek(80);
    var b = a.readUInt32();
    StlFile.setNbfacet(b);
    var c = [],
        h = [];
    progressBar("start", b, "file is loading");
    for (var d = 0; d < b; d++) {
        progressBar("update", d);
        var g = [a.readFloat(), a.readFloat(), a.readFloat()];
        c.push(g);
        g = [a.readFloat(), a.readFloat(), a.readFloat()];
        h.push(g);
        g = [a.readFloat(), a.readFloat(), a.readFloat()];
        h.push(g);
        g = [a.readFloat(), a.readFloat(), a.readFloat()];
        h.push(g);
        a.readUInt16()
    }
    progressBar("dispose");
    StlFile.setNormal(c);
    StlFile.setVertice(h)
}

function readfileascii(a) {
    a = a.replace(/\r/, "\n");
    a = a.replace(/^solid[^\n]*/, "");
    a = a.replace(/\n/g, " ");
    a = a.replace(/facet normal /g, "");
    a = a.replace(/outer loop/g, "");
    a = a.replace(/vertex /g, "");
    a = a.replace(/endloop/g, "");
    a = a.replace(/endfacet/g, "");
    a = a.replace(/endsolid[^\n]*/, "");
    a = a.replace(/\s+/g, " ");
    a = a.replace(/^\s+/, "");
    a = a.split(" ");
    var b = a.length / 12;
    StlFile.nbfacet = Math.floor(b);
    var c = [],
        h = [];
    progressBar("start", b, "file is loading");
    for (var d = 0; d < b; d++) {
        progressBar("update", d);
        var g = [parseFloat(a[12 *
        d]), parseFloat(a[12 * d + 1], parseFloat(a[12 * d] + 2))];
        c.push(g);
        for (g = 0; 3 > g; g++) {
            var f = [parseFloat(a[12 * d + 3 * g + 3]), parseFloat(a[12 * d + 3 * g + 4]), parseFloat(a[12 * d + 3 * g + 5])];
            h.push(f)
        }
    }
    StlFile.setNormal(c);
    StlFile.setVertice(h);
    progressBar("dispose")
}

function readAMF(a) {
    var b = new XMLHttpRequest;
    b.onreadystatechange = function() {
        if (4 == b.readyState && 200 == b.status) {
            var a = b.responseText,
                a = (new DOMImplementation).loadXML(a);
            consolelog("XML Root Tag Name: " + a.documentElement.tagName);
            var h = a.getDocumentElement().getElementsByTagName("object").item(0).getElementsByTagName("mesh"),
                a = h.item(0).getElementsByTagName("vertices").item(0).getElementsByTagName("vertex"),
                h = h.item(0).getElementsByTagName("volume").item(0).getElementsByTagName("triangle"),
                d = h.getLength();
            StlFile.setNbfacet(d);
            var g = [],
                f = [],
                e = [];
            progressBar("start", a.getLength(), "file is loading 1");
            for (var j = 0; j < a.getLength(); j++) {
                progressBar("update", j);
                var k = a.item(j),
                    l = k.getElementsByTagName("coordinates").item(0),
                    k = parseFloat(l.getElementsByTagName("x").item(0).getFirstChild().getNodeValue()),
                    m = parseFloat(l.getElementsByTagName("y").item(0).getFirstChild().getNodeValue()),
                    l = parseFloat(l.getElementsByTagName("z").item(0).getFirstChild().getNodeValue());
                e.push([k, m, l])
            }
            progressBar("dispose");
            progressBar("start",
                d, "file is loading 2");
            for (j = 0; j < h.getLength(); j++) {
                progressBar("update", j);
                var k = h.item(j),
                    e = parseInt(k.getElementsByTagName("v1").item(0).getFirstChild().getNodeValue()),
                    d = parseInt(k.getElementsByTagName("v2").item(0).getFirstChild().getNodeValue()),
                    k = parseInt(k.getElementsByTagName("v3").item(0).getFirstChild().getNodeValue()),
                    m = [0, 0, 0],
                    l = [0, 0, 0],
                    r = [0, 0, 0],
                    e = a.item(e).getElementsByTagName("coordinates").item(0);
                m[0] = parseFloat(e.getElementsByTagName("x").item(0).getFirstChild().getNodeValue());
                m[1] = parseFloat(e.getElementsByTagName("y").item(0).getFirstChild().getNodeValue());
                m[2] = parseFloat(e.getElementsByTagName("z").item(0).getFirstChild().getNodeValue());
                f.push(m);
                e = a.item(d).getElementsByTagName("coordinates").item(0);
                l[0] = parseFloat(e.getElementsByTagName("x").item(0).getFirstChild().getNodeValue());
                l[1] = parseFloat(e.getElementsByTagName("y").item(0).getFirstChild().getNodeValue());
                l[2] = parseFloat(e.getElementsByTagName("z").item(0).getFirstChild().getNodeValue());
                f.push(l);
                e = a.item(k).getElementsByTagName("coordinates").item(0);
                r[0] = parseFloat(e.getElementsByTagName("x").item(0).getFirstChild().getNodeValue());
                r[1] = parseFloat(e.getElementsByTagName("y").item(0).getFirstChild().getNodeValue());
                r[2] = parseFloat(e.getElementsByTagName("z").item(0).getFirstChild().getNodeValue());
                f.push(r);
                d = Mymath.CreateNormal(f[3 * j], f[3 * j + 1], f[3 * j + 2]);
                g.push(d)
            }
            StlFile.setNormal(g);
            StlFile.setVertice(f);
            progressBar("dispose");
            self.postMessage({
                status: "startwebgl"
            })
        }
    };
    b.open("GET", a, !1);
    b.setRequestHeader("Content-Type", "text/xml");
    b.send("")
}

function showresults() {
    for (var a = StlFile.getNormal(), b = StlFile.getVertice(), c = StlFile.getNbfacet(), h = 0; h < c; h++) h++, document.getElementById("info").innerHTML = document.getElementById("info").innerHTML + "<br/> Facet number: " + h, h--, document.getElementById("info").innerHTML = document.getElementById("info").innerHTML + "<br/> Normal: " + a[h][0] + " " + a[h][1] + " " + a[h][2], document.getElementById("info").innerHTML = document.getElementById("info").innerHTML + "<br/> Vertice 1: " + b[3 * h][0] + " " + b[3 * h][1] + " " + b[3 * h][2],
        document.getElementById("info").innerHTML = document.getElementById("info").innerHTML + "<br/> Vertice 2: " + b[3 * h + 1][0] + " " + b[3 * h + 1][1] + " " + b[3 * h + 1][2], document.getElementById("info").innerHTML = document.getElementById("info").innerHTML + "<br/> Vertice 3: " + b[3 * h + 2][0] + " " + b[3 * h + 2][1] + " " + b[3 * h + 2][2]
}
var Machine = "",
    Material = "",
    Scenario = "";
onmessage = function(a) {
    switch (a.data.fnct) {
        case "new":
            StlFile.New();
            break;
        case "cutPart":
            a = a.data.arg;
            StlFile.cutPart(a[0], a[1], a[2]);
            break;
        case "setScenar":
            Machine = a.data.machine;
            Material = a.data.material;
            Scenario = a.data.scenario;
            StlFile.init(Scenario);
            break;
        case "calculateBoundingBox":
            StlFile.calculateBoundingBox();
            break;
        case "calculateArea":
            StlFile.calculateArea();
            break;
        case "moveToOrigin":
            StlFile.moveToOrigin();
            break;
        case "calculateVolume":
            StlFile.calculateVolume();
            break;
        case "calculateRoughness":
            var b =
                a.data.arg;
            StlFile.calculateRoughness(b);
            break;
        case "calculateRoughnessInterpolation":
            b = a.data.arg, StlFile.calculateRoughnessInterpolation(b);
        case "calculateSupport":
            b = a.data.arg;
            StlFile.calculateSupport(b);
            break;
        case "Facet2Facet":
            StlFile.Facet2Facet();
            break;
        case "setNbfacet":
            b = a.data.arg;
            StlFile.setNbfacet(b);
            break;
        case "setName":
            StlFile.setName(a.data.arg);
            break;
        case "testifbin":
            a = a.data.arg;
            testifbin(a);
            break;
        case "testifbinUrl":
            a = a.data.arg;
            testifbinUrl(a);
            break;
        case "testifbinUrlout":
            a = a.data.arg;
            testifbinUrlout(a);
            break;
        case "readAMF":
            readAMF(a.data.arg);
            break;
        case "stlGeometry":
            StlFile.setNormal(a.data.normals);
            StlFile.setVertice(a.data.vertices);
            StlFile.nbfacet = a.data.normals.length;
            StlFile.R = a.data.roughness;
            StlFile.Support = a.data.support;
            StlFile.Rmin = a.data.Rmin;
            StlFile.Rmax = a.data.Rmax;
            StlFile.SupportVol = a.data.supVol;
            StlFile.totalRoughness = a.data.totalR;
            break;
        case "getSTL":
            returnSTL();
            break;
        case "buildTimeFast":
            StlFile.CalculateBuildTime(!0);
            break;
        case "buildTimeSlow":
            StlFile.CalculateBuildTime(!1);
            break;
        case "calculsNewPart":
            a = parseInt(a.data.scenario);
            StlFile.scenario = a;
            StlFile.Init(a);
            StlFile.moveToOrigin();
            StlFile.calculateBoundingBox();
            StlFile.calculateVolume();
            0 >= StlFile.Volume && (StlFile.generateNormals(), StlFile.calculateVolume());
            StlFile.calculateArea();
            StlFile.calculateRoughnessInterpolation();
            StlFile.calculateSupport();
            self.postMessage({
                status: "endcalculations"
            });
            addPart();
            break;
        case "newAllCalc":
            a = parseInt(a.data.scenario);
            StlFile.scenario = a;
            StlFile.Init(a);
            StlFile.moveToOrigin();
            StlFile.calculateBoundingBox();
            StlFile.calculateVolume();
            0 >= StlFile.Volume && (StlFile.generateNormals(), StlFile.calculateVolume());
            StlFile.calculateArea();
            StlFile.calculateRoughnessInterpolation();
            StlFile.calculateSupport();
            StlFile.CalculateBuildTime(!0);
            StlFile.CalculateCost();
            self.postMessage({
                status: "endcalculations"
            });
            returnSTL();
            break;
        case "manufacturability":
            StlFile.isCut || StlFile.cutPart(30, 30, 30);
            StlFile.isSeparated || StlFile.SurfaceSeparation();
            StlFile.RecognitionDone || StlFile.SurfaceRecognition();
            for (var c = 0; c < StlFile.SurfaceList.length; c++)(2 == StlFile.SurfaceList[c].type || 3 == StlFile.SurfaceList[c].type) && StlFile.SurfaceList[c].getGeometrieData();
            StlFile.FacetDistanceDone || StlFile.Facet2Facet();
            returnSTL(!1);
            self.postMessage({
                status: "finimanuf"
            });
            break;
        case "Slice":
            !StlFile.isCut && !StlFile.isCutSmall && StlFile.cutPartSmall(30, 30, 30);
            StlFile.Slice();
            returnSlices();
            break;
        case "Rotation":
            StlFile.Rotate(a.data.x, a.data.y, a.data.z);
            StlFile.moveCentroid(StlFile.centroid);
            StlFile.calculateVolume();
            StlFile.calculateRoughnessInterpolation();
            StlFile.calculateSupport();
            StlFile.CalculateBuildTime(!0);
            StlFile.CalculateCost();
            StlFile.nickname += "Rotated, ";
            updateSTL();
            break;
        case "scale":
            b = StlFile.centroid.slice(0);
            StlFile.scale(a.data.val);
            StlFile.calculateArea();
            StlFile.moveCentroid(b);
            StlFile.calculateVolume();
            StlFile.calculateRoughnessInterpolation();
            StlFile.calculateSupport();
            StlFile.CalculateBuildTime(!0);
            StlFile.CalculateCost();
            StlFile.nickname += "scaled, ";
            updateSTL();
            break;
        case "move":
            StlFile.move(a.data.x,
                a.data.y, a.data.z);
            StlFile.calculateVolume();
            StlFile.calculateSupport();
            StlFile.CalculateBuildTime(!0);
            StlFile.CalculateCost();
            StlFile.nickname += "moved, ";
            updateSTL();
            break;
        case "merge":
            a = JSON.parse(a.data.files);
            for (c = 0; c < a.length; c++) StlFile.merge(a[c]), delete a[c], a[c] = null;
            StlFile.generateNormals();
            StlFile.calculateBoundingBox();
            StlFile.calculateVolume();
            StlFile.calculateArea();
            StlFile.calculateRoughnessInterpolation();
            StlFile.calculateSupport();
            StlFile.CalculateBuildTime(!0);
            StlFile.CalculateCost();
            returnSTL();
            break;
        case "exportAMFdec":
            StlFile.isCut || StlFile.cutPart(30, 30, 30);
            a = null;
            for (c = 0; c < StlFile.VertexUnique.length; c++) a.push([StlFile.VertexUnique[c].coordinates[0], StlFile.VertexUnique[c].coordinates[1], StlFile.VertexUnique[c].coordinates[2]]);
            b = null;
            for (c = 0; c < StlFile.facets.length; c++) b.push([StlFile.facets[c].vertices[0].number, StlFile.facets[c].vertices[1].number, StlFile.facets[c].vertices[2].number]);
            var h = JSON.stringify(a);
            a = null;
            var d = JSON.stringify(b),
                b = null,
                g = 3E5;
            if (d.length > g ||
                h.length > g) {
                a = Math.ceil(d.length / g) + 1;
                var b = Math.ceil(h.length / g) + 1,
                    f = a > b ? a : b;
                progressBar("start", f, "The part is being prepared for export");
                a = getXhr();
                a.open("POST", "/viewer/Request/fileinit.php", !1);
                a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                var e = "name=" + StlFile.name + "&vertices=" + h.substring(0, g) + "&triangles=" + d.substring(0, g);
                a.send(e);
                var c = 1,
                    j = !0,
                    k = getXhr();
                k.onreadystatechange = function() {
                    if (4 == k.readyState && 200 == k.status)
                        if (progressBar("update", c), c++, c <= f + 1) {
                            var a =
                                "name=" + StlFile.name + "&vertices=" + h.substring(c * g + 1, (c + 1) * g) + "&triangles=" + d.substring(c * g + 1, (c + 1) * g);
                            k.open("POST", "/viewer/Request/fileupdate.php", !1);
                            k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            k.send(a)
                        } else j = !1
                };
                e = "name=" + StlFile.name + "&vertices=" + h.substring(c * g + 1, (c + 1) * g) + "&triangles=" + d.substring(c * g + 1, (c + 1) * g);
                k.open("POST", "/viewer/Request/fileupdate.php", !1);
                k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                for (k.send(e); j;);
                var l = getXhr();
                l.onreadystatechange = function() {
                    4 == l.readyState && 200 == l.status && (progressBar("dispose"), self.postMessage({
                        status: "iframe",
                        arg: l.responseText,
                        type: "amf"
                    }))
                };
                l.open("POST", "/viewer/Request/filefinishAMF.php", !1);
                l.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                e = "Name=" + StlFile.name + "&Rmin=" + StlFile.Rmin + "&Rmax=" + StlFile.Rmax + "&totalR=" + StlFile.totalRoughness + "&supvol=" + StlFile.SupportVol + "&machine=" + Machine + "&material=" + Material + "&scenario=" + Scenario;
                l.send(e)
            } else {
                var m = getXhr();
                m.onreadystatechange = function() {
                    4 == m.readyState && 200 == m.status && self.postMessage({
                        status: "iframe",
                        arg: m.responseText,
                        type: "amf"
                    })
                };
                try {
                    m.open("POST", "/viewer/Request/makeAMF.php", !1), m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), e = "vertices=" + JSON.stringify(a) + "&triangles=" + JSON.stringify(b) + "&Name=" + StlFile.name + "&Rmin=" + StlFile.Rmin + "&Rmax=" + StlFile.Rmax + "&totalR=" + StlFile.totalRoughness + "&supvol=" + StlFile.SupportVol + "&machine=" + Machine + "&material=" + Material + "&scenario=" +
                        Scenario, m.send(e)
                } catch (r) {
                    debugmsg("file too big impossible to convert it")
                }
            }
            break;
        case "exportSTLdec":
            var h = JSON.stringify(StlFile.vertex),
                n = JSON.stringify(StlFile.normal),
                g = 3E5;
            if (n.length > g || h.length > g) {
                a = Math.ceil(n.length / g) + 1;
                b = Math.ceil(h.length / g) + 1;
                f = a > b ? a : b;
                progressBar("start", f, "The part is being prepared for export");
                a = getXhr();
                a.open("POST", "/viewer/Request/fileinitSTL.php", !1);
                a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                e = "name=" + StlFile.name + "&vertices=" +
                    h.substring(0, g) + "&normals=" + n.substring(0, g);
                a.send(e);
                c = 1;
                j = !0;
                k = getXhr();
                k.onreadystatechange = function() {
                    if (4 == k.readyState && 200 == k.status)
                        if (progressBar("update", c), c++, c <= f + 1) {
                            var a = "name=" + StlFile.name + "&vertices=" + h.substring(c * g + 1, (c + 1) * g) + "&normals=" + n.substring(c * g + 1, (c + 1) * g);
                            k.open("POST", "/viewer/Request/fileupdateSTL.php", !1);
                            k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            k.send(a)
                        } else j = !1
                };
                e = "name=" + StlFile.name + "&vertices=" + h.substring(c * g + 1, (c + 1) * g) + "&normals=" +
                    n.substring(c * g + 1, (c + 1) * g);
                k.open("POST", "/viewer/Request/fileupdateSTL.php", !1);
                k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                for (k.send(e); j;);
                l = getXhr();
                l.onreadystatechange = function() {
                    4 == l.readyState && 200 == l.status && (progressBar("dispose"), self.postMessage({
                        status: "iframe",
                        arg: l.responseText,
                        type: "stl"
                    }))
                };
                l.open("POST", "/viewer/Request/filefinishSTL.php", !1);
                l.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                e = "Name=" + StlFile.name + "&nbfacet=" + StlFile.nbfacet;
                l.send(e)
            } else {
                m = getXhr();
                m.onreadystatechange = function() {
                    4 == m.readyState && 200 == m.status && (consolelog(m.responseText), self.postMessage({
                        status: "iframe",
                        arg: m.responseText,
                        type: "stl"
                    }))
                };
                try {
                    m.open("POST", "/viewer/Request/makeSTL.php", !1), m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), e = "vertices=" + JSON.stringify(StlFile.vertex) + "&normals=" + JSON.stringify(StlFile.normal) + "&Name=" + StlFile.name, m.send(e)
                } catch (t) {
                    debugmsg("file too big impossible to convert it")
                }
            }
            break;
        case "exportSTL":
            h =
                JSON.stringify(StlFile.vertex);
            n = JSON.stringify(StlFile.normal);
            g = 3E5;
            if (n.length > g || h.length > g) {
                var h = h.slice(2, -2),
                    n = n.slice(2, -2),
                    s = h.split("],["),
                    p = n.split("],["),
                    n = h = null,
                    q = 1E4,
                    w = Math.ceil(p.length / q) + 1;
                progressBar("start", w, "The part is being prepared for export");
                var v = s.slice(0, 3 * q),
                    u = p.slice(0, q),
                    z = v.join(";"),
                    v = null,
                    x = u.join(";"),
                    u = null;
                a = getXhr();
                a.open("POST", "/viewer/Request/fileinitSTLnew.php", !1);
                a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                e = "name=" + StlFile.name +
                    "&vertices=" + z + "&normals=" + x;
                a.send(e);
                c = 1;
                j = !0;
                k = getXhr();
                k.onreadystatechange = function() {
                    4 == k.readyState && 200 == k.status && (progressBar("update", c), c++, c < w ? (v = s.slice(3 * c * q, 3 * (c + 1) * q), u = p.slice(c * q, (c + 1) * q), z = v.join(";"), v = null, x = u.join(";"), u = null, e = "name=" + StlFile.name + "&vertices=" + z + "&normals=" + x, k.open("POST", "/viewer/Request/fileupdateSTLnew.php", !1), k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), k.send(e)) : j = !1)
                };
                v = s.slice(3 * c * q, 3 * (c + 1) * q);
                u = p.slice(c * q, (c + 1) * q);
                z = v.join(";");
                v = null;
                x = u.join(";");
                u = null;
                e = "name=" + StlFile.name + "&vertices=" + z + "&normals=" + x;
                k.open("POST", "/viewer/Request/fileupdateSTLnew.php", !1);
                k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                for (k.send(e); j;);
                p = s = null;
                l = getXhr();
                l.onreadystatechange = function() {
                    4 == l.readyState && 200 == l.status && (progressBar("dispose"), self.postMessage({
                        status: "iframe",
                        arg: l.responseText,
                        type: "stl"
                    }))
                };
                l.open("POST", "/viewer/Request/filefinishSTLnew.php", !1);
                l.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                e = "Name=" + StlFile.name + "&nbfacet=" + StlFile.nbfacet;
                l.send(e)
            } else {
                m = getXhr();
                m.onreadystatechange = function() {
                    4 == m.readyState && 200 == m.status && self.postMessage({
                        status: "iframe",
                        arg: m.responseText,
                        type: "stl"
                    })
                };
                try {
                    m.open("POST", "/viewer/Request/makeSTL.php", !1), m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), e = "vertices=" + JSON.stringify(StlFile.vertex) + "&normals=" + JSON.stringify(StlFile.normal) + "&Name=" + StlFile.name, m.send(e)
                } catch (y) {
                    debugmsg("file too big impossible to convert it")
                }
            }
            break;
        case "exportAMF":
            StlFile.isCut || StlFile.cutPart(30, 30, 30);
            a = [];
            for (c = 0; c < StlFile.VertexUnique.length; c++) a.push([StlFile.VertexUnique[c].coordinates[0], StlFile.VertexUnique[c].coordinates[1], StlFile.VertexUnique[c].coordinates[2]]);
            b = [];
            for (c = 0; c < StlFile.facets.length; c++) b.push([StlFile.facets[c].vertices[0].number, StlFile.facets[c].vertices[1].number, StlFile.facets[c].vertices[2].number]);
            h = JSON.stringify(a);
            a = null;
            d = JSON.stringify(b);
            b = null;
            g = 3E4;
            if (d.length > g || h.length > g) {
                h = h.slice(2, -2);
                d = d.slice(2, -2);
                s = h.split("],[");
                p = d.split("],[");
                d = h = null;
                q = 1E4;
                w = Math.max(Math.ceil(s.length / q) + 1, Math.ceil(p.length / q) + 1);
                progressBar("start", w, "The part is being prepared for export");
                v = s.slice(0, q);
                u = p.slice(0, q);
                z = v.join(";");
                v = null;
                x = u.join(";");
                u = null;
                a = getXhr();
                a.open("POST", "/viewer/Request/fileinitAMFnew.php", !1);
                a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                e = "name=" + StlFile.name + "&vertices=" + z + "&triangles=" + x;
                a.send(e);
                c = 1;
                j = !0;
                k = getXhr();
                k.onreadystatechange = function() {
                    4 ==
                    k.readyState && 200 == k.status && (progressBar("update", c), c++, c < w ? (v = s.slice(c * q, (c + 1) * q), u = p.slice(c * q, (c + 1) * q), z = v.join(";"), v = null, x = u.join(";"), u = null, e = "name=" + StlFile.name + "&vertices=" + z + "&triangles=" + x, k.open("POST", "/viewer/Request/fileupdateAMFnew.php", !1), k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), k.send(e)) : j = !1)
                };
                v = s.slice(c * q, (c + 1) * q);
                u = p.slice(c * q, (c + 1) * q);
                z = v.join(";");
                v = null;
                x = u.join(";");
                u = null;
                e = "name=" + StlFile.name + "&vertices=" + z + "&triangles=" + x;
                k.open("POST",
                    "/viewer/Request/fileupdateAMFnew.php", !1);
                k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                for (k.send(e); j;);
                p = s = null;
                l = getXhr();
                l.onreadystatechange = function() {
                    4 == l.readyState && 200 == l.status && (consolelog(l.responseText), progressBar("dispose"), self.postMessage({
                        status: "iframe",
                        arg: l.responseText,
                        type: "amf"
                    }))
                };
                l.open("POST", "/viewer/Request/filefinishAMFnew.php", !1);
                l.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                e = "Name=" + StlFile.name + "&Rmin=" + StlFile.Rmin +
                    "&Rmax=" + StlFile.Rmax + "&totalR=" + StlFile.totalRoughness + "&supvol=" + StlFile.SupportVol + "&machine=" + Machine + "&material=" + Material + "&scenario=" + Scenario;
                l.send(e)
            } else {
                m = getXhr();
                m.onreadystatechange = function() {
                    4 == m.readyState && 200 == m.status && self.postMessage({
                        status: "iframe",
                        arg: m.responseText,
                        type: "amf"
                    })
                };
                try {
                    m.open("POST", "/viewer/Request/makeAMF.php", !1), m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), e = "vertices=" + h + "&triangles=" + d + "&Name=" + StlFile.name + "&Rmin=" + StlFile.Rmin +
                        "&Rmax=" + StlFile.Rmax + "&totalR=" + StlFile.totalRoughness + "&supvol=" + StlFile.SupportVol + "&machine=" + Machine + "&material=" + Material + "&scenario=" + Scenario, m.send(e)
                } catch (C) {
                    debugmsg("file too big impossible to convert it")
                }
            }
            break;
        case "binRead":
            binRead(a.data.arg)
    }
};
updateSTL = function() {
    self.postMessage({
        status: "updateSTL",
        arg: JSON.stringify(StlFile)
    })
};
returnSlices = function() {
    self.postMessage({
        status: "returnSlices",
        arg: JSON.stringify(StlFile.slices)
    })
};
returnSTL = function(a) {
    void 0 === a && (a = !0);
    a ? self.postMessage({
        status: "returnSTL",
        arg: JSON.stringify(StlFile)
    }) : self.postMessage({
        status: "returnSTLsansShow",
        arg: JSON.stringify(StlFile)
    })
};
addPart = function() {
    self.postMessage({
        status: "addPart",
        arg: JSON.stringify(StlFile)
    })
};
showObject = function(a) {
    self.postMessage({
        status: "object",
        arg: JSON.stringify(a)
    })
};
debugmsg = function(a) {
    self.postMessage({
        status: "debug",
        arg: a
    })
};
consolelog = function(a) {
    self.postMessage({
        status: "console",
        arg: a
    })
};
progressBar = function(a, b, c) {
    self.postMessage({
        status: "progressBar",
        op: a,
        arg1: b,
        arg2: c
    })
};
Result = function(a) {
    self.postMessage({
        status: a.status,
        arg: a.arg
    })
};
updateView = function() {
    self.postMessage({
        status: "updateView"
    })
};