/**
 * enchant.js v0.6-pre
 *
 * Copyright (c) Ubiquitous Entertainment Inc.
 * Dual licensed under the MIT or GPL Version 3 licenses
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(window, undefined){

if (typeof Object.defineProperty !== 'function') {
    Object.defineProperty = function(obj, prop, desc) {
        if ('value' in desc) {
            obj[prop] = desc.value;
        }
        if ('get' in desc) {
            obj.__defineGetter__(prop, desc.get);
        }
        if ('set' in desc) {
            obj.__defineSetter__(prop, desc.set);
        }
        return obj;
    };
}
if (typeof Object.defineProperties !== 'function') {
    Object.defineProperties = function(obj, descs) {
        for (var prop in descs) {
            if (descs.hasOwnProperty(prop)) {
                Object.defineProperty(obj, prop, descs[prop]);
            }
        }
        return obj;
    };
}
if (typeof Object.create !== 'function') {
    Object.create = function(prototype, descs) {
        function F() {
        }

        F.prototype = prototype;
        var obj = new F();
        if (descs != null){
            Object.defineProperties(obj, descs);
        }
        return obj;
    };
}
if (typeof Object.getPrototypeOf !== 'function') {
    Object.getPrototypeOf = function(obj) {
        return obj.__proto__;
    };
}

if (typeof Function.prototype.bind !== 'function') {
    Function.prototype.bind = function(thisObject) {
        var func = this;
        var args = Array.prototype.slice.call(arguments, 1);
        var Nop = function() {
        };
        var bound = function() {
            var a = args.concat(Array.prototype.slice.call(arguments));
            return func.apply(
                this instanceof Nop ? this : thisObject || window, a);
        };
        Nop.prototype = func.prototype;
        bound.prototype = new Nop();
        return bound;
    };
}

/**
 [lang:ja]
 * グローバルにライブラリのクラスをエクスポートする.
 *
 * 引数に何も渡さない場合enchant.jsで定義されたクラス及びプラグインで定義されたクラス
 * 全てがエクスポートされる. 引数が一つ以上の場合はenchant.jsで定義されたクラスのみ
 * がデフォルトでエクスポートされ, プラグインのクラスをエクスポートしたい場合は明示的に
 * プラグインの識別子を引数として渡す必要がある.
 *
 * @example
 *   enchant();     // 全てのクラスがエクスポートされる
 *   enchant('');   // enchant.js本体のクラスのみがエクスポートされる
 *   enchant('ui'); // enchant.js本体のクラスとui.enchant.jsのクラスがエクスポートされる
 *
 * @param {...String} [modules] エクスポートするモジュール. 複数指定できる.
 [/lang]
 [lang:en]
 * Export the library classes globally.
 *
 * When no arguments are given, all classes defined in enchant.js as well as all classes defined in
 * plugins will be exported. When more than one argument is given, by default only classes defined
 * in enchant.js will be exported. When you wish to export plugin classes you must explicitly deliver
 * the plugin identifiers as arguments.
 *
 * @example
 *   enchant();     // All classes will be exported.
 *   enchant('');   // Only classes in enchant.js will be exported.
 *   enchant('ui'); // enchant.js classes and ui.enchant.js classes will be exported.
 *
 * @param {...String} [modules] Export module. Multiple designations possible.
 [/lang]
 [lang:de]
 * Globaler Export der Programmbibliotheken.
 *
 * Wenn keine Argument übergeben werden, werden alle Klassen die in enchant.js und in den Plugins
 * definiert sind exportiert. Falls mehr als ein Argument übergeben wurde, werden standardmäßig nur Klassen
 * die in enchant.js selbst definiert sind exporitert. Wenn auch Plugin Klassen exportiert werden sollen,
 * müssen die Plugin Bezeichner explizit als Argumente übergeben werden.
 *
 * @example
 *   enchant();     // alle Klassen werden exportiert.
 *   enchant('');   // nur Klassen die in enchant.js definiert sind werden exportiert.
 *   enchant('ui'); // enchant.js Klassen und ui.enchant.js Klassen werden exportiert.
 *
 * @param {...String} [modules] Module die exportiert werden sollen.
 [/lang]
 */
var enchant = function(modules) {
    if (modules != null) {
        if (!(modules instanceof Array)) {
            modules = Array.prototype.slice.call(arguments);
        }
        modules = modules.filter(function(module) {
            return [module].join();
        });
    }
    (function include(module, prefix) {
        var submodules = [],
            i, len;
        for (var prop in module){
            if (module.hasOwnProperty(prop)) {
                if (typeof module[prop] === 'function') {
                    window[prop] = module[prop];
                } else if (typeof module[prop] === 'object' && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                    if (modules == null) {
                        submodules.push(prop);
                    } else {
                        i = modules.indexOf(prefix + prop);
                        if (i !== -1) {
                            submodules.push(prop);
                            modules.splice(i, 1);
                        }
                    }
                }
            }
        }

        for (i = 0, len = submodules.length; i < len; i++) {
            include(module[submodules[i]], prefix + submodules[i] + '.');
        }
    }(enchant, ''));

    window.Game = window.Core;

    if (modules != null && modules.length) {
        throw new Error('Cannot load module: ' + modules.join(', '));
    }
};

/**
 * export enchant
 */
window.enchant = enchant;

window.addEventListener("message", function(msg, origin) {
    try {
        var data = JSON.parse(msg.data);
        if (data.type === "event") {
            enchant.Core.instance.dispatchEvent(new enchant.Event(data.value));
        } else if (data.type === "debug") {
            switch (data.value) {
                case "start":
                    enchant.Core.instance.start();
                    break;
                case "pause":
                    enchant.Core.instance.pause();
                    break;
                case "resume":
                    enchant.Core.instance.resume();
                    break;
                case "tick":
                    enchant.Core.instance._tick();
                    break;
                default:
                    break;
            }
        }
    } catch (e) {
        // ignore
    }
}, false);
/**
 [lang:ja]
 * クラスのクラス.
 *
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} definition クラス定義.
 [/lang]
 [lang:en]
 * A Class representing a class which supports inheritance.
 *
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} definition Class definition.
 [/lang]
 [lang:de]
 * Eine Klasse für Klassen, die Vererbung unterstützen.
 *
 * @param {Function} [superclass] Die Klasse, deren Klassendefinition
 * die neue Klasse erben wird.
 * @param {*} definition Klassendefinition.
 [/lang]
 * @constructor
 */

enchant.Class = function(superclass, definition) {
    return enchant.Class.create(superclass, definition);
};

/**
 [lang:ja]
 * クラスを作成する.
 *
 * ほかのクラスを継承したクラスを作成する場合, コンストラクタはデフォルトで
 * 継承元のクラスのものが使われる. コンストラクタをオーバーライドする場合継承元の
 * コンストラクタを適用するには明示的に呼び出す必要がある.
 *
 * @example
 *   var Ball = Class.create({ // 何も継承しないクラスを作成する
 *       initialize: function(radius) { ... }, // メソッド定義
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // Spriteを継承したクラスを作成する
 *   var Ball = Class.create(Sprite, { // Spriteを継承したクラスを作成する
 *       initialize: function(radius) { // コンストラクタを上書きする
 *          Sprite.call(this, radius*2, radius*2); // 継承元のコンストラクタを適用する
 *          this.image = core.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} [definition] クラス定義.
 [/lang]
 [lang:en]
 * Create a class.
 *
 * When defining classes that inherit from other classes, the previous class is used as a base with
 * the superclass's constructor as default. When overriding the default constructor, it is necessary
 * to explicitly call the previous constructor to ensure a correct class initialization.
 *
 * @example
 *   var Ball = Class.create({ // Creates independent class.
 *       initialize: function(radius) { ... }, // Method definition.
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // Creates a class inheriting from "Sprite"
 *   var Ball = Class.create(Sprite, { // Creates a class inheriting "Sprite"
 *       initialize: function(radius) { // Overwrites constructor
 *          Sprite.call(this, radius*2, radius*2); // Applies previous constructor.
 *          this.image = core.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} [definition] Class definition.
 [/lang]
 [lang:de]
 * Erstellt eine neue Klasse
 *
 * Wenn eine Klasse definiert wird, die von einer anderen Klasse erbt, wird der Konstruktor der
 * Basisklasse als Standard definiert. Sollte dieser Konstruktor in der neuen Klasse überschrieben
 * werden, sollte der vorherige Konstruktor explizit aufgerufen werden, um eine korrekte
 * Klasseninitialisierung sicherzustellen.
 *
 * @example
 *   var Ball = Class.create({ // definiert eine unabhängige Klasse.
 *       initialize: function(radius) { ... }, // Methodendefinitionen
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // definiert eine Klasse die von "Sprite" erbt.
 *   var Ball = Class.create(Sprite, { // definiert eine Klasse die von "Sprite" erbt.
 *       initialize: function(radius) { // überschreibt den Standardkonstruktor.
 *          Sprite.call(this, radius*2, radius*2); // Aufruf des Konstruktors der Basisklasse.
 *          this.image = game.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] Die Klasse, deren Klassendefinition
 * die neue Klasse erben wird.
 * @param {*} definition Klassendefinition.
 [/lang]
 * @static
 */
enchant.Class.create = function(superclass, definition) {
    if (superclass == null){
        throw new Error("superclass is undefined");
    }
    if (arguments.length === 0) {
        return enchant.Class.create(Object, definition);
    } else if (arguments.length === 1 && typeof arguments[0] !== 'function') {
        return enchant.Class.create(Object, arguments[0]);
    }

    for (var prop in definition) {
        if (definition.hasOwnProperty(prop)) {
            if (typeof definition[prop] === 'object' && definition[prop] !== null && Object.getPrototypeOf(definition[prop]) === Object.prototype) {
                if (!('enumerable' in definition[prop])) {
                    definition[prop].enumerable = true;
                }
            } else {
                definition[prop] = { value: definition[prop], enumerable: true, writable: true };
            }
        }
    }
    var Constructor = function() {
        if (this instanceof Constructor) {
            Constructor.prototype.initialize.apply(this, arguments);
        } else {
            return new Constructor();
        }
    };
    Constructor.prototype = Object.create(superclass.prototype, definition);
    Constructor.prototype.constructor = Constructor;
    if (Constructor.prototype.initialize == null) {
        Constructor.prototype.initialize = function() {
            superclass.apply(this, arguments);
        };
    }

    var tree = this.getInheritanceTree(superclass);
    for (var i = tree.length - 1; i >= 0; i--) {
        if (typeof tree[i]._inherited === 'function') {
            tree[i]._inherited(Constructor);
            break;
        }
    }

    return Constructor;
};

/**
 [lang:ja]
 * クラスの継承関係を取得する.
 [/lang]
 [lang:en]
 * Get the inheritance tree of this class.
 [/lang]
 * @param {ConstructorFunction}
    * @param {...ConstructorFunction}
    */
enchant.Class.getInheritanceTree = function(Constructor) {
    var ret = [];
    var C = Constructor;
    var proto = C.prototype;
    while (C !== Object) {
        ret.push(C);
        proto = Object.getPrototypeOf(proto);
        C = proto.constructor;
    }
    return ret;
};

/**
 [lang:ja]
 * enchant.js の環境変数。new Game() を呼ぶ前に変更することで変更することで、動作設定を変えることができる。
 * @type {Object}
 [/lang]
 [lang:en]
 * Environment variable.
 [/lang]
 [lang:de]
 * Umgebungsvariable.
 [/lang]
 * @type {Object}
 */
enchant.ENV = {
    /**
     * The CSS vendor prefix of the current browser.
     * @type {String}
     */
    VENDOR_PREFIX: (function() {
        var ua = navigator.userAgent;
        if (ua.indexOf('Opera') !== -1) {
            return 'O';
        } else if (ua.indexOf('MSIE') !== -1) {
            return 'ms';
        } else if (ua.indexOf('WebKit') !== -1) {
            return 'webkit';
        } else if (navigator.product === 'Gecko') {
            return 'Moz';
        } else {
            return '';
        }
    }()),
    /**
     * Determines if the current browser supports touch.
     * @type {Boolean} True, if touch is enabled.
     */
    TOUCH_ENABLED: (function() {
        var div = document.createElement('div');
        div.setAttribute('ontouchstart', 'return');
        return typeof div.ontouchstart === 'function';
    }()),
    /**
     * Determines if the current browser is an iPhone with a retina display.
     * @return {Boolean} True, if this display is a retina display
     */
    RETINA_DISPLAY: (function() {
        if (navigator.userAgent.indexOf('iPhone') !== -1 && window.devicePixelRatio === 2) {
            var viewport = document.querySelector('meta[name="viewport"]');
            if (viewport == null) {
                viewport = document.createElement('meta');
                document.head.appendChild(viewport);
            }
            viewport.setAttribute('content', 'width=640');
            return true;
        } else {
            return false;
        }
    }()),
    /**
     * Will Use Flash instead of native Audio class?
     * @type {String}
     */
    USE_FLASH_SOUND: (function() {
        var ua = navigator.userAgent;
        var vendor = navigator.vendor || "";
        // ローカルではなく、モバイル端末向けでもなく、Safariでもない場合 (デフォルト)
        return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1);
    }()),
    /**
     * If click/touch event occure for these tags the setPreventDefault() method will not be called.
     */
    USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],
    CANVAS_DRAWING_METHODS: [
        'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
        'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
    ],
    KEY_BIND_TABLE: {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    },
    PREVENT_DEFAULT_KEY_CODES: [37, 38, 39, 40, 32],
    /**
     * @type {Boolean}
     */
    SOUND_ENABLED_IN_MOBILE_SAFARI: false,
    /**
     * Determines if animation feature is enabled. (true: Timeline instance will be generated in new Node)
     */
    USE_ANIMATION: true
};
/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
     [lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @param {String} type Eventのタイプ
     [/lang]
     [lang:en]
     * A class for an independent implementation of events
     * similar to DOM Events.
     * However, it does not include phase concept.
     * @param {String} type Event type.
     [/lang]
     [lang:de]
     * Eine Klasse für eine unabhängige Implementierung von Ereignissen 
     * (Events), ähnlich wie DOM Events.
     * Jedoch wird das Phasenkonzept nicht unterstützt.
     * @param {String} type Event Typ.
     [/lang]
     * @constructs
     */
    initialize: function(type) {
        /**
         [lang:ja]
         * イベントのタイプ.
         [/lang]
         [lang:en]
         * The type of the event.
         [/lang]
         [lang:de]
         * Typ des Ereignis.
         [/lang]
         * @type {String}
         */
        this.type = type;
        /**
         [lang:ja]
         * イベントのターゲット.
         [/lang]
         [lang:en]
         * The target of the event.
         [/lang]
         [lang:de]
         * Ziel des Ereignis.
         [/lang]
         * @type {*}
         */
        this.target = null;
        /**
         [lang:ja]
         * イベント発生位置のx座標.
         [/lang]
         [lang:en]
         * The x coordinate of the events occurrence.
         [/lang]
         [lang:de]
         * X Koordinate des Auftretens des Ereignis.
         [/lang]
         * @type {Number}
         */
        this.x = 0;
        /**
         [lang:ja]
         * イベント発生位置のy座標.
         [/lang]
         [lang:en]
         * The y coordinate of the events occurrence.
         [/lang]
         [lang:de]
         * Y Koordinate des Auftretens des Ereignis.
         [/lang]
         * @type {Number}
         */
        this.y = 0;
        /**
         [lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のx座標.
         [/lang]
         [lang:en]
         * The event occurrences local coordinate systems x coordinates.
         [/lang]
         [lang:de]
         * X Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
         [/lang]
         * @type {Number}
         */
        this.localX = 0;
        /**
         [lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のy座標.
         [/lang]
         [lang:en]
         * The event occurrences local coordinate systems y coordinates.
         [/lang]
         [lang:de]
         * Y Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
         [/lang]
         * @type {Number}
         */
        this.localY = 0;
    },
    _initPosition: function(pageX, pageY) {
        var core = enchant.Core.instance;
        this.x = this.localX = (pageX - core._pageX) / core.scale;
        this.y = this.localY = (pageY - core._pageY) / core.scale;
    }
});

/**
 [lang:ja]
 * Coreのロード完了時に発生するイベント.
 *
 * 画像のプリロードを行う場合ロードが完了するのを待ってゲーム開始時の処理を行う必要がある.
 * 発行するオブジェクト: enchant.Core
 *
 * @example
 *   var core = new Core(320, 320);
 *   core.preload('player.gif');
 *   core.onload = function() {
 *      ... // ゲーム開始時の処理を記述
 *   };
 *   core.start();
 *
 [/lang]
 [lang:en]
 * Event activated upon completion of core loading.
 *
 * It is necessary to wait for loading to finish and to do initial processing when preloading images.
 * Issued object: {@link enchant.Core}
 *
 * @example
 *   var core = new Core(320, 320);
 *   core.preload('player.gif');
 *   core.onload = function() {
 *      ... // Describes initial core processing
 *   };
 *   core.start();
 *
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn das Laden des Spieles abgeschlossen wurde.
 *
 * Wenn Grafiken im voraus geladen werden ist es notwendig, auf dieses Ereignis zu warten bis mit
 * diesen gearbeitet werden kann. 
 * Objekt des Auftretens: {@link enchant.Game}
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // initialisierung des Spieles 
 *   };
 *   game.start();
 *
 [/lang]
 * @type {String}
 */
enchant.Event.LOAD = 'load';

/**
 [lang:ja]
 * Coreのロード進行中に発生するイベント.
 * プリロードする画像が一枚ロードされる度に発行される. 発行するオブジェクト: enchant.Core
 [/lang]
 [lang:en]
 * Events occurring during core loading.
 * Activated each time a preloaded image is loaded. Issued object: enchant.Core
 [/lang]
 * @type {String}
 */
enchant.Event.PROGRESS = 'progress';

/**
 [lang:ja]
 * フレーム開始時に発生するイベント.
 * 発行するオブジェクト: enchant.Core, enchant.Node
 [/lang]
 [lang:en]
 * Events occurring during frame start.
 * Issued object: enchant.Core, enchant.Node
 [/lang]
 * @type {String}
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 [lang:ja]
 * フレーム終了時に発生するイベント.
 * 発行するオブジェクト: enchant.Core
 [/lang]
 [lang:en]
 * Events occurring during frame end.
 * Issued object: enchant.Core
 [/lang]
 * @type {String}
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 [lang:ja]
 * Sceneが開始したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Events occurring during Scene beginning.
 * Issued object: {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn eine neue Szene
 * ({@link enchant.Scene}) beginnt.
 * Objekt des Auftretens: {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.ENTER = 'enter';

/**
 [lang:ja]
 * Sceneが終了したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Events occurring during Scene end.
 * Issued object: {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn eine Szene
 * ({@link enchant.Scene}) endet.
 * Objekt des Auftretens: {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.EXIT = 'exit';

/**
 [lang:ja]
 * Nodeに子が追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when a Child is getting added to a Node.
 * Issued object: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Kindelement zu einem Node
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.CHILD_ADDED = 'childadded';

/**
 [lang:ja]
 * NodeがGroupに追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event which is occurring when the Node is added to a Group.
 * Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node zu einer Gruppe
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.ADDED = 'added';

/**
 [lang:ja]
 * NodeがSceneに追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event which is occurring when the Node is added to a Scene.
 * Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node zu einer Szene
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 [lang:ja]
 * Nodeから子が削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
 * @type {String}
 [/lang]
 [lang:en]
 * An event which is occurring when a Child is removed from a Node.
 * Issued object: {@link enchant.Group}, {@link enchant.Scene}
 * @type {String}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Kindelement von einem Node
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.CHILD_REMOVED = 'childremoved';

/**
 [lang:ja]
 * NodeがGroupから削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event which is occurring when the Node is deleted from a Group.
 * Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node aus einer Gruppe
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.REMOVED = 'removed';

/**
 [lang:ja]
 * NodeがSceneから削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event which is occurring when the Node is deleted from a Scene.
 * Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node aus einer Szene
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 [lang:ja]
 * Nodeに対するタッチが始まったとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event occurring when a touch related to the Node has begun.
 * A click is also treated as touch. Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * beginnt. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 [lang:ja]
 * Nodeに対するタッチが移動したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event occurring when a touch related to the Node has been moved.
 * A click is also treated as touch. Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * bewegt wurde. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 [lang:ja]
 * Nodeに対するタッチが終了したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 [/lang]
 [lang:en]
 * An event which is occurring when a touch related to the Node has ended.
 * A Click is also treated as touch. Issued object: enchant.Node
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * endet. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 [lang:ja]
 * Entityがレンダリングされるときに発生するイベント.
 * 発行するオブジェクト: {@link enchant.Entity}
 [/lang]
 [lang:en]
 * An event which is occurring when an Entity is rendered.
 * Issued object: {@link enchant.Entity}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn eine Entity
 * gerendert wird.
 * Objekt des Auftretens: {@link enchant.Entity}
 [/lang]
 * @type {String}
 */
enchant.Event.RENDER = 'render';

/**
 [lang:ja]
 * ボタン入力が始まったとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when a button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Knopf gedückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 [lang:ja]
 * ボタン入力が変化したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when a button input changes.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn eine Knopfeingabe verändert wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 [lang:ja]
 * ボタン入力が終了したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when button input ends.
 * Issued object: enchant.Core, enchant.Scene
 [/lang]
 * @type {String}
 */
enchant.Event.INPUT_END = 'inputend';

/**
 [lang:ja]
 * leftボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when the left button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 [lang:ja]
 * leftボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when the left button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 [lang:ja]
 * rightボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when the right button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 [lang:ja]
 * rightボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when the right button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 [lang:ja]
 * upボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when the up button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 [lang:ja]
 * upボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when the up button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 [lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when the down button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 [lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event which is occurring when the down button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 [lang:ja]
 * aボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Core, enchant.Scene
 [/lang]
 [lang:en]
 * Event occurring when a button is pushed.
 * Issued object: enchant.Core, enchant.Scene
 [/lang]
 * @type {String}
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 [lang:ja]
 * aボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Core, enchant.Scene
 [/lang]
 [lang:en]
 * Event occurring when a button is released.
 * Issued object: enchant.Core, enchant.Scene
 [/lang]
 * @type {String}
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 [lang:ja]
 * bボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Core, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when b button is pushed.
 * Issued object: enchant.Core, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 [lang:ja]
 * bボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Core, enchant.Scene
 [/lang]
 [lang:en]
 * Event occurring when b button is released.
 * Issued object: enchant.Core, enchant.Scene
 [/lang]
 * @type {String}
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';

/**
 * アクションがタイムラインに追加された時に発行されるイベント
 * @type {String}
 */
enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";

/**
 * アクションがタイムラインから削除された時に発行されるイベント
 * looped が設定されている時も、アクションは一度タイムラインから削除されもう一度追加される
 * @type {String}
 */
enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";

/**
 * アクションが開始された時に発行されるイベント
 * @type {String}
 */
enchant.Event.ACTION_START = "actionstart";

/**
 * アクションが終了するときに発行されるイベント
 * @type {String}
 */
enchant.Event.ACTION_END = "actionend";

/**
 * アクションが1フレーム経過するときに発行されるイベント
 * @type {String}
 */
enchant.Event.ACTION_TICK = "actiontick";

/**
 * アクションが追加された時に、タイムラインに対して発行されるイベント
 * @type {String}
 */
enchant.Event.ACTION_ADDED = "actionadded";

/**
 * アクションが削除された時に、タイムラインに対して発行されるイベント
 * @type {String}
 */
enchant.Event.ACTION_REMOVED = "actionremoved";

/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     [lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     [/lang]
     [lang:en]
     * A class for an independent implementation of events
     * similar to DOM Events.
     * However, it does not include the phase concept.
     [/lang]
     [lang:de]
     * Eine Klasse für eine unabhängige Implementierung von Ereignissen 
     * (Events), ähnlich wie DOM Events.
     * Jedoch wird das Phasenkonzept nicht unterstützt.
     [/lang]
     * @constructs
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     [lang:ja]
     * イベントリスナを追加する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 追加するイベントリスナ.
     [/lang]
     [lang:en]
     * Add a new event listener which will be executed when the event
     * is being dispatched.
     * @param {String} type Type of the events.
     * @param {function(e:enchant.Event)} listener Event listener to be added.
     [/lang]
     [lang:de]
     * Fügt einen neuen Ereignisbeobachter hinzu, welcher beim Auftreten des
     * Events ausgeführt wird.
     * @param {String} type Ereignis Typ.
     * @param {function(e:enchant.Event)} listener Der Ereignisbeobachter 
     * der hinzugefügt wird.
     [/lang]
     */
    addEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) === -1) {
            listeners.unshift(listener);

        }
    },
    /**
     * Synonym for addEventListener
     * @see {enchant.EventTarget#addEventListener}
     * @param {String} type Type of the events.
     * @param {function(e:enchant.Event)} listener Event listener to be added.
     */
    on: function() {
        this.addEventListener.apply(this, arguments);
    },
    /**
     [lang:ja]
     * イベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 削除するイベントリスナ.
     [/lang]
     [lang:en]
     * Delete an event listener.
     * @param {String} type Type of the events.
     * @param {function(e:enchant.Event)} listener Event listener to be deleted.
     [/lang]
     [lang:de]
     * Entfernt einen Ereignisbeobachter.
     * @param {String} type Ereignis Typ.
     * @param {function(e:enchant.Event)} listener Der Ereignisbeobachter 
     * der entfernt wird.
     [/lang]
     */
    removeEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners != null) {
            var i = listeners.indexOf(listener);
            if (i !== -1) {
                listeners.splice(i, 1);
            }
        }
    },
    /**
     [lang:ja]
     * すべてのイベントリスナを削除する.
     * @param [String] type イベントのタイプ.
     [/lang]
     [lang:en]
     * Clear all defined event listener for a given type.
     * If no type is given, all listener will be removed.
     * @param [String] type Type of the events.
     [/lang]
     [lang:de]
     * Entfernt alle Ereignisbeobachter für einen Typ.
     * Wenn kein Typ gegeben ist, werden alle 
     * Ereignisbeobachter entfernt.
     * @param [String] type Ereignis Typ.
     [/lang]
     */
    clearEventListener: function(type) {
        if (type != null) {
            delete this._listeners[type];
        } else {
            this._listeners = {};
        }
    },
    /**
     [lang:ja]
     * イベントを発行する.
     * @param {enchant.Event} e 発行するイベント.
     [/lang]
     [lang:en]
     * Issue an event.
     * @param {enchant.Event} e Event to be issued.
     [/lang]
     [lang:de]
     * Löst ein Ereignis aus.
     * @param {enchant.Event} e Ereignis das ausgelöst werden soll.
     [/lang]
     */
    dispatchEvent: function(e) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null){
            this['on' + e.type](e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e);
            }
        }
    }
});

/**
 * @scope enchant.Core.prototype
 */
(function() {
    var core;

    /**
     * @scope enchant.Core.prototype
     */
    enchant.Core = enchant.Class.create(enchant.EventTarget, {
        /**
         [lang:ja]
         * アプリケーションのメインループ, シーンを管理するクラス.
         *
         * インスタンスは一つしか存在することができず, すでにインスタンスが存在する状態で
         * コンストラクタを実行した場合既存のものが上書きされる. 存在するインスタンスには
         * enchant.Core.instanceからアクセスできる.
         *
         * @param {Number} width 画面の横幅.
         * @param {Number} height 画面の高さ.
         [/lang]
         [lang:en]
         * A class which is controlling the cores main loop and scenes.
         *
         * There can be only one instance at a time, when the constructor is executed
         * with an instance present, the existing instance will be overwritten. The existing instance
         * can be accessed from {@link enchant.Core.instance}.
         *
         * @param {Number} width The width of the core screen.
         * @param {Number} height The height of the core screen.
         [/lang]
         [lang:de]
         * Klasse, welche die Spielschleife und Szenen kontrolliert.
         *
         * Es kann immer nur eine Instanz geben und sollte der Konstruktor ausgeführt werden,
         * obwohl bereits eine Instanz existiert, wird die vorherige Instanz überschrieben.
         * Auf die aktuell existierende Instanz kann über die {@link enchant.Core.instance}
         * Variable zugegriffen werden.
         *
         * @param {Number} width Die Breite des Spieles.
         * @param {Number} height Die Höhe des Spieles.
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(width, height) {
            if (window.document.body === null) {
                throw new Error("document.body is null. Please excute 'new Core()' in window.onload.");
            }

            enchant.EventTarget.call(this);
            var initial = true;
            if (core) {
                initial = false;
                core.stop();
            }
            core = enchant.Core.instance = this;

            /**
             [lang:ja]
             * 画面の横幅.
             [/lang]
             [lang:en]
             * The width of the core screen.
             [/lang]
             [lang:de]
             * Breite des Spieles.
             [/lang]
             * @type {Number}
             */
            this.width = width || 320;
            /**
             [lang:ja]
             * 画面の高さ.
             [/lang]
             [lang:en]
             * The height of the core screen.
             [/lang]
             [lang:de]
             * Höhe des Spieles.
             [/lang]
             * @type {Number}
             */
            this.height = height || 320;
            /**
             [lang:ja]
             * 画面の表示倍率.
             [/lang]
             [lang:en]
             * The scaling of the core rendering.
             [/lang]
             [lang:de]
             * Skalierung der Spieldarstellung.
             [/lang]
             * @type {Number}
             */
            this.scale = 1;

            var stage = document.getElementById('enchant-stage');
            if (!stage) {
                stage = document.createElement('div');
                stage.id = 'enchant-stage';
//                stage.style.width = window.innerWidth + 'px';
//                stage.style.height = window.innerHeight + 'px';
                stage.style.position = 'absolute';

                if (document.body.firstChild) {
                    document.body.insertBefore(stage, document.body.firstChild);
                } else {
                    document.body.appendChild(stage);
                }
                this.scale = Math.min(
                    window.innerWidth / this.width,
                    window.innerHeight / this.height
                );
                this._pageX = 0;
                this._pageY = 0;
            } else {
                var style = window.getComputedStyle(stage);
                width = parseInt(style.width, 10);
                height = parseInt(style.height, 10);
                if (width && height) {
                    this.scale = Math.min(
                        width / this.width,
                        height / this.height
                    );
                } else {
                    stage.style.width = this.width + 'px';
                    stage.style.height = this.height + 'px';
                }
                while (stage.firstChild) {
                    stage.removeChild(stage.firstChild);
                }
                stage.style.position = 'relative';

                var bounding = stage.getBoundingClientRect();
                this._pageX = Math.round(window.scrollX + bounding.left);
                this._pageY = Math.round(window.scrollY + bounding.top);
            }
            if (!this.scale) {
                this.scale = 1;
            }
            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            this._element = stage;

            /**
             [lang:ja]
             * フレームレート.
             [/lang]
             [lang:en]
             * The frame rate of the core.
             [/lang]
             [lang:de]
             * Frame Rate des Spieles.
             [/lang]
             * @type {Number}
             */
            this.fps = 30;
            /**
             [lang:ja]
             * アプリの開始からのフレーム数.
             [/lang]
             [lang:en]
             * The amount of frames since the core was started.
             [/lang]
             [lang:de]
             * Anzahl der Frames seit dem Spielestart.
             [/lang]
             * @type {Number}
             */
            this.frame = 0;
            /**
             [lang:ja]
             * アプリが実行可能な状態かどうか.
             [/lang]
             [lang:en]
             * Indicates if the core can be executed.
             [/lang]
             [lang:de]
             * Zeigt an ob das Spiel ausgeführt werden kann.
             [/lang]
             * @type {Boolean}
             */
            this.ready = null;
            /**
             [lang:ja]
             * アプリが実行状態かどうか.
             [/lang]
             [lang:en]
             * Indicates if the core is currently executed.
             [/lang]
             [lang:de]
             * Zeigt an ob das Spiel derzeit ausgeführt wird.
             [/lang]
             * @type {Boolean}
             */
            this.running = false;
            /**
             [lang:ja]
             * ロードされた画像をパスをキーとして保存するオブジェクト.
             [/lang]
             [lang:en]
             * Object which stores loaded objects with the path as key.
             [/lang]
             [lang:de]
             * Geladene Objekte werden unter dem Pfad als Schlüssel in diesem Objekt abgelegt.
             [/lang]
             * @type {Object.<String, Surface>}
             */
            this.assets = {};
            var assets = this._assets = [];
            (function detectAssets(module) {
                if (module.assets instanceof Array) {
                    [].push.apply(assets, module.assets);
                }
                for (var prop in module) {
                    if (module.hasOwnProperty(prop)) {
                        if (typeof module[prop] === 'object' && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                            detectAssets(module[prop]);
                        }
                    }
                }
            }(enchant));

            this._scenes = [];
            /**
             [lang:ja]
             * 現在のScene. Sceneスタック中の一番上のScene.
             [/lang]
             [lang:en]
             * The Scene which is currently displayed. This Scene is on top of Scene stack.
             [/lang]
             [lang:de]
             * Die aktuell dargestellte Szene.
             * Diese Szene befindet sich oben auf dem Stapelspeicher.
             [/lang]
             * @type {enchant.Scene}
             */
            this.currentScene = null;
            /**
             [lang:ja]
             * ルートScene. Sceneスタック中の一番下のScene.
             [/lang]
             [lang:en]
             * The root Scene. The Scene at bottom of Scene stack.
             [/lang]
             [lang:de]
             * Die Ursprungsszene.
             * Diese Szene befindet sich unten auf dem Stapelspeicher.
             [/lang]
             * @type {enchant.Scene}
             */
            this.rootScene = new enchant.Scene();
            this.pushScene(this.rootScene);
            /**
             [lang:ja]
             * ローディング時に表示されるScene.
             [/lang]
             [lang:en]
             * The Scene which is getting displayed during loading.
             [/lang]
             [lang:de]
             * Die Szene, welche während des Ladevorgangs dargestellt wird.
             [/lang]
             * @type {enchant.Scene}
             */
            this.loadingScene = new enchant.Scene();
            this.loadingScene.backgroundColor = '#000';
            var barWidth = this.width * 0.4 | 0;
            var barHeight = this.width * 0.05 | 0;
            var border = barWidth * 0.03 | 0;
            var bar = new enchant.Sprite(barWidth, barHeight);

            bar.x = (this.width - barWidth) / 2;
            bar.y = (this.height - barHeight) / 2;
            var image = new enchant.Surface(barWidth, barHeight);
            image.context.fillStyle = '#fff';
            image.context.fillRect(0, 0, barWidth, barHeight);
            image.context.fillStyle = '#000';
            image.context.fillRect(border, border, barWidth - border * 2, barHeight - border * 2);
            bar.image = image;
            var progress = 0, _progress = 0;
            this.addEventListener('progress', function(e) {
                progress = e.loaded / e.total;
            });
            bar.addEventListener('enterframe', function() {
                _progress *= 0.9;
                _progress += progress * 0.1;
                image.context.fillStyle = '#fff';
                image.context.fillRect(border, 0, (barWidth - border * 2) * _progress, barHeight);
            });
            this.loadingScene.addChild(bar);

            this._mousedownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;
            this._intervalID = null;

            this._offsetX = 0;
            this._offsetY = 0;

            /**
             [lang:ja]
             * アプリに対する入力状態を保存するオブジェクト.
             [/lang]
             [lang:en]
             * Object that saves the current input state for the core.
             [/lang]
             [lang:de]
             * Objekt, welches den aktuellen Eingabestatus des Spieles speichert.
             [/lang]
             * @type {Object.<String, Boolean>}
             */
            this.input = {};
            this._keybind = enchant.ENV.KEY_BIND_TABLE || {};

            var c = 0;
            ['left', 'right', 'up', 'down', 'a', 'b'].forEach(function(type) {
                this.addEventListener(type + 'buttondown', function(e) {
                    var inputEvent;
                    if (!this.input[type]) {
                        this.input[type] = true;
                        inputEvent = new enchant.Event((c++) ? 'inputchange' : 'inputstart');
                        this.dispatchEvent(inputEvent);
                    }
                    this.currentScene.dispatchEvent(e);
                    if (inputEvent) {
                        this.currentScene.dispatchEvent(inputEvent);
                    }
                });
                this.addEventListener(type + 'buttonup', function(e) {
                    var inputEvent;
                    if (this.input[type]) {
                        this.input[type] = false;
                        inputEvent = new enchant.Event((--c) ? 'inputchange' : 'inputend');
                        this.dispatchEvent(inputEvent);
                    }
                    this.currentScene.dispatchEvent(e);
                    if (inputEvent) {
                        this.currentScene.dispatchEvent(inputEvent);
                    }
                });
            }, this);

            if (initial) {
                stage = enchant.Core.instance._element;
                var evt;
                document.addEventListener('keydown', function(e) {
                    core.dispatchEvent(new enchant.Event('keydown'));
                    if (enchant.ENV.PREVENT_DEFAULT_KEY_CODES.indexOf(e.keyCode) !== -1) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    if (!core.running) {
                        return;
                    }
                    var button = core._keybind[e.keyCode];
                    if (button) {
                        evt = new enchant.Event(button + 'buttondown');
                        core.dispatchEvent(evt);
                    }
                }, true);
                document.addEventListener('keyup', function(e) {
                    if (!core.running) {
                        return;
                    }
                    var button = core._keybind[e.keyCode];
                    if (button) {
                        evt = new enchant.Event(button + 'buttonup');
                        core.dispatchEvent(evt);
                    }
                }, true);

                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchstart', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('touchmove', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('touchend', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                }
                stage.addEventListener('mousedown', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        core._mousedownID++;
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                stage.addEventListener('mousemove', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                stage.addEventListener('mouseup', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                core._touchEventTarget = null;
                var _ontouchstart = function(e) {
                    var core = enchant.Core.instance;
                    var evt = new enchant.Event(enchant.Event.TOUCH_START);
                    evt._initPosition(e.pageX, e.pageY);
                    core._touchEventTarget = core.currentScene._determineEventTarget(evt);
                    core._touchEventTarget.dispatchEvent(evt);
                };
                var _ontouchmove = function(e) {
                    var evt;
                    if (core._touchEventTarget) {
                        evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                        evt._initPosition(e.pageX, e.pageY);
                        core._touchEventTarget.dispatchEvent(evt);
                    }
                };
                var _ontouchend = function(e) {
                    var evt;
                    if (core._touchEventTarget) {
                        evt = new enchant.Event(enchant.Event.TOUCH_END);
                        evt._initPosition(e.pageX, e.pageY);
                        core._touchEventTarget.dispatchEvent(evt);
                        core._touchEventTarget = null;
                        core.currentScene._layers.Dom._touchEventTarget = null;
                    }
                };
                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchstart', _ontouchstart, false);
                    stage.addEventListener('touchmove', _ontouchmove, false);
                    stage.addEventListener('touchend', _ontouchend, false);
                }
                stage.addEventListener('mousedown', _ontouchstart, false);
                stage.addEventListener('mousemove', _ontouchmove, false);
                stage.addEventListener('mouseup', _ontouchend, false);
            }
        },
        /**
         [lang:ja]
         * ファイルのプリロードを行う.
         *
         * プリロードを行うよう設定されたファイルはenchant.Core#startが実行されるとき
         * ロードが行われる. 全てのファイルのロードが完了したときはCoreオブジェクトからload
         * イベントが発行され, Coreオブジェクトのassetsプロパティから画像ファイルの場合は
         * Surfaceオブジェクトとして, 音声ファイルの場合はSoundオブジェクトとして,
         * その他の場合は文字列としてアクセスできるようになる.
         *
         * なおこのSurfaceオブジェクトはenchant.Surface.loadを使って作成されたものである
         * ため直接画像操作を行うことはできない. enchant.Surface.loadの項を参照.
         *
         * @example
         *   core.preload('player.gif');
         *   core.onload = function() {
         *      var sprite = new Sprite(32, 32);
         *      sprite.image = core.assets['player.gif']; // パス名でアクセス
         *      ...
         *   };
         *   core.start();
         *
         * @param {...String} assets プリロードする画像のパス. 複数指定できる.
         [/lang]
         [lang:en]
         * Performs a file preload.
         *
         * Sets files which are to be preloaded. When {@link enchant.Core#start} is called the
         * actual loading takes place. When all files are loaded, a {@link enchant.Event.LOAD} event
         * is dispatched from the Core object. Depending on the type of the file different objects will be
         * created and stored in {@link enchant.Core#assets} Variable.
         * When an image file is loaded, an {@link enchant.Surface} is created. If a sound file is loaded, an
         * {@link enchant.Sound} object is created. Otherwise it will be accessible as a string.
         *
         * In addition, because this Surface object used made with {@link enchant.Surface.load},
         * direct object manipulation is not possible. Refer to the items of {@link enchant.Surface.load}
         *
         * @example
         *   core.preload('player.gif');
         *   core.onload = function() {
         *      var sprite = new Sprite(32, 32);
         *      sprite.image = core.assets['player.gif']; // Access via path
         *      ...
         *   };
         *   core.start();
         *
         * @param {...String} assets Path of images to be preloaded. Multiple settings possible.
         [/lang]
         [lang:de]
         * Lässt Dateien im voraus laden.
         *
         * Diese Methode setzt die Dateien die im voraus geladen werden sollen. Wenn {@link enchant.Core#start}
         * aufgerufen wird, findet das tatsächliche laden der Resource statt. Sollten alle Dateien vollständig
         * geladen sein, wird ein {@link enchant.Event.LOAD} Ereignis auf dem Core Objekt ausgelöst.
         * Abhängig von den Dateien die geladen werden sollen, werden unterschiedliche Objekte erstellt und in
         * dem {@link enchant.Core#assets} Feld gespeichert.
         * Falls ein Bild geladen wird, wird ein {@link enchant.Surface} Objekt erstellt. Wenn es eine Ton Datei ist,
         * wird ein {@link enchant.Sound} Objekt erstellt. Ansonsten kann auf die Datei über einen String zugegriffen werden.
         *
         * Da die Surface Objekte mittels {@link enchant.Surface.load} erstellt werden ist zusätlich ist zu beachten, dass
         * eine direkte Objektmanipulation nicht möglich ist.
         * Für diesen Fall ist auf die {@link enchant.Surface.load} Dokumentation zu verweisen.
         *
         * @example
         *   core.preload('player.gif');
         *   core.onload = function() {
         *      var sprite = new Sprite(32, 32);
         *      sprite.image = core.assets['player.gif']; // zugriff mittels Dateipfades
         *      ...
         *   };
         *   core.start();
         *
         * @param {...String} assets Pfade zu den Dateien die im voraus geladen werden sollen.
         * Mehrfachangaben möglich.
         [/lang]
         */
        preload: function(assets) {
            if (!(assets instanceof Array)) {
                assets = Array.prototype.slice.call(arguments);
            }
            [].push.apply(this._assets, assets);
        },
        /**
         [lang:ja]
         * ファイルのロードを行う.
         *
         * @param {String} asset ロードするファイルのパス.
         * @param {Function} [callback] ファイルのロードが完了したときに呼び出される関数.
         [/lang]
         [lang:en]
         * Loads a file.
         *
         * @param {String} asset File path of the resource to be loaded.
         * @param {Function} [callback] Function called up when file loading is finished.
         [/lang]
         [lang:de]
         * Laden von Dateien.
         *
         * @param {String} asset Pfad zu der Datei die geladen werden soll.
         * @param {Function} [callback] Funktion die ausgeführt wird wenn das laden abgeschlossen wurde.
         [/lang]
         */
        load: function(src, callback) {
            if (callback == null) {
                callback = function() {
                };
            }

            var ext = enchant.Core.findExt(src);

            if (enchant.Core._loadFuncs[ext]) {
                enchant.Core._loadFuncs[ext].call(this, src, callback, ext);
            }
            else {
                var req = new XMLHttpRequest();
                req.open('GET', src, true);
                req.onreadystatechange = function(e) {
                    if (req.readyState === 4) {
                        if (req.status !== 200 && req.status !== 0) {
                            throw new Error(req.status + ': ' + 'Cannot load an asset: ' + src);
                        }

                        var type = req.getResponseHeader('Content-Type') || '';
                        if (type.match(/^image/)) {
                            core.assets[src] = enchant.Surface.load(src);
                            core.assets[src].addEventListener('load', callback);
                        } else if (type.match(/^audio/)) {
                            core.assets[src] = enchant.Sound.load(src, type);
                            core.assets[src].addEventListener('load', callback);
                        } else {
                            core.assets[src] = req.responseText;
                            callback();
                        }
                    }
                };
                req.send(null);
            }
        },
        /**
         [lang:ja]
         * アプリを起動する.
         *
         * enchant.Core#fpsで設定されたフレームレートに従ってenchant.Core#currentSceneの
         * フレームの更新が行われるようになる. プリロードする画像が存在する場合はロードが
         * 始まりローディング画面が表示される.
         [/lang]
         [lang:en]
         * Start the core.
         *
         * Obeying the frame rate set in {@link enchant.Core#fps}, the frame in
         * {@link enchant.Core#currentScene} will be updated. If images to preload are present,
         * loading will begin and the loading screen will be displayed.
         [/lang]
         [lang:de]
         * Starte das Spiel
         *
         * Je nach der Frame Rate definiert in {@link enchant.Core#fps}, wird der Frame in der
         * {@link enchant.Core#currentScene} aktualisiert. Sollten Dateien die im voraus geladen werden
         * sollen vorhanden sein, beginnt das laden dieser Dateien und der Ladebildschirm wird dargestellt.
         [/lang]
         */
        start: function() {
            if (this._intervalID) {
                window.clearInterval(this._intervalID);
            } else if (this._assets.length) {
                if (enchant.Sound.enabledInMobileSafari && !core._touched &&
                    enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
                    var scene = new enchant.Scene();
                    scene.backgroundColor = '#000';
                    var size = Math.round(core.width / 10);
                    var sprite = new enchant.Sprite(core.width, size);
                    sprite.y = (core.height - size) / 2;
                    sprite.image = new enchant.Surface(core.width, size);
                    sprite.image.context.fillStyle = '#fff';
                    sprite.image.context.font = (size - 1) + 'px bold Helvetica,Arial,sans-serif';
                    var width = sprite.image.context.measureText('Touch to Start').width;
                    sprite.image.context.fillText('Touch to Start', (core.width - width) / 2, size - 1);
                    scene.addChild(sprite);
                    document.addEventListener('touchstart', function() {
                        core._touched = true;
                        core.removeScene(scene);
                        core.start();
                    }, true);
                    core.pushScene(scene);
                    return;
                }

                var o = {};
                var assets = this._assets.filter(function(asset) {
                    return asset in o ? false : o[asset] = true;
                });
                var loaded = 0,
                    len = assets.length,
                    loadFunc = function() {
                        var e = new enchant.Event('progress');
                        e.loaded = ++loaded;
                        e.total = len;
                        core.dispatchEvent(e);
                        if (loaded === len) {
                            core.removeScene(core.loadingScene);
                            core.dispatchEvent(new enchant.Event('load'));
                        }
                    };

                for (var i = 0; i < len; i++) {
                    this.load(assets[i], loadFunc);
                }
                this.pushScene(this.loadingScene);
            } else {
                this.dispatchEvent(new enchant.Event('load'));
            }
            this.currentTime = this.getTime();
            this._intervalID = window.setInterval(function() {
                core._tick();
            }, 1000 / this.fps);
            this.running = true;
        },
        /**
         [lang:ja]
         * アプリをデバッグモードで開始する.
         *
         * enchant.Core.instance._debug フラグを true にすることでもデバッグモードをオンにすることができる
         [/lang]
         [lang:en]
         * Begin core debug mode.
         *
         * Core debug mode can be set to on even if enchant.Core.instance._debug
         * flag is already set to true.
         [/lang]
         [lang:de]
         * Startet den Debug-Modus des Spieles.
         *
         * Auch wenn die enchant.Core.instance._debug Variable gesetzt ist,
         * kann der Debug-Modus gestartet werden.
         [/lang]
         */
        debug: function() {
            this._debug = true;
            this.rootScene.addEventListener("enterframe", function(time) {
                this._actualFps = (1 / time);
            });
            this.start();
        },
        actualFps: {
            get: function() {
                return this._actualFps || this.fps;
            }
        },
        _tick: function() {
            var now = this.getTime();
            var e = new enchant.Event('enterframe');
            e.elapsed = now - this.currentTime;
            this.currentTime = now;

            var nodes = this.currentScene.childNodes.slice();
            var push = Array.prototype.push;
            while (nodes.length) {
                var node = nodes.pop();
                node.age++;
                node.dispatchEvent(e);
                if (node.childNodes) {
                    push.apply(nodes, node.childNodes);
                }
            }

            this.currentScene.age++;
            this.currentScene.dispatchEvent(e);
            this.dispatchEvent(e);

            this.dispatchEvent(new enchant.Event('exitframe'));
            this.frame++;
        },
        getTime: function() {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            }else if(window.performance && window.performance.webkitNow){
                return window.performance.webkitNow();
            }else{
                return Date.now();
            }
        },
        /**
         [lang:ja]
         * アプリを停止する.
         *
         * フレームは更新されず, ユーザの入力も受け付けなくなる.
         * enchant.Core#startで再開できる.
         [/lang]
         [lang:en]
         * Stops the core.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Core can be restarted using {@link enchant.Core#start}.
         [/lang]
         [lang:de]
         * Stoppt das Spiel.
         *
         * Der Frame wird nicht mehr aktualisiert und Spielereingaben werden nicht
         * mehr akzeptiert. Das spiel kann mit der {@link enchant.Core#start} Methode
         * erneut gestartet werden.
         [/lang]
         */
        stop: function() {
            if (this._intervalID) {
                window.clearInterval(this._intervalID);
                this._intervalID = null;
            }
            this.running = false;
        },
        /**
         [lang:ja]
         * アプリを一時停止する.
         *
         * フレームは更新されず, ユーザの入力は受け付ける.
         * enchant.Core#startで再開できる.
         [/lang]
         [lang:en]
         * Stops the core.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Core can be started again using {@link enchant.Core#start}.
         [/lang]
         [lang:de]
         * Stoppt das Spiel.
         *
         * Der Frame wird nicht mehr aktualisiert und Spielereingaben werden nicht
         * mehr akzeptiert. Das spiel kann mit der {@link enchant.Core#start} Methode
         * erneut gestartet werden.
         [/lang]
         */
        pause: function() {
            if (this._intervalID) {
                window.clearInterval(this._intervalID);
                this._intervalID = null;
            }
        },
        /**
         [lang:ja]
         * アプリを再開する。
         [/lang]
         [lang:en]
         * Resumes the core.
         [/lang]
         [lang:de]
         * Setzt die Ausführung des Spieles fort.
         [/lang]
         */
        resume: function() {
            if (this._intervalID) {
                return;
            }
            this.currentTime = this.getTime();
            this._intervalID = window.setInterval(function() {
                core._tick();
            }, 1000 / this.fps);
            this.running = true;
        },

        /**
         [lang:ja]
         * 新しいSceneに移行する.
         *
         * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
         * enchant.Core#pushSceneを行うとSceneをスタックの一番上に積むことができる. スタックの
         * 一番上のSceneに対してはフレームの更新が行われる.
         *
         * @param {enchant.Scene} scene 移行する新しいScene.
         * @return {enchant.Scene} 新しいScene.
         [/lang]
         [lang:en]
         * Switch to a new Scene.
         *
         * Scenes are controlled using a stack, and the display order also obeys that stack order.
         * When {@link enchant.Core#pushScene} is executed, the Scene can be brought to the top of stack.
         * Frames will be updated in the Scene which is on the top of the stack.
         *
         * @param {enchant.Scene} scene The new scene to be switched to.
         * @return {enchant.Scene} The new Scene.
         [/lang]
         [lang:de]
         * Wechselt zu einer neuen Szene.
         *
         * Szenen werden durch einen Stapelspeicher kontrolliert und die Darstellungsreihenfolge
         * folgt ebenfalls der Ordnung des Stapelspeichers.
         * Wenn die {@link enchant.Core#pushScene} Methode ausgeführt wird, wird die Szene auf dem
         * Stapelspeicher oben abgelegt. Der Frame wird immer in der Szene ganz oben auf dem Stapelspeicher
         * aktualisiert.
         *
         * @param {enchant.Scene} scene Die neue Szene zu der gewechselt werden soll.
         * @return {enchant.Scene} Die neue Szene.
         [/lang]
         */
        pushScene: function(scene) {
            this._element.appendChild(scene._element);
            if (this.currentScene) {
                this.currentScene.dispatchEvent(new enchant.Event('exit'));
            }
            this.currentScene = scene;
            this.currentScene.dispatchEvent(new enchant.Event('enter'));
            return this._scenes.push(scene);
        },
        /**
         [lang:ja]
         * 現在のSceneを終了させ前のSceneに戻る.
         *
         * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
         * enchant.Core#popSceneを行うとスタックの一番上のSceneを取り出すことができる.
         *
         * @return {enchant.Scene} 終了させたScene.
         [/lang]
         [lang:en]
         * Ends the current Scene, return to the previous Scene.
         *
         * Scenes are controlled using a stack, and the display order also obeys that stack order.
         * When {@link enchant.Core#popScene} is executed, the Scene at the top of the stack
         * will be removed and returned.
         *
         * @return {enchant.Scene} Ended Scene.
         [/lang]
         [lang:de]
         * Beendet die aktuelle Szene und wechselt zu der vorherigen Szene.
         *
         * Szenen werden durch einen Stapelspeicher kontrolliert und die Darstellungsreihenfolge
         * folgt ebenfalls der Ordnung des Stapelspeichers.
         * Wenn die {@link enchant.Core#popScene} Methode ausgeführt wird, wird die Szene oben auf dem
         * Stapelspeicher entfernt und liefert diese als Rückgabewert.
         *
         * @return {enchant.Scene} Die Szene, die beendet wurde.
         [/lang]
         */
        popScene: function() {
            if (this.currentScene === this.rootScene) {
                return this.currentScene;
            }
            this._element.removeChild(this.currentScene._element);
            this.currentScene.dispatchEvent(new enchant.Event('exit'));
            this.currentScene = this._scenes[this._scenes.length - 2];
            this.currentScene.dispatchEvent(new enchant.Event('enter'));
            return this._scenes.pop();
        },
        /**
         [lang:ja]
         * 現在のSceneを別のSceneにおきかえる.
         *
         * enchant.Core#popScene, enchant.Core#pushSceneを同時に行う.
         *
         * @param {enchant.Scene} scene おきかえるScene.
         * @return {enchant.Scene} 新しいScene.
         [/lang]
         [lang:en]
         * Overwrites the current Scene with a new Scene.
         *
         * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene} are executed after
         * each other to replace to current scene with the new scene.
         *
         * @param {enchant.Scene} scene The new scene which will replace the previous scene.
         * @return {enchant.Scene} The new Scene.
         [/lang]
         [lang:de]
         * Ersetzt die aktuelle Szene durch eine neue Szene.
         *
         * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene} werden nacheinander
         * ausgeführt um die aktuelle Szene durch die neue zu ersetzen.
         *
         * @param {enchant.Scene} scene Die neue Szene, welche die aktuelle Szene ersetzen wird.
         * @return {enchant.Scene} Die neue Szene.
         [/lang]
         */
        replaceScene: function(scene) {
            this.popScene();
            return this.pushScene(scene);
        },
        /**
         [lang:ja]
         * Scene削除する.
         *
         * Sceneスタック中からSceneを削除する.
         *
         * @param {enchant.Scene} scene 削除するScene.
         * @return {enchant.Scene} 削除したScene.
         [/lang]
         [lang:en]
         * Removes a Scene.
         *
         * Removes a Scene from the Scene stack.
         *
         * @param {enchant.Scene} scene Scene to be removed.
         * @return {enchant.Scene} The deleted Scene.
         [/lang]
         [lang:de]
         * Entfernt eine Szene.
         *
         * Entfernt eine Szene aus dem Szenen-Stapelspeicher.
         *
         * @param {enchant.Scene} scene Die Szene die entfernt werden soll.
         * @return {enchant.Scene} Die entfernte Szene.
         [/lang]
         */
        removeScene: function(scene) {
            if (this.currentScene === scene) {
                return this.popScene();
            } else {
                var i = this._scenes.indexOf(scene);
                if (i !== -1) {
                    this._scenes.splice(i, 1);
                    this._element.removeChild(scene._element);
                    return scene;
                } else {
                    return null;
                }
            }
        },
        /**
         [lang:ja]
         * キーバインドを設定する.
         *
         * キー入力をleft, right, up, down, a, bいずれかのボタン入力として割り当てる.
         *
         * @param {Number} key キーバインドを設定するキーコード.
         * @param {String} button 割り当てるボタン.
         [/lang]
         [lang:en]
         * Set a key binding.
         *
         * Maps an input key to an enchant.js left, right, up, down, a, b button.
         *
         * @param {Number} key Key code for the button which will be bound.
         * @param {String} button The enchant.js button (left, right, up, down, a, b).
         [/lang]
         [lang:de]
         * Bindet eine Taste.
         *
         * Diese Methode bindet eine Taste an einen in enchant.js verwendeten Knopf (Button).
         *
         * @param {Number} key Der Tastencode der Taste die gebunden werden soll.
         * @param {String} button Der enchant.js Knopf (left, right, up, down, a, b).
         [/lang]
         */
        keybind: function(key, button) {
            this._keybind[key] = button;
        },
        /**
         [lang:ja]
         * Core#start が呼ばれてから経過した時間を取得する
         * @return {Number} 経過した時間 (秒)
         [/lang]
         [lang:en]
         * Get the elapsed core time (not actual) from when core.start was called.
         * @return {Number} The elapsed time (seconds)
         [/lang]
         [lang:de]
         * Liefert die vergange Spielzeit (keine reale) die seit dem Aufruf von core.start
         * vergangen ist.
         * @return {Number} Die vergangene Zeit (Sekunden)
         [/lang]
         */
        getElapsedTime: function() {
            return this.frame / this.fps;
        }
    });

    enchant.Core._loadFuncs = {};
    enchant.Core._loadFuncs['jpg'] =
        enchant.Core._loadFuncs['jpeg'] =
            enchant.Core._loadFuncs['gif'] =
                enchant.Core._loadFuncs['png'] =
                    enchant.Core._loadFuncs['bmp'] = function(src, callback) {
                        this.assets[src] = enchant.Surface.load(src);
                        this.assets[src].addEventListener('load', callback);
                    };
    enchant.Core._loadFuncs['mp3'] =
        enchant.Core._loadFuncs['aac'] =
            enchant.Core._loadFuncs['m4a'] =
                enchant.Core._loadFuncs['wav'] =
                    enchant.Core._loadFuncs['ogg'] = function(src, callback, ext) {
                        this.assets[src] = enchant.Sound.load(src, 'audio/' + ext);
                        this.assets[src].addEventListener('load', callback);
                    };


    /**
     * Get the file extension from a path
     * @param path
     * @return {*}
     */
    enchant.Core.findExt = function(path) {
        var matched = path.match(/\.\w+$/);
        if (matched && matched.length > 0) {
            return matched[0].slice(1).toLowerCase();
        }

        // for data URI
        if (path.indexOf('data:') === 0) {
            return path.split(/[\/;]/)[1].toLowerCase();
        }
        return null;
    };

    /**
     [lang:ja]
     * 現在のCoreインスタンス.
     [/lang]
     [lang:en]
     * The Current Core instance.
     [/lang]
     [lang:de]
     * Die aktuelle Instanz des Spieles.
     [/lang]
     * @type {enchant.Core}
     * @static
     */
    enchant.Core.instance = null;
}());

/**
 * enchant.Core is moved to enchant.Core from v0.6
 * @type {*}
 */

enchant.Game = enchant.Core;
/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     [lang:ja]
     * Sceneをルートとした表示オブジェクトツリーに属するオブジェクトの基底クラス.
     * 直接使用することはない.
     [/lang]
     [lang:en]
     * Base class for objects in the display tree which is rooted at a Scene.
     * Not to be used directly.
     [/lang]
     [lang:de]
     * Basisklasse für Objekte die im Darstellungsbaum, 
     * dessen Wurzel eine Szene ist, enthalten sind.
     * Sollte nicht direkt verwendet werden.
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._dirty = false;

        this._matrix = [ 1, 0, 0, 1, 0, 0 ];

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         * [lang:ja]
         * Node が画面に表示されてから経過したフレーム数。
         * {@link enchant.Event.ENTER_FRAME} イベントを受け取る前にインクリメントされる。
         * (ENTER_FRAME イベントのリスナが初めて実行される時に 1 となる。)
         * [/lang]
         * [lang:en]
         * The age (frames) of this node which will be increased before this node receives {@link enchant.Event.ENTER_FRAME} event.
         * [/lang]
         * [lang:de]
         * Das Alter (Frames) dieses Nodes welches vor dem {@link enchant.Event.ENTER_FRAME} Ereignis erhöht wird.
         * [/lang]
         * @type {Number}
         */
        this.age = 0;

        /**
         [lang:ja]
         * Nodeの親Node.
         [/lang]
         [lang:en]
         * Parent Node of this Node.
         [/lang]
         [lang:de]
         * Der Eltern-Node dieses Node.
         [/lang]
         * @type {enchant.Group}
         */
        this.parentNode = null;
        /**
         [lang:ja]
         * Nodeが属しているScene.
         [/lang]
         [lang:en]
         * Scene to which Node belongs.
         [/lang]
         [lang:de]
         * Die Szene, zu welcher dieser Node gehört.
         [/lang]
         * @type {enchant.Scene}
         */
        this.scene = null;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });

        /**
         * Node が生成される際に、tl プロパティに Timeline オブジェクトを追加している
         */
        if(enchant.ENV.USE_ANIMATION){
            var tl = this.tl = new enchant.Timeline(this);
            this.addEventListener("enterframe", function(e) {
                tl.dispatchEvent(e);
            });
        }
    },
    /**
     [lang:ja]
     * Nodeを移動する.
     * @param {Number} x 移動先のx座標.
     * @param {Number} y 移動先のy座標.
     [/lang]
     [lang:en]
     * Move the Node to the given target location.
     * @param {Number} x Target x coordinates.
     * @param {Number} y Target y coordinates.
     [/lang]
     [lang:de]
     * Bewegt diesen Node zu den gegebenen Ziel Koordinaten.
     * @param {Number} x Ziel x Koordinaten.
     * @param {Number} y Ziel y Koordinaten.
     [/lang]
     */
    moveTo: function(x, y) {
        this._x = x;
        this._y = y;
        this._dirty = true;
    },
    /**
     [lang:ja]
     * Nodeを移動する.
     * @param {Number} x 移動するx軸方向の距離.
     * @param {Number} y 移動するy軸方向の距離.
     [/lang]
     [lang:en]
     * Move the Node relative to its current position.
     * @param {Number} x x axis movement distance.
     * @param {Number} y y axis movement distance.
     [/lang]
     [lang:de]
     * Bewegt diesen Node relativ zur aktuellen Position.
     * @param {Number} x Distanz auf der x Achse.
     * @param {Number} y Distanz auf der y Achse.
     [/lang]
     */
    moveBy: function(x, y) {
        this._x += x;
        this._y += y;
        this._dirty = true;
    },
    /**
     [lang:ja]
     * Nodeのx座標.
     [/lang]
     [lang:en]
     * x coordinates of the Node.
     [/lang]
     [lang:de]
     * Die x Koordinaten des Nodes.
     [/lang]
     * @type {Number}
     */
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            this._x = x;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Nodeのy座標.
     [/lang]
     [lang:en]
     * y coordinates of the Node.
     [/lang]
     [lang:de]
     * Die y Koordinaten des Nodes.
     [/lang]
     * @type {Number}
     */
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            this._y = y;
            this._dirty = true;
        }
    },
    _updateCoordinate: function() {
        var node = this;
        var tree = [ node ];
        var parent = node.parentNode;
        var scene = this.scene;
        while (parent && node._dirty) {
            tree.unshift(parent);
            node = node.parentNode;
            parent = node.parentNode;
        }
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var mat = [];
        var newmat, ox, oy;
        stack.push(tree[0]._matrix);
        for (var i = 1, l = tree.length; i < l; i++) {
            node = tree[i];
            newmat = [];
            matrix.makeTransformMatrix(node, mat);
            matrix.multiply(stack[stack.length - 1], mat, newmat);
            node._matrix = newmat;
            stack.push(newmat);
            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        }
        matrix.reset();
    },
    remove: function() {
        if (this._listener) {
            this.clearEventListener();
        }
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    }
});

/**
 * @scope enchant.Entity.prototype
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
     [lang:ja]
     * DOM上で表示する実体を持ったクラス.直接使用することはない.
     [/lang]
     [lang:en]
     * A class with objects displayed as DOM elements. Not to be used directly.
     [/lang]
     [lang:de]
     * Eine Klasse die Objekte mit Hilfe von DOM Elementen darstellt.
     * Sollte nicht direkt verwendet werden.
     [/lang]
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        var core = enchant.Core.instance;
        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._clipping = false;

        this._originX = null;
        this._originY = null;

        this._width = 0;
        this._height = 0;
        this._backgroundColor = null;
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        this._style = {};
        this.__styleStatus = {};

        /**
         [lang:ja]
         * Entityを描画する際の合成処理を設定する.
         * Canvas上に描画する際のみ有効.
         * CanvasのコンテキストのglobalCompositeOperationにセットされる.
         [/lang]
         */
        this.compositeOperation = null;

        /**
         [lang:ja]
         * Entityにボタンの機能を設定する.
         * Entityに対するタッチ, クリックをleft, right, up, down, a, bいずれかの
         * ボタン入力として割り当てる.
         [/lang]
         [lang:en]
         * Defines this Entity as a button.
         * When touched or clicked the corresponding button event is dispatched.
         * Valid buttonModes are: left, right, up, down, a, b. 
         [/lang]
         [lang:de]
         * Definiert diese Entity als Schaltfläche (Button).
         * Bei einem Klick oder Touch wird das entsprechende
         * Button Ereignis (Event) ausgelöst.
         * Mögliche buttonModes sind: left, right, up, down, a, b. 
         [/lang]
         * @type {String}
         */
        this.buttonMode = null;
        /**
         [lang:ja]
         * Entityが押されているかどうか.
         * {@link enchant.Entity.buttonMode}が設定されているときだけ機能する.
         [/lang]
         [lang:en]
         * Indicates if this Entity is being clicked.
         * Only works when {@link enchant.Entity.buttonMode} is set.
         [/lang]
         [lang:de]
         * Zeigt an, ob auf die Entity geklickt wurde.
         * Funktioniert nur wenn {@link enchant.Entity.buttonMode} gesetzt ist.
         [/lang]
         * @type {Boolean}
         */
        this.buttonPressed = false;
        this.addEventListener('touchstart', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = true;
            var e = new enchant.Event(this.buttonMode + 'buttondown');
            this.dispatchEvent(e);
            core.dispatchEvent(e);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = false;
            var e = new enchant.Event(this.buttonMode + 'buttonup');
            this.dispatchEvent(e);
            core.dispatchEvent(e);
        });
    },
    /**
     [lang:ja]
     * Entityの横幅.
     [/lang]
     [lang:en]
     * The width of the Entity.
     [/lang]
     [lang:de]
     * Die Breite der Entity.
     [/lang]
     * @type {Number}
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Entityの高さ.
     [/lang]
     [lang:en]
     * The height of the Entity.
     [/lang]
     [lang:de]
     * Die Höhe der Entity.
     [/lang]
     * @type {Number}
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Entityの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * The Entity background color.
     * Must be provided in the same format as the CSS 'color' property.
     [/lang]
     [lang:de]
     * Die Hintergrundfarbe der Entity.
     * Muss im gleichen Format definiert werden wie das CSS 'color' Attribut.
     [/lang]
     * @type {String}
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = color;
        }
    },
    /**
     [lang:ja]
     * Entityの透明度.
     * 0から1までの値を設定する(0が完全な透明, 1が完全な不透明).
     [/lang]
     [lang:en]
     * The transparency of this entity.
     * Defines the transparency level from 0 to 1
     * (0 is completely transparent, 1 is completely opaque).
     [/lang]
     [lang:de]
     * Transparenz der Entity.
     * Definiert den Level der Transparenz von 0 bis 1
     * (0 ist komplett transparent, 1 ist vollständig deckend).
     [/lang]
     * @type {Number}
     */
    opacity: {
        get: function() {
            return this._opacity;
        },
        set: function(opacity) {
            this._opacity = opacity;
        }
    },
    /**
     [lang:ja]
     * Entityを表示するかどうかを指定する.
     [/lang]
     [lang:en]
     * Indicates whether or not to display this Entity.
     [/lang]
     [lang:de]
     * Zeigt an, ob die Entity dargestellt werden soll oder nicht.
     [/lang]
     * @type {Boolean}
     */
    visible: {
        get: function() {
            return this._visible;
        },
        set: function(visible) {
            this._visible = visible;
        }
    },
    /**
     [lang:ja]
     * Entityのタッチを有効にするかどうかを指定する.
     [/lang]
     [lang:en]
     * Indicates whether or not this Entity can be touched.
     [/lang]
     [lang:de]
     * Definiert ob auf die Entity geklickt werden kann. 
     [/lang]
     * @type {Boolean}
     */
    touchEnabled: {
        get: function() {
            return this._touchEnabled;
        },
        set: function(enabled) {
            this._touchEnabled = enabled;
            /*
            if (this._touchEnabled = enabled) {
                this._style.pointerEvents = 'all';
            } else {
                this._style.pointerEvents = 'none';
            }
            */
        }
    },
    /**
     [lang:ja]
     * Entityの矩形が交差しているかどうかにより衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @return {Boolean} 衝突判定の結果.
     [/lang]
     [lang:en]
     * Performs a collision detection based on whether or not the bounding rectangles are intersecting.
     * @param {*} other An object like Entity, with the properties x, y, width, height, which are used for the 
     * collision detection.
     * @return {Boolean} True, if a collision was detected.
     [/lang]
     [lang:de]
     * Führt eine Kollisionsdetektion durch, die überprüft ob eine Überschneidung zwischen den
     * begrenzenden Rechtecken existiert. 
     * @param {*} other Ein Objekt wie Entity, welches x, y, width und height Variablen besitzt,
     * mit dem die Kollisionsdetektion durchgeführt wird.
     * @return {Boolean} True, falls eine Kollision festgestellt wurde.
     [/lang]
     */
    intersect: function(other) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        return this._offsetX < other._offsetX + other.width && other._offsetX < this._offsetX + this.width &&
            this._offsetY < other._offsetY + other.height && other._offsetY < this._offsetY + this.height;
    },
    /**
     [lang:ja]
     * Entityの中心点どうしの距離により衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @param {Number} [distance] 衝突したと見なす最大の距離. デフォルト値は二つのEntityの横幅と高さの平均.
     * @return {Boolean} 衝突判定の結果.
     [/lang]
     [lang:en]
     * Performs a collision detection based on distance from the Entity's central point.
     * @param {*} other An object like Entity, with properties x, y, width, height, which are used for the 
     * collision detection.
     * @param {Number} [distance] The greatest distance to be considered for a collision.
     * The default distance is the average of both objects width and height.
     * @return {Boolean} True, if a collision was detected.
     [/lang]
     [lang:de]
     * Führt eine Kollisionsdetektion durch, die anhand der Distanz zwischen den Objekten feststellt,
     * ob eine Kollision aufgetreten ist.
     * @param {*} other Ein Objekt wie Entity, welches x, y, width und height Variablen besitzt,
     * mit dem die Kollisionsdetektion durchgeführt wird.
     * @param {Number} [distance] Die größte Distanz die für die Kollision in betracht gezogen wird.
     * Der Standardwert ist der Durchschnitt der Breite und Höhe beider Objekte.
     * @return {Boolean} True, falls eine Kollision festgestellt wurde.
     [/lang]
     */
    within: function(other, distance) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        if (distance == null) {
            distance = (this.width + this.height + other.width + other.height) / 4;
        }
        var _;
        return (_ = this._offsetX - other._offsetX + (this.width - other.width) / 2) * _ +
            (_ = this._offsetY - other._offsetY + (this.height - other.height) / 2) * _ < distance * distance;
    }, /**
     [lang:ja]
     * Spriteを拡大縮小する.
     * @param {Number} x 拡大するx軸方向の倍率.
     * @param {Number} [y] 拡大するy軸方向の倍率.
     [/lang]
     [lang:en]
     * Enlarges or shrinks this Sprite.
     * @param {Number} x Scaling factor on the x axis.
     * @param {Number} [y] Scaling factor on the y axis.
     [/lang]
     [lang:de]
     * Vergrößert oder verkleinert dieses Sprite.
     * @param {Number} x Skalierungsfaktor auf der x-Achse.
     * @param {Number} [y] Skalierungsfaktor auf der y-Achse.
     [/lang]
     */
    scale: function(x, y) {
        this._scaleX *= x;
        this._scaleY *= (y != null) ? y : x;
        this._dirty = true;
    },
    /**
     [lang:ja]
     * Spriteを回転する.
     * @param {Number} deg 回転する角度 (度数法).
     [/lang]
     [lang:en]
     * Rotate this Sprite.
     * @param {Number} deg Rotation angle (degree).
     [/lang]
     [lang:de]
     * Rotiert dieses Sprite.
     * @param {Number} deg Rotationswinkel (Grad).
     [/lang]
     */
    rotate: function(deg) {
        this._rotation += deg;
        this._dirty = true;
    },
    /**
     [lang:ja]
     * Spriteのx軸方向の倍率.
     [/lang]
     [lang:en]
     * Scaling factor on the x axis of this Sprite.
     [/lang]
     [lang:de]
     * Skalierungsfaktor auf der x-Achse dieses Sprites.
     [/lang]
     * @type {Number}
     */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Spriteのy軸方向の倍率.
     [/lang]
     [lang:en]
     * Scaling factor on the y axis of this Sprite.
     [/lang]
     [lang:de]
     * Skalierungsfaktor auf der y-Achse dieses Sprites.
     [/lang]
     * @type {Number}
     */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Spriteの回転角 (度数法).
     [/lang]
     [lang:en]
     * Sprite rotation angle (degree).
     [/lang]
     [lang:de]
     * Rotationswinkel des Sprites (Grad).
     [/lang]
     * @type {Number}
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * 回転・拡大縮小の基準点のX座標
     [/lang]
     [lang:en]
     * The point of origin used for rotation and scaling.
     [/lang]
     [lang:de]
     * Ausgangspunkt für Rotation und Skalierung.
     [/lang]
     * @type {Number}
     */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            this._originX = originX;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * 回転・拡大縮小の基準点のY座標
     [/lang]
     [lang:en]
     * The point of origin used for rotation and scaling.
     [/lang]
     [lang:de]
     * Ausgangspunkt für Rotation und Skalierung.
     [/lang]
     * @type {Number}
     */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            this._originY = originY;
            this._dirty = true;
        }
    }
});

/**
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     [lang:ja]
     * 画像表示機能を持ったクラス。
     * Entity を継承している。
     *
     * @param {Number} [width] Spriteの横幅.
     * @param {Number} [height] Spriteの高さ.
     [/lang]
     [lang:en]
     * Class which can display images.
     * 
     * @param {Number} [width] Sprite width.
     * @param {Number} [height] Sprite height.
     [/lang]
     [lang:de]
     * Eine Klasse die Grafiken darstellen kann.
     * 
     * @param {Number} [width] Die Breite des Sprites.
     * @param {Number} [height] Die Höhe des Sprites.
     [/lang]
     * @example
     *   var bear = new Sprite(32, 32);
     *   bear.image = core.assets['chara1.gif'];
     *
     * @param {Number} [width] Sprite width.g
     * @param {Number} [height] Sprite height.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(width, height) {
        enchant.Entity.call(this);

        this.width = width;
        this.height = height;
        this._image = null;
        this._frameLeft = 0;
        this._frameTop = 0;
        this._frame = 0;
        this._frameSequence = [];

        /**
         * frame に配列が指定されたときの処理。
         * _frameSeuence に
         */
        this.addEventListener('enterframe', function() {
            if (this._frameSequence.length !== 0) {
                var nextFrame = this._frameSequence.shift();
                if (nextFrame === null) {
                    this._frameSequence = [];
                } else {
                    this._setFrame(nextFrame);
                    this._frameSequence.push(nextFrame);
                }
            }
        });
    },
    /**
     [lang:ja]
     * Spriteで表示する画像.
     [/lang]
     [lang:en]
     * Image displayed in the Sprite.
     [/lang]
     [lang:de]
     * Die Grafik die im Sprite dargestellt wird.
     [/lang]
     * @type {enchant.Surface}
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            if (image === this._image) {
                return;
            }
            this._image = image;
            this._setFrame(this._frame);
        }
    },
    /**
     [lang:ja]
     * 表示するフレームのインデックス.
     * Spriteと同じ横幅と高さを持ったフレームが{@link enchant.Sprite#image}プロパティの画像に左上から順に
     * 配列されていると見て, 0から始まるインデックスを指定することでフレームを切り替える.
     *
     * 数値の配列が指定された場合、それらを毎フレーム順に切り替える。
     * ループするが、null値が含まれているとそこでループをストップする。
     [/lang]
     [lang:en]
     * Indizes of the frames to be displayed.
     * Frames with same width and height as Sprite will be arrayed from upper left corner of the 
     * {@link enchant.Sprite#image} image. When a sequence of numbers is provided, the displayed frame 
     * will switch automatically. At the end of the array the sequence will restart. By setting 
     * a value within the sequence to null, the frame switching is stopped.
     [/lang]
     [lang:de]
     * Die Indizes der darzustellenden Frames.
     * Die Frames mit der selben Größe wie das Sprite werden aus der {@link enchant.Sprite#image} image Variable,
     * beginnend an der oberen linken Ecke, angeordnet. Wenn eine Nummbersequenz übergeben wird, wird
     * der dargestellte Frame automatisch gewechselt. Am ende des Arrays der Sequenz wird diese neugestartet.
     * Wenn ein Wert in der Sequenz auf null gesetzt wird, wird das automatische Framewechseln gestoppt.
     [/lang]
     * @example
     * var sprite = new Sprite(32, 32);
     * sprite.frame = [0, 1, 0, 2]
     * //-> 0, 1, 0, 2, 0, 1, 0, 2,..
     * sprite.frame = [0, 1, 0, 2, null]
     * //-> 0, 1, 0, 2, (2, 2,.. :stop)
     *
     * @type {Number|Array}
     */
    frame: {
        get: function() {
            return this._frame;
        },
        set: function(frame) {
            if (frame instanceof Array) {
                var frameSequence = frame;
                var nextFrame = frameSequence.shift();
                this._setFrame(nextFrame);
                frameSequence.push(nextFrame);
                this._frameSequence = frameSequence;
            } else {
                this._setFrame(frame);
                this._frameSequence = [];
                this._frame = frame;
            }
        }
    },
    /**
     * 0 <= frame
     * 0以下の動作は未定義.
     * @param frame
     * @private
     */
    _setFrame: function(frame) {
        var image = this._image;
        var row, col;
        if (image != null) {
            this._frame = frame;
            row = image.width / this._width | 0;
            this._frameLeft = (frame % row | 0) * this._width;
            this._frameTop = (frame / row | 0) * this._height % image.height;
        }
    },
    cvsRender: function(ctx) {
        var img, imgdata, row, frame;
        var sx, sy, sw, sh;
        if (this._image && this._width !== 0 && this._height !== 0) {
            frame = Math.abs(this._frame) || 0;
            img = this._image;
            imgdata = img._element;
            sx = this._frameLeft;
            sy = Math.min(this._frameTop, img.height - this._height);
            sw = Math.min(img.width - sx, this._width);
            sh = Math.min(img.height - sy, this._height);
            ctx.drawImage(imgdata, sx, sy, sw, sh, 0, 0, this._width, this._height);
        }
    },
    domRender: function(element) {
        if (this._image) {
            if (this._image._css) {
                element.style.backgroundImage = this._image._css;
                element.style.backgroundPosition =
                    -this._frameLeft + 'px ' +
                    -this._frameTop + 'px';
            } else if (this._image._element) {
            }
        }
    }
});

/**
 * @scope enchant.Label.prototype
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     [lang:ja]
     * Labelオブジェクトを作成する.
     [/lang]
     [lang:en]
     * Create Label object.
     [/lang]
     [lang:de]
     * Erstellt ein Label Objekt.
     [/lang]
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.width = 300;
        this.font = '14px serif';
        this.text = text || '';
        this.textAlign = 'left';
    },
    /**
     [lang:ja]
     * 表示するテキスト.
     [/lang]
     [lang:en]
     * Text to be displayed.
     [/lang]
     [lang:de]
     * Darzustellender Text.
     [/lang]
     * @type {String}
     */
    text: {
        get: function() {
            return this._text;
        },
        set: function(text) {
            this._text = text;
            text = text.replace(/<(br|BR) ?\/?>/g, '<br/>');
            this._splitText = text.split('<br/>');
            var metrics = this.getMetrics();
            this._boundWidth = metrics.width;
            this._boundHeight = metrics.height;
            for (var i = 0, l = this._splitText.length; i < l; i++) {
                text = this._splitText[i];
                metrics = this.getMetrics(text);
                this._splitText[i] = {};
                this._splitText[i].text = text;
                this._splitText[i].height = metrics.height;
            }
        }
    },
    /**
     [lang:ja]
     * テキストの水平位置の指定.
     * CSSの'text-align'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * Specifies horizontal alignment of text.
     * Can be set according to the format of the CSS 'text-align' property.
     [/lang]
     [lang:de]
     * Spezifiziert die horizontale Ausrichtung des Textes.
     * Kann im gleichen Format wie die CSS 'text-align' Eigenschaft angegeben werden.
     [/lang]
     * @type {String}
     */
    textAlign: {
        get: function() {
            return this._style.textAlign;
        },
        set: function(textAlign) {
            this._style.textAlign = textAlign;
        }
    },
    /**
     [lang:ja]
     * フォントの指定.
     * CSSの'font'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * Font settings.
     * Can be set according to the format of the CSS 'font' property.
     [/lang]
     [lang:de]
     * Text Eigenschaften.
     * Kann im gleichen Format wie die CSS 'font' Eigenschaft angegeben werden.
     [/lang]
     * @type {String}
     */
    font: {
        get: function() {
            return this._style.font;
        },
        set: function(font) {
            this._style.font = font;
        }
    },
    /**
     [lang:ja]
     * 文字色の指定.
     * CSSの'color'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * Text color settings.
     * Can be set according to the format of the CSS 'color' property.
     [/lang]
     [lang:de]
     * Text Farbe.
     * Kann im gleichen Format wie die CSS 'color' Eigenschaft angegeben werden.
     [/lang]
     * @type {String}
     */
    color: {
        get: function() {
            return this._style.color;
        },
        set: function(color) {
            this._style.color = color;
        }
    },
    cvsRender: function(ctx) {
        var y = 0;
        var text, buf, c;
        if (this._splitText) {
            ctx.textBaseline = 'top';
            ctx.font = this.font;
            ctx.fillStyle = this.color || '#000000';
            for (var i = 0, l = this._splitText.length; i < l; i++) {
                text = this._splitText[i];
                buf = '';
                for (var j = 0, ll = text.text.length; j < ll; j++) {
                    c = text.text[j];
                    if (ctx.measureText(buf).width > this.width) {
                        ctx.fillText(buf, 0, y);
                        y += text.height - 1;
                        buf = '';
                    }
                    buf += c;
                }
                ctx.fillText(buf, 0, y);
                y += text.height - 1;
            }
        }
    },
    domRender: function(element) {
        if (element.innerHTML !== this._text) {
            element.innerHTML = this._text;
        }
        element.style.font = this._font;
        element.style.color = this._color;
        element.style.textAlign = this._textAlign;
    },
    detectRender: function(ctx) {
        ctx.fillRect(0, 0, this._boundWidth, this._boundHeight);
    }
});

enchant.Label.prototype.getMetrics = function(text) {
    var ret = {};
    var div, width, height;
    if (document.body) {
        div = document.createElement('div');
        for (var prop in this._style) {
            div.style[prop] = this._style[prop];
        }
        div.innerHTML = text || this._text;
        document.body.appendChild(div);
        ret.height = parseInt(getComputedStyle(div).height, 10) + 1;
        div.style.position = 'absolute';
        ret.width = parseInt(getComputedStyle(div).width, 10) + 1;
        document.body.removeChild(div);
    } else {
        ret.width = this.width;
        ret.height = this.height;
    }
    return ret;
};

/**
 * @scope enchant.Map.prototype
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
     [lang:ja]
     * タイルセットからマップを生成して表示するクラス.
     *
     * @param {Number} tileWidth タイルの横幅.
     * @param {Number} tileHeight タイルの高さ.
     [/lang]
     [lang:en]
     * A class to create and display maps from a tile set.
     *
     * @param {Number} tileWidth Tile width.
     * @param {Number} tileHeight Tile height.
     [/lang]
     [lang:de]
     * Eine Klasse mit der Karten aus Kacheln (Tiles)
     * erstellt und angezeigt werden können.
     *
     * @param {Number} tileWidth Kachelbreite.
     * @param {Number} tileHeight Kachelhöhe.
     [/lang]
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(tileWidth, tileHeight) {
        var core = enchant.Core.instance;

        enchant.Entity.call(this);

        var surface = new enchant.Surface(core.width, core.height);
        this._surface = surface;
        var canvas = surface._element;
        canvas.style.position = 'absolute';
        if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
            canvas.width = core.width * 2;
            canvas.height = core.height * 2;
            this._style.webkitTransformOrigin = '0 0';
            this._style.webkitTransform = 'scale(0.5)';
        } else {
            canvas.width = core.width;
            canvas.height = core.height;
        }
        this._context = canvas.getContext('2d');

        this._tileWidth = tileWidth || 0;
        this._tileHeight = tileHeight || 0;
        this._image = null;
        this._data = [
            [
                []
            ]
        ];
        this._dirty = false;
        this._tight = false;

        this.touchEnabled = false;

        /**
         [lang:ja]
         * タイルが衝突判定を持つかを表す値の二元配列.
         [/lang]
         [lang:en]
         * Two dimensional array to store if collision detection should be performed for a tile.
         [/lang]
         [lang:de]
         * Ein 2-Dimensionales Array um zu speichern, ob für eine Kachel
         * Kollesionsdetektion durchgeführt werden soll.
         [/lang]
         * @type {Array.<Array.<Number>>}
         */
        this.collisionData = null;

        this._listeners['render'] = null;
        this.addEventListener('render', function() {
            if (this._dirty || this._previousOffsetX == null) {
                this.redraw(0, 0, core.width, core.height);
            } else if (this._offsetX !== this._previousOffsetX ||
                this._offsetY !== this._previousOffsetY) {
                if (this._tight) {
                    var x = -this._offsetX;
                    var y = -this._offsetY;
                    var px = -this._previousOffsetX;
                    var py = -this._previousOffsetY;
                    var w1 = x - px + core.width;
                    var w2 = px - x + core.width;
                    var h1 = y - py + core.height;
                    var h2 = py - y + core.height;
                    if (w1 > this._tileWidth && w2 > this._tileWidth &&
                        h1 > this._tileHeight && h2 > this._tileHeight) {
                        var sx, sy, dx, dy, sw, sh;
                        if (w1 < w2) {
                            sx = 0;
                            dx = px - x;
                            sw = w1;
                        } else {
                            sx = x - px;
                            dx = 0;
                            sw = w2;
                        }
                        if (h1 < h2) {
                            sy = 0;
                            dy = py - y;
                            sh = h1;
                        } else {
                            sy = y - py;
                            dy = 0;
                            sh = h2;
                        }

                        if (core._buffer == null) {
                            core._buffer = document.createElement('canvas');
                            core._buffer.width = this._context.canvas.width;
                            core._buffer.height = this._context.canvas.height;
                        }
                        var context = core._buffer.getContext('2d');
                        if (this._doubledImage) {
                            context.clearRect(0, 0, sw * 2, sh * 2);
                            context.drawImage(this._context.canvas,
                                sx * 2, sy * 2, sw * 2, sh * 2, 0, 0, sw * 2, sh * 2);
                            context = this._context;
                            context.clearRect(dx * 2, dy * 2, sw * 2, sh * 2);
                            context.drawImage(core._buffer,
                                0, 0, sw * 2, sh * 2, dx * 2, dy * 2, sw * 2, sh * 2);
                        } else {
                            context.clearRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                sx, sy, sw, sh, 0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(core._buffer,
                                0, 0, sw, sh, dx, dy, sw, sh);
                        }

                        if (dx === 0) {
                            this.redraw(sw, 0, core.width - sw, core.height);
                        } else {
                            this.redraw(0, 0, core.width - sw, core.height);
                        }
                        if (dy === 0) {
                            this.redraw(0, sh, core.width, core.height - sh);
                        } else {
                            this.redraw(0, 0, core.width, core.height - sh);
                        }
                    } else {
                        this.redraw(0, 0, core.width, core.height);
                    }
                } else {
                    this.redraw(0, 0, core.width, core.height);
                }
            }
            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        });
    },
    /**
     [lang:ja]
     * データを設定する.
     * タイルががimageプロパティの画像に左上から順に配列されていると見て, 0から始まる
     * インデックスの二元配列を設定する.複数指定された場合は後のものから順に表示される.
     * @param {...Array<Array.<Number>>} data タイルのインデックスの二元配列. 複数指定できる.
     [/lang]
     [lang:en]
     * Set map data.
     * Sets the tile data, whereas the data (two-dimensional array with indizes starting from 0) 
     * is mapped on the image starting from the upper left corner.
     * When more than one map data array is set, they are displayed in reverse order.
     * @param {...Array<Array.<Number>>} data Two-dimensional array of tile indizes. Multiple designations possible.
     [/lang]
     [lang:de]
     * Setzt die Kartendaten.
     * Setzt die Kartendaten, wobei die Daten (ein 2-Dimensionales Array bei dem die Indizes bei 0 beginnen) 
     * auf das Bild, beginned bei der linken oberen Ecke) projeziert werden.
     * Sollte mehr als ein Array übergeben worden sein, werden die Karten in invertierter Reihenfolge dargestellt. 
     * @param {...Array<Array.<Number>>} data 2-Dimensionales Array mit Kachel Indizes. Mehrfachangaben möglich.
     [/lang]
     */
    loadData: function(data) {
        this._data = Array.prototype.slice.apply(arguments);
        this._dirty = true;

        this._tight = false;
        for (var i = 0, len = this._data.length; i < len; i++) {
            var c = 0;
            data = this._data[i];
            for (var y = 0, l = data.length; y < l; y++) {
                for (var x = 0, ll = data[y].length; x < ll; x++) {
                    if (data[y][x] >= 0) {
                        c++;
                    }
                }
            }
            if (c / (data.length * data[0].length) > 0.2) {
                this._tight = true;
                break;
            }
        }
    },
    /**
     [lang:ja]
     * ある座標のタイルが何か調べる.
     * @param {Number} x マップ上の点のx座標.
     * @param {Number} y マップ上の点のy座標.
     * @return {*} ある座標のタイルのデータ.
     [/lang]
     [lang:en]
     * Checks what tile is present at the given position.
     * @param {Number} x x coordinates of the point on the map.
     * @param {Number} y y coordinates of the point on the map.
     * @return {*} The tile data for the given position.
     [/lang]
     [lang:de]
     * Überprüft welche Kachel an der gegeben Position vorhanden ist.
     * @param {Number} x Die x Koordinataten des Punktes auf der Karte.
     * @param {Number} y Die y Koordinataten des Punktes auf der Karte.
     * @return {*} Die Kachel für die angegebene Position.
     [/lang]
     */
    checkTile: function(x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        //		return this._data[y][x];
        var data = this._data[0];
        return data[y][x];
    },
    /**
     [lang:ja]
     * Map上に障害物があるかどうかを判定する.
     * @param {Number} x 判定を行うマップ上の点のx座標.
     * @param {Number} y 判定を行うマップ上の点のy座標.
     * @return {Boolean} 障害物があるかどうか.
     [/lang]
     [lang:en]
     * Judges whether or not obstacles are on top of Map.
     * @param {Number} x x coordinates of detection spot on map.
     * @param {Number} y y coordinates of detection spot on map.
     * @return {Boolean} True, if there are obstacles.
     [/lang]
     [lang:de]
     * Überprüft ob auf der Karte Hindernisse vorhanden sind.
     * @param {Number} x Die x Koordinataten des Punktes auf der Karte, der überprüft werden soll.
     * @param {Number} y Die y Koordinataten des Punktes auf der Karte, der überprüft werden soll.
     * @return {Boolean} True, falls Hindernisse vorhanden sind.
     [/lang]
     */
    hitTest: function(x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        if (this.collisionData != null) {
            return this.collisionData[y] && !!this.collisionData[y][x];
        } else {
            for (var i = 0, len = this._data.length; i < len; i++) {
                var data = this._data[i];
                var n;
                if (data[y] != null && (n = data[y][x]) != null &&
                    0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0)) {
                    return true;
                }
            }
            return false;
        }
    },
    /**
     [lang:ja]
     * Mapで表示するタイルセット画像.
     [/lang]
     [lang:en]
     * Image with which the tile set is displayed on the map.
     [/lang]
     [lang:de]
     * Das Bild mit dem die Kacheln auf der Karte dargestellt werden.
     [/lang]
     * @type {enchant.Surface}
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            var core = enchant.Core.instance;

            this._image = image;
            if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
                var img = new enchant.Surface(image.width * 2, image.height * 2);
                var tileWidth = this._tileWidth || image.width;
                var tileHeight = this._tileHeight || image.height;
                var row = image.width / tileWidth | 0;
                var col = image.height / tileHeight | 0;
                for (var y = 0; y < col; y++) {
                    for (var x = 0; x < row; x++) {
                        img.draw(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight,
                            x * tileWidth * 2, y * tileHeight * 2, tileWidth * 2, tileHeight * 2);
                    }
                }
                this._doubledImage = img;
            }
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Mapのタイルの横幅.
     [/lang]
     [lang:en]
     * Map tile width.
     [/lang]
     [lang:de]
     * Kachelbreite
     [/lang]
     * @type {Number}
     */
    tileWidth: {
        get: function() {
            return this._tileWidth;
        },
        set: function(tileWidth) {
            this._tileWidth = tileWidth;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Mapのタイルの高さ.
     [/lang]
     [lang:en]
     * Map tile height.
     [/lang]
     [lang:de]
     * Kachelhöhe.
     [/lang]
     * @type {Number}
     */
    tileHeight: {
        get: function() {
            return this._tileHeight;
        },
        set: function(tileHeight) {
            this._tileHeight = tileHeight;
            this._dirty = true;
        }
    },
    /**
     * @private
     */
    width: {
        get: function() {
            return this._tileWidth * this._data[0][0].length;
        }
    },
    /**
     * @private
     */
    height: {
        get: function() {
            return this._tileHeight * this._data[0].length;
        }
    },
    /**
     * @private
     */
    redraw: function(x, y, width, height) {
        if (this._image == null) {
            return;
        }

        var image, tileWidth, tileHeight, dx, dy;
        if (this._doubledImage) {
            image = this._doubledImage;
            tileWidth = this._tileWidth * 2;
            tileHeight = this._tileHeight * 2;
            dx = -this._offsetX * 2;
            dy = -this._offsetY * 2;
            x *= 2;
            y *= 2;
            width *= 2;
            height *= 2;
        } else {
            image = this._image;
            tileWidth = this._tileWidth;
            tileHeight = this._tileHeight;
            dx = -this._offsetX;
            dy = -this._offsetY;
        }
        var row = image.width / tileWidth | 0;
        var col = image.height / tileHeight | 0;
        var left = Math.max((x + dx) / tileWidth | 0, 0);
        var top = Math.max((y + dy) / tileHeight | 0, 0);
        var right = Math.ceil((x + dx + width) / tileWidth);
        var bottom = Math.ceil((y + dy + height) / tileHeight);

        var source = image._element;
        var context = this._context;
        var canvas = context.canvas;
        context.clearRect(x, y, width, height);
        for (var i = 0, len = this._data.length; i < len; i++) {
            var data = this._data[i];
            var r = Math.min(right, data[0].length);
            var b = Math.min(bottom, data.length);
            for (y = top; y < b; y++) {
                for (x = left; x < r; x++) {
                    var n = data[y][x];
                    if (0 <= n && n < row * col) {
                        var sx = (n % row) * tileWidth;
                        var sy = (n / row | 0) * tileHeight;
                        context.drawImage(source, sx, sy, tileWidth, tileHeight,
                            x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight);
                    }
                }
            }
        }
    },
    cvsRender: function(ctx) {
        var game = enchant.Game.instance;
        if (this.width !== 0 && this.height !== 0) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            var cvs = this._context.canvas;
                ctx.drawImage(cvs, 0, 0, game.width, game.height);
            ctx.restore();
        }
    },
    domRender: function(element) {
        if (this._image) {
            element.style.backgroundImage = this._surface._css;
            // bad performance
            element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(1, 0, 0, 1, 0, 0)';
        }
    }
});


/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
     [lang:ja]
     * 複数の{@link enchant.Node}を子に持つことができるクラス.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // playerの座標に従って全体をスクロールする
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     * @extends enchant.Node
     [/lang]
     [lang:en]
     * A class that can hold multiple {@link enchant.Node}.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // Moves the entire frame in according to the player's coordinates.
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     [/lang]
     [lang:de]
     * Eine Klasse die mehrere {@link enchant.Node} beinhalten kann.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // Bewegt den gesamten Frame je nach der aktuelle Spielerposition.
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     [/lang]
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        /**
         [lang:ja]
         * 子のNode.
         [/lang]
         [lang:en]
         * Child Nodes.
         [/lang]
         [lang:de]
         * Kind-Nodes.
         [/lang]
         * @type {Array.<enchant.Node>}
         */
        this.childNodes = [];

        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._originX = null;
        this._originY = null;

        this.__dirty = false;

        [enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE]
            .forEach(function(event) {
                this.addEventListener(event, function(e) {
                    this.childNodes.forEach(function(child) {
                        child.scene = this.scene;
                        child.dispatchEvent(e);
                    }, this);
                });
            }, this);
    },
    /**
     [lang:ja]
     * GroupにNodeを追加する.
     * @param {enchant.Node} node 追加するNode.
     [/lang]
     [lang:en]
     * Adds a Node to the Group.
     * @param {enchant.Node} node Node to be added.
     [/lang]
     [lang:de]
     * Fügt einen Node zu der Gruppe hinzu.
     * @param {enchant.Node} node Node der hinzugeügt werden soll.
     [/lang]
     */
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        childAdded.next = null;
        this.dispatchEvent(childAdded);
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            node.scene = this.scene;
            var addedToScene = new enchant.Event('addedtoscene');
            node.dispatchEvent(addedToScene);
        }
    },
    /**
     [lang:ja]
     * GroupにNodeを挿入する.
     * @param {enchant.Node} node 挿入するNode.
     * @param {enchant.Node} reference 挿入位置の前にあるNode.
     [/lang]
     [lang:en]
     * Incorporates Node into Group.
     * @param {enchant.Node} node Node to be incorporated.
     * @param {enchant.Node} reference Node in position before insertion.
     [/lang]
     [lang:de]
     * Fügt einen Node vor einen anderen Node zu dieser Gruppe hinzu.
     * @param {enchant.Node} node Der Node der hinzugefügt werden soll.
     * @param {enchant.Node} reference Der Node der sich vor dem einzufügendem Node befindet.
     [/lang]
     */
    insertBefore: function(node, reference) {
        var i = this.childNodes.indexOf(reference);
        if (i !== -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = reference;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        } else {
            this.addChild(node);
        }
    },
    /**
     [lang:ja]
     * GroupからNodeを削除する.
     * @param {enchant.Node} node 削除するNode.
     [/lang]
     [lang:en]
     * Remove a Node from the Group.
     * @param {enchant.Node} node Node to be deleted.
     [/lang]
     [lang:de]
     * Entfernt einen Node aus der Gruppe.
     * @param {enchant.Node} node Der Node der entfernt werden soll.
     [/lang]
     */
    removeChild: function(node) {
        var i;
        if ((i = this.childNodes.indexOf(node)) !== -1) {
            this.childNodes.splice(i, 1);
            node.parentNode = null;
            var childRemoved = new enchant.Event('childremoved');
            childRemoved.node = node;
            this.dispatchEvent(childRemoved);
            node.dispatchEvent(new enchant.Event('removed'));
            if (this.scene) {
                node.scene = null;
                var removedFromScene = new enchant.Event('removedfromscene');
                node.dispatchEvent(removedFromScene);
            }
        }
    },
    /**
     [lang:ja]
     * 最初の子Node.
     [/lang]
     [lang:en]
     * The Node which is the first child.
     [/lang]
     [lang:de]
     * Der Node, welcher das erste Kind der Gruppe darstellt.
     [/lang]
     * @type {enchant.Node}
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     [lang:ja]
     * 最後の子Node.
     [/lang]
     [lang:en]
     * The Node which is the last child.
     [/lang]
     [lang:de]
     * Der Node, welcher das letzte Kind der Gruppe darstellt.
     [/lang]
     * @type {enchant.Node}
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length - 1];
        }
    },
    /**
    [lang:ja]
    * Groupの回転角 (度数法).
    [/lang]
    [lang:en]
    * Group rotation angle (degree).
    [/lang]
    [lang:de]
    * Rotationswinkel der Gruppe (Grad).
    [/lang]
    * @type {Number}
    */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    },
    /**
    [lang:ja]
    * Groupのx軸方向の倍率.
    [/lang]
    [lang:en]
    * Scaling factor on the x axis of the Group.
    [/lang]
    [lang:de]
    * Skalierungsfaktor auf der x-Achse der Gruppe.
    [/lang]
    * @type {Number}
    * @see enchant.CanvasGroup.originX
    * @see enchant.CanvasGroup.originY
    */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scale) {
            this._scaleX = scale;
            this._dirty = true;
        }
    },
    /**
    [lang:ja]
    * Groupのy軸方向の倍率.
    [/lang]
    [lang:en]
    * Scaling factor on the y axis of the Group.
    [/lang]
    [lang:de]
    * Skalierungsfaktor auf der y-Achse der Gruppe.
    [/lang]
    * @type {Number}
    * @see enchant.CanvasGroup.originX
    * @see enchant.CanvasGroup.originY
    */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scale) {
            this._scaleY = scale;
            this._dirty = true;
        }
    },
    /**
    [lang:ja]
    * 回転・拡大縮小の基準点のX座標
    [/lang]
    [lang:en]
    * origin point of rotation, scaling
    [/lang]
    [lang:de]
    * Ausgangspunkt für Rotation und Skalierung.
    [/lang]
    * @type {Number}
    */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            this._originX = originX;
            this._dirty = true;
        }
    },
    /**
    [lang:ja]
    * 回転・拡大縮小の基準点のX座標
    [/lang]
    [lang:en]
    * origin point of rotation, scaling
    [/lang]
    [lang:de]
    * Ausgangspunkt für Rotation und Skalierung.
    [/lang]
    * @type {Number}
    */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            this._originY = originY;
            this._dirty = true;
        }
    },
    _dirty: {
        get: function() {
            return this.__dirty;
        },
        set: function(dirty) {
            dirty = !!dirty;
            this.__dirty = dirty;
            if (dirty) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i]._dirty = true;
                }
            }
        }
    }
});

enchant.Matrix = enchant.Class.create({
    initialize: function() {
        if (enchant.Matrix.instance) {
            return enchant.Matrix.instance;
        }
        this.reset();
    },
    reset: function() {
        this.stack = [];
        this.stack.push([ 1, 0, 0, 1, 0, 0 ]);
    },
    makeTransformMatrix: function(node, dest) {
        var x = node._x;
        var y = node._y;
        var width = node._width || 0;
        var height = node._height || 0;
        var rotation = node._rotation || 0;
        var scaleX = (typeof node._scaleX === 'number') ? node._scaleX : 1;
        var scaleY = (typeof node._scaleY === 'number') ? node._scaleY : 1;
        var theta = rotation * Math.PI / 180;
        var tmpcos = Math.cos(theta);
        var tmpsin = Math.sin(theta);
        var w = (typeof node._originX === 'number') ? node._originX : width / 2;
        var h = (typeof node._originY === 'number') ? node._originY : height / 2;
        var a = scaleX * tmpcos;
        var b = scaleX * tmpsin;
        var c = scaleY * tmpsin;
        var d = scaleY * tmpcos;
        dest[0] = a;
        dest[1] = b;
        dest[2] = -c;
        dest[3] = d;
        dest[4] = (-a * w + c * h + x + w);
        dest[5] = (-b * w - d * h + y + h);
    },
    multiply: function(m1, m2, dest) {
        var a11 = m1[0], a21 = m1[2], adx = m1[4],
            a12 = m1[1], a22 = m1[3], ady = m1[5];
        var b11 = m2[0], b21 = m2[2], bdx = m2[4],
            b12 = m2[1], b22 = m2[3], bdy = m2[5];

        dest[0] = a11 * b11 + a21 * b12;
        dest[1] = a12 * b11 + a22 * b12;
        dest[2] = a11 * b21 + a21 * b22;
        dest[3] = a12 * b21 + a22 * b22;
        dest[4] = a11 * bdx + a21 * bdy + adx;
        dest[5] = a12 * bdx + a22 * bdy + ady;
    },
    multiplyVec: function(mat, vec, dest) {
        var x = vec[0], y = vec[1];
        var m11 = mat[0], m21 = mat[2], mdx = mat[4],
            m12 = mat[1], m22 = mat[3], mdy = mat[5];
        dest[0] = m11 * x + m21 * y + mdx;
        dest[1] = m12 * x + m22 * y + mdy;
    }
});
enchant.Matrix.instance = new enchant.Matrix();


enchant.DetectColorManager = enchant.Class.create({
    initialize: function(reso, max) {
        this.reference = [];
        this.detectColorNum = 0;
        this.colorResolution = reso || 16;
        this.max = max || 1;
    },
    attachDetectColor: function(sprite) {
        this.detectColorNum += 1;
        this.reference[this.detectColorNum] = sprite;
        return this._createNewColor();
    },
    detachDetectColor: function(sprite) {
        var i = this.reference.indexOf(sprite);
        if (i !== -1) {
            this.reference[i] = null;
        }
    },
    _createNewColor: function() {
        var n = this.detectColorNum;
        var C = this.colorResolution;
        var d = C / this.max;
        return [
            parseInt((n / C / C) % C, 10) / d,
            parseInt((n / C) % C, 10) / d,
            parseInt(n % C, 10) / d, 1.0
        ];
    },
    _decodeDetectColor: function(color) {
        var C = this.colorResolution;
        return ~~(color[0] * C * C * C / 256) +
            ~~(color[1] * C * C / 256) +
            ~~(color[2] * C / 256);
    },
    getSpriteByColor: function(color) {
        return this.reference[this._decodeDetectColor(color)];
    }
});

enchant.DomManager = enchant.Class.create({
	initialize: function(node, elementDefinition) {
		var game = enchant.Game.instance;
		this.layer = null;
		this.targetNode = node;
		if (typeof elementDefinition === 'string') {
			this.element = document.createElement(elementDefinition);
		} else if (elementDefinition instanceof HTMLElement) {
			this.element = elementDefinition;
		}
		this.style = this.element.style;
		this.style.position = 'absolute';
		this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0px 0px';
		if (game._debug) {
			this.style.border = '1px solid blue';
			this.style.margin = '-1px';
		}

		var manager = this;
		this._setDomTarget = function() {
			manager.layer._touchEventTarget = manager.targetNode;
		};
		this._attachEvent();
	},
	getDomElement: function() {
		return this.element;
	},
	getDomElementAsNext: function() {
		return this.element;
	},
	getNextManager: function(manager) {
		var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
		if (i !== this.targetNode.parentNode.childNodes.length - 1) {
			return this.targetNode.parentNode.childNodes[i + 1]._domManager;
		} else {
			return null;
		}
	},
	addManager: function(childManager, nextManager) {
		var nextElement;
		if (nextManager) {
			nextElement = nextManager.getDomElementAsNext();
		} else if (this.targetNode.parentNode) {
			//nextElement = this.getNextManager(this);
		}
		this.element.insertBefore(childManager.getDomElement(), nextElement);
		this.setLayer(this.layer);
	},
	removeManager: function(childManager) {
		if (childManager instanceof enchant.DomlessManager) {
			childManager._domRef.forEach(function(element) {
				this.element.removeChild(element);
			}, this);
		} else {
			this.element.removeChild(childManager.element);
		}
		this.setLayer(this.layer);
	},
	setLayer: function(layer) {
		this.layer = layer;
		var node = this.targetNode;
		var manager;
		if (node.childNodes) {
			for (var i = 0, l = node.childNodes.length; i < l; i++) {
				manager = node.childNodes[i]._domManager;
				if (manager) {
					manager.setLayer(layer);
				}
			}
		}
	},
	render: function(inheritMat) {
		var node = this.targetNode;
		var matrix = enchant.Matrix.instance;
		var stack = matrix.stack;
		var dest = [];
		matrix.makeTransformMatrix(node, dest);
		matrix.multiply(stack[stack.length - 1], dest, dest);
		matrix.multiply(inheritMat, dest, inheritMat);
		node._matrix = inheritMat;
		var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
		var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
		var vec = [ ox, oy ];
		matrix.multiplyVec(dest, vec, vec);

		node._offsetX = vec[0] - ox;
		node._offsetY = vec[1] - oy;
		if(node.parentNode && !(node instanceof enchant.Group)) {
			node._offsetX += node.parentNode._offsetX;
			node._offsetY += node.parentNode._offsetY;
		}
		this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(' +
		dest[0].toFixed(10) + ',' +
		dest[1].toFixed(10) + ',' +
		dest[2].toFixed(10) + ',' +
		dest[3].toFixed(10) + ',' +
		dest[4].toFixed(10) + ',' +
		dest[5].toFixed(10) +
		')';
		this.domRender();
	},
	domRender: function() {
		var node = this.targetNode;
		if(!node._style) {
			node._style = {};
		}
		if(!node.__styleStatus) {
			node.__styleStatus = {};
		}
		node._style.width = node.width + 'px';
		node._style.height = node.height + 'px';
		node._style.opacity = node._opacity;
		node._style.backgroundColor = node._backgroundColor;
		if (typeof node._visible !== 'undefined') {
			node._style.display = node._visible ? 'block' : 'none';
		}
		for (var prop in node._style) {
			if(node.__styleStatus[prop] !== node._style[prop]) {
				this.style.setProperty(prop, node._style[prop]);
				node.__styleStatus[prop] = node._style[prop];
			}
		}
		if (typeof node.domRender === 'function') {
			node.domRender(this.element);
		}
	},
	_attachEvent: function() {
		if (enchant.ENV.TOUCH_ENABLED) {
			this.element.addEventListener('touchstart', this._setDomTarget, true);
		}
		this.element.addEventListener('mousedown', this._setDomTarget, true);
	},
	_detachEvent: function() {
		if (enchant.ENV.TOUCH_ENABLED) {
			this.element.removeEventListener('touchstart', this._setDomTarget, true);
		}
		this.element.removeEventListener('mousedown', this._setDomTarget, true);
	},
	remove: function() {
		this._detachEvent();
		this.element = this.style = this.targetNode = null;
	}
});

enchant.DomlessManager = enchant.Class.create({
	initialize: function(node) {
		this._domRef = [];
		this.targetNode = node;
	},
	_register: function(element, nextElement) {
		var i = this._domRef.indexOf(nextElement);
		if (element instanceof DocumentFragment) {
			if (i === -1) {
				Array.prototype.push.apply(this._domRef, element.childNodes);
			} else {
				//this._domRef.splice(i, 0, element);
				Array.prototype.splice.apply(this._domRef, [i, 0].join(element.childNodes));
			}
		} else {
			if (i === -1) {
				this._domRef.push(element);
			} else {
				this._domRef.splice(i, 0, element);
			}
		}
	},
	getNextManager: function(manager) {
		var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
		if (i !== this.targetNode.parentNode.childNodes.length - 1) {
			return this.targetNode.parentNode.childNodes[i + 1]._domManager;
		} else {
			return null;
		}
	},
	getDomElement: function() {
		var frag = document.createDocumentFragment();
		var children = this.targetNode.childNodes;
		children.forEach(function(child) {
			var element = child._domManager.getDomElement();
			this._domRef.push(element);
			frag.appendChild(element);
		}, this);
		return frag;
	},
	getDomElementAsNext: function() {
		if (this._domRef.length) {
			return this._domRef[0];
		} else {
			var nextManager = this.getNextManager(this);
			if (nextManager) {
				return nextManager.element;
			} else {
				return null;
			}
		}
	},
	addManager: function(childManager, nextManager) {
		if (this.targetNode.parentNode) {
			if (nextManager === null) {
				nextManager = this.getNextManager(this);
			}
			this.targetNode.parentNode._domManager.addManager(childManager, nextManager);
		}
		var nextElement = nextManager ? nextManager.getDomElementAsNext() : null;
		this._register(childManager.getDomElement(), nextElement);
		this.setLayer(this.layer);
	},
	removeManager: function(childManager) {
		var dom;
		var i = this._domRef.indexOf(childManager.element);
		if (i !== -1) {
			dom = this._domRef[i];
			dom.parentNode.removeChild(dom);
			this._domRef.splice(i, 1);
		}
		this.setLayer(this.layer);
	},
	setLayer: function(layer) {
		this.layer = layer;
		var node = this.targetNode;
		var manager;
		if (node.childNodes) {
			for (var i = 0, l = node.childNodes.length; i < l; i++) {
				manager = node.childNodes[i]._domManager;
				if (manager) {
					manager.setLayer(layer);
				}
			}
		}
	},
	render: function(inheritMat) {
		var matrix = enchant.Matrix.instance;
		var stack = matrix.stack;
		var node = this.targetNode;
		var dest = [];
		matrix.makeTransformMatrix(node, dest);
		matrix.multiply(stack[stack.length - 1], dest, dest);
		matrix.multiply(inheritMat, dest, inheritMat);
		node._matrix = inheritMat;
		var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
		var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
		var vec = [ ox, oy ];
		matrix.multiplyVec(dest, vec, vec);
		node._offsetX = vec[0] - ox;
		node._offsetY = vec[1] - oy;
		stack.push(dest);
	},
	remove: function() {
		this._domRef = [];
		this.targetNode = null;
	}
});

enchant.DomLayer = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var game = enchant.Game.instance;
        enchant.Group.call(this);

        this.width = this._width = game.width;
        this.height = this._height = game.height;

        this._touchEventTarget = null;

        this._element = document.createElement('div');
        this._element.style.width = this.width + 'px';
        this._element.style.height = this.height + 'px';
        this._element.style.position = 'absolute';

        this._domManager = new enchant.DomManager(this, this._element);
        this._domManager.layer = this;

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this.scene) {
                    this.scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var next = e.next;
            var self = e.target;
            if (child.childNodes) {
                child.addEventListener('childadded', __onchildadded);
                child.addEventListener('childremoved', __onchildremoved);
            }
            var nextManager = next ? next._domManager : null;
            enchant.DomLayer._attachDomManager(child);
            self._domManager.addManager(child._domManager, nextManager);
            var render = new enchant.Event(enchant.Event.RENDER);
            self._domManager.layer._rendering(child, render);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            if (child.childNodes) {
                child.removeEventListener('childadded', __onchildadded);
                child.removeEventListener('childremoved', __onchildremoved);
            }
            self._domManager.removeManager(child._domManager);
            enchant.DomLayer._detachDomManager(child);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

    },
    _startRendering: function() {
        this.addEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _stopRendering: function() {
        this.removeEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _onexitframe: function() {
        this._rendering(this, new enchant.Event(enchant.Event.RENDER));
    },
    _rendering: function(node, e, inheritMat) {
        var child;
        if (!inheritMat) {
            inheritMat = [ 1, 0, 0, 1, 0, 0 ];
        }
        node.dispatchEvent(e);
        node._domManager.render(inheritMat);
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child, e, inheritMat.slice());
            }
        }
        if (node._domManager instanceof enchant.DomlessManager) {
            enchant.Matrix.instance.stack.pop();
        }
        node._dirty = false;
    },
    _determineEventTarget: function() {
        if (this._touchEventTarget) {
            if (this._touchEventTarget !== this) {
                return this._touchEventTarget;
            }
        }
        return null;
    }
});

enchant.DomLayer._attachDomManager = function(node) {
    var child;
    if (!node._domManager) {
        if (node instanceof enchant.Group) {
            node._domManager = new enchant.DomlessManager(node);
        } else {
            if (node._element) {
                node._domManager = new enchant.DomManager(node, node._element);
            } else {
                node._domManager = new enchant.DomManager(node, 'div');
            }
        }
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.DomLayer._attachDomManager(child);
            node._domManager.addManager(child._domManager, null);
        }
    }
};

enchant.DomLayer._detachDomManager = function(node) {
    var child;
    node._domManager.remove();
    delete node._domManager;
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.DomLayer._detachDomManager(child);
            node._domManager.removeManager(child._domManager, null);
        }
    }
};

/**
 * @scope enchant.CanvasGroup.prototype
 */
enchant.CanvasLayer = enchant.Class.create(enchant.Group, {
    /**
     [lang:ja]
     * Canvas を用いた描画を行うクラス。
     * 子を Canvas を用いた描画に切り替えるクラス
     [/lang]
     [lang:en]
     * A class which is using HTML Canvas for the rendering.
     * The rendering of children will be replaced by the Canvas rendering.
     [/lang]
     [lang:de]
     * Eine Klasse die HTML Canvas für das Rendern nutzt.
     * Das Rendern der Kinder wird durch das Canvas Rendering ersetzt.
     [/lang]
     * @constructs
     */
    initialize: function() {
        var game = enchant.Game.instance;

        enchant.Group.call(this);

        this._cvsCache = {
            matrix: [1, 0, 0, 1, 0, 0],
            detectColor: '#000000'
        };
        this._cvsCache.layer = this;

        this.width = game.width;
        this.height = game.height;

        this._element = document.createElement('canvas');
        this._element.width = game.width;
        this._element.height = game.height;
        this._element.style.position = 'absolute';

        this._detect = document.createElement('canvas');
        this._detect.width = game.width;
        this._detect.height = game.height;
        this._detect.style.position = 'absolute';
        this._lastDetected = 0;

        this.context = this._element.getContext('2d');
        this._dctx = this._detect.getContext('2d');

        this._colorManager = new enchant.DetectColorManager(16, 256);

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this.scene) {
                    this.scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var self = e.target;
            var layer = self.scene._layers.Canvas;
            if (child.childNodes) {
                child.addEventListener('childadded', __onchildadded);
                child.addEventListener('childremoved', __onchildremoved);
            }
            enchant.CanvasLayer._attachCache(child, layer);
            var render = new enchant.Event(enchant.Event.RENDER);
            layer._rendering(child, render);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            var layer = self.scene._layers.Canvas;
            if (child.childNodes) {
                child.removeEventListener('childadded', __onchildadded);
                child.removeEventListener('childremoved', __onchildremoved);
            }
            enchant.CanvasLayer._detachCache(child, layer);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

    },
    /**
     * レンダリングを開始.
     * @private
     */
    _startRendering: function() {
        this.addEventListener('exitframe', this._onexitframe);
        this._onexitframe(new enchant.Event(enchant.Event.RENDER));
    },
    /**
     * レンダリングを停止.
     * @private
     */
    _stopRendering: function() {
        this.removeEventListener('render', this._onexitframe);
        this._onexitframe(new enchant.Event(enchant.Event.RENDER));
    },
    _onexitframe: function() {
        var game = enchant.Game.instance;
        var ctx = this.context;
        ctx.clearRect(0, 0, game.width, game.height);
        var render = new enchant.Event(enchant.Event.RENDER);
        this._rendering(this, render);
    },
    _rendering:  function(node, e) {
        var game = enchant.Game.instance;
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var ctx = this.context;
        var child;
        ctx.save();
        node.dispatchEvent(e);
        // composite
        if (node.compositeOperation) {
            ctx.globalCompositeOperation = node.compositeOperation;
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = (typeof node._opacity === 'number') ? node._opacity : 1.0;
        // transform
        this._transform(node, ctx);
        // render
        if (typeof node._visible === 'undefined' || node._visible) {
            if (node._backgroundColor) {
                ctx.fillStyle = node._backgroundColor;
                ctx.fillRect(0, 0, node._width, node._height);
            }

            if (node.cvsRender) {
                node.cvsRender(ctx);
            }

            if (game._debug) {
                if (node instanceof enchant.Label || node instanceof enchant.Sprite) {
                    ctx.strokeStyle = '#ff0000';
                } else {
                    ctx.strokeStyle = '#0000ff';
                }
                ctx.strokeRect(0, 0, node._width, node._height);
            }
            if (node._clipping) {
                ctx.clip();
            }
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child, e);
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    _detectrendering: function(node) {
        var ctx = this._dctx;
        var child;
        ctx.save();
        this._transform(node, ctx);
        ctx.fillStyle = node._cvsCache.detectColor;
        if (node.detectRender) {
            node.detectRender(ctx);
        } else {
            ctx.fillRect(0, 0, node.width, node.height);
        }
        if (node._clipping) {
            ctx.clip();
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._detectrendering(child);
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    _transform: function(node, ctx) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var newmat;
        if (node._dirty) {
            matrix.makeTransformMatrix(node, node._cvsCache.matrix);
            newmat = [];
            matrix.multiply(stack[stack.length - 1], node._cvsCache.matrix, newmat);
            node._matrix = newmat;
        } else {
            newmat = node._matrix;
        }
        stack.push(newmat);
        ctx.setTransform.apply(ctx, newmat);
        var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
        var vec = [ ox, oy ];
        matrix.multiplyVec(newmat, vec, vec);
        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        node._dirty = false;

    },
    _determineEventTarget: function(e) {
        return this._getEntityByPosition(e.x, e.y);
    },
    _getEntityByPosition: function(x, y) {
        var game = enchant.Game.instance;
        var ctx = this._dctx;
        if (this._lastDetected < game.frame) {
            ctx.clearRect(0, 0, this.width, this.height);
            this._detectrendering(this);
            this._lastDetected = game.frame;
        }
        var color = ctx.getImageData(x, y, 1, 1).data;
        return this._colorManager.getSpriteByColor(color);
    }
});

enchant.CanvasLayer._attachCache = function(node, layer) {
    var child;
    if (!node._cvsCache) {
        node._cvsCache = {};
        node._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
        node._cvsCache.detectColor = 'rgba(' + layer._colorManager.attachDetectColor(node) + ')';
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._attachCache(child, layer);
        }
    }
};

enchant.CanvasLayer._detachCache = function(node, layer) {
    var child;
    if (node._cvsCache) {
        layer._colorManager.detachDetectColor(node);
        delete node._cvsCache;
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._detachCache(child, layer);
        }
    }
};

enchant.Scene = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var game = enchant.Game.instance;
        enchant.Group.call(this);

        this.width = game.width;
        this.height = game.height;

        this.scene = this;

        this._backgroundColor = null;

        this._element = document.createElement('div');
        this._element.style.width = this.width + 'px';
        this._element.style.height = this.height + 'px';
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + enchant.Game.instance.scale + ')';

        this._layers = {};
        this._layerPriority = [];
        this.addLayer('Canvas');
        this.addLayer('Dom');
        this.addEventListener(enchant.Event.CHILD_ADDED, this._onchildadded);
        this.addEventListener(enchant.Event.CHILD_REMOVED, this._onchildremoved);
        this.addEventListener(enchant.Event.ENTER, this._onenter);
        this.addEventListener(enchant.Event.EXIT, this._onexit);

        var that = this;
        this._dispatchExitframe = function() {
            var layer;
            for (var prop in that._layers) {
                layer = that._layers[prop];
                layer.dispatchEvent(new enchant.Event(enchant.Event.EXIT_FRAME));
            }
        };
    },
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            this._x = x;
            for (var type in this._layers) {
                this._layers[type].x = x;
            }
        }
    },
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            this._y = y;
            for (var type in this._layers) {
                this._layers[type].y = y;
            }
        }
    },
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            for (var type in this._layers) {
                this._layers[type].rotation = rotation;
            }
        }
    },
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            for (var type in this._layers) {
                this._layers[type].scaleX = scaleX;
            }
        }
    },
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            for (var type in this._layers) {
                this._layers[type].scaleY = scaleY;
            }
        }
    },
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = this._element.style.backgroundColor = color;
        }
    },
    addLayer: function(type, i) {
        var game = enchant.Game.instance;
        if (this._layers[type]) {
            return;
        }
        var layer = new enchant[type + 'Layer']();
        if (game.currentScene === this) {
            layer._startRendering();
        }
        this._layers[type] = layer;
        var element = layer._element;
        if (typeof i === 'number') {
            var nextSibling = this._element.childNodes.indexOf(i);
            this._element.insertBefore(element, nextSibling);
            this._layerPriority.splice(i, 0, type);
        } else {
            this._element.appendChild(element);
            this._layerPriority.push(type);
        }
        layer.scene = this;
    },
    _determineEventTarget: function(e) {
        var layer, target;
        for (var i = this._layerPriority.length - 1; i >= 0; i--) {
            layer = this._layers[this._layerPriority[i]];
            target = layer._determineEventTarget(e);
            if (target) {
                break;
            }
        }
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        if (child._element) {
            this._layers.Dom.insertBefore(child, next);
            child._layer = this._layers.Dom;
        } else {
            this._layers.Canvas.insertBefore(child, next);
            child._layer = this._layers.Canvas;
        }
    },
    _onchildremoved: function(e) {
        var child = e.node;
        child._layer.removeChild(child);
        child._layer = null;
    },
    _onenter: function() {
        for (var type in this._layers) {
            this._layers[type]._startRendering();
        }
        enchant.Game.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        for (var type in this._layers) {
            this._layers[type]._stopRendering();
        }
        enchant.Game.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});

/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
     [lang:ja]
     * canvas要素をラップしたクラス.
     *
     * {@link enchant.Sprite}や{@link enchant.Map}のimageプロパティに設定して表示させることができる.
     * Canvas APIにアクセスしたいときは{@link enchant.Surface#context}プロパティを用いる.
     *
     * @example
     *   // 円を表示するSpriteを作成する
     *   var ball = new Sprite(50, 50);
     *   var surface = new Surface(50, 50);
     *   surface.context.beginPath();
     *   surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     *   surface.context.fill();
     *   ball.image = surface;
     *
     * @param {Number} width Surfaceの横幅.
     * @param {Number} height Surfaceの高さ.
     [/lang]
     [lang:en]
     * Class that wraps canvas elements.
     *
     * Can be used to set the {@link enchant.Sprite} and {@link enchant.Map}'s image properties to be displayed.
     * If you wish to access Canvas API use the {@link enchant.Surface#context} property.
     *
     * @example
     *   // Creates Sprite that displays a circle.
     *   var ball = new Sprite(50, 50);
     *   var surface = new Surface(50, 50);
     *   surface.context.beginPath();
     *   surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     *   surface.context.fill();
     *   ball.image = surface;
     *
     * @param {Number} width Surface width.
     * @param {Number} height Surface height.
     [/lang]
     [lang:de]
     * Diese Klasse dient als Hüllenklasse (Wrapper) für Canvas Elemente.
     *
     * Mit dieser Klasse können die image Felder der {@link enchant.Sprite} und {@link enchant.Map}'s
     * Klassen gesetzt werden und dadurch dargestellt werden.
     * Falls die Canvas API genutzt werden möchte kann dies über die
     * {@link enchant.Surface#context} Variable erfolgen.
     *
     * @example
     *   // Erstellt einen Sprite und stellt einen Kreis dar.
     *   var ball = new Sprite(50, 50);
     *   var surface = new Surface(50, 50);
     *   surface.context.beginPath();
     *   surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     *   surface.context.fill();
     *   ball.image = surface;
     *
     * @param {Number} width Die Breite der Surface.
     * @param {Number} height Die Höhe der Surface.
     [/lang]
     * @constructs
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var core = enchant.Core.instance;

        /**
         [lang:ja]
         * Surfaceの横幅.
         [/lang]
         [lang:en]
         * Surface width.
         [/lang]
         [lang:de]
         * Die Breite der Surface.
         [/lang]
         * @type {Number}
         */
        this.width = width;
        /**
         [lang:ja]
         * Surfaceの高さ.
         [/lang]
         [lang:en]
         * Surface height.
         [/lang]
         [lang:de]
         * Die Höhe der Surface.
         [/lang]
         * @type {Number}
         */
        this.height = height;
        /**
         [lang:ja]
         * Surfaceの描画コンテクスト.
         [/lang]
         [lang:en]
         * Surface drawing context.
         [/lang]
         [lang:de]
         * Der Surface Zeichenkontext.
         [/lang]
         * @type {CanvasRenderingContext2D}
         */
        this.context = null;

        var id = 'enchant-surface' + core._surfaceID++;
        if (document.getCSSCanvasContext) {
            this.context = document.getCSSCanvasContext('2d', id, width, height);
            this._element = this.context.canvas;
            this._css = '-webkit-canvas(' + id + ')';
            var context = this.context;
        } else if (document.mozSetImageElement) {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._css = '-moz-element(#' + id + ')';
            this.context = this._element.getContext('2d');
            document.mozSetImageElement(id, this._element);
        } else {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';
            this.context = this._element.getContext('2d');

            enchant.ENV.CANVAS_DRAWING_METHODS.forEach(function(name) {
                var method = this.context[name];
                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                };
            }, this);
        }
    },
    /**
     [lang:ja]
     * Surfaceから1ピクセル取得する.
     * @param {Number} x 取得するピクセルのx座標.
     * @param {Number} y 取得するピクセルのy座標.
     * @return {Array.<Number>} ピクセルの情報を[r, g, b, a]の形式で持つ配列.
     [/lang]
     [lang:en]
     * Returns 1 pixel from the Surface.
     * @param {Number} x The pixel's x coordinates.
     * @param {Number} y The pixel's y coordinates.
     * @return {Array.<Number>} An array that holds pixel information in [r, g, b, a] format.
     [/lang]
     [lang:de]
     * Liefert einen Pixel der Surface.
     * @param {Number} x Die x Koordinaten des Pixel.
     * @param {Number} y Die y Koordinaten des Pixel.
     * @return {Array.<Number>} Ein Array das die Pixelinformationen im [r, g, b, a] Format enthält.
     [/lang]
     */
    getPixel: function(x, y) {
        return this.context.getImageData(x, y, 1, 1).data;
    },
    /**
     [lang:ja]
     * Surfaceに1ピクセル設定する.
     * @param {Number} x 設定するピクセルのx座標.
     * @param {Number} y 設定するピクセルのy座標.
     * @param {Number} r 設定するピクセルのrの値.
     * @param {Number} g 設定するピクセルのgの値.
     * @param {Number} b 設定するピクセルのbの値.
     * @param {Number} a 設定するピクセルの透明度.
     [/lang]
     [lang:en]
     * Sets one pixel within the surface.
     * @param {Number} x The pixel's x coordinates.
     * @param {Number} y The pixel's y coordinates.
     * @param {Number} r The pixel's red level.
     * @param {Number} g The pixel's green level.
     * @param {Number} b The pixel's blue level.
     * @param {Number} a The pixel's transparency.
     [/lang]
     [lang:de]
     * Setzt einen Pixel in der Surface.
     * @param {Number} x Die x Koordinaten des Pixel.
     * @param {Number} y Die y Koordinaten des Pixel.
     * @param {Number} r Der Rotwert des Pixel.
     * @param {Number} g Der Grünwert des Pixel.
     * @param {Number} b Der Blauwert des Pixels.
     * @param {Number} a Die Transparenz des Pixels
     [/lang]
     */
    setPixel: function(x, y, r, g, b, a) {
        var pixel = this.context.createImageData(1, 1);
        pixel.data[0] = r;
        pixel.data[1] = g;
        pixel.data[2] = b;
        pixel.data[3] = a;
        this.context.putImageData(pixel, x, y);
    },
    /**
     [lang:ja]
     * Surfaceの全ピクセルをクリアし透明度0の黒に設定する.
     [/lang]
     [lang:en]
     * Clears all Surface pixels and makes the pixels transparent.
     [/lang]
     [lang:de]
     * Löscht alle Pixel und setzt macht die Pixel transparent.
     [/lang]
     */
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    /**
     [lang:ja]
     * Surfaceに対して引数で指定されたSurfaceを描画する.
     *
     * Canvas APIのdrawImageをラップしており, 描画する矩形を同様の形式で指定できる.
     *
     * @example
     *   var src = core.assets['src.gif'];
     *   var dst = new Surface(100, 100);
     *   dst.draw(src);         // ソースを(0, 0)に描画
     *   dst.draw(src, 50, 50); // ソースを(50, 50)に描画
     *   // ソースを(50, 50)に縦横30ピクセル分だけ描画
     *   dst.draw(src, 50, 50, 30, 30);
     *   // ソースの(10, 10)から縦横40ピクセルの領域を(50, 50)に縦横30ピクセルに縮小して描画
     *   dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image 描画に用いるSurface.
     [/lang]
     [lang:en]
     * Draws the content of the given Surface onto this surface.
     *
     * Wraps Canvas API drawImage and if multiple arguments are given,
     * these are getting applied to the Canvas drawImage method.
     *
     * @example
     *   var src = core.assets['src.gif'];
     *   var dst = new Surface(100, 100);
     *   dst.draw(src);         // Draws source at (0, 0)
     *   dst.draw(src, 50, 50); // Draws source at (50, 50)
     *   // Draws just 30 horizontal and vertical pixels of source at (50, 50)
     *   dst.draw(src, 50, 50, 30, 30);
     *   // Takes the image content in src starting at (10,10) with a (Width, Height) of (40,40),
     *   // scales it and draws it in this surface at (50, 50) with a (Width, Height) of (30,30).
     *   dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image Surface used in drawing.
     [/lang]
     [lang:de]
     * Zeichnet den Inhalt der gegebenen Surface auf diese Surface.
     *
     * Umhüllt (wraps) die Canvas drawImage Methode und sollten mehrere Argumente
     * übergeben werden, werden diese auf die Canvas drawImage Methode angewendet.
     *
     * @example
     *   var src = game.assets['src.gif'];
     *   var dst = new Surface(100, 100);
     *   dst.draw(src);         // Zeichnet src bei (0, 0)
     *   dst.draw(src, 50, 50); // Zeichnet src bei (50, 50)
     *   // Zeichnet src an der Position (50,50), jedoch nur 30x30 Pixel
     *   dst.draw(src, 50, 50, 30, 30);
     *   // Skaliert und zeichnet den Bereich mit der (Breite, Höhe) von (40, 40)
     *   // in src ab (10,10) in diese Surface bei (50,50) mit einer (Breite, Höhe) von (30, 30).
     *   dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image Surface used in drawing.
     [/lang]
     */
    draw: function(image) {
        image = image._element;
        if (arguments.length === 1) {
            this.context.drawImage(image, 0, 0);
        } else {
            var args = arguments;
            args[0] = image;
            this.context.drawImage.apply(this.context, args);
        }
    },
    /**
     [lang:ja]
     * Surfaceを複製する.
     * @return {enchant.Surface} 複製されたSurface.
     [/lang]
     [lang:en]
     * Copies Surface.
     * @return {enchant.Surface} The copied Surface.
     [/lang]
     [lang:de]
     * Kopiert diese Surface.
     * @return {enchant.Surface} Die kopierte Surface.
     [/lang]
     */
    clone: function() {
        var clone = new enchant.Surface(this.width, this.height);
        clone.draw(this);
        return clone;
    },
    /**
     [lang:ja]
     * SurfaceからdataスキームのURLを生成する.
     * @return {String} Surfaceを表すdataスキームのURL.
     [/lang]
     [lang:en]
     * Creates a data URI scheme from this Surface.
     * @return {String} The data URI scheme that identifies this Surface and
     * can be used to include this Surface into a dom tree.
     [/lang]
     [lang:de]
     * Erstellt eine Data-URL (URI Schema) für diese Surface.
     * @return {String} Die Data-URL, welche diese Surface identifiziert und
     * welche genutzt werden kann um diese in einen DOM Baum einzubinden.
     [/lang]
     */
    toDataURL: function() {
        var src = this._element.src;
        if (src) {
            if (src.slice(0, 5) === 'data:') {
                return src;
            } else {
                return this.clone().toDataURL();
            }
        } else {
            return this._element.toDataURL();
        }
    }
});

/**
 [lang:ja]
 * 画像ファイルを読み込んでSurfaceオブジェクトを作成する.
 *
 * このメソッドによって作成されたSurfaceはimg要素のラップしており{@link enchant.Surface#context}プロパティに
 * アクセスしたり{@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel},
 * {@link enchant.Surface#setPixel}メソッドなどの呼び出しでCanvas APIを使った画像操作を行うことはできない.
 * ただし{@link enchant.Surface#draw}メソッドの引数とすることはでき,
 * ほかのSurfaceに描画した上で画像操作を行うことはできる(クロスドメインでロードした
 * 場合はピクセルを取得するなど画像操作の一部が制限される).
 *
 * @param {String} src ロードする画像ファイルのパス.
 [/lang]
 [lang:en]
 * Loads an image and creates a Surface object out of it.
 *
 * It is not possible to access properties or methods of the {@link enchant.Surface#context}, or to call methods using the Canvas API -
 * like {@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel}, {@link enchant.Surface#setPixel}.. -
 * of the wrapped image created with this method.
 * However, it is possible to use this surface to draw it to another surface using the {@link enchant.Surface#draw} method.
 * The resulting surface can then be manipulated. (when loading images in a cross-origin resource sharing environment,
 * pixel acquisition and other image manipulation might be limited).
 *
 * @param {String} src The file path of the image to be loaded.
 [/lang]
 [lang:de]
 * Läd eine Grafik und erstellt daraus ein Surface Objekt.
 *
 * Bei Grafiken die mit dieser Methode erstellt wurden ist es nicht möglich auf Variablen oder Methoden des {@link enchant.Surface#context}
 * zuzugreifen, oder Methoden die die Canvas API nutzen, wie {@link enchant.Surface#draw}, {@link enchant.Surface#clear},
 * {@link enchant.Surface#getPixel}, {@link enchant.Surface#setPixel}.., aufzurufen.
 * Jedoch ist es möglich diese Surface zu nutzen um sie in eine andere Surface mittels der {@link enchant.Surface#draw} zu zeichen.
 * Die daraus resultierende Surface kann dann manipuliert werden. (Wenn Bilder in einer Cross-Origin Resource Sharing Umgebung
 * geladen werden, kann es sein, dass die Pixelabfrage und andere Bildmanipulationen limitiert sind)
 *
 * @param {String} src Der Dateipfad der Grafik die geladen werden soll.
 [/lang]
 * @static
 */
enchant.Surface.load = function(src, callback) {
    var image = new Image();
    var surface = Object.create(enchant.Surface.prototype, {
        context: { value: null },
        _css: { value: 'url(' + src + ')' },
        _element: { value: image }
    });
    enchant.EventTarget.call(surface);
    image.src = src;
    image.onerror = function() {
        throw new Error('Cannot load an asset: ' + image.src);
    };
    image.onload = function() {
        surface.width = image.width;
        surface.height = image.height;
        surface.dispatchEvent(new enchant.Event('load'));
    };
    return surface;
};

/**
 * @scope enchant.Sound.prototype
 */
enchant.Sound = enchant.Class.create(enchant.EventTarget, {
    /**
     [lang:ja]
     * audio要素をラップしたクラス.
     *
     * MP3ファイルの再生はSafari, Chrome, Firefox, Opera, IEが対応
     * (Firefox, OperaではFlashを経由して再生). WAVEファイルの再生は
     * Safari, Chrome, Firefox, Operaが対応している. ブラウザが音声ファイル
     * のコーデックに対応していない場合は再生されない.
     *
     * コンストラクタではなく{@link enchant.Sound.load}を通じてインスタンスを作成する.
     [/lang]
     [lang:en]
     * Class to wrap audio elements.
     *
     * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
     * (Firefox and Opera play via Flash). WAVE files can be played on
     * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
     * the used codec the file will not play.
     *
     * Instances are created not via constructor but via {@link enchant.Sound.load}.
     [/lang]
     [lang:de]
     * Klasse die eine Hüllenklasse (Wrapper) für Audio Elemente darstellt. 
     *
     * Safari, Chrome, Firefox, Opera, und IE können alle MP3 Dateien abspielen
     * (Firefox und Opera spielen diese mit Hilfe von Flash ab). WAVE Dateien können 
     * Safari, Chrome, Firefox, and Opera abspielen. Sollte der Browser nicht mit
     * dem genutzten Codec kompatibel sein, wird die Datei nicht abgespielt. 
     *
     * Instanzen dieser Klasse werden nicht mit Hilfe des Konstruktors, sondern mit 
     * {@link enchant.Sound.load} erstellt.
     [/lang]
     * @constructs
     */
    initialize: function() {
        enchant.EventTarget.call(this);
        /**
         [lang:ja]
         * Soundの再生時間 (秒).
         [/lang]
         [lang:en]
         * Sound file duration (seconds).
         [/lang]
         [lang:de]
         * Die länge der Sounddatei in Sekunden.
         [/lang]
         * @type {Number}
         */
        this.duration = 0;
        throw new Error("Illegal Constructor");
    },
    /**
     [lang:ja]
     * 再生を開始する.
     [/lang]
     [lang:en]
     * Begin playing.
     [/lang]
     [lang:de]
     * Startet die Wiedergabe.
     [/lang]
     */
    play: function() {
        if (this._element){
            this._element.play();
        }
    },
    /**
     [lang:ja]
     * 再生を中断する.
     [/lang]
     [lang:en]
     * Pause playback.
     [/lang]
     [lang:de]
     * Pausiert die Wiedergabe.
     [/lang]
     */
    pause: function() {
        if (this._element){
            this._element.pause();
        }
    },
    /**
     [lang:ja]
     * 再生を停止する.
     [/lang]
     [lang:en]
     * Stop playing.
     [/lang]
     [lang:de]
     * Stoppt die Wiedergabe.
     [/lang]
     */
    stop: function() {
        this.pause();
        this.currentTime = 0;
    },
    /**
     [lang:ja]
     * Soundを複製する.
     * @return {enchant.Sound} 複製されたSound.
     [/lang]
     [lang:en]
     * Create a copy of this Sound object.
     * @return {enchant.Sound} Copied Sound.
     [/lang]
     [lang:de]
     * Erstellt eine Kopie dieses Soundobjektes.
     * @return {enchant.Sound} Kopiertes Sound Objekt.
     [/lang]
     */
    clone: function() {
        var clone;
        if (this._element instanceof Audio) {
            clone = Object.create(enchant.Sound.prototype, {
                _element: { value: this._element.cloneNode(false) },
                duration: { value: this.duration }
            });
        } else if (enchant.ENV.USE_FLASH_SOUND) {
            return this;
        } else {
            clone = Object.create(enchant.Sound.prototype);
        }
        enchant.EventTarget.call(clone);
        return clone;
    },
    /**
     [lang:ja]
     * 現在の再生位置 (秒).
     [/lang]
     [lang:en]
     * Current playback position (seconds).
     [/lang]
     [lang:de]
     * Aktuelle Wiedergabeposition (seconds).
     [/lang]
     * @type {Number}
     */
    currentTime: {
        get: function() {
            return this._element ? this._element.currentTime : 0;
        },
        set: function(time) {
            if (this._element){
                this._element.currentTime = time;
            }
        }
    },
    /**
     [lang:ja]
     * ボリューム. 0 (無音) ～ 1 (フルボリューム).
     [/lang]
     [lang:en]
     * Volume. 0 (muted) ～ 1 (full volume).
     [/lang]
     [lang:de]
     * Lautstärke. 0 (stumm) ～ 1 (volle Lautstärke).
     [/lang]
     * @type {Number}
     */
    volume: {
        get: function() {
            return this._element ? this._element.volume : 1;
        },
        set: function(volume) {
            if (this._element){
                this._element.volume = volume;
            }
        }
    }
});

/**
 [lang:ja]
 * 音声ファイルを読み込んでSoundオブジェクトを作成する.
 *
 * @param {String} src ロードする音声ファイルのパス.
 * @param {String} [type] 音声ファイルのMIME Type.
 [/lang]
 [lang:en]
 * Loads an audio file and creates Sound object.
 *
 * @param {String} src Path of the audio file to be loaded.
 * @param {String} [type] MIME Type of the audio file.
 [/lang]
[lang:de]
 * Läd eine Audio Datei und erstellt ein Sound objekt.
 *
 * @param {String} src Pfad zu der zu ladenden Audiodatei.
 * @param {String} [type] MIME Type der Audtiodatei.
 [/lang]
 * @static
 */
enchant.Sound.load = function(src, type) {
    if (type == null) {
        var ext = enchant.Core.findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');

    var sound = Object.create(enchant.Sound.prototype);
    enchant.EventTarget.call(sound);
    var audio = new Audio();
    if (!enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI &&
        enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
        window.setTimeout(function() {
            sound.dispatchEvent(new enchant.Event('load'));
        }, 0);
    } else {
        if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
            audio.src = src;
            audio.load();
            audio.autoplay = false;
            audio.onerror = function() {
                throw new Error('Cannot load an asset: ' + audio.src);
            };
            audio.addEventListener('canplaythrough', function() {
                sound.duration = audio.duration;
                sound.dispatchEvent(new enchant.Event('load'));
            }, false);
            sound._element = audio;
        } else if (type === 'audio/mpeg') {
            var embed = document.createElement('embed');
            var id = 'enchant-audio' + enchant.Core.instance._soundID++;
            embed.width = embed.height = 1;
            embed.name = id;
            embed.src = 'sound.swf?id=' + id + '&src=' + src;
            embed.allowscriptaccess = 'always';
            embed.style.position = 'absolute';
            embed.style.left = '-1px';
            sound.addEventListener('load', function() {
                Object.defineProperties(embed, {
                    currentTime: {
                        get: function() {
                            return embed.getCurrentTime();
                        },
                        set: function(time) {
                            embed.setCurrentTime(time);
                        }
                    },
                    volume: {
                        get: function() {
                            return embed.getVolume();
                        },
                        set: function(volume) {
                            embed.setVolume(volume);
                        }
                    }
                });
                sound._element = embed;
                sound.duration = embed.getDuration();
            });
            enchant.Core.instance._element.appendChild(embed);
            enchant.Sound[id] = sound;
        } else {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        }
    }
    return sound;
};


/**
 * ============================================================================================
 * Easing Equations v2.0
 * September 1, 2003
 * (c) 2003 Robert Penner, all rights reserved.
 * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
 * ============================================================================================
 */

/**
 * イージング関数ライブラリ
 * ActionScript で広く使われている
 * Robert Penner による Easing Equations を JavaScript に移植した。
 * @type {Object}
 */
enchant.Easing = {
    LINEAR: function(t, b, c, d) {
        return c * t / d + b;
    },
    SWING: function(t, b, c, d) {
        return c * (0.5 - Math.cos(((t / d) * Math.PI)) / 2) + b;
    },
    // quad
    QUAD_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    QUAD_EASEOUT: function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    QUAD_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    // cubic
    CUBIC_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    CUBIC_EASEOUT: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    CUBIC_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    // quart
    QUART_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    QUART_EASEOUT: function(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    QUART_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    // quint
    QUINT_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    QUINT_EASEOUT: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    QUINT_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    //sin
    SIN_EASEIN: function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    SIN_EASEOUT: function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    SIN_EASEINOUT: function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    // circ
    CIRC_EASEIN: function(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    CIRC_EASEOUT: function(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    CIRC_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    // elastic
    ELASTIC_EASEIN: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }

        if (!p) {
            p = d * 0.3;
        }

        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    ELASTIC_EASEOUT: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    ELASTIC_EASEINOUT: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    // bounce
    BOUNCE_EASEOUT: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    },
    BOUNCE_EASEIN: function(t, b, c, d) {
        return c - enchant.Easing.BOUNCE_EASEOUT(d - t, 0, c, d) + b;
    },
    BOUNCE_EASEINOUT: function(t, b, c, d) {
        if (t < d / 2) {
            return enchant.Easing.BOUNCE_EASEIN(t * 2, 0, c, d) * 0.5 + b;
        } else {
            return enchant.Easing.BOUNCE_EASEOUT(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }

    },
    // back
    BACK_EASEIN: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    BACK_EASEOUT: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    BACK_EASEINOUT: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    // expo
    EXPO_EASEIN: function(t, b, c, d) {
        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    EXPO_EASEOUT: function(t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    EXPO_EASEINOUT: function(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
};

/**
 * Easing Equations v2.0
 */

/**
 * @scope enchant.ActionEventTarget.prototype
 * @type {*}
 */
enchant.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
    /**
     * イベントリスナの実行時にコンテキストを this.target にするよう書き換えた EventTarget
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.apply(this, arguments);
    },
    /**
     * Issue event.
     * @param {enchant.Event} e Event issued.
     */
    dispatchEvent: function(e) {
        var target;
        if (this.node) {
            target = this.node;
            e.target = target;
            e.localX = e.x - target._offsetX;
            e.localY = e.y - target._offsetY;
        } else {
            this.node = null;
        }

        if (this['on' + e.type] != null) {
            this['on' + e.type].call(target, e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(target, e);
            }
        }
    }
});

/**
 * @scope enchant.Timeline.prototype
 */
enchant.Timeline = enchant.Class.create(enchant.EventTarget, {
    /**
     * タイムラインクラス。
     * アクションを管理するためのクラス。
     * 操作するノードひとつに対して、必ずひとつのタイムラインが対応する。
     *
     * tl.enchant.js を読み込むと、Node クラスを継承したすべてのクラス (Group, Scene, Entity, Label, Sprite)の
     * tl プロパティに、タイムラインクラスのインスタンスが生成される。
     * タイムラインクラスは、自身に様々なアクションを追加するメソッドを持っており、
     * これらを使うことで簡潔にアニメーションや様々な操作をすることができる。
     * タイムラインクラスはフレームとタイムのアニメーションができる。
     *
     * @constructs
     * @param node 操作の対象となるノード
     * @param [unitialized] このパラメータはtrueだったら、
     * 最初のaddメソッド呼ぶ時nodeにenchant.Event.ENTER_FRAMEイベントリスナを追加される。
     */
    initialize: function(node, unitialized) {
        enchant.EventTarget.call(this);
        this.node = node;
        this.queue = [];
        this.paused = false;
        this.looped = false;
        this.isFrameBased = true;
        this._parallel = null;
        this._initialized = !unitialized;
        this.addEventListener(enchant.Event.ENTER_FRAME, this.tick);
    },
    /**
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに一つの時間単位になる。 （デフォルト）
     */
    setFrameBased: function() {
        this.isFrameBased = true;
    },
    /**
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに前のフレームから経過した時間になる。
     */
    setTimeBased: function() {
        this.isFrameBased = false;
    },
    /**
     * キューの先頭にあるアクションを終了し、次のアクションへ移行する。
     * アクションの中から呼び出されるが、外から呼び出すこともできる。
     *
     * アクション実行中に、アクションが終了した場合、
     * もう一度 tick() 関数が呼ばれるため、1フレームに複数のアクションが処理される場合もある。
     * ex.
     *   sprite.tl.then(function A(){ .. }).then(function B(){ .. });
     * と記述した場合、最初のフレームで A・B の関数どちらも実行される
     *
     */
    next: function(remainingTime) {
        var e, action = this.queue.shift();
        e = new enchant.Event("actionend");
        e.timeline = this;
        action.dispatchEvent(e);

        if (this.looped) {
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);

            action.frame = 0;

            this.add(action);
        } else {
            // イベントを発行して捨てる
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
        }
        var event = new enchant.Event("enterframe");
        event.elapsed = Math.max(remainingTime, 1);
        this.dispatchEvent(event);
    },
    /**
     * ターゲットの enterframe イベントのリスナとして登録される関数
     * 1フレーム経過する際に実行する処理が書かれている。
     * (キューの先頭にあるアクションに対して、actionstart/actiontickイベントを発行する)
     */
    tick: function(enterFrameEvent) {
        if (this.paused) {
            return;
        }
        if (this.queue.length > 0) {
            var action = this.queue[0];
            if (action.frame === 0) {
                var f;
                f = new enchant.Event("actionstart");
                f.timeline = this;
                action.dispatchEvent(f);
            }
            var e = new enchant.Event("actiontick");
            e.timeline = this;
            if (this.isFrameBased) {
                e.elapsed = 1;
            } else {
                e.elapsed = enterFrameEvent.elapsed;
            }
            action.dispatchEvent(e);
        }
    },
    add: function(action) {
        if (!this._initialized) {
            var tl = this;
            this.node.addEventListener("enterframe", function(e) {
                tl.dispatchEvent(e);
            });
            this._initialized = true;
        }
        if (this._parallel) {
            this._parallel.actions.push(action);
            this._parallel = null;
        } else {
            this.queue.push(action);
        }
        action.frame = 0;

        var e = new enchant.Event("addedtotimeline");
        e.timeline = this;
        action.dispatchEvent(e);

        e = new enchant.Event("actionadded");
        e.action = action;
        this.dispatchEvent(e);

        return this;
    },
    /**
     * アクションを簡単に追加するためのメソッド。
     * 実体は add メソッドのラッパ。
     * @param params アクションの設定オブジェクト
     */
    action: function(params) {
        return this.add(new enchant.Action(params));
    },
    /**
     * トゥイーンを簡単に追加するためのメソッド。
     * 実体は add メソッドのラッパ。
     * @param params トゥイーンの設定オブジェクト。
     */
    tween: function(params) {
        return this.add(new enchant.Tween(params));
    },
    /**
     * タイムラインのキューをすべて破棄する。終了イベントは発行されない。
     */
    clear: function() {
        var e = new enchant.Event("removedfromtimeline");
        e.timeline = this;

        for (var i = 0, len = this.queue.length; i < len; i++) {
            this.queue[i].dispatchEvent(e);
        }
        this.queue = [];
        return this;
    },
    /**
     * タイムラインを早送りする。
     * 指定したフレーム数が経過したのと同様の処理を、瞬時に実行する。
     * 巻き戻しはできない。
     * @param frames
     */
    skip: function(frames) {
        var event = new enchant.Event("enterframe");
        if (this.isFrameBased) {
            event.elapsed = 1;
        } else {
            event.elapsed = frames;
            frames = 1;
        }
        while (frames--) {
            this.dispatchEvent(event);
        }
        return this;
    },
    /**
     * タイムラインの実行を一時停止する
     */
    pause: function() {
        this.paused = true;
        return this;
    },
    /**
     * タイムラインの実行を再開する
     */
    resume: function() {
        this.paused = false;
        return this;
    },
    /**
     * タイムラインをループさせる。
     * ループしているときに終了したアクションは、タイムラインから取り除かれた後
     * 再度タイムラインに追加される。このアクションは、ループが解除されても残る。
     */
    loop: function() {
        this.looped = true;
        return this;
    },
    /**
     * タイムラインのループを解除する。
     */
    unloop: function() {
        this.looped = false;
        return this;
    },
    /**
     * 指定したフレーム数だけ待ち、何もしないアクションを追加する。
     * @param time
     */
    delay: function(time) {
        this.add(new enchant.Action({
            time: time
        }));
        return this;
    },
    /**
     * @ignore
     * @param time
     */
    wait: function(time) {
        // reserved
        return this;
    },
    /**
     * 関数を実行し、即時に次のアクションに移るアクションを追加する。
     * @param func
     */
    then: function(func) {
        var timeline = this;
        this.add(new enchant.Action({
            onactiontick: function(evt) {
                func.call(timeline.node);
                timeline.next(evt.elapsed);
            }
        }));
        return this;
    },
    /**
     * then メソッドのシノニム。
     * 関数を実行し、即時に次のアクションに移る。
     * @param func
     */
    exec: function(func) {
        this.then(func);
    },
    /**
     * 実行したい関数を、フレーム数をキーとした連想配列(オブジェクト)で複数指定し追加する。
     * 内部的には delay, then を用いている。
     *
     * @example
     * sprite.tl.cue({
     *    10: function(){ 10フレーム経過した後に実行される関数 },
     *    20: function(){ 20フレーム経過した後に実行される関数 },
     *    30: function(){ 30フレーム経過した後に実行される関数 }
     * });
     * @param cue キューオブジェクト
     */
    cue: function(cue) {
        var ptr = 0;
        for (var frame in cue) {
            if (cue.hasOwnProperty(frame)) {
                this.delay(frame - ptr);
                this.then(cue[frame]);
                ptr = frame;
            }
        }
    },
    /**
     * ある関数を指定したフレーム数繰り返し実行するアクションを追加する。
     * @param func 実行したい関数
     * @param time 持続フレーム数
     */
    repeat: function(func, time) {
        this.add(new enchant.Action({
            onactiontick: function(evt) {
                func.call(this);
            },
            time: time
        }));
        return this;
    },
    /**
     * 複数のアクションを並列で実行したいときに指定する。
     * and で結ばれたすべてのアクションが終了するまで次のアクションには移行しない
     * @example
     * sprite.tl.fadeIn(30).and.rotateBy(360, 30);
     * 30フレームでフェードインしながら 360度回転する
     */
    and: function() {
        var last = this.queue.pop();
        if (last instanceof enchant.ParallelAction) {
            this._parallel = last;
            this.queue.push(last);
        } else {
            var parallel = new enchant.ParallelAction();
            parallel.actions.push(last);
            this.queue.push(parallel);
            this._parallel = parallel;
        }
        return this;
    },
    /**
     * @ignore
     */
    or: function() {
        return this;
    },
    /**
     * @ignore
     */
    doAll: function(children) {
        return this;
    },
    /**
     * @ignore
     */
    waitAll: function() {
        return this;
    },
    /**
     * true値 が返るまで、関数を毎フレーム実行するアクションを追加する。
     * @example
     * sprite.tl.waitUntil(function(){
     *    return this.x-- < 0
     * }).then(function(){ .. });
     * // x 座標が負になるまで毎フレーム x座標を減算し続ける
     *
     * @param func 実行したい関数
     */
    waitUntil: function(func) {
        var timeline = this;
        this.add(new enchant.Action({
            onactionstart: func,
            onactiontick: function(evt) {
                if (func.call(this)) {
                    timeline.next();
                }
            }
        }));
        return this;
    },
    /**
     * Entity の不透明度をなめらかに変えるアクションを追加する。
     * @param opacity 目標の不透明度
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeTo: function(opacity, time, easing) {
        this.tween({
            opacity: opacity,
            time: time,
            easing: easing
        });
        return this;
    },
    /**
     * Entity をフェードインするアクションを追加する。
     * fadeTo(1) のエイリアス。
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeIn: function(time, easing) {
        return this.fadeTo(1, time, easing);
    },
    /**
     * Entity をフェードアウトするアクションを追加する。
     * fadeTo(1) のエイリアス。
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeOut: function(time, easing) {
        return this.fadeTo(0, time, easing);
    },
    /**
     * Entity の位置をなめらかに移動させるアクションを追加する。
     * @param x 目標のx座標
     * @param y 目標のy座標
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    moveTo: function(x, y, time, easing) {
        return this.tween({
            x: x,
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity のx座標をなめらかに変化させるアクションを追加する。
     * @param x
     * @param time
     * @param [easing]
     */
    moveX: function(x, time, easing) {
        return this.tween({
            x: x,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity のy座標をなめらかに変化させるアクションを追加する。
     * @param y
     * @param time
     * @param [easing]
     */
    moveY: function(y, time, easing) {
        return this.tween({
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity の位置をなめらかに変化させるアクションを追加する。
     * 座標は、アクション開始時からの相対座標で指定する。
     * @param x
     * @param y
     * @param time
     * @param [easing]
     */
    moveBy: function(x, y, time, easing) {
        return this.tween({
            x: function() {
                return this.x + x;
            },
            y: function() {
                return this.y + y;
            },
            time: time,
            easing: easing
        });
    },
    /**
     * Entity の opacity を0にする (即時)
     */
    hide: function() {
        return this.then(function() {
            this.opacity = 0;
        });
    },
    /**
     * Entity の opacity を1にする (即時)
     */
    show: function() {
        return this.then(function() {
            this.opacity = 1;
        });
    },
    /**
     * Entity をシーンから削除する。
     * シーンから削除された場合、 enterframe イベントは呼ばれなくなるので、
     * タイムラインも止まることに注意。
     * これ以降のアクションは、再度シーンに追加されるまで実行されない。
     */
    removeFromScene: function() {
        return this.then(function() {
            this.scene.removeChild(this);
        });
    },
    /**
     * Entity をなめらかに拡大・縮小するアクションを追加する。
     * @param scaleX 縮尺
     * @param [scaleY] 縮尺。省略した場合 scaleX と同じ
     * @param time
     * @param [easing]
     */
    scaleTo: function(scale, time, easing) {
        if (typeof easing === "number") {
            return this.tween({
                scaleX: arguments[0],
                scaleY: arguments[1],
                time: arguments[2],
                easing: arguments[3]
            });
        }
        return this.tween({
            scaleX: scale,
            scaleY: scale,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity をなめらかに拡大・縮小させるアクションを追加する。
     * 相対縮尺 (ex. アクション開始時の縮尺の n 倍) で指定する。
     * @param scaleX 相対縮尺
     * @param [scaleY] 相対縮尺。省略した場合 scaleX と同じ
     * @param time
     * @param [easing]
     */
    scaleBy: function(scale, time, easing) {
        if (typeof easing === "number") {
            return this.tween({
                scaleX: function() {
                    return this.scaleX * arguments[0];
                },
                scaleY: function() {
                    return this.scaleY * arguments[1];
                },
                time: arguments[2],
                easing: arguments[3]
            });
        }
        return this.tween({
            scaleX: function() {
                return this.scaleX * scale;
            },
            scaleY: function() {
                return this.scaleY * scale;
            },
            time: time,
            easing: easing
        });
    },
    /**
     * Entity をなめらかに回転させるアクションを追加する。
     * @param deg 目標の回転角度 (弧度法: 1回転を 360 とする)
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    rotateTo: function(deg, time, easing) {
        return this.tween({
            rotation: deg,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity をなめらかに回転させるアクションを追加する。
     * 角度は相対角度 (アクション開始時の角度から更に n 度) で指定する
     * @param deg 目標の相対角度 (弧度法: 1回転を 360 とする)
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    rotateBy: function(deg, time, easing) {
        return this.tween({
            rotation: function() {
                return this.rotation + deg;
            },
            time: time,
            easing: easing
        });
    }
});
/**
 * @scope enchant.Action.prototype
 * @type {*}
 */

enchant.Action = enchant.Class.create(enchant.ActionEventTarget, {
    /**
     * @class
     * アクションクラス。
     * アクションはタイムラインを構成する単位であり、
     * 実行したい処理を指定するためのユニットである。
     * タイムラインに追加されたアクションは順に実行される。
     *
     * アクションが開始・終了された時に actionstart, actiontick イベントが発行され、
     * また1フレーム経過した時には actiontick イベントが発行される。
     * これらのイベントのリスナとして実行したい処理を指定する。
     *
     * time で指定されたフレーム数が経過すると自動的に次のアクションに移行するが、
     * null が指定されると、タイムラインの next メソッドが呼ばれるまで移行しない。
     *
     * @constructs
     * @param param
     * @config {integer} [time] アクションが持続するフレーム数。 null が指定されると無限長
     * @config {function} [onactionstart] アクションが開始される時のイベントリスナ
     * @config {function} [onactiontick] アクションが1フレーム経過するときのイベントリスナ
     * @config {function} [onactionend] アクションがが終了する時のイベントリスナ
     */
    initialize: function(param) {
        enchant.ActionEventTarget.call(this);
        this.time = null;
        this.frame = 0;
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                if (param[key] != null) {
                    this[key] = param[key];
                }
            }
        }

        var action = this;

        this.timeline = null;
        this.node = null;

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
            action.timeline = evt.timeline;
            action.node = evt.timeline.node;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
            action.timeline = null;
            action.node = null;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            var remaining = action.time - (action.frame + evt.elapsed);
            if (action.time != null && remaining <= 0) {
                action.frame = action.time;
                evt.timeline.next(-remaining);
            } else {
                action.frame += evt.elapsed;
            }
        });

    }
});
/**
 * @scope enchant.ParallelAction.prototype
 */
enchant.ParallelAction = enchant.Class.create(enchant.Action, {
    /**
     * アクションを並列で実行するためのアクション。
     * 子アクションを複数持つことができる。
     * @constructs
     * @extends enchant.Action
     */
    initialize: function(param) {
        enchant.Action.call(this, param);
        var timeline = this.timeline;
        var node = this.node;
        /**
         * 子アクション
         */
        this.actions = [];
        /**
         * 実行が終了したアクション
         */
        this.endedActions = [];
        var that = this;

        this.addEventListener(enchant.Event.ACTION_START, function(evt) {
            // start するときは同時
            for (var i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(evt);
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            var i, len, timeline = {
                next: function(remaining) {
                    var action = that.actions[i];
                    that.actions.splice(i--, 1);
                    len = that.actions.length;
                    that.endedActions.push(action);

                    // イベントを発行
                    var e = new enchant.Event("actionend");
                    e.timeline = this;
                    action.dispatchEvent(e);

                    e = new enchant.Event("removedfromtimeline");
                    e.timeline = this;
                    action.dispatchEvent(e);
                }
            };

            var e = new enchant.Event("actiontick");
            e.timeline = timeline;
            e.elapsed = evt.elapsed;
            for (i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(e);
            }
            // 残りアクションが 0 になったら次のアクションへ
            if (that.actions.length === 0) {
                evt.timeline.next();
            }
        });

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
            for (var i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(evt);
            }
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
            // すべて戻す
            this.actions = this.endedActions;
            this.endedActions = [];
        });

    }
});

/**
 * @scope enchant.Tween.prototype
 */
enchant.Tween = enchant.Class.create(enchant.Action, {
    /**
     * トゥイーンクラス。
     * アクションを扱いやすく拡張したクラス。
     * オブジェクトの特定のプロパティを、なめらかに変更したい時に用いる。
     *
     * コンストラクタに渡す設定オブジェクトに、プロパティの目標値を指定すると、
     * アクションが実行された時に、目標値までなめらかに値を変更するようなアクションを生成する。
     *
     * トゥイーンのイージングも、easing プロパティで指定できる。
     * デフォルトでは enchant.Easing.LINEAR が指定されている。
     *
     * @param params
     * @constructs
     * @config {time}
     * @config {easing} [function]
     */
    initialize: function(params) {
        var origin = {};
        var target = {};
        enchant.Action.call(this, params);

        if (this.easing == null) {
            // linear
            this.easing = function(t, b, c, d) {
                return c * t / d + b;
            };
        }

        var tween = this;
        this.addEventListener(enchant.Event.ACTION_START, function() {
            // トゥイーンの対象とならないプロパティ
            var excepted = ["frame", "time", "callback", "onactiontick", "onactionstart", "onactionend"];
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    // 値の代わりに関数が入っていた場合評価した結果を用いる
                    var target_val;
                    if (typeof params[prop] === "function") {
                        target_val = params[prop].call(tween.node);
                    } else {
                        target_val = params[prop];
                    }

                    if (excepted.indexOf(prop) === -1) {
                        origin[prop] = tween.node[prop];
                        target[prop] = target_val;
                    }
                }
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            var ratio = tween.easing(Math.min(tween.time,tween.frame + evt.elapsed), 0, 1, tween.time) - tween.easing(tween.frame, 0, 1, tween.time);
            for (var prop in target){
                if (target.hasOwnProperty(prop)) {
                    if (typeof this[prop] === "undefined"){
                        continue;
                    }
                    tween.node[prop] += (target[prop] - origin[prop]) * ratio;
                    if (Math.abs(tween.node[prop]) < 10e-8){
                        tween.node[prop] = 0;
                    }
                }
            }
        });
    }
});
}(window));