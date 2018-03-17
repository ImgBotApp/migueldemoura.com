/**
MIT License

Copyright (c) 2017-present Desmond Ding
Copyright (c) 2018-present Miguel de Moura

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.Zooming = factory());
}(this, (function () {
    'use strict';

    function listen(el, event, handler) {
        var add = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        var options = {
            passive: false
        };

        if (add) {
            el.addEventListener(event, handler, options);
        } else {
            el.removeEventListener(event, handler, options);
        }
    }

    function loadImage(src) {
        if (src) {
            new Image().src = src;
        }
    }

    function getOriginalSource(el) {
        if (el.dataset.original) {
            return el.dataset.original;
        } else if (el.parentNode.tagName === 'A') {
            return el.parentNode.getAttribute('href');
        } else {
            return null;
        }
    }

    function setStyle(el, styles, remember) {
        checkTrans(styles);

        var s = el.style;
        var original = {};

        for (var key in styles) {
            if (remember) {
                original[key] = s[key] || '';
            }

            s[key] = styles[key];
        }

        return original;
    }

    function bindAll(_this, that) {
        var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(_this));
        methods.forEach(function bindOne(method) {
            _this[method] = _this[method].bind(that);
        });
    }

    var trans = sniffTransition(document.createElement('div'));
    var transformCssProp = trans.transformCssProp;
    var transEndEvent = trans.transEndEvent;

    function checkTrans(styles) {
        var transitionProp = trans.transitionProp,
            transformProp = trans.transformProp;

        if (styles.transition) {
            var value = styles.transition;
            delete styles.transition;
            styles[transitionProp] = value;
        }

        if (styles.transform) {
            var _value = styles.transform;
            delete styles.transform;
            styles[transformProp] = _value;
        }
    }

    function sniffTransition(el) {
        var res = {};
        var trans = ['webkitTransition', 'transition', 'mozTransition'];
        var tform = ['webkitTransform', 'transform', 'mozTransform'];
        var end = {
            transition: 'transitionend',
            mozTransition: 'transitionend',
            webkitTransition: 'webkitTransitionEnd'
        };

        trans.some(function hasTransition(prop) {
            if (el.style[prop] !== undefined) {
                res.transitionProp = prop;
                res.transEndEvent = end[prop];
                return true;
            }
        });

        tform.some(function hasTransform(prop) {
            if (el.style[prop] !== undefined) {
                res.transformProp = prop;
                res.transformCssProp = prop.replace(/(.*)Transform/, '-$1-transform');
                return true;
            }
        });

        return res;
    }

    var handler = {
        init: function init(instance) {
            bindAll(this, instance);
        },
        click: function click(e) {
            e.preventDefault();

            if (this.shown) {
                if (this.released) {
                    this.close();
                } else {
                    this.release();
                }
            } else {
                this.open(e.currentTarget);
            }
        },
        scroll: function scroll() {
            var el = document.documentElement || document.body.parentNode || document.body;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            var scrollTop = window.pageYOffset || el.scrollTop;

            if (this.lastScrollPosition === null) {
                this.lastScrollPosition = {
                    x: scrollLeft,
                    y: scrollTop
                };
            }

            var deltaX = this.lastScrollPosition.x - scrollLeft;
            var deltaY = this.lastScrollPosition.y - scrollTop;
            var threshold = 40;

            if (Math.abs(deltaY) >= threshold || Math.abs(deltaX) >= threshold) {
                this.lastScrollPosition = null;
                this.close();
            }
        },
        keydown: function keydown(e) {
            if ((e.key || e.code) === 'Escape' || e.keyCode === 27) {
                if (this.released) {
                    this.close();
                } else {
                    this.release(this.close);
                }
            }
        },
        clickOverlay: function clickOverlay() {
            this.close();
        },
        resizeWindow: function resizeWindow() {
            this.close();
        }
    };

    var overlay = {
        init: function init(instance) {
            this.el = document.createElement('div');
            this.instance = instance;
            this.parent = document.body;

            setStyle(this.el, {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0
            });

            this.updateStyle(instance.options);
            listen(this.el, 'click', instance.handler.clickOverlay.bind(instance));
        },
        updateStyle: function updateStyle(options) {
            setStyle(this.el, {
                zIndex: 998,
                backgroundColor: 'rgb(255, 255, 255)',
                transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0, 1)'
            });
        },
        insert: function insert() {
            this.parent.appendChild(this.el);
        },
        remove: function remove() {
            this.parent.removeChild(this.el);
        },
        fadeIn: function fadeIn() {
            this.el.offsetWidth;
            this.el.style.opacity = 1;
        },
        fadeOut: function fadeOut() {
            this.el.style.opacity = 0;
        }
    };

    // Translate z-axis to fix CSS grid display issue in Chrome:
    // https://github.com/kingdido999/zooming/issues/42
    var TRANSLATE_Z = 0;

    var target = {
        init: function init(el, instance) {
            this.el = el;
            this.instance = instance;
            this.srcThumbnail = this.el.getAttribute('src');
            this.srcset = this.el.getAttribute('srcset');
            this.srcOriginal = getOriginalSource(this.el);
            this.rect = this.el.getBoundingClientRect();
            this.translate = null;
            this.scale = null;
            this.styleOpen = null;
            this.styleClose = null;
        },
        zoomIn: function zoomIn() {
            this.translate = this.calculateTranslate();
            this.scale = this.calculateScale();

            this.styleOpen = {
                position: 'relative',
                zIndex: 999,
                cursor: 'zoom-out',
                transition: transformCssProp + ' 0.4s cubic-bezier(0.4, 0, 0, 1)',
                transform: 'translate3d(' + this.translate.x + 'px, ' + this.translate.y + 'px, ' + TRANSLATE_Z + 'px) scale(' + this.scale.x + ',' + this.scale.y + ')',
                height: this.rect.height + 'px',
                width: this.rect.width + 'px'

                // Force layout update
            };
            this.el.offsetWidth;

            // Trigger transition
            this.styleClose = setStyle(this.el, this.styleOpen, true);
        },
        zoomOut: function zoomOut() {
            // Force layout update
            this.el.offsetWidth;

            setStyle(this.el, {
                transform: 'none'
            });
        },
        restoreCloseStyle: function restoreCloseStyle() {
            setStyle(this.el, this.styleClose);
        },
        upgradeSource: function upgradeSource() {
            if (this.srcOriginal) {
                var parentNode = this.el.parentNode;

                if (this.srcset) {
                    this.el.removeAttribute('srcset');
                }

                var temp = this.el.cloneNode(false);

                // Force compute the hi-res image in DOM to prevent
                // image flickering while updating src
                temp.setAttribute('src', this.srcOriginal);
                temp.style.position = 'fixed';
                temp.style.visibility = 'hidden';
                parentNode.appendChild(temp);

                // Add delay to prevent Firefox from flickering
                setTimeout(function updateSrc() {
                    this.el.setAttribute('src', this.srcOriginal);
                    parentNode.removeChild(temp);
                }.bind(this), 50);
            }
        },
        downgradeSource: function downgradeSource() {
            if (this.srcOriginal) {
                if (this.srcset) {
                    this.el.setAttribute('srcset', this.srcset);
                }
                this.el.setAttribute('src', this.srcThumbnail);
            }
        },
        calculateTranslate: function calculateTranslate() {
            var windowCenter = getWindowCenter();
            var targetCenter = {
                x: this.rect.left + this.rect.width / 2,
                y: this.rect.top + this.rect.height / 2

                // The vector to translate image to the window center
            };
            return {
                x: windowCenter.x - targetCenter.x,
                y: windowCenter.y - targetCenter.y
            };
        },
        calculateScale: function calculateScale() {
            var _el$dataset = this.el.dataset,
                zoomingHeight = _el$dataset.zoomingHeight,
                zoomingWidth = _el$dataset.zoomingWidth;

            var targetHalfWidth = this.rect.width / 2;
            var targetHalfHeight = this.rect.height / 2;
            var windowCenter = getWindowCenter();

            // The distance between target edge and window edge
            var targetEdgeToWindowEdge = {
                x: windowCenter.x - targetHalfWidth,
                y: windowCenter.y - targetHalfHeight
            };

            var scaleHorizontally = targetEdgeToWindowEdge.x / targetHalfWidth;
            var scaleVertically = targetEdgeToWindowEdge.y / targetHalfHeight;

            // The additional scale is based on the smaller value of
            // scaling horizontally and scaling vertically
            var scale = 0.90 + Math.min(scaleHorizontally, scaleVertically);

            // Return the one that's smaller
            var maxZoomingWidth = zoomingWidth / this.rect.width,
                maxZoomingHeight = zoomingHeight / this.rect.height
            if (zoomingHeight && zoomingWidth &&
                scale > maxZoomingWidth || scale > maxZoomingHeight
            ) {
                return {
                    x: maxZoomingWidth,
                    y: maxZoomingHeight
                }
            } else {
                return {
                    x: scale,
                    y: scale
                }
            }
        }
    };

    function getWindowCenter() {
        var docEl = document.documentElement;
        var windowWidth = Math.min(docEl.clientWidth, window.innerWidth);
        var windowHeight = Math.min(docEl.clientHeight, window.innerHeight);

        return {
            x: windowWidth / 2,
            y: windowHeight / 2
        };
    }

    var createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    /**
     * Zooming instance.
     */

    var Zooming = function () {
        function Zooming() {
            this.target = Object.create(target);
            this.overlay = Object.create(overlay);
            this.handler = Object.create(handler);
            this.body = document.body;

            this.shown = false;
            this.lock = false;
            this.released = true;
            this.lastScrollPosition = null;
            this.pressTimer = null;

            this.overlay.init(this);
            this.handler.init(this);
            this.listen('img[data-action="zoom"]');
        }

        createClass(Zooming, [{
            key: 'listen',
            value: function listen$$1(el) {
                if (typeof el === 'string') {
                    var els = document.querySelectorAll(el);
                    var i = els.length;

                    while (i--) {
                        this.listen(els[i]);
                    }
                } else if (el.tagName === 'IMG') {
                    el.style.cursor = 'zoom-in';
                    listen(el, 'click', this.handler.click);
                }

                return this;
            }
        }, {
            key: 'config',
            value: function config(options) {
                if (options) {
                    _extends(this.options, options);
                    this.overlay.updateStyle(this.options);
                    return this;
                } else {
                    return this.options;
                }
            }
        }, {
            key: 'open',
            value: function open(el) {
                var _this = this;

                if (this.shown || this.lock) return;

                var target$$1 = typeof el === 'string' ? document.querySelector(el) : el;

                if (target$$1.tagName !== 'IMG') return;

                this.target.init(target$$1, this);

                loadImage(this.target.srcOriginal);

                this.shown = true;
                this.lock = true;

                this.target.zoomIn();
                this.overlay.insert();
                this.overlay.fadeIn();

                listen(document, 'scroll', this.handler.scroll);
                listen(document, 'keydown', this.handler.keydown);
                listen(window, 'resize', this.handler.resizeWindow);

                var onOpenEnd = function onOpenEnd() {
                    listen(target$$1, transEndEvent, onOpenEnd, false);
                    _this.lock = false;
                    _this.target.upgradeSource();
                };

                listen(target$$1, transEndEvent, onOpenEnd);

                return this;
            }
        }, {
            key: 'close',
            value: function close() {
                var _this2 = this;

                if (!this.shown || this.lock) return;

                var target$$1 = this.target.el;

                this.lock = true;
                this.body.style.cursor = 'auto';
                this.overlay.fadeOut();
                this.target.zoomOut();

                listen(document, 'scroll', this.handler.scroll, false);
                listen(document, 'keydown', this.handler.keydown, false);
                listen(window, 'resize', this.handler.resizeWindow, false);

                var onCloseEnd = function onCloseEnd() {
                    listen(target$$1, transEndEvent, onCloseEnd, false);

                    _this2.shown = false;
                    _this2.lock = false;

                    _this2.target.downgradeSource();
                    _this2.target.restoreCloseStyle();
                    _this2.overlay.remove();
                };

                listen(target$$1, transEndEvent, onCloseEnd);

                return this;
            }
        }]);
        return Zooming;
    }();

    listen(document, 'DOMContentLoaded', function initZooming() {
        new Zooming();
    });

    return Zooming;
})));