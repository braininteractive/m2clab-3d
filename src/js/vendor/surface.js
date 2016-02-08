var Surface = function() {
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
};

module.exports = Surface;