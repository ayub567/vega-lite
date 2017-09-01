"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bin_1 = require("../../bin");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
var model_1 = require("../model");
var dataflow_1 = require("./dataflow");
function rangeFormula(model, fieldDef, channel, config) {
    if (common_1.binRequiresRange(fieldDef, channel)) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        var guide = model_1.isUnitModel(model) ? (model.axis(channel) || model.legend(channel) || {}) : {};
        var startField = fielddef_1.field(fieldDef, { expr: 'datum', });
        var endField = fielddef_1.field(fieldDef, { expr: 'datum', binSuffix: 'end' });
        return {
            formulaAs: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
            formula: common_1.binFormatExpression(startField, endField, guide.format, config)
        };
    }
    return {};
}
function binKey(bin, field) {
    return bin_1.binToString(bin) + "_" + field;
}
function isModelParams(p) {
    return !!p['model'];
}
function getSignalsFromParams(params, key) {
    if (isModelParams(params)) {
        var model = params.model;
        return {
            signal: model.getName(key + "_bins"),
            extentSignal: model.getName(key + "_extent")
        };
    }
    return params;
}
function createBinComponent(t, params) {
    var bin = fielddef_1.normalizeBin(t.bin, undefined) || {};
    var key = binKey(bin, t.field);
    var _a = getSignalsFromParams(params, key), signal = _a.signal, extentSignal = _a.extentSignal;
    var binComponent = tslib_1.__assign({ bin: bin, field: t.field, as: [fielddef_1.field(t, {}), fielddef_1.field(t, { binSuffix: 'end' })] }, signal ? { signal: signal } : {}, extentSignal ? { extentSignal: extentSignal } : {});
    return { key: key, binComponent: binComponent };
}
var BinNode = (function (_super) {
    tslib_1.__extends(BinNode, _super);
    function BinNode(bins) {
        var _this = _super.call(this) || this;
        _this.bins = bins;
        return _this;
    }
    BinNode.prototype.clone = function () {
        return new BinNode(util_1.duplicate(this.bins));
    };
    BinNode.makeBinFromEncoding = function (model) {
        var bins = model.reduceFieldDef(function (binComponentIndex, fieldDef, channel) {
            if (fieldDef.bin) {
                var _a = createBinComponent(fieldDef, { model: model }), key = _a.key, binComponent = _a.binComponent;
                binComponentIndex[key] = tslib_1.__assign({}, binComponent, binComponentIndex[key], rangeFormula(model, fieldDef, channel, model.config));
            }
            return binComponentIndex;
        }, {});
        if (util_1.keys(bins).length === 0) {
            return null;
        }
        return new BinNode(bins);
    };
    /**
     * Creates a bin node from BinTransform.
     * The optional parameter should provide
     */
    BinNode.makeFromTransform = function (t, params) {
        var _a = createBinComponent(t, params), key = _a.key, binComponent = _a.binComponent;
        return new BinNode((_b = {},
            _b[key] = binComponent,
            _b));
        var _b;
    };
    BinNode.prototype.merge = function (other) {
        this.bins = util_1.extend(other.bins);
        other.remove();
    };
    BinNode.prototype.producedFields = function () {
        var out = {};
        util_1.vals(this.bins).forEach(function (c) {
            c.as.forEach(function (f) { return out[f] = true; });
        });
        return out;
    };
    BinNode.prototype.dependentFields = function () {
        var out = {};
        util_1.vals(this.bins).forEach(function (c) {
            out[c.field] = true;
        });
        return out;
    };
    BinNode.prototype.assemble = function () {
        return util_1.flatten(util_1.vals(this.bins).map(function (bin) {
            var transform = [];
            var binTrans = tslib_1.__assign({ type: 'bin', field: bin.field, as: bin.as, signal: bin.signal }, bin.bin);
            if (!bin.bin.extent && bin.extentSignal) {
                transform.push({
                    type: 'extent',
                    field: bin.field,
                    signal: bin.extentSignal
                });
                binTrans.extent = { signal: bin.extentSignal };
            }
            transform.push(binTrans);
            if (bin.formula) {
                transform.push({
                    type: 'formula',
                    expr: bin.formula,
                    as: bin.formulaAs
                });
            }
            return transform;
        }));
    };
    return BinNode;
}(dataflow_1.DataFlowNode));
exports.BinNode = BinNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlEO0FBR2pELDJDQUE2RDtBQUU3RCxtQ0FBd0U7QUFFeEUsb0NBQWdFO0FBQ2hFLGtDQUE0RDtBQUM1RCx1Q0FBd0M7QUFHeEMsc0JBQXNCLEtBQXFCLEVBQUUsUUFBMEIsRUFBRSxPQUFnQixFQUFFLE1BQWM7SUFDckcsRUFBRSxDQUFDLENBQUMseUJBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxzRkFBc0Y7UUFFdEYsSUFBTSxLQUFLLEdBQUcsbUJBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFN0YsSUFBTSxVQUFVLEdBQUcsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxHQUFFLENBQUMsQ0FBQztRQUNyRCxJQUFNLFFBQVEsR0FBRyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFFcEUsTUFBTSxDQUFDO1lBQ0wsU0FBUyxFQUFFLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDO1lBQ2hELE9BQU8sRUFBRSw0QkFBbUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1NBQ3pFLENBQUM7SUFDSixDQUFDO0lBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFFRCxnQkFBZ0IsR0FBYyxFQUFFLEtBQWE7SUFDM0Ms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