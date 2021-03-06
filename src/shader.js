/*
 |   shader.js - A small and compact closure-compiler compatible javascript library for managing shaders.
 |----------------
 |  shader.js, and all compiled versions of shader.js are copyright Patrick Rhodes Martin, 2013, 2019.
 |-
 */
window.shaderlog = {};
window["ShaderPrototype"] = Object.create(Object, {
    _shader: {
        value: null,
        writable: true
    },
    _keys: {
        value: Object.create(Object),
        writable: true
    },

    _isUnchanged: {
        value: function(property) {
            var val = property.val;
            var cval = property.cval;
            var i;
            var unchanged = true;
            if (val === cval)
                return true;
            if (val instanceof Array && cval instanceof Array) {
                if (val.length != cval.length)
                    return false;
                else
                    for (i = 0; i < val.length; i++)
                        unchanged = unchanged && (val[i] === cval[i]);
                return unchanged;
            }
            return false;
        },
        writable: false
    },


    'load': {
        value: function(vertexUrl, fragmentUrl, expire) {
            if (typeof(window.localStorage) === "undefined" || typeof(expire) === 'undefined' || expire <= 0) {
                if (typeof(window.shaderlog[vertexUrl]) === 'undefined') {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET", vertexUrl, false);
                    xmlhttp.send();
                    if ((xmlhttp.status === 200)) {
                        window.shaderlog[vertexUrl] = xmlhttp.responseText;
                        this.vertSrc = xmlhttp.responseText;
                    }
                } else {
                    this.vertSrc = window.shaderlog[vertexUrl];
                }
                if (typeof(window.shaderlog[fragmentUrl]) === 'undefined') {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET", fragmentUrl, false);
                    xmlhttp.send();
                    if ((xmlhttp.status === 200)) {
                        window.shaderlog[fragmentUrl] = xmlhttp.responseText;
                        this.fragSrc = xmlhttp.responseText;
                    }
                } else {
                    this.fragSrc = window.shaderlog[fragmentUrl];
                }
                return;
            }
            if (window["localStorage"]["getItem"](vertexUrl) === null || parseInt(window["localStorage"]["getItem"](vertexUrl).split('\u0003')[1], 16) < window["Date"]["now"]()) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", vertexUrl, false);
                xmlhttp.send();
                if ((xmlhttp.status === 200)) {
                    window["localStorage"]["setItem"](vertexUrl, xmlhttp.responseText + "\u0003" + ((expire * 86400000) + window["Date"]["now"]()).toString(16));
                    this.vertSrc = xmlhttp.responseText;
                }
            } else {
                this.vertSrc = window["localStorage"]["getItem"](vertexUrl).split('\u0003')[0];
            }
            if (window["localStorage"]["getItem"](fragmentUrl) === null || parseInt(window["localStorage"]["getItem"](fragmentUrl).split('\u0003')[1], 16) < window["Date"]["now"]()) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", fragmentUrl, false);
                xmlhttp.send();
                if ((xmlhttp.status === 200)) {
                    window["localStorage"]["setItem"](fragmentUrl, xmlhttp.responseText + "\u0003" + ((expire * 86400000) + window["Date"]["now"]()).toString(16));
                    this.fragSrc = xmlhttp.responseText;
                }
            } else {
                this.fragSrc = window["localStorage"]["getItem"](fragmentUrl).split('\u0003')[0];
            }
        }
    },

    'updateOption': {
        value: function(key, value) {
            if (this._keys[key]) {
                this._keys[key].val = value;
                return true;
            }
            return false;
        },
        writable: false
    },

    'addOption': {
        value: function(key, value, type) {
            if (this._keys[key] == null) {
                this._keys[key] = {
                    val: value,
                    datatype: type,
                    cval: null
                };

                return true;
            }
            return false;
        },
        writable: false
    },

    'bindShader': {
        value: function(gl) {
            gl["useProgram"](this._shader);
            var props = this._keys.keys(this._keys);
            var key = null;
            var uniform = null;
            var type = null;
            for (var i = 0; i < props.length; i++) {
                key = props[i];
                if (this._isUnchanged(this._keys[key]))
                    continue;
                uniform = gl["getUniformLocation"](this._shader, key);
                if ((uniform || null) != null) {
                    type = this._keys[key].datatype;
                    switch (type) {
                        case '1f':
                            gl["uniform1f"](uniform, this._keys[key].val);
                            break;
                        case '2f':
                            gl["uniform2f"](uniform, this._keys[key].val[0], this._keys[key].val[1]);
                            break;
                        case '3f':
                            gl["uniform3f"](uniform, this._keys[key].val[0], this._keys[key].val[1], this._keys[key].val[2]);
                            break;
                        case '4f':
                            gl["uniform4f"](uniform, this._keys[key].val[0], this._keys[key].val[1], this._keys[key].val[2], this._keys[key].val[3]);
                            break;
                        case '1i':
                            gl["uniform1i"](uniform, this._keys[key].val);
                            break;
                        case '2i':
                            gl["uniform2i"](uniform, this._keys[key].val[0], this._keys[key].val[1]);
                            break;
                        case '3i':
                            gl["uniform3i"](uniform, this._keys[key].val[0], this._keys[key].val[1], this._keys[key].val[2]);
                            break;
                        case '4i':
                            gl["uniform4i"](uniform, this._keys[key].val[0], this._keys[key].val[1], this._keys[key].val[2], this._keys[key].val[3]);
                            break;
                        case '1fv':
                            gl["uniform1fv"](uniform, this._keys[key].val);
                            break;
                        case '2fv':
                            gl["uniform2fv"](uniform, this._keys[key].val);
                            break;
                        case '3fv':
                            gl["uniform3fv"](uniform, this._keys[key].val);
                            break;
                        case '4fv':
                            gl["uniform4fv"](uniform, this._keys[key].val);
                            break;
                        case '1iv':
                            gl["uniform1iv"](uniform, this._keys[key].val);
                            break;
                        case '2iv':
                            gl["uniform2iv"](uniform, this._keys[key].val);
                            break;
                        case '3iv':
                            gl["uniform3iv"](uniform, this._keys[key].val);
                            break;
                        case '4iv':
                            gl["uniform4iv"](uniform, this._keys[key].val);
                            break;
                        case 'Matrix2fv':
                            gl["uniformMatrix2fv"](uniform, false, this._keys[key].val);
                            break;
                        case 'Matrix3fv':
                            gl["uniformMatrix3fv"](uniform, false, this._keys[key].val);
                            break;
                        case 'Matrix4fv':
                            gl["uniformMatrix4fv"](uniform, false, this._keys[key].val);
                            break;
                    }
                    this._keys[key].cval = this._keys[key].val;
                }
            }
        },

        writable: false
    },

    'getShader': {
        value: function() {
            return this._shader;
        },
        writable: false
    },

    'compile': {
        value: function(gl, err) {
            var shaderProgram;
            this._shader = shaderProgram = gl["createProgram"]();


            this._vert = this._compile(gl, this.vertSrc, gl["VERTEX_SHADER"]);
            this._frag = this._compile(gl, this.fragSrc, gl["FRAGMENT_SHADER"]);

            gl["attachShader"](shaderProgram, this._vert);
            gl["attachShader"](shaderProgram, this._frag);
            gl["linkProgram"](shaderProgram);

            if (!gl["getProgramParameter"](shaderProgram, gl["LINK_STATUS"])) {
                var errorMsg = gl["getProgramInfoLog"](shaderProgram);
                gl["deleteProgram"](shaderProgram);
                gl["deleteShader"](this._vert);
                gl["deleteShader"](this._frag);
                if (err) {
                    err();
                } else {
                    throw new Error(errorMsg);
                }
                return;
            }
        },
        writable: false
    },

    _compile: {
        value: function(gl, source, type) {
            var shaderHeader = "#ifdef GL_ES\n";
            shaderHeader += "precision highp float;\n";
            shaderHeader += "#endif\n";

            var shader = gl["createShader"](type);

            gl["shaderSource"](shader, shaderHeader + source);
            gl["compileShader"](shader);

            if (!gl["getShaderParameter"](shader, gl["COMPILE_STATUS"])) {
                console.debug(gl["getShaderInfoLog"](shader));
                gl["deleteShader"](shader);
                return null;
            }

            return shader;
        }
    }
});
