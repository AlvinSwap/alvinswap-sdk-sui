'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var JSBI = _interopDefault(require('jsbi'));
var invariant = _interopDefault(require('tiny-invariant'));
var sdkCore = require('@uniswap/sdk-core');
var _Big = _interopDefault(require('big.js'));
var toFormat = _interopDefault(require('toformat'));
var sui_js = require('@mysten/sui.js');

function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function (method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var _TICK_SPACINGS;
(function (FeeAmount) {
  FeeAmount[FeeAmount["LOWEST"] = 100] = "LOWEST";
  FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
  FeeAmount[FeeAmount["MEDIUM"] = 3000] = "MEDIUM";
  FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(exports.FeeAmount || (exports.FeeAmount = {}));
/**
 * The default factory tick spacings by fee amount.
 */
var TICK_SPACINGS = (_TICK_SPACINGS = {}, _TICK_SPACINGS[exports.FeeAmount.LOWEST] = 1, _TICK_SPACINGS[exports.FeeAmount.LOW] = 10, _TICK_SPACINGS[exports.FeeAmount.MEDIUM] = 60, _TICK_SPACINGS[exports.FeeAmount.HIGH] = 200, _TICK_SPACINGS);
var moduleAddress = "";
function setModuleAddress(addr) {
  moduleAddress = addr;
}
function getModuleAddress() {
  return moduleAddress;
}
function getFeeType(feeAmount) {
  if (feeAmount == exports.FeeAmount.LOWEST) {
    return "::fee_spacing::Fee100";
  } else if (feeAmount == exports.FeeAmount.LOW) {
    return "::fee_spacing::Fee500";
  } else if (feeAmount == exports.FeeAmount.MEDIUM) {
    return "::fee_spacing::Fee3000";
  } else if (feeAmount == exports.FeeAmount.HIGH) {
    return "::fee_spacing::Fee10000";
  }
  throw "invalid fee amount";
}
function feeTypeToFeeAmount(feeType) {
  if (feeType.endsWith(getFeeType(exports.FeeAmount.LOWEST))) {
    return exports.FeeAmount.LOWEST;
  }
  if (feeType.endsWith(getFeeType(exports.FeeAmount.LOW))) {
    return exports.FeeAmount.LOW;
  }
  if (feeType.endsWith(getFeeType(exports.FeeAmount.MEDIUM))) {
    return exports.FeeAmount.MEDIUM;
  }
  if (feeType.endsWith(getFeeType(exports.FeeAmount.HIGH))) {
    return exports.FeeAmount.HIGH;
  }
  throw "invalid fee type";
}

// constants used internally but not expected to be used externally
var NEGATIVE_ONE = /*#__PURE__*/JSBI.BigInt(-1);
var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1);
// used in liquidity amount math
var Q64 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(64));
var Q128 = /*#__PURE__*/JSBI.exponentiate(Q64, /*#__PURE__*/JSBI.BigInt(2));

var LiquidityMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function LiquidityMath() {}
  LiquidityMath.addDelta = function addDelta(x, y) {
    if (JSBI.lessThan(y, ZERO)) {
      return JSBI.subtract(x, JSBI.multiply(y, NEGATIVE_ONE));
    } else {
      return JSBI.add(x, y);
    }
  };
  return LiquidityMath;
}();

var FullMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function FullMath() {}
  FullMath.mulDivRoundingUp = function mulDivRoundingUp(a, b, denominator) {
    var product = JSBI.multiply(a, b);
    var result = JSBI.divide(product, denominator);
    if (JSBI.notEqual(JSBI.remainder(product, denominator), ZERO)) result = JSBI.add(result, ONE);
    return result;
  };
  return FullMath;
}();

var MaxUint160 = /*#__PURE__*/JSBI.subtract( /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(160)), ONE);
function multiplyIn256(x, y) {
  var product = JSBI.multiply(x, y);
  return JSBI.bitwiseAnd(product, sdkCore.MaxUint256);
}
function addIn256(x, y) {
  var sum = JSBI.add(x, y);
  return JSBI.bitwiseAnd(sum, sdkCore.MaxUint256);
}
var SqrtPriceMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SqrtPriceMath() {}
  SqrtPriceMath.getAmount0Delta = function getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref[0];
      sqrtRatioBX96 = _ref[1];
    }
    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(64));
    var numerator2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
    return roundUp ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96) : JSBI.divide(JSBI.divide(JSBI.multiply(numerator1, numerator2), sqrtRatioBX96), sqrtRatioAX96);
  };
  SqrtPriceMath.getAmount1Delta = function getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref2[0];
      sqrtRatioBX96 = _ref2[1];
    }
    return roundUp ? FullMath.mulDivRoundingUp(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96), Q64) : JSBI.divide(JSBI.multiply(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)), Q64);
  };
  SqrtPriceMath.getNextSqrtPriceFromInput = function getNextSqrtPriceFromInput(sqrtPX96, liquidity, amountIn, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ?  invariant(false)  : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ?  invariant(false)  : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true) : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
  };
  SqrtPriceMath.getNextSqrtPriceFromOutput = function getNextSqrtPriceFromOutput(sqrtPX96, liquidity, amountOut, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ?  invariant(false)  : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ?  invariant(false)  : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false) : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
  };
  SqrtPriceMath.getNextSqrtPriceFromAmount0RoundingUp = function getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amount, add) {
    if (JSBI.equal(amount, ZERO)) return sqrtPX96;
    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(64));
    if (add) {
      var product = multiplyIn256(amount, sqrtPX96);
      if (JSBI.equal(JSBI.divide(product, amount), sqrtPX96)) {
        var denominator = addIn256(numerator1, product);
        if (JSBI.greaterThanOrEqual(denominator, numerator1)) {
          return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
        }
      }
      return FullMath.mulDivRoundingUp(numerator1, ONE, JSBI.add(JSBI.divide(numerator1, sqrtPX96), amount));
    } else {
      var _product = multiplyIn256(amount, sqrtPX96);
      !JSBI.equal(JSBI.divide(_product, amount), sqrtPX96) ?  invariant(false)  : void 0;
      !JSBI.greaterThan(numerator1, _product) ?  invariant(false)  : void 0;
      var _denominator = JSBI.subtract(numerator1, _product);
      return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, _denominator);
    }
  };
  SqrtPriceMath.getNextSqrtPriceFromAmount1RoundingDown = function getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amount, add) {
    if (add) {
      var quotient = JSBI.lessThanOrEqual(amount, MaxUint160) ? JSBI.divide(JSBI.leftShift(amount, JSBI.BigInt(64)), liquidity) : JSBI.divide(JSBI.multiply(amount, Q64), liquidity);
      return JSBI.add(sqrtPX96, quotient);
    } else {
      var _quotient = FullMath.mulDivRoundingUp(amount, Q64, liquidity);
      !JSBI.greaterThan(sqrtPX96, _quotient) ?  invariant(false)  : void 0;
      return JSBI.subtract(sqrtPX96, _quotient);
    }
  };
  return SqrtPriceMath;
}();

var MAX_FEE = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(10), /*#__PURE__*/JSBI.BigInt(6));
var SwapMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapMath() {}
  SwapMath.computeSwapStep = function computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips) {
    var returnValues = {};
    var zeroForOne = JSBI.greaterThanOrEqual(sqrtRatioCurrentX96, sqrtRatioTargetX96);
    var exactIn = JSBI.greaterThanOrEqual(amountRemaining, ZERO);
    if (exactIn) {
      var amountRemainingLessFee = JSBI.divide(JSBI.multiply(amountRemaining, JSBI.subtract(MAX_FEE, JSBI.BigInt(feePips))), MAX_FEE);
      returnValues.amountIn = zeroForOne ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true) : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);
      if (JSBI.greaterThanOrEqual(amountRemainingLessFee, returnValues.amountIn)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne);
      }
    } else {
      returnValues.amountOut = zeroForOne ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false) : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false);
      if (JSBI.greaterThanOrEqual(JSBI.multiply(amountRemaining, NEGATIVE_ONE), returnValues.amountOut)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, JSBI.multiply(amountRemaining, NEGATIVE_ONE), zeroForOne);
      }
    }
    var max = JSBI.equal(sqrtRatioTargetX96, returnValues.sqrtRatioNextX96);
    if (zeroForOne) {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false);
    } else {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false);
    }
    if (!exactIn && JSBI.greaterThan(returnValues.amountOut, JSBI.multiply(amountRemaining, NEGATIVE_ONE))) {
      returnValues.amountOut = JSBI.multiply(amountRemaining, NEGATIVE_ONE);
    }
    if (exactIn && JSBI.notEqual(returnValues.sqrtRatioNextX96, sqrtRatioTargetX96)) {
      // we didn't reach the target, so take the remainder of the maximum input as fee
      returnValues.feeAmount = JSBI.subtract(amountRemaining, returnValues.amountIn);
    } else {
      returnValues.feeAmount = FullMath.mulDivRoundingUp(returnValues.amountIn, JSBI.BigInt(feePips), JSBI.subtract(MAX_FEE, JSBI.BigInt(feePips)));
    }
    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.feeAmount];
  };
  return SwapMath;
}();

var TWO = /*#__PURE__*/JSBI.BigInt(2);
var POWERS_OF_2 = /*#__PURE__*/[128, 64, 32, 16, 8, 4, 2, 1].map(function (pow) {
  return [pow, JSBI.exponentiate(TWO, JSBI.BigInt(pow))];
});
function mostSignificantBit(x) {
  !JSBI.greaterThan(x, ZERO) ?  invariant(false, 'ZERO')  : void 0;
  !JSBI.lessThanOrEqual(x, sdkCore.MaxUint256) ?  invariant(false, 'MAX')  : void 0;
  var msb = 0;
  for (var _iterator = _createForOfIteratorHelperLoose(POWERS_OF_2), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
      power = _step$value[0],
      min = _step$value[1];
    if (JSBI.greaterThanOrEqual(x, min)) {
      x = JSBI.signedRightShift(x, JSBI.BigInt(power));
      msb += power;
    }
  }
  return msb;
}

function mulShift(val, mulBy) {
  return JSBI.signedRightShift(JSBI.multiply(val, JSBI.BigInt(mulBy)), JSBI.BigInt(128));
}
var Q32 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(32));
var TickMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function TickMath() {}
  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick the tick for which to compute the sqrt ratio
   */
  TickMath.getSqrtRatioAtTick = function getSqrtRatioAtTick(tick) {
    return JSBI.divide(TickMath.getSqrtRatioAtTickInternal(tick), Q32);
  };
  TickMath.getSqrtRatioAtTickInternal = function getSqrtRatioAtTickInternal(tick) {
    !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK && Number.isInteger(tick)) ?  invariant(false, 'TICK')  : void 0;
    var absTick = tick < 0 ? tick * -1 : tick;
    var ratio = (absTick & 0x1) != 0 ? JSBI.BigInt('0xfffcb933bd6fad37aa2d162d1a594001') : JSBI.BigInt('0x100000000000000000000000000000000');
    if ((absTick & 0x2) != 0) ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
    if ((absTick & 0x4) != 0) ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
    if ((absTick & 0x8) != 0) ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
    if ((absTick & 0x10) != 0) ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
    if ((absTick & 0x20) != 0) ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
    if ((absTick & 0x40) != 0) ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
    if ((absTick & 0x80) != 0) ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
    if ((absTick & 0x100) != 0) ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
    if ((absTick & 0x200) != 0) ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
    if ((absTick & 0x400) != 0) ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
    if ((absTick & 0x800) != 0) ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
    if ((absTick & 0x1000) != 0) ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
    if ((absTick & 0x2000) != 0) ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
    if ((absTick & 0x4000) != 0) ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
    if ((absTick & 0x8000) != 0) ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
    if ((absTick & 0x10000) != 0) ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
    if ((absTick & 0x20000) != 0) ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
    if ((absTick & 0x40000) != 0) ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
    if ((absTick & 0x80000) != 0) ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');
    if (tick > 0) ratio = JSBI.divide(sdkCore.MaxUint256, ratio);
    // back to Q96
    return JSBI.greaterThan(JSBI.remainder(ratio, Q32), ZERO) ? JSBI.add(JSBI.divide(ratio, Q32), ONE) : JSBI.divide(ratio, Q32);
  };
  TickMath.getTickAtSqrtRatioFromString = function getTickAtSqrtRatioFromString(sqrtRatioX96_) {
    return TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtRatioX96_));
  }
  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
   */;
  TickMath.getTickAtSqrtRatio = function getTickAtSqrtRatio(sqrtRatioX96_) {
    !(JSBI.greaterThanOrEqual(sqrtRatioX96_, TickMath.MIN_SQRT_RATIO) && JSBI.lessThan(sqrtRatioX96_, TickMath.MAX_SQRT_RATIO)) ?  invariant(false, 'SQRT_RATIO')  : void 0;
    var sqrtRatioX96 = JSBI.leftShift(sqrtRatioX96_, JSBI.BigInt(32));
    var sqrtRatioX128 = JSBI.leftShift(sqrtRatioX96, JSBI.BigInt(32));
    var msb = mostSignificantBit(sqrtRatioX128);
    var r;
    if (JSBI.greaterThanOrEqual(JSBI.BigInt(msb), JSBI.BigInt(128))) {
      r = JSBI.signedRightShift(sqrtRatioX128, JSBI.BigInt(msb - 127));
    } else {
      r = JSBI.leftShift(sqrtRatioX128, JSBI.BigInt(127 - msb));
    }
    var log_2 = JSBI.leftShift(JSBI.subtract(JSBI.BigInt(msb), JSBI.BigInt(128)), JSBI.BigInt(64));
    for (var i = 0; i < 14; i++) {
      r = JSBI.signedRightShift(JSBI.multiply(r, r), JSBI.BigInt(127));
      var f = JSBI.signedRightShift(r, JSBI.BigInt(128));
      log_2 = JSBI.bitwiseOr(log_2, JSBI.leftShift(f, JSBI.BigInt(63 - i)));
      r = JSBI.signedRightShift(r, f);
    }
    var log_sqrt10001 = JSBI.multiply(log_2, JSBI.BigInt('255738958999603826347141'));
    var tickLow = JSBI.toNumber(JSBI.signedRightShift(JSBI.subtract(log_sqrt10001, JSBI.BigInt('3402992956809132418596140100660247210')), JSBI.BigInt(128)));
    var tickHigh = JSBI.toNumber(JSBI.signedRightShift(JSBI.add(log_sqrt10001, JSBI.BigInt('291339464771989622907027621153398088495')), JSBI.BigInt(128)));
    return tickLow === tickHigh ? tickLow : JSBI.lessThanOrEqual(TickMath.getSqrtRatioAtTick(tickHigh), JSBI.divide(sqrtRatioX96, Q32)) ? tickHigh : tickLow;
  };
  return TickMath;
}();
/**
 * The minimum tick that can be used on any pool.
 */
TickMath.MIN_TICK = -443636;
/**
 * The maximum tick that can be used on any pool.
 */
TickMath.MAX_TICK = -TickMath.MIN_TICK;
/**
 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
 */
TickMath.MIN_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('4295048016');
/**
 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
 */
TickMath.MAX_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('79226673515401279992447579061');

/**
 * This tick data provider does not know how to fetch any tick data. It throws whenever it is required. Useful if you
 * do not need to load tick data for your use case.
 */
var NoTickDataProvider = /*#__PURE__*/function () {
  function NoTickDataProvider() {}
  var _proto = NoTickDataProvider.prototype;
  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_tick) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            throw new Error(NoTickDataProvider.ERROR_MESSAGE);
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }
    return getTick;
  }();
  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(_tick, _lte, _tickSpacing) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            throw new Error(NoTickDataProvider.ERROR_MESSAGE);
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }
    return nextInitializedTickWithinOneWord;
  }();
  return NoTickDataProvider;
}();
NoTickDataProvider.ERROR_MESSAGE = 'No tick data provider was given';

/**
 * Determines if a tick list is sorted
 * @param list The tick list
 * @param comparator The comparator
 * @returns true if sorted
 */
function isSorted(list, comparator) {
  for (var i = 0; i < list.length - 1; i++) {
    if (comparator(list[i], list[i + 1]) > 0) {
      return false;
    }
  }
  return true;
}

function tickComparator(a, b) {
  return a.index - b.index;
}
/**
 * Utility methods for interacting with sorted lists of ticks
 */
var TickList = /*#__PURE__*/function () {
  /**
   * Cannot be constructed
   */
  function TickList() {}
  TickList.validateList = function validateList(ticks, tickSpacing) {
    !(tickSpacing > 0) ?  invariant(false, 'TICK_SPACING_NONZERO')  : void 0;
    // ensure ticks are spaced appropriately
    !ticks.every(function (_ref) {
      var index = _ref.index;
      return index % tickSpacing === 0;
    }) ?  invariant(false, 'TICK_SPACING')  : void 0;
    // ensure tick liquidity deltas sum to 0
    !JSBI.equal(ticks.reduce(function (accumulator, _ref2) {
      var liquidityNet = _ref2.liquidityNet;
      return JSBI.add(accumulator, liquidityNet);
    }, ZERO), ZERO) ?  invariant(false, 'ZERO_NET')  : void 0;
    !isSorted(ticks, tickComparator) ?  invariant(false, 'SORTED')  : void 0;
  };
  TickList.isBelowSmallest = function isBelowSmallest(ticks, tick) {
    !(ticks.length > 0) ?  invariant(false, 'LENGTH')  : void 0;
    return tick < ticks[0].index;
  };
  TickList.isAtOrAboveLargest = function isAtOrAboveLargest(ticks, tick) {
    !(ticks.length > 0) ?  invariant(false, 'LENGTH')  : void 0;
    return tick >= ticks[ticks.length - 1].index;
  };
  TickList.getTick = function getTick(ticks, index) {
    var tick = ticks[this.binarySearch(ticks, index)];
    !(tick.index === index) ?  invariant(false, 'NOT_CONTAINED')  : void 0;
    return tick;
  }
  /**
   * Finds the largest tick in the list of ticks that is less than or equal to tick
   * @param ticks list of ticks
   * @param tick tick to find the largest tick that is less than or equal to tick
   * @private
   */;
  TickList.binarySearch = function binarySearch(ticks, tick) {
    !!this.isBelowSmallest(ticks, tick) ?  invariant(false, 'BELOW_SMALLEST')  : void 0;
    var l = 0;
    var r = ticks.length - 1;
    var i;
    while (true) {
      i = Math.floor((l + r) / 2);
      if (ticks[i].index <= tick && (i === ticks.length - 1 || ticks[i + 1].index > tick)) {
        return i;
      }
      if (ticks[i].index < tick) {
        l = i + 1;
      } else {
        r = i - 1;
      }
    }
  };
  TickList.nextInitializedTick = function nextInitializedTick(ticks, tick, lte) {
    if (lte) {
      !!TickList.isBelowSmallest(ticks, tick) ?  invariant(false, 'BELOW_SMALLEST')  : void 0;
      if (TickList.isAtOrAboveLargest(ticks, tick)) {
        return ticks[ticks.length - 1];
      }
      var index = this.binarySearch(ticks, tick);
      return ticks[index];
    } else {
      !!this.isAtOrAboveLargest(ticks, tick) ?  invariant(false, 'AT_OR_ABOVE_LARGEST')  : void 0;
      if (this.isBelowSmallest(ticks, tick)) {
        return ticks[0];
      }
      var _index = this.binarySearch(ticks, tick);
      return ticks[_index + 1];
    }
  };
  TickList.nextInitializedTickWithinOneWord = function nextInitializedTickWithinOneWord(ticks, tick, lte, tickSpacing) {
    var compressed = Math.floor(tick / tickSpacing); // matches rounding in the code
    if (lte) {
      var wordPos = compressed >> 8;
      var minimum = (wordPos << 8) * tickSpacing;
      if (TickList.isBelowSmallest(ticks, tick)) {
        return [minimum, false];
      }
      var index = TickList.nextInitializedTick(ticks, tick, lte).index;
      var nextInitializedTick = Math.max(minimum, index);
      return [nextInitializedTick, nextInitializedTick === index];
    } else {
      var _wordPos = compressed + 1 >> 8;
      var maximum = ((_wordPos + 1 << 8) - 1) * tickSpacing;
      if (this.isAtOrAboveLargest(ticks, tick)) {
        return [maximum, false];
      }
      var _index2 = this.nextInitializedTick(ticks, tick, lte).index;
      var _nextInitializedTick = Math.min(maximum, _index2);
      return [_nextInitializedTick, _nextInitializedTick === _index2];
    }
  };
  return TickList;
}();

/**
 * Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 The numerator amount i.e., the amount of token1
 * @param amount0 The denominator amount i.e., the amount of token0
 * @returns The sqrt ratio
 */
function encodeSqrtRatioX96(amount1, amount0) {
  var numerator = JSBI.leftShift(JSBI.BigInt(amount1), JSBI.BigInt(128));
  var denominator = JSBI.BigInt(amount0);
  var ratioX192 = JSBI.divide(numerator, denominator);
  return sdkCore.sqrt(ratioX192);
}

/**
 * Returns an imprecise maximum amount of liquidity received for a given amount of token 0.
 * This function is available to accommodate LiquidityAmounts#getLiquidityForAmount0 in the v3 periphery,
 * which could be more precise by at least 32 bits by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits. This imprecise calculation will likely be replaced in a future
 * v3 router contract.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, imprecise
 */
function maxLiquidityForAmount0Imprecise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref[0];
    sqrtRatioBX96 = _ref[1];
  }
  var intermediate = JSBI.divide(JSBI.multiply(sqrtRatioAX96, sqrtRatioBX96), Q64);
  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount0), intermediate), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Returns a precise maximum amount of liquidity received for a given amount of token 0 by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, precise
 */
function maxLiquidityForAmount0Precise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref2[0];
    sqrtRatioBX96 = _ref2[1];
  }
  var numerator = JSBI.multiply(JSBI.multiply(JSBI.BigInt(amount0), sqrtRatioAX96), sqrtRatioBX96);
  var denominator = JSBI.multiply(Q64, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
  return JSBI.divide(numerator, denominator);
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token1
 * @param sqrtRatioAX96 The price at the lower tick boundary
 * @param sqrtRatioBX96 The price at the upper tick boundary
 * @param amount1 The token1 amount
 * @returns liquidity for amount1
 */
function maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref3 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref3[0];
    sqrtRatioBX96 = _ref3[1];
  }
  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount1), Q64), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token0, token1,
 * and the prices at the tick boundaries.
 * @param sqrtRatioCurrentX96 the current price
 * @param sqrtRatioAX96 price at lower boundary
 * @param sqrtRatioBX96 price at upper boundary
 * @param amount0 token0 amount
 * @param amount1 token1 amount
 * @param useFullPrecision if false, liquidity will be maximized according to what the router can calculate,
 * not what core can theoretically support
 */
function maxLiquidityForAmounts(sqrtRatioCurrentX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref4 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref4[0];
    sqrtRatioBX96 = _ref4[1];
  }
  var maxLiquidityForAmount0 = useFullPrecision ? maxLiquidityForAmount0Precise : maxLiquidityForAmount0Imprecise;
  if (JSBI.lessThanOrEqual(sqrtRatioCurrentX96, sqrtRatioAX96)) {
    return maxLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (JSBI.lessThan(sqrtRatioCurrentX96, sqrtRatioBX96)) {
    var liquidity0 = maxLiquidityForAmount0(sqrtRatioCurrentX96, sqrtRatioBX96, amount0);
    var liquidity1 = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1);
    return JSBI.lessThan(liquidity0, liquidity1) ? liquidity0 : liquidity1;
  } else {
    return maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }
}

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */
function nearestUsableTick(tick, tickSpacing) {
  !(Number.isInteger(tick) && Number.isInteger(tickSpacing)) ?  invariant(false, 'INTEGERS')  : void 0;
  !(tickSpacing > 0) ?  invariant(false, 'TICK_SPACING')  : void 0;
  !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK) ?  invariant(false, 'TICK_BOUND')  : void 0;
  var rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK) return rounded + tickSpacing;else if (rounded > TickMath.MAX_TICK) return rounded - tickSpacing;else return rounded;
}

var Q256 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(256));
function subIn256(x, y) {
  var difference = JSBI.subtract(x, y);
  if (JSBI.lessThan(difference, ZERO)) {
    return JSBI.add(Q256, difference);
  } else {
    return difference;
  }
}
var TickLibrary = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function TickLibrary() {}
  TickLibrary.getFeeGrowthInside = function getFeeGrowthInside(feeGrowthOutsideLower, feeGrowthOutsideUpper, tickLower, tickUpper, tickCurrent, feeGrowthGlobal0X128, feeGrowthGlobal1X128) {
    var feeGrowthBelow0X128;
    var feeGrowthBelow1X128;
    if (tickCurrent >= tickLower) {
      feeGrowthBelow0X128 = feeGrowthOutsideLower.feeGrowthOutside0X128;
      feeGrowthBelow1X128 = feeGrowthOutsideLower.feeGrowthOutside1X128;
    } else {
      feeGrowthBelow0X128 = subIn256(feeGrowthGlobal0X128, feeGrowthOutsideLower.feeGrowthOutside0X128);
      feeGrowthBelow1X128 = subIn256(feeGrowthGlobal1X128, feeGrowthOutsideLower.feeGrowthOutside1X128);
    }
    var feeGrowthAbove0X128;
    var feeGrowthAbove1X128;
    if (tickCurrent < tickUpper) {
      feeGrowthAbove0X128 = feeGrowthOutsideUpper.feeGrowthOutside0X128;
      feeGrowthAbove1X128 = feeGrowthOutsideUpper.feeGrowthOutside1X128;
    } else {
      feeGrowthAbove0X128 = subIn256(feeGrowthGlobal0X128, feeGrowthOutsideUpper.feeGrowthOutside0X128);
      feeGrowthAbove1X128 = subIn256(feeGrowthGlobal1X128, feeGrowthOutsideUpper.feeGrowthOutside1X128);
    }
    return [subIn256(subIn256(feeGrowthGlobal0X128, feeGrowthBelow0X128), feeGrowthAbove0X128), subIn256(subIn256(feeGrowthGlobal1X128, feeGrowthBelow1X128), feeGrowthAbove1X128)];
  };
  return TickLibrary;
}();

var Q128$1 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(128));
var PositionLibrary = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function PositionLibrary() {}
  // replicates the portions of Position#update required to compute unaccounted fees
  PositionLibrary.getTokensOwed = function getTokensOwed(feeGrowthInside0LastX128, feeGrowthInside1LastX128, liquidity, feeGrowthInside0X128, feeGrowthInside1X128) {
    var tokensOwed0 = JSBI.divide(JSBI.multiply(subIn256(feeGrowthInside0X128, feeGrowthInside0LastX128), liquidity), Q128$1);
    var tokensOwed1 = JSBI.divide(JSBI.multiply(subIn256(feeGrowthInside1X128, feeGrowthInside1LastX128), liquidity), Q128$1);
    return [tokensOwed0, tokensOwed1];
  };
  PositionLibrary.getTokensOwed2 = function getTokensOwed2(feeGrowthInside0LastX128, feeGrowthInside1LastX128, liquidity, feeGrowthInside0X128, feeGrowthInside1X128) {
    return PositionLibrary.getTokensOwed(JSBI.BigInt(feeGrowthInside0LastX128), JSBI.BigInt(feeGrowthInside1LastX128), JSBI.BigInt(liquidity), JSBI.BigInt(feeGrowthInside0X128), JSBI.BigInt(feeGrowthInside1X128));
  };
  return PositionLibrary;
}();

var Big = /*#__PURE__*/toFormat(_Big);
var CurrencyAmount = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction);
  function CurrencyAmount(currency, numerator, denominator) {
    var _this;
    _this = _Fraction.call(this, numerator, denominator) || this;
    !JSBI.lessThanOrEqual(_this.quotient, sdkCore.MaxUint256) ?  invariant(false, 'AMOUNT')  : void 0;
    _this.currency = currency;
    _this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals));
    return _this;
  }
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  CurrencyAmount.fromRawAmount = function fromRawAmount(currency, rawAmount) {
    return new CurrencyAmount(currency, rawAmount);
  }
  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */;
  CurrencyAmount.fromFractionalAmount = function fromFractionalAmount(currency, numerator, denominator) {
    return new CurrencyAmount(currency, numerator, denominator);
  };
  var _proto = CurrencyAmount.prototype;
  _proto.add = function add(other) {
    !this.currency.equals(other.currency) ?  invariant(false, 'CURRENCY')  : void 0;
    var added = _Fraction.prototype.add.call(this, other);
    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
  };
  _proto.subtract = function subtract(other) {
    !this.currency.equals(other.currency) ?  invariant(false, 'CURRENCY')  : void 0;
    var subtracted = _Fraction.prototype.subtract.call(this, other);
    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator);
  };
  _proto.multiply = function multiply(other) {
    var multiplied = _Fraction.prototype.multiply.call(this, other);
    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator);
  };
  _proto.divide = function divide(other) {
    var divided = _Fraction.prototype.divide.call(this, other);
    return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator);
  };
  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }
    if (rounding === void 0) {
      rounding = sdkCore.Rounding.ROUND_DOWN;
    }
    return _Fraction.prototype.divide.call(this, this.decimalScale).toSignificant(significantDigits, format, rounding);
  };
  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals;
    }
    if (rounding === void 0) {
      rounding = sdkCore.Rounding.ROUND_DOWN;
    }
    !(decimalPlaces <= this.currency.decimals) ?  invariant(false, 'DECIMALS')  : void 0;
    return _Fraction.prototype.divide.call(this, this.decimalScale).toFixed(decimalPlaces, format, rounding);
  };
  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }
    Big.DP = this.currency.decimals;
    return new Big(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format);
  };
  _createClass(CurrencyAmount, [{
    key: "wrapped",
    get: function get() {
      return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator);
    }
  }]);
  return CurrencyAmount;
}(sdkCore.Fraction);

var Price = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Price, _Fraction);
  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  function Price() {
    var _this;
    var baseCurrency, quoteCurrency, denominator, numerator;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (args.length === 4) {
      baseCurrency = args[0];
      quoteCurrency = args[1];
      denominator = args[2];
      numerator = args[3];
    } else {
      var result = args[0].quoteAmount.divide(args[0].baseAmount);
      var _ref = [args[0].baseAmount.currency, args[0].quoteAmount.currency, result.denominator, result.numerator];
      baseCurrency = _ref[0];
      quoteCurrency = _ref[1];
      denominator = _ref[2];
      numerator = _ref[3];
    }
    _this = _Fraction.call(this, numerator, denominator) || this;
    _this.baseCurrency = baseCurrency;
    _this.quoteCurrency = quoteCurrency;
    _this.scalar = new sdkCore.Fraction(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(baseCurrency.decimals)), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(quoteCurrency.decimals)));
    return _this;
  }
  /**
   * Flip the price, switching the base and quote currency
   */
  var _proto = Price.prototype;
  _proto.invert = function invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  }
  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */;
  _proto.multiply = function multiply(other) {
    !this.quoteCurrency.equals(other.baseCurrency) ?  invariant(false, 'TOKEN')  : void 0;
    var fraction = _Fraction.prototype.multiply.call(this, other);
    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  }
  /**
   * Return the amount of quote currency corresponding to a given amount of the base currency
   * @param currencyAmount the amount of base currency to quote against the price
   */;
  _proto.quote = function quote(currencyAmount) {
    !currencyAmount.currency.equals(this.baseCurrency) ?  invariant(false, 'TOKEN')  : void 0;
    var result = _Fraction.prototype.multiply.call(this, currencyAmount);
    return CurrencyAmount.fromFractionalAmount(this.quoteCurrency, result.numerator, result.denominator);
  }
  /**
   * Get the value scaled by decimals for formatting
   * @private
   */;
  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }
    return this.adjustedForDecimals.toSignificant(significantDigits, format, rounding);
  };
  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 4;
    }
    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding);
  };
  _createClass(Price, [{
    key: "adjustedForDecimals",
    get: function get() {
      return _Fraction.prototype.multiply.call(this, this.scalar);
    }
  }]);
  return Price;
}(sdkCore.Fraction);

/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
function tickToPrice(baseToken, quoteToken, tick) {
  var sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
  var ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);
  return baseToken.sortsBefore(quoteToken) ? new Price(baseToken, quoteToken, Q128, ratioX192) : new Price(baseToken, quoteToken, ratioX192, Q128);
}
/**
 * Returns the first tick for which the given price is greater than or equal to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 */
function priceToClosestTick(price) {
  var sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);
  var sqrtRatioX96 = sorted ? encodeSqrtRatioX96(price.numerator, price.denominator) : encodeSqrtRatioX96(price.denominator, price.numerator);
  var tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  var nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick + 1);
  if (sorted) {
    if (!price.lessThan(nextTickPrice)) {
      tick++;
    }
  } else {
    if (!price.greaterThan(nextTickPrice)) {
      tick++;
    }
  }
  return tick;
}

function toUTF8Array(str) {
  var utf8 = [];
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);else if (charcode < 0x800) {
      utf8.push(0xc0 | charcode >> 6, 0x80 | charcode & 0x3f);
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | charcode >> 12, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + ((charcode & 0x3ff) << 10 | str.charCodeAt(i) & 0x3ff);
      utf8.push(0xf0 | charcode >> 18, 0x80 | charcode >> 12 & 0x3f, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
    }
  }
  return utf8;
}
function hexToBN(hex) {
  return hex.replace('0x', '');
}
function validateAndParseAddress(address) {
  var result = '';
  try {
    if (address.match(/^(0x)?[0-9a-fA-F]{64}$/)) {
      if (address.substring(0, 2) !== '0x') {
        result = '0x' + address;
      } else {
        result = address;
      }
    }
  } catch (error) {
    throw new Error(address + " is not a valid address.");
  }
  return result;
}
function toHex(bigintIsh) {
  var bigInt = JSBI.BigInt(bigintIsh);
  var hex = bigInt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }
  return "0x" + hex;
}
function bnToBigInt(sqrtPricex96) {
  return JSBI.BigInt(sqrtPricex96);
}
function i64ToNumber(v) {
  var b = JSBI.bitwiseAnd(JSBI.BigInt(v.bits), JSBI.BigInt('9223372036854775808'));
  if (JSBI.equal(b, JSBI.BigInt(0))) {
    return parseInt(v.bits);
  }
  return -JSBI.toNumber(JSBI.subtract(JSBI.BigInt('18446744073709551616'), JSBI.BigInt(v.bits)));
}
function i128ToBigInt(v) {
  var u128WithFirstBitSet = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(127));
  var maxU128Plus1 = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(128));
  if (JSBI.greaterThan(JSBI.BigInt(v.bits), u128WithFirstBitSet)) {
    // negative
    var abs = JSBI.subtract(maxU128Plus1, JSBI.BigInt(v.bits)).toString();
    return JSBI.BigInt("-" + abs);
  }
  return JSBI.BigInt(v.bits);
}
function i256ToBigInt(v) {
  var u256WithFirstBitSet = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(255));
  var bi = bnToBigInt(v.bits);
  var maxU256Plus1 = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(256));
  if (JSBI.greaterThan(JSBI.BigInt(bi), u256WithFirstBitSet)) {
    // negative
    var abs = JSBI.subtract(maxU256Plus1, JSBI.BigInt(bi)).toString();
    return JSBI.BigInt("-" + abs);
  }
  return JSBI.BigInt(bi);
}
function decimalToHexString(n) {
  var ret = '';
  if (n < 0) {
    ret = (n >>> 0).toString(16);
    while (ret.length < 16) {
      ret = "F" + ret;
    }
  } else {
    ret = n.toString(16);
    while (ret.length < 16) {
      ret = "0" + ret;
    }
  }
  return ret;
}
function sleep(_x) {
  return _sleep.apply(this, arguments);
}
function _sleep() {
  _sleep = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(time) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve) {
            return setTimeout(resolve, time);
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _sleep.apply(this, arguments);
}
function tryCallWithTrial(_x2, _x3, _x4) {
  return _tryCallWithTrial.apply(this, arguments);
}
function _tryCallWithTrial() {
  _tryCallWithTrial = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(func, trial, waitTime) {
    var initial, ret;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (trial === void 0) {
            trial = 10;
          }
          if (waitTime === void 0) {
            waitTime = 2000;
          }
          initial = trial;
        case 3:
          if (!(trial > 0)) {
            _context2.next = 22;
            break;
          }
          _context2.prev = 4;
          _context2.next = 7;
          return func();
        case 7:
          ret = _context2.sent;
          return _context2.abrupt("return", ret);
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](4);
          console.warn(_context2.t0.toString());
          _context2.next = 16;
          return sleep(waitTime);
        case 16:
          trial--;
          if (!(initial - trial > 5)) {
            _context2.next = 20;
            break;
          }
          _context2.next = 20;
          return sleep(waitTime);
        case 20:
          _context2.next = 3;
          break;
        case 22:
          return _context2.abrupt("return", undefined);
        case 23:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[4, 11]]);
  }));
  return _tryCallWithTrial.apply(this, arguments);
}
function typeInfoToQualifiedName(tInfo) {
  var moduleName = Buffer.from(tInfo).toString("utf8");
  return "0x" + moduleName;
}
function sortTypes(a, b) {
  if (sortBefore(a, b)) {
    return {
      token0: a,
      token1: b
    };
  } else {
    return {
      token0: b,
      token1: a
    };
  }
}
function sortBefore(a, b) {
  !(a !== b) ?  invariant(false, 'ADDRESSES')  : void 0;
  if (a.includes('::')) {
    a = toFullyQualifiedName(a);
  }
  if (b.includes('::')) {
    b = toFullyQualifiedName(b);
  }
  if (a.length < b.length) {
    return true;
  } else if (a.length > b.length) {
    return false;
  }
  return a < b;
}
function toFullyQualifiedName(ct) {
  return ct;
}
var VECTOR_REGEX = /^vector<(.+)>$/;
var STRUCT_REGEX = /^([^:]+)::([^:]+)::(.+)/;
var STRUCT_TYPE_TAG_REGEX = /^[^<]+<(.+)>$/;
var TypeTagSerializer = /*#__PURE__*/function () {
  function TypeTagSerializer() {}
  var _proto = TypeTagSerializer.prototype;
  _proto.parseFromStr = function parseFromStr(str) {
    if (str === 'address') {
      return {
        address: null
      };
    } else if (str === 'bool') {
      return {
        bool: null
      };
    } else if (str === 'u8') {
      return {
        u8: null
      };
    } else if (str === 'u16') {
      return {
        u16: null
      };
    } else if (str === 'u32') {
      return {
        u32: null
      };
    } else if (str === 'u64') {
      return {
        u64: null
      };
    } else if (str === 'u128') {
      return {
        u128: null
      };
    } else if (str === 'u256') {
      return {
        u256: null
      };
    } else if (str === 'signer') {
      return {
        signer: null
      };
    }
    var vectorMatch = str.match(VECTOR_REGEX);
    if (vectorMatch) {
      return {
        vector: this.parseFromStr(vectorMatch[1])
      };
    }
    var structMatch = str.match(STRUCT_REGEX);
    if (structMatch) {
      try {
        return {
          struct: {
            address: structMatch[1],
            module: structMatch[2],
            name: structMatch[3].match(/^([^<]+)/)[1],
            typeParams: this.parseStructTypeTag(structMatch[3])
          }
        };
      } catch (e) {
        throw new Error("Encounter error parsing type args for " + str);
      }
    }
    throw new Error("Encounter unexpected token when parsing type args for " + str);
  };
  _proto.parseStructTypeTag = function parseStructTypeTag(str) {
    var _this = this;
    var typeTagsMatch = str.match(STRUCT_TYPE_TAG_REGEX);
    if (!typeTagsMatch) {
      return [];
    }
    // TODO: This will fail if the struct has nested type args with commas. Need
    // to implement proper parsing for this case
    var typeTags = typeTagsMatch[1].split(',');
    return typeTags.map(function (tag) {
      return _this.parseFromStr(tag);
    });
  };
  return TypeTagSerializer;
}();
function parseTypeFromStr(t) {
  return new TypeTagSerializer().parseFromStr(t);
}
function structTagToString(st_) {
  if (Object.keys(st_).includes('struct')) {
    var st = st_.struct;
    var ret = st.address + "::" + st.module + "::" + st.name;
    if (st.typeParams.length > 0) {
      var joined = st.typeParams.join(',');
      ret = ret + "<" + joined + ">";
    }
    return ret;
  }
  return '';
}

var Tick = function Tick(_ref) {
  var index = _ref.index,
    liquidityGross = _ref.liquidityGross,
    liquidityNet = _ref.liquidityNet;
  !(index >= TickMath.MIN_TICK && index <= TickMath.MAX_TICK) ?  invariant(false, 'TICK')  : void 0;
  this.index = index;
  this.liquidityGross = JSBI.BigInt(liquidityGross);
  this.liquidityNet = JSBI.BigInt(liquidityNet);
};

/**
 * A data provider for ticks that is backed by an in-memory array of ticks.
 */
var TickListDataProvider = /*#__PURE__*/function () {
  function TickListDataProvider(ticks, tickSpacing) {
    var ticksMapped = ticks.map(function (t) {
      return t instanceof Tick ? t : new Tick(t);
    });
    TickList.validateList(ticksMapped, tickSpacing);
    this.ticks = ticksMapped;
  }
  var _proto = TickListDataProvider.prototype;
  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(tick) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", TickList.getTick(this.ticks, tick));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }
    return getTick;
  }();
  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(tick, lte, tickSpacing) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }
    return nextInitializedTickWithinOneWord;
  }();
  return TickListDataProvider;
}();

/**
 * By default, pools will not allow operations that require ticks.
 */
var NO_TICK_DATA_PROVIDER_DEFAULT = /*#__PURE__*/new NoTickDataProvider();
/**
 * Represents a V3 pool
 */
var Pool = /*#__PURE__*/function () {
  /**
   * Construct a pool
   * @param tokenA One of the tokens in the pool
   * @param tokenB The other token in the pool
   * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
   * @param sqrtRatioX96 The sqrt of the current ratio of amounts of token1 to token0
   * @param liquidity The current value of in range liquidity
   * @param tickCurrent The current tick of the pool
   * @param ticks The current state of the pool ticks or a data provider that can return tick data
   */
  function Pool(tokenA, tokenB, fee, sqrtRatioX96, liquidity, tickCurrent, ticks, objectId, poolHash) {
    if (ticks === void 0) {
      ticks = NO_TICK_DATA_PROVIDER_DEFAULT;
    }
    !(Number.isInteger(fee) && fee < 1000000) ?  invariant(false, 'FEE')  : void 0;
    this.objectId = objectId;
    this.poolHash = poolHash;
    var tickCurrentSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent);
    var nextTickSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent + 1);
    !(JSBI.greaterThanOrEqual(JSBI.BigInt(sqrtRatioX96), tickCurrentSqrtRatioX96) && JSBI.lessThanOrEqual(JSBI.BigInt(sqrtRatioX96), nextTickSqrtRatioX96)) ?  invariant(false, 'PRICE_BOUNDS')  : void 0;
    var _ref = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    this.token0 = _ref[0];
    this.token1 = _ref[1];
    this.fee = fee;
    this.sqrtRatioX96 = JSBI.BigInt(sqrtRatioX96);
    this.liquidity = JSBI.BigInt(liquidity);
    this.tickCurrent = tickCurrent;
    this.tickDataProvider = Array.isArray(ticks) ? new TickListDataProvider(ticks, TICK_SPACINGS[fee]) : ticks;
  }
  var _proto = Pool.prototype;
  _proto.getPoolType = function getPoolType(packageId) {
    return packageId + "::pool::Pool<" + this.token0.address + "," + this.token1.address + "," + packageId + getFeeType(this.fee) + ">";
  };
  _proto.updateTickProvider = function updateTickProvider(ticks) {
    if (ticks === void 0) {
      ticks = NO_TICK_DATA_PROVIDER_DEFAULT;
    }
    this.tickDataProvider = Array.isArray(ticks) ? new TickListDataProvider(ticks, TICK_SPACINGS[this.fee]) : ticks;
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */;
  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */;
  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
   * @returns The output amount and the pool with updated state
   */;
  _proto.getOutputAmount =
  /*#__PURE__*/
  function () {
    var _getOutputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(inputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap, outputAmount, sqrtRatioX96, liquidity, tickCurrent, outputToken;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            !this.involvesToken(inputAmount.currency) ?  invariant(false, 'TOKEN')  : void 0;
            zeroForOne = inputAmount.currency.equals(this.token0);
            _context.next = 4;
            return this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96);
          case 4:
            _yield$this$swap = _context.sent;
            outputAmount = _yield$this$swap.amountCalculated;
            sqrtRatioX96 = _yield$this$swap.sqrtRatioX96;
            liquidity = _yield$this$swap.liquidity;
            tickCurrent = _yield$this$swap.tickCurrent;
            outputToken = zeroForOne ? this.token1 : this.token0;
            return _context.abrupt("return", [CurrencyAmount.fromRawAmount(outputToken, JSBI.multiply(outputAmount, NEGATIVE_ONE)), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider, this.objectId, this.poolHash)]);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function getOutputAmount(_x, _x2) {
      return _getOutputAmount.apply(this, arguments);
    }
    return getOutputAmount;
  }()
  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  ;
  _proto.getInputAmount =
  /*#__PURE__*/
  function () {
    var _getInputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(outputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap2, inputAmount, sqrtRatioX96, liquidity, tickCurrent, inputToken;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            zeroForOne = outputAmount.currency.equals(this.token1);
            _context2.next = 3;
            return this.swap(zeroForOne, JSBI.multiply(outputAmount.quotient, NEGATIVE_ONE), sqrtPriceLimitX96);
          case 3:
            _yield$this$swap2 = _context2.sent;
            inputAmount = _yield$this$swap2.amountCalculated;
            sqrtRatioX96 = _yield$this$swap2.sqrtRatioX96;
            liquidity = _yield$this$swap2.liquidity;
            tickCurrent = _yield$this$swap2.tickCurrent;
            inputToken = zeroForOne ? this.token0 : this.token1;
            return _context2.abrupt("return", [CurrencyAmount.fromRawAmount(inputToken, inputAmount), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider, this.objectId, this.poolHash)]);
          case 10:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function getInputAmount(_x3, _x4) {
      return _getInputAmount.apply(this, arguments);
    }
    return getInputAmount;
  }()
  /**
   * Executes a swap
   * @param zeroForOne Whether the amount in is token0 or token1
   * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns amountCalculated
   * @returns sqrtRatioX96
   * @returns liquidity
   * @returns tickCurrent
   */
  ;
  _proto.swap =
  /*#__PURE__*/
  function () {
    var _swap = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
      var exactInput, state, step, _yield$this$tickDataP, _SwapMath$computeSwap, liquidityNet;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!sqrtPriceLimitX96) sqrtPriceLimitX96 = zeroForOne ? JSBI.add(TickMath.MIN_SQRT_RATIO, ONE) : JSBI.subtract(TickMath.MAX_SQRT_RATIO, ONE);
            if (zeroForOne) {
              !JSBI.greaterThan(sqrtPriceLimitX96, TickMath.MIN_SQRT_RATIO) ?  invariant(false, 'RATIO_MIN')  : void 0;
              !JSBI.lessThan(sqrtPriceLimitX96, this.sqrtRatioX96) ?  invariant(false, 'RATIO_CURRENT')  : void 0;
            } else {
              !JSBI.lessThan(sqrtPriceLimitX96, TickMath.MAX_SQRT_RATIO) ?  invariant(false, 'RATIO_MAX')  : void 0;
              !JSBI.greaterThan(sqrtPriceLimitX96, this.sqrtRatioX96) ?  invariant(false, 'RATIO_CURRENT')  : void 0;
            }
            exactInput = JSBI.greaterThanOrEqual(amountSpecified, ZERO); // keep track of swap state
            state = {
              amountSpecifiedRemaining: amountSpecified,
              amountCalculated: ZERO,
              sqrtPriceX96: this.sqrtRatioX96,
              tick: this.tickCurrent,
              liquidity: this.liquidity
            }; // start swap while loop
          case 4:
            if (!(JSBI.notEqual(state.amountSpecifiedRemaining, ZERO) && state.sqrtPriceX96 != sqrtPriceLimitX96)) {
              _context3.next = 35;
              break;
            }
            step = {};
            step.sqrtPriceStartX96 = state.sqrtPriceX96;
            _context3.next = 9;
            return this.tickDataProvider.nextInitializedTickWithinOneWord(state.tick, zeroForOne, this.tickSpacing);
          case 9:
            _yield$this$tickDataP = _context3.sent;
            step.tickNext = _yield$this$tickDataP[0];
            step.initialized = _yield$this$tickDataP[1];
            if (step.tickNext < TickMath.MIN_TICK) {
              step.tickNext = TickMath.MIN_TICK;
            } else if (step.tickNext > TickMath.MAX_TICK) {
              step.tickNext = TickMath.MAX_TICK;
            }
            step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);
            _SwapMath$computeSwap = SwapMath.computeSwapStep(state.sqrtPriceX96, (zeroForOne ? JSBI.lessThan(step.sqrtPriceNextX96, sqrtPriceLimitX96) : JSBI.greaterThan(step.sqrtPriceNextX96, sqrtPriceLimitX96)) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96, state.liquidity, state.amountSpecifiedRemaining, this.fee);
            state.sqrtPriceX96 = _SwapMath$computeSwap[0];
            step.amountIn = _SwapMath$computeSwap[1];
            step.amountOut = _SwapMath$computeSwap[2];
            step.feeAmount = _SwapMath$computeSwap[3];
            if (exactInput) {
              state.amountSpecifiedRemaining = JSBI.subtract(state.amountSpecifiedRemaining, JSBI.add(step.amountIn, step.feeAmount));
              state.amountCalculated = JSBI.subtract(state.amountCalculated, step.amountOut);
            } else {
              state.amountSpecifiedRemaining = JSBI.add(state.amountSpecifiedRemaining, step.amountOut);
              state.amountCalculated = JSBI.add(state.amountCalculated, JSBI.add(step.amountIn, step.feeAmount));
            }
            // TODO
            if (!JSBI.equal(state.sqrtPriceX96, step.sqrtPriceNextX96)) {
              _context3.next = 32;
              break;
            }
            if (!step.initialized) {
              _context3.next = 29;
              break;
            }
            _context3.t0 = JSBI;
            _context3.next = 25;
            return this.tickDataProvider.getTick(step.tickNext);
          case 25:
            _context3.t1 = _context3.sent.liquidityNet;
            liquidityNet = _context3.t0.BigInt.call(_context3.t0, _context3.t1);
            // if we're moving leftward, we interpret liquidityNet as the opposite sign
            // safe because liquidityNet cannot be type(int128).min
            if (zeroForOne) liquidityNet = JSBI.multiply(liquidityNet, NEGATIVE_ONE);
            state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);
          case 29:
            state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
            _context3.next = 33;
            break;
          case 32:
            if (JSBI.notEqual(state.sqrtPriceX96, step.sqrtPriceStartX96)) {
              // updated comparison function
              // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
              state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
            }
          case 33:
            _context3.next = 4;
            break;
          case 35:
            return _context3.abrupt("return", {
              amountCalculated: state.amountCalculated,
              sqrtRatioX96: state.sqrtPriceX96,
              liquidity: state.liquidity,
              tickCurrent: state.tick
            });
          case 36:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    function swap(_x5, _x6, _x7) {
      return _swap.apply(this, arguments);
    }
    return swap;
  }();
  _createClass(Pool, [{
    key: "token0Price",
    get: function get() {
      var _this$_token0Price;
      return (_this$_token0Price = this._token0Price) != null ? _this$_token0Price : this._token0Price = new Price(this.token0, this.token1, Q128, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96));
    }
    /**
     * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
     */
  }, {
    key: "token1Price",
    get: function get() {
      var _this$_token1Price;
      return (_this$_token1Price = this._token1Price) != null ? _this$_token1Price : this._token1Price = new Price(this.token1, this.token0, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96), Q128);
    }
  }, {
    key: "tickSpacing",
    get: function get() {
      return TICK_SPACINGS[this.fee];
    }
  }]);
  return Pool;
}();

/**
 * Represents a position on a Uniswap V3 Pool
 */
var Position = /*#__PURE__*/function () {
  /**
   * Constructs a position for a given pool with the given liquidity
   * @param pool For which pool the liquidity is assigned
   * @param liquidity The amount of liquidity that is in the position
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   */
  function Position(_ref) {
    var pool = _ref.pool,
      liquidity = _ref.liquidity,
      tickLower = _ref.tickLower,
      tickUpper = _ref.tickUpper;
    // cached resuts for the getters
    this._token0Amount = null;
    this._token1Amount = null;
    this._mintAmounts = null;
    !(tickLower < tickUpper) ?  invariant(false, 'TICK_ORDER')  : void 0;
    !(tickLower >= TickMath.MIN_TICK && tickLower % pool.tickSpacing === 0) ?  invariant(false, 'TICK_LOWER')  : void 0;
    !(tickUpper <= TickMath.MAX_TICK && tickUpper % pool.tickSpacing === 0) ?  invariant(false, 'TICK_UPPER')  : void 0;
    this.pool = pool;
    this.tickLower = tickLower;
    this.tickUpper = tickUpper;
    this.liquidity = JSBI.BigInt(liquidity);
  }
  /**
   * Returns the price of token0 at the lower tick
   */
  var _proto = Position.prototype;
  /**
   * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
   * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
   * @returns The sqrt ratios after slippage
   */
  _proto.ratiosAfterSlippage = function ratiosAfterSlippage(slippageTolerance) {
    var priceLower = this.pool.token0Price.asFraction.multiply(new sdkCore.Percent(1).subtract(slippageTolerance));
    var priceUpper = this.pool.token0Price.asFraction.multiply(slippageTolerance.add(1));
    var sqrtRatioX96Lower = encodeSqrtRatioX96(priceLower.numerator, priceLower.denominator);
    if (JSBI.lessThanOrEqual(sqrtRatioX96Lower, TickMath.MIN_SQRT_RATIO)) {
      sqrtRatioX96Lower = JSBI.add(TickMath.MIN_SQRT_RATIO, JSBI.BigInt(1));
    }
    var sqrtRatioX96Upper = encodeSqrtRatioX96(priceUpper.numerator, priceUpper.denominator);
    if (JSBI.greaterThanOrEqual(sqrtRatioX96Upper, TickMath.MAX_SQRT_RATIO)) {
      sqrtRatioX96Upper = JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1));
    }
    return {
      sqrtRatioX96Lower: sqrtRatioX96Lower,
      sqrtRatioX96Upper: sqrtRatioX96Upper
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
   * with the given slippage tolerance
   * @param slippageTolerance Tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */;
  _proto.mintAmountsWithSlippage = function mintAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip = this.ratiosAfterSlippage(slippageTolerance),
      sqrtRatioX96Upper = _this$ratiosAfterSlip.sqrtRatioX96Upper,
      sqrtRatioX96Lower = _this$ratiosAfterSlip.sqrtRatioX96Lower;
    // construct counterfactual pools
    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0 /* liquidity doesn't matter */, TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0 /* liquidity doesn't matter */, TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper));
    // because the router is imprecise, we need to calculate the position that will be created (assuming no slippage)
    var positionThatWillBeCreated = Position.fromAmounts(_extends({
      pool: this.pool,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }, this.mintAmounts, {
      useFullPrecision: false
    }));
    // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...
    var amount0 = new Position({
      pool: poolUpper,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount0;
    // ...and the lower for amount1
    var amount1 = new Position({
      pool: poolLower,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount1;
    return {
      amount0: amount0,
      amount1: amount1
    };
  }
  /**
   * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
   * position with the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */;
  _proto.burnAmountsWithSlippage = function burnAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip2 = this.ratiosAfterSlippage(slippageTolerance),
      sqrtRatioX96Upper = _this$ratiosAfterSlip2.sqrtRatioX96Upper,
      sqrtRatioX96Lower = _this$ratiosAfterSlip2.sqrtRatioX96Lower;
    // construct counterfactual pools
    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0 /* liquidity doesn't matter */, TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0 /* liquidity doesn't matter */, TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper));
    // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...
    var amount0 = new Position({
      pool: poolUpper,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount0;
    // ...and the lower for amount1
    var amount1 = new Position({
      pool: poolLower,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount1;
    return {
      amount0: amount0.quotient,
      amount1: amount1.quotient
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
   * the current price for the pool
   */;
  /**
   * Computes the maximum amount of liquidity received for a given amount of token0, token1,
   * and the prices at the tick boundaries.
   * @param pool The pool for which the position should be created
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   * @param amount0 token0 amount
   * @param amount1 token1 amount
   * @param useFullPrecision If false, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The amount of liquidity for the position
   */
  Position.fromAmounts = function fromAmounts(_ref2) {
    var pool = _ref2.pool,
      tickLower = _ref2.tickLower,
      tickUpper = _ref2.tickUpper,
      amount0 = _ref2.amount0,
      amount1 = _ref2.amount1,
      useFullPrecision = _ref2.useFullPrecision;
    var sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    var sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
    return new Position({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      liquidity: maxLiquidityForAmounts(pool.sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision)
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token0, assuming an unlimited amount of token1
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount0 The desired amount of token0
   * @param useFullPrecision If true, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The position
   */;
  Position.fromAmount0 = function fromAmount0(_ref3) {
    var pool = _ref3.pool,
      tickLower = _ref3.tickLower,
      tickUpper = _ref3.tickUpper,
      amount0 = _ref3.amount0,
      useFullPrecision = _ref3.useFullPrecision;
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: amount0,
      amount1: sdkCore.MaxUint256,
      useFullPrecision: useFullPrecision
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token1, assuming an unlimited amount of token0
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount1 The desired amount of token1
   * @returns The position
   */;
  Position.fromAmount1 = function fromAmount1(_ref4) {
    var pool = _ref4.pool,
      tickLower = _ref4.tickLower,
      tickUpper = _ref4.tickUpper,
      amount1 = _ref4.amount1;
    // this function always uses full precision,
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: sdkCore.MaxUint256,
      amount1: amount1,
      useFullPrecision: true
    });
  };
  _createClass(Position, [{
    key: "token0PriceLower",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickLower);
    }
    /**
     * Returns the price of token0 at the upper tick
     */
  }, {
    key: "token0PriceUpper",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickUpper);
    }
    /**
     * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
     */
  }, {
    key: "amount0",
    get: function get() {
      if (this._token0Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, ZERO);
        }
      }
      return this._token0Amount;
    }
    /**
     * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
     */
  }, {
    key: "amount1",
    get: function get() {
      if (this._token1Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, ZERO);
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, false));
        } else {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        }
      }
      return this._token1Amount;
    }
  }, {
    key: "mintAmounts",
    get: function get() {
      if (this._mintAmounts === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: ZERO
          };
        } else if (this.pool.tickCurrent < this.tickUpper) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, true)
          };
        } else {
          return {
            amount0: ZERO,
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true)
          };
        }
      }
      return this._mintAmounts;
    }
  }]);
  return Position;
}();

/**
 * Represents a list of pools through which a swap can occur
 * @template TInput The input token
 * @template TOutput The output token
 */
var Route = /*#__PURE__*/function () {
  /**
   * Creates an instance of route.
   * @param pools An array of `Pool` objects, ordered by the route the swap will take
   * @param input The input token
   * @param output The output token
   */
  function Route(pools, input, output) {
    this._midPrice = null;
    !(pools.length > 0) ?  invariant(false, 'POOLS')  : void 0;
    var wrappedInput = input.wrapped;
    !pools[0].involvesToken(wrappedInput) ?  invariant(false, 'INPUT')  : void 0;
    !pools[pools.length - 1].involvesToken(output.wrapped) ?  invariant(false, 'OUTPUT')  : void 0;
    /**
     * Normalizes token0-token1 order and selects the next token/fee step to add to the path
     * */
    var tokenPath = [wrappedInput];
    for (var _iterator = _createForOfIteratorHelperLoose(pools.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
        i = _step$value[0],
        pool = _step$value[1];
      var currentInputToken = tokenPath[i];
      !(currentInputToken.equals(pool.token0) || currentInputToken.equals(pool.token1)) ?  invariant(false, 'PATH')  : void 0;
      var nextToken = currentInputToken.equals(pool.token0) ? pool.token1 : pool.token0;
      tokenPath.push(nextToken);
    }
    this.pools = pools;
    this.tokenPath = tokenPath;
    this.input = input;
    this.output = output != null ? output : tokenPath[tokenPath.length - 1];
  }
  /**
   * Returns the mid price of the route
   */
  _createClass(Route, [{
    key: "midPrice",
    get: function get() {
      if (this._midPrice !== null) return this._midPrice;
      var price = this.pools.slice(1).reduce(function (_ref, pool) {
        var nextInput = _ref.nextInput,
          price = _ref.price;
        return nextInput.equals(pool.token0) ? {
          nextInput: pool.token1,
          price: price.multiply(pool.token0Price)
        } : {
          nextInput: pool.token0,
          price: price.multiply(pool.token1Price)
        };
      }, this.pools[0].token0.equals(this.input.wrapped) ? {
        nextInput: this.pools[0].token1,
        price: this.pools[0].token0Price
      } : {
        nextInput: this.pools[0].token0,
        price: this.pools[0].token1Price
      }).price;
      return this._midPrice = new Price(this.input, this.output, price.denominator, price.numerator);
    }
  }]);
  return Route;
}();

/**
 * Trades comparator, an extension of the input output comparator that also considers other dimensions of the trade in ranking them
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 * @param a The first trade to compare
 * @param b The second trade to compare
 * @returns A sorted ordering for two neighboring elements in a trade array
 */
function tradeComparator(a, b) {
  // must have same input and output token for comparison
  !a.inputAmount.currency.equals(b.inputAmount.currency) ?  invariant(false, 'INPUT_CURRENCY')  : void 0;
  !a.outputAmount.currency.equals(b.outputAmount.currency) ?  invariant(false, 'OUTPUT_CURRENCY')  : void 0;
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      // consider the number of hops since each hop costs gas
      var aHops = a.swaps.reduce(function (total, cur) {
        return total + cur.route.tokenPath.length;
      }, 0);
      var bHops = b.swaps.reduce(function (total, cur) {
        return total + cur.route.tokenPath.length;
      }, 0);
      return aHops - bHops;
    }
    // trade A requires less input than trade B, so A should come first
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
}
/**
 * Represents a trade executed against a set of routes where some percentage of the input is
 * split across each route.
 *
 * Each route has its own set of pools. Pools can not be re-used across routes.
 *
 * Does not account for slippage, i.e., changes in price environment that can occur between
 * the time the trade is submitted and when it is executed.
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 */
var Trade = /*#__PURE__*/function () {
  /**
   * Construct a trade by passing in the pre-computed property values
   * @param routes The routes through which the trade occurs
   * @param tradeType The type of trade, exact input or exact output
   */
  function Trade(_ref) {
    var routes = _ref.routes,
      tradeType = _ref.tradeType;
    var inputCurrency = routes[0].inputAmount.currency;
    var outputCurrency = routes[0].outputAmount.currency;
    !routes.every(function (_ref2) {
      var route = _ref2.route;
      return inputCurrency.wrapped.equals(route.input.wrapped);
    }) ?  invariant(false, 'INPUT_CURRENCY_MATCH')  : void 0;
    !routes.every(function (_ref3) {
      var route = _ref3.route;
      return outputCurrency.wrapped.equals(route.output.wrapped);
    }) ?  invariant(false, 'OUTPUT_CURRENCY_MATCH')  : void 0;
    this.swaps = routes;
    this.tradeType = tradeType;
  }
  /**
   * @deprecated Deprecated in favor of 'swaps' property. If the trade consists of multiple routes
   * this will return an error.
   *
   * When the trade consists of just a single route, this returns the route of the trade,
   * i.e. which pools the trade goes through.
   */
  /**
   * Constructs an exact in trade with the given amount in and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact in trade
   * @param amountIn The amount being passed in
   * @returns The exact in trade
   */
  Trade.exactIn =
  /*#__PURE__*/
  function () {
    var _exactIn = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(route, amountIn) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Trade.fromRoute(route, amountIn, sdkCore.TradeType.EXACT_INPUT));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function exactIn(_x, _x2) {
      return _exactIn.apply(this, arguments);
    }
    return exactIn;
  }()
  /**
   * Constructs an exact out trade with the given amount out and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact out trade
   * @param amountOut The amount returned by the trade
   * @returns The exact out trade
   */
  ;
  Trade.exactOut =
  /*#__PURE__*/
  function () {
    var _exactOut = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(route, amountOut) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", Trade.fromRoute(route, amountOut, sdkCore.TradeType.EXACT_OUTPUT));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function exactOut(_x3, _x4) {
      return _exactOut.apply(this, arguments);
    }
    return exactOut;
  }()
  /**
   * Constructs a trade by simulating swaps through the given route
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param route route to swap through
   * @param amount the amount specified, either input or output, depending on tradeType
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The route
   */
  ;
  Trade.fromRoute =
  /*#__PURE__*/
  function () {
    var _fromRoute = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(route, amount, tradeType) {
      var amounts, inputAmount, outputAmount, i, pool, _yield$pool$getOutput, _outputAmount, _i, _pool, _yield$_pool$getInput, _inputAmount;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            amounts = new Array(route.tokenPath.length);
            if (!(tradeType === sdkCore.TradeType.EXACT_INPUT)) {
              _context3.next = 19;
              break;
            }
            !amount.currency.equals(route.input) ?  invariant(false, 'INPUT')  : void 0;
            amounts[0] = amount.wrapped;
            i = 0;
          case 5:
            if (!(i < route.tokenPath.length - 1)) {
              _context3.next = 15;
              break;
            }
            pool = route.pools[i];
            _context3.next = 9;
            return pool.getOutputAmount(amounts[i]);
          case 9:
            _yield$pool$getOutput = _context3.sent;
            _outputAmount = _yield$pool$getOutput[0];
            amounts[i + 1] = _outputAmount;
          case 12:
            i++;
            _context3.next = 5;
            break;
          case 15:
            inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
            outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amounts[amounts.length - 1].numerator, amounts[amounts.length - 1].denominator);
            _context3.next = 34;
            break;
          case 19:
            !amount.currency.equals(route.output) ?  invariant(false, 'OUTPUT')  : void 0;
            amounts[amounts.length - 1] = amount.wrapped;
            _i = route.tokenPath.length - 1;
          case 22:
            if (!(_i > 0)) {
              _context3.next = 32;
              break;
            }
            _pool = route.pools[_i - 1];
            _context3.next = 26;
            return _pool.getInputAmount(amounts[_i]);
          case 26:
            _yield$_pool$getInput = _context3.sent;
            _inputAmount = _yield$_pool$getInput[0];
            amounts[_i - 1] = _inputAmount;
          case 29:
            _i--;
            _context3.next = 22;
            break;
          case 32:
            inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);
            outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
          case 34:
            return _context3.abrupt("return", new Trade({
              routes: [{
                inputAmount: inputAmount,
                outputAmount: outputAmount,
                route: route
              }],
              tradeType: tradeType
            }));
          case 35:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    function fromRoute(_x5, _x6, _x7) {
      return _fromRoute.apply(this, arguments);
    }
    return fromRoute;
  }()
  /**
   * Constructs a trade from routes by simulating swaps
   *
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param routes the routes to swap through and how much of the amount should be routed through each
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The trade
   */
  ;
  Trade.fromRoutes =
  /*#__PURE__*/
  function () {
    var _fromRoutes = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(routes, tradeType) {
      var populatedRoutes, _iterator, _step, _step$value, route, amount, amounts, inputAmount, outputAmount, i, pool, _yield$pool$getOutput2, _outputAmount2, _i2, _pool2, _yield$_pool2$getInpu, _inputAmount2;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            populatedRoutes = [];
            _iterator = _createForOfIteratorHelperLoose(routes);
          case 2:
            if ((_step = _iterator()).done) {
              _context4.next = 43;
              break;
            }
            _step$value = _step.value, route = _step$value.route, amount = _step$value.amount;
            amounts = new Array(route.tokenPath.length);
            inputAmount = void 0;
            outputAmount = void 0;
            if (!(tradeType === sdkCore.TradeType.EXACT_INPUT)) {
              _context4.next = 25;
              break;
            }
            !amount.currency.equals(route.input) ?  invariant(false, 'INPUT')  : void 0;
            inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
            amounts[0] = CurrencyAmount.fromFractionalAmount(route.input.wrapped, amount.numerator, amount.denominator);
            i = 0;
          case 12:
            if (!(i < route.tokenPath.length - 1)) {
              _context4.next = 22;
              break;
            }
            pool = route.pools[i];
            _context4.next = 16;
            return pool.getOutputAmount(amounts[i]);
          case 16:
            _yield$pool$getOutput2 = _context4.sent;
            _outputAmount2 = _yield$pool$getOutput2[0];
            amounts[i + 1] = _outputAmount2;
          case 19:
            i++;
            _context4.next = 12;
            break;
          case 22:
            outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amounts[amounts.length - 1].numerator, amounts[amounts.length - 1].denominator);
            _context4.next = 40;
            break;
          case 25:
            !amount.currency.equals(route.output) ?  invariant(false, 'OUTPUT')  : void 0;
            outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
            amounts[amounts.length - 1] = CurrencyAmount.fromFractionalAmount(route.output.wrapped, amount.numerator, amount.denominator);
            _i2 = route.tokenPath.length - 1;
          case 29:
            if (!(_i2 > 0)) {
              _context4.next = 39;
              break;
            }
            _pool2 = route.pools[_i2 - 1];
            _context4.next = 33;
            return _pool2.getInputAmount(amounts[_i2]);
          case 33:
            _yield$_pool2$getInpu = _context4.sent;
            _inputAmount2 = _yield$_pool2$getInpu[0];
            amounts[_i2 - 1] = _inputAmount2;
          case 36:
            _i2--;
            _context4.next = 29;
            break;
          case 39:
            inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);
          case 40:
            populatedRoutes.push({
              route: route,
              inputAmount: inputAmount,
              outputAmount: outputAmount
            });
          case 41:
            _context4.next = 2;
            break;
          case 43:
            return _context4.abrupt("return", new Trade({
              routes: populatedRoutes,
              tradeType: tradeType
            }));
          case 44:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    function fromRoutes(_x8, _x9) {
      return _fromRoutes.apply(this, arguments);
    }
    return fromRoutes;
  }()
  /**
   * Creates a trade without computing the result of swapping through the route. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  ;
  Trade.createUncheckedTrade = function createUncheckedTrade(constructorArguments) {
    return new Trade(_extends({}, constructorArguments, {
      routes: [{
        inputAmount: constructorArguments.inputAmount,
        outputAmount: constructorArguments.outputAmount,
        route: constructorArguments.route
      }]
    }));
  };
  Trade.createUncheckedTradeWithSimpleTrade = function createUncheckedTradeWithSimpleTrade(simpleTradeInfo) {
    return Trade.createUncheckedTrade({
      route: new Route([simpleTradeInfo.pool], simpleTradeInfo.tokenIn, simpleTradeInfo.tokenOut),
      inputAmount: CurrencyAmount.fromRawAmount(simpleTradeInfo.tokenIn, simpleTradeInfo.amountIn),
      outputAmount: CurrencyAmount.fromRawAmount(simpleTradeInfo.tokenOut, simpleTradeInfo.amountOut),
      tradeType: simpleTradeInfo.swapType
    });
  };
  Trade.createUncheckedTradeWithSimpleTrades = function createUncheckedTradeWithSimpleTrades(simpleTradeInfos) {
    return Trade.createUncheckedTrade({
      route: new Route(simpleTradeInfos.map(function (s) {
        return s.pool;
      }), simpleTradeInfos[0].tokenIn, simpleTradeInfos[simpleTradeInfos.length - 1].tokenOut),
      inputAmount: CurrencyAmount.fromRawAmount(simpleTradeInfos[0].tokenIn, simpleTradeInfos[0].amountIn),
      outputAmount: CurrencyAmount.fromRawAmount(simpleTradeInfos[simpleTradeInfos.length - 1].tokenOut, simpleTradeInfos[simpleTradeInfos.length - 1].amountOut),
      tradeType: simpleTradeInfos[0].swapType
    });
  }
  /**
   * Creates a trade without computing the result of swapping through the routes. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */;
  Trade.createUncheckedTradeWithMultipleRoutes = function createUncheckedTradeWithMultipleRoutes(constructorArguments) {
    return new Trade(constructorArguments);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount out
   */;
  var _proto = Trade.prototype;
  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance, amountOut) {
    if (amountOut === void 0) {
      amountOut = this.outputAmount;
    }
    //invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
    if (this.tradeType === sdkCore.TradeType.EXACT_OUTPUT) {
      return amountOut;
    } else {
      var slippageAdjustedAmountOut = new sdkCore.Fraction(ONE).add(slippageTolerance).invert().multiply(amountOut.quotient).quotient;
      return CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount in
   */;
  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance, amountIn) {
    if (amountIn === void 0) {
      amountIn = this.inputAmount;
    }
    console.log('maximumAmountIn', this.tradeType, sdkCore.TradeType.EXACT_INPUT);
    //invariant(!slippageTolerance.lessThan(new Fraction(ZERO)), 'SLIPPAGE_TOLERANCE')
    if (this.tradeType === sdkCore.TradeType.EXACT_INPUT) {
      return amountIn;
    } else {
      var slippageAdjustedAmountIn = new sdkCore.Fraction(ONE).add(slippageTolerance).multiply(amountIn.quotient).quotient;
      return CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
    }
  }
  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   * @returns The execution price
   */;
  _proto.worstExecutionPrice = function worstExecutionPrice(slippageTolerance) {
    return new Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
  }
  /**
   * Given a list of pools, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact in trade
   */;
  Trade.bestTradeExactIn =
  /*#__PURE__*/
  function () {
    var _bestTradeExactIn = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(pools, currencyAmountIn, currencyOut, _temp,
    // used in recursion.
    currentPools, nextAmountIn, bestTrades) {
      var _ref4, _ref4$maxNumResults, maxNumResults, _ref4$maxHops, maxHops, amountIn, i, pool, amountOut, _yield$pool$getOutput3, poolsExcludingThisPool;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _ref4 = _temp === void 0 ? {} : _temp, _ref4$maxNumResults = _ref4.maxNumResults, maxNumResults = _ref4$maxNumResults === void 0 ? 3 : _ref4$maxNumResults, _ref4$maxHops = _ref4.maxHops, maxHops = _ref4$maxHops === void 0 ? 3 : _ref4$maxHops;
            if (currentPools === void 0) {
              currentPools = [];
            }
            if (nextAmountIn === void 0) {
              nextAmountIn = currencyAmountIn;
            }
            if (bestTrades === void 0) {
              bestTrades = [];
            }
            !(pools.length > 0) ?  invariant(false, 'POOLS')  : void 0;
            !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
            !(currencyAmountIn === nextAmountIn || currentPools.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
            amountIn = nextAmountIn.wrapped;
            i = 0;
          case 9:
            if (!(i < pools.length)) {
              _context5.next = 34;
              break;
            }
            pool = pools[i]; // pool irrelevant
            if (!(!pool.token0.equals(amountIn.currency) && !pool.token1.equals(amountIn.currency))) {
              _context5.next = 13;
              break;
            }
            return _context5.abrupt("continue", 31);
          case 13:
            amountOut = void 0;
            _context5.prev = 14;
            _context5.next = 18;
            return pool.getOutputAmount(amountIn);
          case 18:
            _yield$pool$getOutput3 = _context5.sent;
            amountOut = _yield$pool$getOutput3[0];
            _context5.next = 27;
            break;
          case 22:
            _context5.prev = 22;
            _context5.t0 = _context5["catch"](14);
            if (!_context5.t0.isInsufficientInputAmountError) {
              _context5.next = 26;
              break;
            }
            return _context5.abrupt("continue", 31);
          case 26:
            throw _context5.t0;
          case 27:
            if (!(maxHops > 1 && pools.length > 1)) {
              _context5.next = 31;
              break;
            }
            poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
            _context5.next = 31;
            return Trade.bestTradeExactIn(poolsExcludingThisPool, currencyAmountIn, currencyOut, {
              maxNumResults: maxNumResults,
              maxHops: maxHops - 1
            }, [].concat(currentPools, [pool]), amountOut, bestTrades);
          case 31:
            i++;
            _context5.next = 9;
            break;
          case 34:
            return _context5.abrupt("return", bestTrades);
          case 35:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[14, 22]]);
    }));
    function bestTradeExactIn(_x10, _x11, _x12, _x13, _x14, _x15, _x16) {
      return _bestTradeExactIn.apply(this, arguments);
    }
    return bestTradeExactIn;
  }()
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pools, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the desired currency amount out
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact out trade
   */
  ;
  Trade.bestTradeExactOut =
  /*#__PURE__*/
  function () {
    var _bestTradeExactOut = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(pools, currencyIn, currencyAmountOut, _temp2,
    // used in recursion.
    currentPools, nextAmountOut, bestTrades) {
      var _ref5, _ref5$maxNumResults, maxNumResults, _ref5$maxHops, maxHops, amountOut, tokenIn, i, pool, amountIn, _yield$pool$getInputA, poolsExcludingThisPool;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _ref5 = _temp2 === void 0 ? {} : _temp2, _ref5$maxNumResults = _ref5.maxNumResults, maxNumResults = _ref5$maxNumResults === void 0 ? 3 : _ref5$maxNumResults, _ref5$maxHops = _ref5.maxHops, maxHops = _ref5$maxHops === void 0 ? 3 : _ref5$maxHops;
            if (currentPools === void 0) {
              currentPools = [];
            }
            if (nextAmountOut === void 0) {
              nextAmountOut = currencyAmountOut;
            }
            if (bestTrades === void 0) {
              bestTrades = [];
            }
            !(pools.length > 0) ?  invariant(false, 'POOLS')  : void 0;
            !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
            !(currencyAmountOut === nextAmountOut || currentPools.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
            amountOut = nextAmountOut.wrapped;
            tokenIn = currencyIn.wrapped;
            i = 0;
          case 10:
            if (!(i < pools.length)) {
              _context6.next = 46;
              break;
            }
            pool = pools[i]; // pool irrelevant
            if (!(!pool.token0.equals(amountOut.currency) && !pool.token1.equals(amountOut.currency))) {
              _context6.next = 14;
              break;
            }
            return _context6.abrupt("continue", 43);
          case 14:
            amountIn = void 0;
            _context6.prev = 15;
            _context6.next = 19;
            return pool.getInputAmount(amountOut);
          case 19:
            _yield$pool$getInputA = _context6.sent;
            amountIn = _yield$pool$getInputA[0];
            _context6.next = 28;
            break;
          case 23:
            _context6.prev = 23;
            _context6.t0 = _context6["catch"](15);
            if (!_context6.t0.isInsufficientReservesError) {
              _context6.next = 27;
              break;
            }
            return _context6.abrupt("continue", 43);
          case 27:
            throw _context6.t0;
          case 28:
            if (!amountIn.currency.equals(tokenIn)) {
              _context6.next = 39;
              break;
            }
            _context6.t1 = sdkCore.sortedInsert;
            _context6.t2 = bestTrades;
            _context6.next = 33;
            return Trade.fromRoute(new Route([pool].concat(currentPools), currencyIn, currencyAmountOut.currency), currencyAmountOut, sdkCore.TradeType.EXACT_OUTPUT);
          case 33:
            _context6.t3 = _context6.sent;
            _context6.t4 = maxNumResults;
            _context6.t5 = tradeComparator;
            (0, _context6.t1)(_context6.t2, _context6.t3, _context6.t4, _context6.t5);
            _context6.next = 43;
            break;
          case 39:
            if (!(maxHops > 1 && pools.length > 1)) {
              _context6.next = 43;
              break;
            }
            poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
            _context6.next = 43;
            return Trade.bestTradeExactOut(poolsExcludingThisPool, currencyIn, currencyAmountOut, {
              maxNumResults: maxNumResults,
              maxHops: maxHops - 1
            }, [pool].concat(currentPools), amountIn, bestTrades);
          case 43:
            i++;
            _context6.next = 10;
            break;
          case 46:
            return _context6.abrupt("return", bestTrades);
          case 47:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[15, 23]]);
    }));
    function bestTradeExactOut(_x17, _x18, _x19, _x20, _x21, _x22, _x23) {
      return _bestTradeExactOut.apply(this, arguments);
    }
    return bestTradeExactOut;
  }();
  _createClass(Trade, [{
    key: "route",
    get: function get() {
      !(this.swaps.length == 1) ?  invariant(false, 'MULTIPLE_ROUTES')  : void 0;
      return this.swaps[0].route;
    }
    /**
     * The input amount for the trade assuming no slippage.
     */
  }, {
    key: "inputAmount",
    get: function get() {
      if (this._inputAmount) {
        return this._inputAmount;
      }
      var inputCurrency = this.swaps[0].inputAmount.currency;
      var totalInputFromRoutes = this.swaps.map(function (_ref6) {
        var inputAmount = _ref6.inputAmount;
        return inputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, CurrencyAmount.fromRawAmount(inputCurrency, 0));
      this._inputAmount = totalInputFromRoutes;
      return this._inputAmount;
    }
    /**
     * The output amount for the trade assuming no slippage.
     */
  }, {
    key: "outputAmount",
    get: function get() {
      if (this._outputAmount) {
        return this._outputAmount;
      }
      var outputCurrency = this.swaps[0].outputAmount.currency;
      var totalOutputFromRoutes = this.swaps.map(function (_ref7) {
        var outputAmount = _ref7.outputAmount;
        return outputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, CurrencyAmount.fromRawAmount(outputCurrency, 0));
      this._outputAmount = totalOutputFromRoutes;
      return this._outputAmount;
    }
    /**
     * The price expressed in terms of output amount/input amount.
     */
  }, {
    key: "executionPrice",
    get: function get() {
      var _this$_executionPrice;
      return (_this$_executionPrice = this._executionPrice) != null ? _this$_executionPrice : this._executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
    }
    /**
     * Returns the percent difference between the route's mid price and the price impact
     */
  }, {
    key: "priceImpact",
    get: function get() {
      if (this._priceImpact) {
        return this._priceImpact;
      }
      var spotOutputAmount = CurrencyAmount.fromRawAmount(this.outputAmount.currency, 0);
      for (var _iterator2 = _createForOfIteratorHelperLoose(this.swaps), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
          route = _step2$value.route,
          inputAmount = _step2$value.inputAmount;
        var midPrice = route.midPrice;
        spotOutputAmount = spotOutputAmount.add(midPrice.quote(inputAmount));
      }
      var priceImpact = spotOutputAmount.subtract(this.outputAmount).divide(spotOutputAmount);
      this._priceImpact = new sdkCore.Percent(priceImpact.numerator, priceImpact.denominator);
      return this._priceImpact;
    }
  }]);
  return Trade;
}();

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
var SuiCoin = /*#__PURE__*/function () {
  /**
   *
   * @param address The contract address on the chain on which this token lives
   * @param decimals {@link BaseCurrency#decimals}
   * @param symbol {@link BaseCurrency#symbol}
   * @param name {@link BaseCurrency#name}
   */
  function SuiCoin(address, decimals, symbol, name) {
    this.address = address.replace(' ', '');
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  var _proto = SuiCoin.prototype;
  _proto.equals = function equals(other) {
    return this.address === other.address;
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */;
  _proto.sortsBefore = function sortsBefore(other) {
    !(this.address !== other.address) ?  invariant(false, 'ADDRESSES')  : void 0;
    if (this.address.length < other.address.length) {
      return true;
    } else if (this.address.length > other.address.length) {
      return false;
    }
    return this.address < other.address;
  }
  /**
   * Return this token, which does not need to be wrapped
   */;
  _createClass(SuiCoin, [{
    key: "wrapped",
    get: function get() {
      return this;
    }
  }]);
  return SuiCoin;
}();

/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
var StateFetcher = /*#__PURE__*/function () {
  function StateFetcher() {}
  StateFetcher.getPoolResourceType = function getPoolResourceType(moduleAddress, token0Address, token1Address, feeAmount) {
    return moduleAddress + "::pool::Pool<" + token0Address + ", " + token1Address + ", " + moduleAddress + getFeeType(feeAmount) + ">";
  }
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */;
  StateFetcher.fetchPool =
  /*#__PURE__*/
  function () {
    var _fetchPool = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(token0Address, token1Address, feeAmount, packageId, suiRPC) {
      var provider, newPoolEventQualifiedName, _yield$Promise$all, coin0, coin1, newPoolEvents, newPoolEvent, poolObjectId, poolObject, poolFields, pool, poolState;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            provider = new sui_js.JsonRpcProvider(suiRPC);
            newPoolEventQualifiedName = packageId + "::pool::NewPoolEvent<" + token0Address + ", " + token1Address + ", " + packageId + getFeeType(feeAmount) + ">";
            _context.t0 = Promise;
            _context.next = 5;
            return StateFetcher.fetchCoinInfo(token0Address, suiRPC);
          case 5:
            _context.t1 = _context.sent;
            _context.next = 8;
            return StateFetcher.fetchCoinInfo(token1Address, suiRPC);
          case 8:
            _context.t2 = _context.sent;
            _context.next = 11;
            return provider.getEvents({
              MoveEvent: newPoolEventQualifiedName
            }, null, 1);
          case 11:
            _context.t3 = _context.sent;
            _context.t4 = [_context.t1, _context.t2, _context.t3];
            _context.next = 15;
            return _context.t0.all.call(_context.t0, _context.t4);
          case 15:
            _yield$Promise$all = _context.sent;
            coin0 = _yield$Promise$all[0];
            coin1 = _yield$Promise$all[1];
            newPoolEvents = _yield$Promise$all[2];
            if (!(!newPoolEvents || !newPoolEvents.data || newPoolEvents.data.length == 0)) {
              _context.next = 21;
              break;
            }
            throw new Error('pool not exist');
          case 21:
            newPoolEvent = newPoolEvents.data[0].event;
            poolObjectId = newPoolEvent.moveEvent.fields.pool_address;
            _context.next = 25;
            return provider.getObject(poolObjectId);
          case 25:
            poolObject = _context.sent;
            poolFields = poolObject.details.data.fields;
            pool = new Pool(coin0, coin1, feeAmount, poolFields.slot0.fields.sqrt_price_x96, poolFields.liquidity, i64ToNumber(poolFields.slot0.fields.tick.fields), [], poolObjectId);
            poolState = {
              reserve0: poolFields.reserve_0,
              reserve1: poolFields.reserve_1,
              fee: parseInt(poolFields.fee),
              tickSpacing: i64ToNumber(poolFields.tick_spacing.fields),
              maxLiquidityPerTick: poolFields.max_liquidity_per_tick,
              feeGrowthGlobal0X128: poolFields.fee_growth_global0_X128,
              feeGrowthGlobal1X128: poolFields.fee_growth_global1_X128,
              protocolFees: {
                token0: poolFields.protocol_fees.fields.token0,
                token1: poolFields.protocol_fees.fields.token1
              },
              liquidity: poolFields.liquidity,
              slot0: {
                sqrtPriceX96: JSBI.BigInt(poolFields.slot0.fields.sqrt_price_x96),
                tick: i64ToNumber(poolFields.slot0.fields.tick.fields),
                observationIndex: poolFields.slot0.fields.observation_index,
                observationCardinality: poolFields.slot0.fields.observation_cardinality,
                observationCardinalityNext: poolFields.slot0.fields.observation_cardinality_next,
                feeProtocol: poolFields.slot0.fields.fee_protocol,
                unlocked: poolFields.slot0.fields.unlocked
              },
              poolAddress: poolObjectId,
              tickHandle: poolFields.ticks.fields.id.id,
              tickBitmapHandle: poolFields.tick_bitmap.fields.id.id,
              positionHandle: poolFields.positions.fields.id.id,
              observationHandle: poolFields.observations.fields.id.id,
              initializedTicks: poolFields.initialized_ticks.map(function (e) {
                return e.fields;
              }).map(function (e) {
                return i64ToNumber(e);
              })
            };
            return _context.abrupt("return", {
              pool: pool,
              poolState: poolState
            });
          case 30:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function fetchPool(_x, _x2, _x3, _x4, _x5) {
      return _fetchPool.apply(this, arguments);
    }
    return fetchPool;
  }();
  StateFetcher.fetchCoinInfo = /*#__PURE__*/function () {
    var _fetchCoinInfo = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(coinType, suiRPC) {
      var ct, provider, coinMetadata;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            ct = coinType;
            if (ct.startsWith('coin::Coin<')) {
              ct = ct.substring('coin::Coin<'.length, ct.length - 1);
            }
            ct = ct.replace(' ', '');
            provider = new sui_js.JsonRpcProvider(suiRPC);
            _context2.next = 6;
            return provider.getCoinMetadata(ct);
          case 6:
            coinMetadata = _context2.sent;
            return _context2.abrupt("return", new SuiCoin(ct, coinMetadata.decimals, coinMetadata.symbol, coinMetadata.name));
          case 8:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function fetchCoinInfo(_x6, _x7) {
      return _fetchCoinInfo.apply(this, arguments);
    }
    return fetchCoinInfo;
  }();
  StateFetcher.fetchPoolLiquidity = /*#__PURE__*/function () {
    var _fetchPoolLiquidity = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(token0Address, token1Address, feeAmount, packageId, suiRPC) {
      var provider, newPoolEventQualifiedName, newPoolEvents, newPoolEvent, poolObjectId, poolObject, poolFields;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            provider = new sui_js.JsonRpcProvider(suiRPC);
            newPoolEventQualifiedName = packageId + "::pool::NewPoolEvent<" + token0Address + ", " + token1Address + ", " + packageId + getFeeType(feeAmount) + ">";
            _context3.next = 4;
            return provider.getEvents({
              MoveEvent: newPoolEventQualifiedName
            }, null, 1);
          case 4:
            newPoolEvents = _context3.sent;
            if (!(!newPoolEvents || !newPoolEvents.data || newPoolEvents.data.length == 0)) {
              _context3.next = 7;
              break;
            }
            throw new Error('pool not exist');
          case 7:
            newPoolEvent = newPoolEvents.data[0].event;
            poolObjectId = newPoolEvent.moveEvent.fields.pool_address;
            _context3.next = 11;
            return provider.getObject(poolObjectId);
          case 11:
            poolObject = _context3.sent;
            poolFields = poolObject.details.data.fields;
            return _context3.abrupt("return", poolFields.liquidity);
          case 14:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    function fetchPoolLiquidity(_x8, _x9, _x10, _x11, _x12) {
      return _fetchPoolLiquidity.apply(this, arguments);
    }
    return fetchPoolLiquidity;
  }();
  StateFetcher.fetchSimplePoolInfo = /*#__PURE__*/function () {
    var _fetchSimplePoolInfo = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(poolObjectId, suiRPC) {
      var provider, poolObject, poolFields;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            provider = new sui_js.JsonRpcProvider(suiRPC);
            _context4.next = 3;
            return provider.getObject(poolObjectId);
          case 3:
            poolObject = _context4.sent;
            poolFields = poolObject.details.data.fields;
            return _context4.abrupt("return", {
              liquidity: poolFields.liquidity,
              reserve0: poolFields.reserve_0,
              reserve1: poolFields.reserve_1
            });
          case 6:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    function fetchSimplePoolInfo(_x13, _x14) {
      return _fetchSimplePoolInfo.apply(this, arguments);
    }
    return fetchSimplePoolInfo;
  }();
  StateFetcher.fetchNFTPosition = /*#__PURE__*/function () {
    var _fetchNFTPosition = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(objectId, suiRPC) {
      var provider, resourcePosition, parsed, fields;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            provider = new sui_js.JsonRpcProvider(suiRPC);
            _context5.next = 3;
            return provider.getObject(objectId);
          case 3:
            resourcePosition = _context5.sent;
            if (!(!resourcePosition || resourcePosition.status !== "Exists")) {
              _context5.next = 6;
              break;
            }
            throw new Error('no position associated');
          case 6:
            parsed = parseTypeFromStr(resourcePosition.details.data.type);
            fields = resourcePosition.details.data.fields;
            console.log(fields);
            return _context5.abrupt("return", {
              token0: structTagToString(parsed.struct.typeParams[0]),
              token1: structTagToString(parsed.struct.typeParams[1]),
              fee: feeTypeToFeeAmount(structTagToString(parsed.struct.typeParams[2])),
              id: objectId,
              tickLower: i64ToNumber(fields.tick_lower.fields),
              tickUpper: i64ToNumber(fields.tick_upper.fields),
              liquidity: fields.liquidity,
              feeGrowthInside0LastX128: JSBI.BigInt(fields.fee_growth_inside0_last_X128),
              feeGrowthInside1LastX128: JSBI.BigInt(fields.fee_growth_inside1_last_X128),
              tokensOwned0: fields.tokens_owed0,
              tokensOwned1: fields.tokens_owed1
            });
          case 10:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    function fetchNFTPosition(_x15, _x16) {
      return _fetchNFTPosition.apply(this, arguments);
    }
    return fetchNFTPosition;
  }();
  StateFetcher.fetchNFTPositions = /*#__PURE__*/function () {
    var _fetchNFTPositions = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(owner, packageId, suiRPC) {
      var provider, ownedInfoObjects, objectIds, fetchPositionTrial, positions;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            provider = new sui_js.JsonRpcProvider(suiRPC);
            _context8.next = 3;
            return provider.getObjectsOwnedByAddress(owner);
          case 3:
            ownedInfoObjects = _context8.sent;
            if (!(!ownedInfoObjects || ownedInfoObjects.length == 0)) {
              _context8.next = 6;
              break;
            }
            return _context8.abrupt("return", []);
          case 6:
            ownedInfoObjects = ownedInfoObjects.filter(function (e) {
              return e.type.startsWith(packageId + "::router::LiquidityPosition<");
            });
            objectIds = ownedInfoObjects.map(function (e) {
              return e.objectId;
            });
            fetchPositionTrial = /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(objectId) {
                var nftLiquidityPosition;
                return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                  while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                      nftLiquidityPosition = tryCallWithTrial( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
                        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                          while (1) switch (_context6.prev = _context6.next) {
                            case 0:
                              return _context6.abrupt("return", StateFetcher.fetchNFTPosition(objectId, suiRPC));
                            case 1:
                            case "end":
                              return _context6.stop();
                          }
                        }, _callee6);
                      })));
                      if (!(nftLiquidityPosition == undefined)) {
                        _context7.next = 3;
                        break;
                      }
                      throw new Error("cant read position " + objectId);
                    case 3:
                      return _context7.abrupt("return", nftLiquidityPosition);
                    case 4:
                    case "end":
                      return _context7.stop();
                  }
                }, _callee7);
              }));
              return function fetchPositionTrial(_x20) {
                return _ref.apply(this, arguments);
              };
            }();
            _context8.next = 11;
            return Promise.all(objectIds.map(function (e) {
              return fetchPositionTrial(e);
            }));
          case 11:
            positions = _context8.sent;
            return _context8.abrupt("return", positions);
          case 13:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    function fetchNFTPositions(_x17, _x18, _x19) {
      return _fetchNFTPositions.apply(this, arguments);
    }
    return fetchNFTPositions;
  }() // public static async fetchPackageConfig(packageId: string, suiRPC: string): Promise<SuiCoin> {
  //   let ct = coinType
  //   if (ct.startsWith('coin::Coin<')) {
  //     ct = ct.substring('coin::Coin<'.length, ct.length - 1)
  //   }
  //   ct = ct.replace(' ', '')
  //   const provider = new JsonRpcProvider(suiRPC)
  //   const currencyCreatedEvents = await provider.getEvents({
  //     MoveEvent: `0x2::coin::CurrencyCreated<${ct}>`
  //   }, null, null)
  //   if (!currencyCreatedEvents || currencyCreatedEvents.data.length == 0) {
  //     throw new Error("invalid coin type")
  //   }
  //   const currencyCreatedEvent = currencyCreatedEvents.data[0].event as any
  //   const splits = ct.split('::')
  //   const name = splits[splits.length - 1]
  //   const symbol = name
  //   const decimals = currencyCreatedEvent.moveEvent.fields.decimals
  //   return new SuiCoin(ct, decimals, symbol, name)
  // }
  ;
  StateFetcher.sortTicks = function sortTicks(tickStates) {
    return tickStates.sort(function (a, b) {
      return a.index - b.index;
    });
  };
  StateFetcher.sortSimpleTicks = function sortSimpleTicks(tickStates) {
    return tickStates.sort(function (a, b) {
      return a.index - b.index;
    });
  };
  StateFetcher.toTicks = function toTicks(tickStates) {
    return tickStates.map(function (t) {
      return new Tick({
        index: t.index,
        liquidityGross: t.liquidityGross,
        liquidityNet: t.liquidityNet
      });
    });
  };
  StateFetcher.simpleStatetoTicks = function simpleStatetoTicks(tickStates) {
    return tickStates.map(function (t) {
      return new Tick({
        index: t.index,
        liquidityGross: JSBI.BigInt(t.liquidityGross),
        liquidityNet: JSBI.BigInt(t.liquidityNet)
      });
    });
  };
  return StateFetcher;
}();

var PositionManager = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function PositionManager(moduleId, poolConfig, poolIdsList, sharedPositionOwnership) {
    this.moduleAddress = moduleId;
    this.poolConfig = poolConfig;
    this.poolIdsList = poolIdsList;
    this.sharedPositionOwnership = sharedPositionOwnership;
  }
  var _proto = PositionManager.prototype;
  _proto.getModuleAddress = function getModuleAddress() {
    return this.moduleAddress;
  };
  _proto.makeCreatePoolTxWithAmounts = /*#__PURE__*/function () {
    var _makeCreatePoolTxWithAmounts = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(token0, token1, coin0s, coin1s, amount0, amount1, useFullPrecision, feeAmount, sqrtPricex96, sqrtMinPricex96, sqrtMaxPricex96, deadline, recipient, suiRPC, gasBudget) {
      var coin0Type, coin1Type, position, payload;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return StateFetcher.fetchCoinInfo(token0, suiRPC);
          case 2:
            coin0Type = _context.sent;
            _context.next = 5;
            return StateFetcher.fetchCoinInfo(token1, suiRPC);
          case 5:
            coin1Type = _context.sent;
            position = this.createPosition(coin0Type, coin1Type, amount0, amount1, useFullPrecision, feeAmount, sqrtPricex96, sqrtMinPricex96, sqrtMaxPricex96);
            _context.next = 9;
            return this.makeCreatePoolTx(coin0s, coin1s, position, deadline, recipient, gasBudget);
          case 9:
            payload = _context.sent;
            return _context.abrupt("return", payload);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function makeCreatePoolTxWithAmounts(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11, _x12, _x13, _x14, _x15) {
      return _makeCreatePoolTxWithAmounts.apply(this, arguments);
    }
    return makeCreatePoolTxWithAmounts;
  }();
  _proto.createPosition = function createPosition(coin0, coin1, amount0, amount1, useFullPrecision, feeAmount, sqrtPricex96, sqrtMinPricex96, sqrtMaxPricex96) {
    var tickCurrent = nearestUsableTick(TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtPricex96)), TICK_SPACINGS[feeAmount]);
    var tickLower = nearestUsableTick(TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtMinPricex96)), TICK_SPACINGS[feeAmount]);
    var tickUpper = nearestUsableTick(TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtMaxPricex96)), TICK_SPACINGS[feeAmount]);
    // console.log('tickLower', tickLower, tickUpper)
    var pool = new Pool(coin0, coin1, feeAmount, TickMath.getSqrtRatioAtTick(tickCurrent), '0', tickCurrent);
    var position = Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: amount0,
      amount1: amount1,
      useFullPrecision: useFullPrecision
    });
    return position;
  };
  _proto.makeCreatePoolTx = /*#__PURE__*/function () {
    var _makeCreatePoolTx = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(coin0s, coin1s, position, deadline, recipient, gasBudget) {
      var typeArgs, moveCallTx;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            typeArgs = [position.pool.token0.address, position.pool.token1.address, this.moduleAddress + getFeeType(position.pool.fee)];
            moveCallTx = {
              packageObjectId: this.getModuleAddress(),
              module: 'router',
              "function": 'create_pool',
              typeArguments: typeArgs,
              arguments: [this.poolConfig, this.poolIdsList, this.sharedPositionOwnership, recipient, coin0s, coin1s, position.mintAmounts.amount0.toString(), position.mintAmounts.amount1.toString(), "" + (position.tickLower >= 0 ? position.tickLower : -position.tickLower), position.tickLower >= 0, "" + (position.tickUpper >= 0 ? position.tickUpper : -position.tickUpper), position.tickUpper >= 0, position.pool.sqrtRatioX96.toString(), "" + deadline.toString()],
              gasBudget: gasBudget
            };
            return _context2.abrupt("return", {
              kind: "moveCall",
              data: moveCallTx
            });
          case 3:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function makeCreatePoolTx(_x16, _x17, _x18, _x19, _x20, _x21) {
      return _makeCreatePoolTx.apply(this, arguments);
    }
    return makeCreatePoolTx;
  }();
  _proto.makeMintTx = /*#__PURE__*/function () {
    var _makeMintTx = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(coin0s, coin1s, position, slippageTolerance, recipient, deadline, gasBudget) {
      var _position$pool$object;
      var _position$mintAmounts, amount0Desired, amount1Desired, minimumAmounts, amount0Min, amount1Min, typeArgs, moveCallTx;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            !JSBI.greaterThan(position.liquidity, ZERO) ?  invariant(false, 'ZERO_LIQUIDITY')  : void 0;
            // get amounts
            _position$mintAmounts = position.mintAmounts, amount0Desired = _position$mintAmounts.amount0, amount1Desired = _position$mintAmounts.amount1; // adjust for slippage
            minimumAmounts = position.mintAmountsWithSlippage(new sdkCore.Percent(slippageTolerance.numerator, slippageTolerance.denominator));
            amount0Min = minimumAmounts.amount0.toString();
            amount1Min = minimumAmounts.amount1.toString();
            typeArgs = [position.pool.token0.address, position.pool.token1.address, this.moduleAddress + getFeeType(position.pool.fee)];
            if (position.pool.objectId) {
              _context3.next = 8;
              break;
            }
            throw new Error('invalid pool object id');
          case 8:
            moveCallTx = {
              packageObjectId: this.getModuleAddress(),
              module: 'router',
              "function": 'mint',
              typeArguments: typeArgs,
              arguments: [this.poolConfig, (_position$pool$object = position.pool.objectId) == null ? void 0 : _position$pool$object.toString(), this.sharedPositionOwnership, coin0s, coin1s, "" + (position.tickLower >= 0 ? position.tickLower : -position.tickLower), position.tickLower >= 0, "" + (position.tickUpper >= 0 ? position.tickUpper : -position.tickUpper), position.tickUpper >= 0, amount0Desired.toString(), amount1Desired.toString(), amount0Min, amount1Min, recipient, "" + deadline.toString()],
              gasBudget: gasBudget
            };
            return _context3.abrupt("return", {
              kind: "moveCall",
              data: moveCallTx
            });
          case 10:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    function makeMintTx(_x22, _x23, _x24, _x25, _x26, _x27, _x28) {
      return _makeMintTx.apply(this, arguments);
    }
    return makeMintTx;
  }();
  _proto.makeIncreaseLiquidityTx = /*#__PURE__*/function () {
    var _makeIncreaseLiquidityTx = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(coin0s, coin1s, position, positionObjectId, slippage, deadline, gasBudget) {
      var _position$mintAmounts2, amount0Desired, amount1Desired, minimumAmounts, amount0Min, amount1Min, typeArgs, moveCallTx;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            !JSBI.greaterThan(position.liquidity, ZERO) ?  invariant(false, 'ZERO_LIQUIDITY')  : void 0;
            // get amounts
            _position$mintAmounts2 = position.mintAmounts, amount0Desired = _position$mintAmounts2.amount0, amount1Desired = _position$mintAmounts2.amount1; // adjust for slippage
            minimumAmounts = position.mintAmountsWithSlippage(new sdkCore.Percent(slippage.numerator, slippage.denominator));
            amount0Min = minimumAmounts.amount0.toString();
            amount1Min = minimumAmounts.amount1.toString();
            typeArgs = [position.pool.token0.address, position.pool.token1.address, this.moduleAddress + getFeeType(position.pool.fee)];
            moveCallTx = {
              packageObjectId: this.getModuleAddress(),
              module: 'router',
              "function": 'increase_liquidity',
              typeArguments: typeArgs,
              arguments: [this.poolConfig, (position.pool.objectId ? position.pool.objectId : '0').toString(), this.sharedPositionOwnership, positionObjectId, coin0s, coin1s, amount0Desired.toString(), amount1Desired.toString(), amount0Min, amount1Min, "" + deadline.toString()],
              gasBudget: gasBudget
            };
            return _context4.abrupt("return", {
              kind: "moveCall",
              data: moveCallTx
            });
          case 8:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this);
    }));
    function makeIncreaseLiquidityTx(_x29, _x30, _x31, _x32, _x33, _x34, _x35) {
      return _makeIncreaseLiquidityTx.apply(this, arguments);
    }
    return makeIncreaseLiquidityTx;
  }();
  _proto.makeRemoveLiquidityTx = /*#__PURE__*/function () {
    var _makeRemoveLiquidityTx = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(position, positionObjectId, slippage, deadline, collectCoin, gasBudget) {
      var minimumAmounts, amount0Min, amount1Min, typeArgs, moveCallTx;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            !JSBI.greaterThan(position.liquidity, ZERO) ?  invariant(false, 'ZERO_LIQUIDITY')  : void 0;
            // adjust for slippage
            minimumAmounts = position.burnAmountsWithSlippage(new sdkCore.Percent(slippage.numerator, slippage.denominator));
            amount0Min = minimumAmounts.amount0.toString();
            amount1Min = minimumAmounts.amount1.toString();
            typeArgs = [position.pool.token0.address, position.pool.token1.address, this.moduleAddress + getFeeType(position.pool.fee)];
            moveCallTx = {
              packageObjectId: this.getModuleAddress(),
              module: 'router',
              "function": 'decrease_liquidity',
              typeArguments: typeArgs,
              arguments: [this.poolConfig, (position.pool.objectId ? position.pool.objectId : '0').toString(), this.sharedPositionOwnership, positionObjectId, position.liquidity.toString(), amount0Min, amount1Min, collectCoin, "" + deadline.toString()],
              gasBudget: gasBudget
            };
            return _context5.abrupt("return", {
              kind: "moveCall",
              data: moveCallTx
            });
          case 7:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this);
    }));
    function makeRemoveLiquidityTx(_x36, _x37, _x38, _x39, _x40, _x41) {
      return _makeRemoveLiquidityTx.apply(this, arguments);
    }
    return makeRemoveLiquidityTx;
  }();
  return PositionManager;
}();

var Payments = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Payments() {}
  Payments.encodeFeeBips = function encodeFeeBips(fee) {
    return toHex(fee.multiply(10000).quotient);
  };
  return Payments;
}();

var SimpleTickDataProvider = /*#__PURE__*/function () {
  function SimpleTickDataProvider() {
    this.ticks = [];
  }
  SimpleTickDataProvider.fromSimpleTickStates = function fromSimpleTickStates(tickStates) {
    var is = new SimpleTickDataProvider();
    is.ticks = StateFetcher.simpleStatetoTicks(StateFetcher.sortSimpleTicks(tickStates));
    return is;
  };
  var _proto = SimpleTickDataProvider.prototype;
  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_tick) {
      var tick;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            tick = this.ticks.find(function (t) {
              return t.index == _tick;
            });
            if (!(tick === undefined)) {
              _context.next = 3;
              break;
            }
            return _context.abrupt("return", {
              liquidityNet: 0
            });
          case 3:
            return _context.abrupt("return", {
              liquidityNet: tick.liquidityNet
            });
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }
    return getTick;
  }();
  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(tick, lte, tickSpacing) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }
    return nextInitializedTickWithinOneWord;
  }();
  return SimpleTickDataProvider;
}();

/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
var SwapRouter = /*#__PURE__*/function () {
  function SwapRouter(addr, swapRouter, poolConfig) {
    this.moduleAddress = addr;
    this.swapRouter = swapRouter;
    this.poolConfig = poolConfig;
  }
  var _proto = SwapRouter.prototype;
  _proto.getModuleAddress = function getModuleAddress() {
    return this.moduleAddress;
  };
  _proto.getSwapRouterAddress = function getSwapRouterAddress() {
    return this.moduleAddress;
  };
  _proto.getQuotes = /*#__PURE__*/function () {
    var _getQuotes = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(tokenIn, tokenOut, swapType, amount, poolsWithTicks) {
      var pools, quotes, bestTrade, _iterator, _step, pool, trade, _iterator2, _step2, _pool, _trade, _i, _quotes, q;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            pools = poolsWithTicks.map(function (p) {
              var pool = p.pool;
              // invariant(pool.token0 == tokenIn || pool.token0 == tokenOut, 'TOKEN_IN_DIFF')
              // invariant(pool.token1 == tokenIn || pool.token1 == tokenOut, 'INVALID_TOKEN')
              pool.updateTickProvider(SimpleTickDataProvider.fromSimpleTickStates(p.ticks));
              return pool;
            });
            quotes = [];
            bestTrade = undefined;
            if (!(swapType == sdkCore.TradeType.EXACT_INPUT)) {
              _context.next = 22;
              break;
            }
            _iterator = _createForOfIteratorHelperLoose(pools);
          case 5:
            if ((_step = _iterator()).done) {
              _context.next = 20;
              break;
            }
            pool = _step.value;
            _context.prev = 7;
            _context.next = 10;
            return Trade.exactIn(new Route([pool], tokenIn, tokenOut), CurrencyAmount.fromRawAmount(tokenIn, amount));
          case 10:
            trade = _context.sent;
            if (bestTrade == undefined) {
              bestTrade = trade;
            } else {
              if (bestTrade.outputAmount.lessThan(trade.outputAmount)) {
                bestTrade = trade;
              }
            }
            quotes.push({
              trade: trade,
              isBest: false
            });
            _context.next = 18;
            break;
          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](7);
            console.log('error get quote', _context.t0.toString());
          case 18:
            _context.next = 5;
            break;
          case 20:
            _context.next = 38;
            break;
          case 22:
            _iterator2 = _createForOfIteratorHelperLoose(pools);
          case 23:
            if ((_step2 = _iterator2()).done) {
              _context.next = 38;
              break;
            }
            _pool = _step2.value;
            _context.prev = 25;
            _context.next = 28;
            return Trade.exactOut(new Route([_pool], tokenIn, tokenOut), CurrencyAmount.fromRawAmount(tokenOut, amount));
          case 28:
            _trade = _context.sent;
            if (bestTrade == undefined) {
              bestTrade = _trade;
            } else {
              if (bestTrade.inputAmount.greaterThan(_trade.inputAmount)) {
                bestTrade = _trade;
              }
            }
            quotes.push({
              trade: _trade,
              isBest: false
            });
            _context.next = 36;
            break;
          case 33:
            _context.prev = 33;
            _context.t1 = _context["catch"](25);
            console.log('error get quote', _context.t1.toString());
          case 36:
            _context.next = 23;
            break;
          case 38:
            _i = 0, _quotes = quotes;
          case 39:
            if (!(_i < _quotes.length)) {
              _context.next = 47;
              break;
            }
            q = _quotes[_i];
            if (!(q.trade == bestTrade)) {
              _context.next = 44;
              break;
            }
            q.isBest = true;
            return _context.abrupt("break", 47);
          case 44:
            _i++;
            _context.next = 39;
            break;
          case 47:
            return _context.abrupt("return", quotes);
          case 48:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[7, 15], [25, 33]]);
    }));
    function getQuotes(_x, _x2, _x3, _x4, _x5) {
      return _getQuotes.apply(this, arguments);
    }
    return getQuotes;
  }()
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  ;
  _proto.createSwapTx = function createSwapTx(coinIns, trade, options, gasBudget) {
    var sampleTrade = trade;
    var tokenIn = sampleTrade.inputAmount.currency.wrapped;
    var tokenOut = sampleTrade.outputAmount.currency.wrapped;
    // All trades should have the same starting and ending token.
    !trade.inputAmount.currency.wrapped.equals(tokenIn) ?  invariant(false, 'TOKEN_IN_DIFF')  : void 0;
    !trade.outputAmount.currency.wrapped.equals(tokenOut) ?  invariant(false, 'TOKEN_OUT_DIFF')  : void 0;
    var deadline = options.deadline;
    var _trade$swaps$ = trade.swaps[0],
      route = _trade$swaps$.route,
      inputAmount = _trade$swaps$.inputAmount,
      outputAmount = _trade$swaps$.outputAmount;
    var singleHop = route.pools.length === 1;
    //invariant(singleHop, 'singleHop')
    //invariant(route.pools.length == 1, 'singlePool')
    var slippage = new sdkCore.Percent(options.slippageTolerance.numerator, options.slippageTolerance.denominator);
    var amountIn = trade.maximumAmountIn(slippage, inputAmount).quotient.toString();
    var amountOut = trade.minimumAmountOut(slippage, outputAmount).quotient.toString();
    // flag for whether the trade is single hop or not
    if (singleHop) {
      var _options$sqrtPriceLim;
      var pool = route.pools[0];
      var typeArgs = [pool.token0.address.toString(), pool.token1.address.toString(), this.moduleAddress + getFeeType(pool.fee)];
      var zeroForOne = route.tokenPath[0].address.replace(' ', '') == pool.token0.address.replace(' ', '');
      var args = [this.poolConfig, pool.objectId ? pool.objectId.toString() : '', zeroForOne ? coinIns : [], zeroForOne ? [] : coinIns, amountIn, amountOut, ((_options$sqrtPriceLim = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0).toString(), zeroForOne, deadline.toString()];
      if (trade.tradeType === sdkCore.TradeType.EXACT_INPUT) {
        var moveCallTx = {
          packageObjectId: this.getSwapRouterAddress(),
          module: 'router',
          "function": 'exact_input_2',
          typeArguments: typeArgs,
          arguments: args,
          gasBudget: gasBudget
        };
        return {
          kind: "moveCall",
          data: moveCallTx
        };
      } else {
        var _moveCallTx = {
          packageObjectId: this.getSwapRouterAddress(),
          module: 'router',
          "function": 'exact_output_2',
          typeArguments: typeArgs,
          arguments: args,
          gasBudget: gasBudget
        };
        return {
          kind: "moveCall",
          data: _moveCallTx
        };
      }
    } else if (route.pools.length == 2) {
      var _options$sqrtPriceLim2;
      var pools = route.pools;
      var _ref = [pools[0].token0.address, pools[0].token1.address],
        token0 = _ref[0],
        token1 = _ref[1];
      var token2 = pools[1].token0.address == token0 || pools[1].token0.address == token1 ? pools[1].token1.address : pools[1].token0.address;
      if (!sortBefore(token1, token2)) {
        var _ref2 = [token2, token1];
        token1 = _ref2[0];
        token2 = _ref2[1];
        if (!sortBefore(token0, token1)) {
          var _ref3 = [token1, token0];
          token0 = _ref3[0];
          token1 = _ref3[1];
        }
      }
      var isExactIn = trade.tradeType === sdkCore.TradeType.EXACT_INPUT;
      var intremediateToken = token0;
      var funName = isExactIn ? 'exact_input_two_hops_intermediate_0' : 'exact_output_two_hops_intermediate_0';
      var firstCoins = route.input.address == token1 ? coinIns : [];
      var secondCoins = route.input.address == token1 ? [] : coinIns;
      var firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[0] : pools[1];
      var secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[1] : pools[0];
      if (intremediateToken === route.input.address || intremediateToken === route.output.address) {
        intremediateToken = token1;
        funName = isExactIn ? 'exact_input_two_hops_intermediate_1' : 'exact_output_two_hops_intermediate_1';
        firstCoins = route.input.address == token0 ? coinIns : [];
        secondCoins = route.input.address == token0 ? [] : coinIns;
        firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[0] : pools[1];
        secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[1] : pools[0];
      }
      if (intremediateToken === route.input.address || intremediateToken === route.output.address) {
        intremediateToken = token2;
        funName = isExactIn ? 'exact_input_two_hops_intermediate_2' : 'exact_output_two_hops_intermediate_2';
        firstCoins = route.input.address == token0 ? coinIns : [];
        secondCoins = route.input.address == token0 ? [] : coinIns;
        firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token2 ? pools[0] : pools[1];
        secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token2 ? pools[1] : pools[0];
      }
      var _typeArgs = [token0, token1, token2, route.input.address, this.moduleAddress + getFeeType(firstPool.fee), this.moduleAddress + getFeeType(secondPool.fee)];
      var _args2 = [this.poolConfig, firstPool.objectId ? firstPool.objectId.toString() : '', secondPool.objectId ? secondPool.objectId.toString() : '', firstCoins, secondCoins, amountIn, amountOut, ((_options$sqrtPriceLim2 = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim2 : 0).toString(), deadline.toString()];
      var _moveCallTx2 = {
        packageObjectId: this.getSwapRouterAddress(),
        module: 'router',
        "function": funName,
        typeArguments: _typeArgs,
        arguments: _args2,
        gasBudget: gasBudget
      };
      return {
        kind: "moveCall",
        data: _moveCallTx2
      };
    } else if (route.pools.length == 3) {
      throw new Error('unsupported multihop');
      //   const pools = route.pools
      //   const typeArgs = [
      //     pools[0].token0.address.toString(), 
      //     pools[0].token1.address.toString(), 
      //     pools[1].token0.address.toString(),
      //     pools[1].token1.address.toString(),
      //     pools[2].token0.address.toString(),
      //     pools[2].token1.address.toString(),
      //     this.moduleAddress + getFeeType(pools[0].fee),
      //     this.moduleAddress + getFeeType(pools[1].fee),
      //     this.moduleAddress + getFeeType(pools[2].fee),
      //     route.input.address,
      //     route.output.address
      //   ]
      //   const args = [
      //     amountIn, 
      //     amountOut, 
      //     ((options.sqrtPriceLimitX96 ?? 0)).toString(),
      //     deadline
      //   ]
      //   if (trade.tradeType === TradeType.EXACT_INPUT) {
      //     return {
      //       type: 'entry_function_payload',
      //       function: `${this.getModuleAddress()}::router::exact_input_three_hops`,
      //       type_arguments: typeArgs,
      //       arguments: args
      //     } 
      //   } else {
      //     return {
      //       type: 'entry_function_payload',
      //       function: `${this.getModuleAddress()}::router::exact_output_three_hops`,
      //       type_arguments: typeArgs,
      //       arguments: args
      //     }
      //   }
    } else {
      //TODO: implement multihops
      throw new Error('unsupported multihop');
      // invariant(options.sqrtPriceLimitX96 === undefined, 'MULTIHOP_PRICE_LIMIT')
      // const path: string = encodeRouteToPath(route, trade.tradeType === TradeType.EXACT_OUTPUT)
      // if (trade.tradeType === TradeType.EXACT_INPUT) {
      //   const exactInputParams = {
      //     path,
      //     recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
      //     deadline,
      //     amountIn,
      //     amountOutMinimum: amountOut
      //   }
      //   calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactInput', [exactInputParams]))
      // } else {
      //   const exactOutputParams = {
      //     path,
      //     recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
      //     deadline,
      //     amountOut,
      //     amountInMaximum: amountIn
      //   }
      //   calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactOutput', [exactOutputParams]))
      // }
    }
  };
  return SwapRouter;
}();

(function (EventType) {
  EventType[EventType["MINT"] = 100] = "MINT";
  EventType[EventType["COLLECT"] = 101] = "COLLECT";
  EventType[EventType["COLLECT_PROTOCOL"] = 102] = "COLLECT_PROTOCOL";
  EventType[EventType["BURN"] = 103] = "BURN";
  EventType[EventType["SWAP"] = 104] = "SWAP";
  EventType[EventType["INCREASE_OBSERVATION_CARDINALITY_NEXT"] = 105] = "INCREASE_OBSERVATION_CARDINALITY_NEXT";
  EventType[EventType["SET_FEE_PROTOCOL_EVENT"] = 106] = "SET_FEE_PROTOCOL_EVENT";
  EventType[EventType["TICK_UPDATED_EVENT"] = 107] = "TICK_UPDATED_EVENT";
})(exports.EventType || (exports.EventType = {}));
/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
var EventFetcher = /*#__PURE__*/function () {
  function EventFetcher() {}
  EventFetcher.fetchPoolUpdatedEvent = /*#__PURE__*/function () {
    var _fetchPoolUpdatedEvent = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(packageObjectId, suiRPC, _startCursor, _limit) {
      var provider, start, limit, poolUpdatedEvents, ret, lastCursor;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            provider = new sui_js.JsonRpcProvider(suiRPC);
            start = _startCursor ? _startCursor : null;
            limit = typeof _limit !== 'undefined' ? _limit : 10000;
            _context2.next = 5;
            return tryCallWithTrial( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
              var events;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return provider.getEvents({
                      MoveEvent: packageObjectId + "::pool::PoolUpdatedEvent"
                    }, start, limit, 'ascending');
                  case 2:
                    events = _context.sent;
                    if (!(!events || events.data.length == 0)) {
                      _context.next = 5;
                      break;
                    }
                    return _context.abrupt("return", []);
                  case 5:
                    return _context.abrupt("return", events.data);
                  case 6:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            })));
          case 5:
            poolUpdatedEvents = _context2.sent;
            ret = [];
            limit = poolUpdatedEvents ? poolUpdatedEvents.length : 0;
            lastCursor = null;
            if (poolUpdatedEvents && Array.isArray(poolUpdatedEvents) && poolUpdatedEvents.length > 0) {
              poolUpdatedEvents.forEach(function (d) {
                var e = d.event.moveEvent.fields;
                ret.push({
                  token0Address: typeInfoToQualifiedName(e.t0),
                  token1Address: typeInfoToQualifiedName(e.t1),
                  feeAmount: feeTypeToFeeAmount(typeInfoToQualifiedName(e.f)),
                  isMint: e.is_mint,
                  isNew: e.is_new,
                  creator: e.creator,
                  tick: i64ToNumber(e.tick.fields),
                  tickLower: i64ToNumber(e.tick_lower.fields),
                  tickUpper: i64ToNumber(e.tick_upper.fields),
                  amount: e.amount,
                  amount0: e.amount0,
                  amount1: e.amount1,
                  reserve0: e.reserve_0,
                  reserve1: e.reserve_1,
                  objectId: e.pool_address,
                  liquidity: e.liquidity,
                  sqrtPriceX96: TickMath.getSqrtRatioAtTick(i64ToNumber(e.tick.fields))
                });
              });
              lastCursor = poolUpdatedEvents[poolUpdatedEvents.length - 1].id;
            }
            return _context2.abrupt("return", {
              poolUpdatedEvents: ret,
              lastCursor: lastCursor
            });
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function fetchPoolUpdatedEvent(_x, _x2, _x3, _x4) {
      return _fetchPoolUpdatedEvent.apply(this, arguments);
    }
    return fetchPoolUpdatedEvent;
  }();
  EventFetcher.fetchTickUpdatedEvent = /*#__PURE__*/function () {
    var _fetchTickUpdatedEvent = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(packageObjectId, suiRPC, filter, _startCursor, _limit) {
      var provider, start, limit, tickUpdatedEvents, ret, lastCursor;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            provider = new sui_js.JsonRpcProvider(suiRPC);
            start = _startCursor ? _startCursor : null;
            limit = typeof _limit !== 'undefined' ? _limit : 10000;
            _context4.next = 5;
            return tryCallWithTrial( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
              var events;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return provider.getEvents({
                      MoveEvent: packageObjectId + "::pool::TickUpdatedEvent"
                    }, start, limit, 'ascending');
                  case 2:
                    events = _context3.sent;
                    if (!(!events || events.data.length == 0)) {
                      _context3.next = 5;
                      break;
                    }
                    return _context3.abrupt("return", []);
                  case 5:
                    return _context3.abrupt("return", events.data);
                  case 6:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            })));
          case 5:
            tickUpdatedEvents = _context4.sent;
            ret = [];
            limit = tickUpdatedEvents ? tickUpdatedEvents.length : 0;
            lastCursor = null;
            if (tickUpdatedEvents && Array.isArray(tickUpdatedEvents) && tickUpdatedEvents.length > 0) {
              tickUpdatedEvents.forEach(function (d) {
                var e = d.event.moveEvent.fields;
                var _ref3 = [typeInfoToQualifiedName(e.t0), typeInfoToQualifiedName(e.t1), feeTypeToFeeAmount(typeInfoToQualifiedName(e.f))],
                  token0 = _ref3[0],
                  token1 = _ref3[1],
                  feeAmount = _ref3[2];
                if (filter != undefined) {
                  if (filter.token0 != token0 || filter.token1 != token1 || filter.feeAmount != feeAmount) {
                    return;
                  }
                }
                ret.push({
                  token0Address: token0,
                  token1Address: token1,
                  feeAmount: feeAmount,
                  liquidityGross: e.liquidity_gross,
                  liquidityNet: i128ToBigInt(e.liquidity_net.fields),
                  tick: i64ToNumber(e.tick.fields),
                  reserve0: e.reserve_0,
                  reserve1: e.reserve_1
                });
              });
              lastCursor = tickUpdatedEvents[tickUpdatedEvents.length - 1].id;
            }
            return _context4.abrupt("return", {
              tickUpdatedEvents: ret,
              lastCursor: lastCursor
            });
          case 11:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    function fetchTickUpdatedEvent(_x5, _x6, _x7, _x8, _x9) {
      return _fetchTickUpdatedEvent.apply(this, arguments);
    }
    return fetchTickUpdatedEvent;
  }();
  EventFetcher.fetchGlobalSwapEvents = /*#__PURE__*/function () {
    var _fetchGlobalSwapEvents = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(packageObjectId, suiRPC, _startCursor, _limit) {
      var provider, start, limit, swapEvents, ret, lastCursor;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            provider = new sui_js.JsonRpcProvider(suiRPC);
            start = _startCursor ? _startCursor : null;
            limit = typeof _limit !== 'undefined' ? _limit : 10000;
            _context6.next = 5;
            return tryCallWithTrial( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
              var events;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return provider.getEvents({
                      MoveEvent: packageObjectId + "::pool::GlobalSwapEvent"
                    }, start, limit, 'ascending');
                  case 2:
                    events = _context5.sent;
                    if (!(!events || events.data.length == 0)) {
                      _context5.next = 5;
                      break;
                    }
                    return _context5.abrupt("return", []);
                  case 5:
                    return _context5.abrupt("return", events.data);
                  case 6:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            })));
          case 5:
            swapEvents = _context6.sent;
            ret = [];
            limit = swapEvents ? swapEvents.length : 0;
            lastCursor = null;
            if (swapEvents && Array.isArray(swapEvents) && swapEvents.length > 0) {
              swapEvents.forEach(function (d) {
                var e = d.event.moveEvent.fields;
                ret.push({
                  token0Address: typeInfoToQualifiedName(e.t0),
                  token1Address: typeInfoToQualifiedName(e.t1),
                  feeAmount: feeTypeToFeeAmount(typeInfoToQualifiedName(e.f)),
                  recipient: e.recipient,
                  amount0: i256ToBigInt(e.amount0.fields),
                  amount1: i256ToBigInt(e.amount1.fields),
                  sqrtPriceX96: e.sqrt_price_x96,
                  liquidity: e.liquidity,
                  tick: i64ToNumber(e.tick.fields),
                  reserve0: e.reserve_0,
                  reserve1: e.reserve_1
                });
              });
              lastCursor = swapEvents[swapEvents.length - 1].id;
            }
            return _context6.abrupt("return", {
              swapEvents: ret,
              lastCursor: lastCursor
            });
          case 11:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    function fetchGlobalSwapEvents(_x10, _x11, _x12, _x13) {
      return _fetchGlobalSwapEvents.apply(this, arguments);
    }
    return fetchGlobalSwapEvents;
  }();
  return EventFetcher;
}();

exports.CurrencyAmount = CurrencyAmount;
exports.EventFetcher = EventFetcher;
exports.FullMath = FullMath;
exports.LiquidityMath = LiquidityMath;
exports.NoTickDataProvider = NoTickDataProvider;
exports.Payments = Payments;
exports.Pool = Pool;
exports.Position = Position;
exports.PositionLibrary = PositionLibrary;
exports.PositionManager = PositionManager;
exports.Price = Price;
exports.Route = Route;
exports.SimpleTickDataProvider = SimpleTickDataProvider;
exports.SqrtPriceMath = SqrtPriceMath;
exports.StateFetcher = StateFetcher;
exports.SuiCoin = SuiCoin;
exports.SwapMath = SwapMath;
exports.SwapRouter = SwapRouter;
exports.TICK_SPACINGS = TICK_SPACINGS;
exports.Tick = Tick;
exports.TickLibrary = TickLibrary;
exports.TickList = TickList;
exports.TickListDataProvider = TickListDataProvider;
exports.TickMath = TickMath;
exports.Trade = Trade;
exports.TypeTagSerializer = TypeTagSerializer;
exports.bnToBigInt = bnToBigInt;
exports.decimalToHexString = decimalToHexString;
exports.encodeSqrtRatioX96 = encodeSqrtRatioX96;
exports.feeTypeToFeeAmount = feeTypeToFeeAmount;
exports.getFeeType = getFeeType;
exports.getModuleAddress = getModuleAddress;
exports.hexToBN = hexToBN;
exports.i128ToBigInt = i128ToBigInt;
exports.i256ToBigInt = i256ToBigInt;
exports.i64ToNumber = i64ToNumber;
exports.isSorted = isSorted;
exports.maxLiquidityForAmounts = maxLiquidityForAmounts;
exports.mostSignificantBit = mostSignificantBit;
exports.nearestUsableTick = nearestUsableTick;
exports.parseTypeFromStr = parseTypeFromStr;
exports.priceToClosestTick = priceToClosestTick;
exports.setModuleAddress = setModuleAddress;
exports.sleep = sleep;
exports.sortBefore = sortBefore;
exports.sortTypes = sortTypes;
exports.structTagToString = structTagToString;
exports.subIn256 = subIn256;
exports.tickToPrice = tickToPrice;
exports.toFullyQualifiedName = toFullyQualifiedName;
exports.toHex = toHex;
exports.toUTF8Array = toUTF8Array;
exports.tradeComparator = tradeComparator;
exports.tryCallWithTrial = tryCallWithTrial;
exports.typeInfoToQualifiedName = typeInfoToQualifiedName;
exports.validateAndParseAddress = validateAndParseAddress;
//# sourceMappingURL=sui-sdk.cjs.development.js.map
