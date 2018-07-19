'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = require('./plugin');

module.exports = function (_Plugin) {
    _inherits(Pinch, _Plugin);

    /**
     * @private
     * @param {Viewport} parent
     * @param {object} [options]
     * @param {boolean} [options.noDrag] disable two-finger dragging
     * @param {number} [options.percent=1.0] percent to modify pinch speed
     * @param {PIXI.Point} [options.center] place this point at center during zoom instead of center of two fingers
     */
    function Pinch(parent, options) {
        _classCallCheck(this, Pinch);

        var _this = _possibleConstructorReturn(this, (Pinch.__proto__ || Object.getPrototypeOf(Pinch)).call(this, parent));

        options = options || {};
        _this.percent = options.percent || 1.0;
        _this.noDrag = options.noDrag;
        _this.center = options.center;
        return _this;
    }

    _createClass(Pinch, [{
        key: 'down',
        value: function down() {
            if (this.parent.countDownPointers() >= 2) {
                this.active = true;
            }
        }
    }, {
        key: 'move',
        value: function move(e) {
            if (this.paused || !this.active) {
                return;
            }

            var x = e.data.global.x;
            var y = e.data.global.y;

            var pointers = this.parent.getTouchPointers();
            if (pointers.length >= 2) {
                var first = pointers[0];
                var second = pointers[1];
                var last = first.last && second.last ? Math.sqrt(Math.pow(second.last.x - first.last.x, 2) + Math.pow(second.last.y - first.last.y, 2)) : null;
                if (first.pointerId === e.data.pointerId) {
                    first.last = { x: x, y: y };
                } else if (second.pointerId === e.data.pointerId) {
                    second.last = { x: x, y: y };
                }
                if (last) {
                    var oldPoint = void 0;
                    var point = { x: first.last.x + (second.last.x - first.last.x) / 2, y: first.last.y + (second.last.y - first.last.y) / 2 };
                    if (!this.center) {
                        oldPoint = this.parent.toLocal(point);
                    }
                    var dist = Math.sqrt(Math.pow(second.last.x - first.last.x, 2) + Math.pow(second.last.y - first.last.y, 2));
                    var change = (dist - last) / this.parent.screenWidth * this.parent.scale.x * this.percent;
                    this.parent.scale.x += change;
                    this.parent.scale.y += change;
                    this.parent.emit('zoomed', { viewport: this.parent, type: 'pinch' });
                    var clamp = this.parent.plugins['clamp-zoom'];
                    if (clamp) {
                        clamp.clamp();
                    }
                    if (this.center) {
                        this.parent.moveCenter(this.center);
                    } else {
                        var newPoint = this.parent.toGlobal(oldPoint);
                        this.parent.x += point.x - newPoint.x;
                        this.parent.y += point.y - newPoint.y;
                        this.parent.emit('moved', { viewport: this.parent, type: 'pinch' });
                    }
                    if (!this.noDrag && this.lastCenter) {
                        this.parent.x += point.x - this.lastCenter.x;
                        this.parent.y += point.y - this.lastCenter.y;
                        this.parent.emit('moved', { viewport: this.parent, type: 'pinch' });
                    }
                    this.lastCenter = point;
                    this.moved = true;
                } else {
                    if (!this.pinching) {
                        this.parent.emit('pinch-start', this.parent);
                        this.pinching = true;
                    }
                }
                this.parent.dirty = true;
            }
        }
    }, {
        key: 'up',
        value: function up() {
            if (this.pinching) {
                if (this.parent.touches.length <= 1) {
                    this.active = false;
                    this.lastCenter = null;
                    this.pinching = false;
                    this.moved = false;
                    this.parent.emit('pinch-end', this.parent);
                }
            }
        }
    }]);

    return Pinch;
}(Plugin);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waW5jaC5qcyJdLCJuYW1lcyI6WyJQbHVnaW4iLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInBhcmVudCIsIm9wdGlvbnMiLCJwZXJjZW50Iiwibm9EcmFnIiwiY2VudGVyIiwiY291bnREb3duUG9pbnRlcnMiLCJhY3RpdmUiLCJlIiwicGF1c2VkIiwieCIsImRhdGEiLCJnbG9iYWwiLCJ5IiwicG9pbnRlcnMiLCJnZXRUb3VjaFBvaW50ZXJzIiwibGVuZ3RoIiwiZmlyc3QiLCJzZWNvbmQiLCJsYXN0IiwiTWF0aCIsInNxcnQiLCJwb3ciLCJwb2ludGVySWQiLCJvbGRQb2ludCIsInBvaW50IiwidG9Mb2NhbCIsImRpc3QiLCJjaGFuZ2UiLCJzY3JlZW5XaWR0aCIsInNjYWxlIiwiZW1pdCIsInZpZXdwb3J0IiwidHlwZSIsImNsYW1wIiwicGx1Z2lucyIsIm1vdmVDZW50ZXIiLCJuZXdQb2ludCIsInRvR2xvYmFsIiwibGFzdENlbnRlciIsIm1vdmVkIiwicGluY2hpbmciLCJkaXJ0eSIsInRvdWNoZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxTQUFTQyxRQUFRLFVBQVIsQ0FBZjs7QUFFQUMsT0FBT0MsT0FBUDtBQUFBOztBQUVJOzs7Ozs7OztBQVFBLG1CQUFZQyxNQUFaLEVBQW9CQyxPQUFwQixFQUNBO0FBQUE7O0FBQUEsa0hBQ1VELE1BRFY7O0FBRUlDLGtCQUFVQSxXQUFXLEVBQXJCO0FBQ0EsY0FBS0MsT0FBTCxHQUFlRCxRQUFRQyxPQUFSLElBQW1CLEdBQWxDO0FBQ0EsY0FBS0MsTUFBTCxHQUFjRixRQUFRRSxNQUF0QjtBQUNBLGNBQUtDLE1BQUwsR0FBY0gsUUFBUUcsTUFBdEI7QUFMSjtBQU1DOztBQWpCTDtBQUFBO0FBQUEsK0JBb0JJO0FBQ0ksZ0JBQUksS0FBS0osTUFBTCxDQUFZSyxpQkFBWixNQUFtQyxDQUF2QyxFQUNBO0FBQ0kscUJBQUtDLE1BQUwsR0FBYyxJQUFkO0FBQ0g7QUFD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QUFZOEIsSUFBWixDQUFpQixhQUFqQixFQUFnQyxLQUFLOUIsTUFBckM7QUFDQSw2QkFBS3dDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDSDtBQUNKO0FBQ0QscUJBQUt4QyxNQUFMLENBQVl5QyxLQUFaLEdBQW9CLElBQXBCO0FBQ0g7QUFDSjtBQW5HTDtBQUFBO0FBQUEsNkJBc0dJO0FBQ0ksZ0JBQUksS0FBS0QsUUFBVCxFQUNBO0FBQ0ksb0JBQUksS0FBS3hDLE1BQUwsQ0FBWTBDLE9BQVosQ0FBb0IzQixNQUFwQixJQUE4QixDQUFsQyxFQUNBO0FBQ0kseUJBQUtULE1BQUwsR0FBYyxLQUFkO0FBQ0EseUJBQUtnQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EseUJBQUtFLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSx5QkFBS0QsS0FBTCxHQUFhLEtBQWI7QUFDQSx5QkFBS3ZDLE1BQUwsQ0FBWThCLElBQVosQ0FBaUIsV0FBakIsRUFBOEIsS0FBSzlCLE1BQW5DO0FBQ0g7QUFDSjtBQUNKO0FBbEhMOztBQUFBO0FBQUEsRUFBcUNKLE1BQXJDIiwiZmlsZSI6InBpbmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUGx1Z2luID0gcmVxdWlyZSgnLi9wbHVnaW4nKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQaW5jaCBleHRlbmRzIFBsdWdpblxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge1ZpZXdwb3J0fSBwYXJlbnRcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubm9EcmFnXSBkaXNhYmxlIHR3by1maW5nZXIgZHJhZ2dpbmdcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5wZXJjZW50PTEuMF0gcGVyY2VudCB0byBtb2RpZnkgcGluY2ggc3BlZWRcclxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gW29wdGlvbnMuY2VudGVyXSBwbGFjZSB0aGlzIHBvaW50IGF0IGNlbnRlciBkdXJpbmcgem9vbSBpbnN0ZWFkIG9mIGNlbnRlciBvZiB0d28gZmluZ2Vyc1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50KVxyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gb3B0aW9ucy5wZXJjZW50IHx8IDEuMFxyXG4gICAgICAgIHRoaXMubm9EcmFnID0gb3B0aW9ucy5ub0RyYWdcclxuICAgICAgICB0aGlzLmNlbnRlciA9IG9wdGlvbnMuY2VudGVyXHJcbiAgICB9XHJcblxyXG4gICAgZG93bigpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50LmNvdW50RG93blBvaW50ZXJzKCkgPj0gMilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlKGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMucGF1c2VkIHx8ICF0aGlzLmFjdGl2ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgeCA9IGUuZGF0YS5nbG9iYWwueFxyXG4gICAgICAgIGNvbnN0IHkgPSBlLmRhdGEuZ2xvYmFsLnlcclxuXHJcbiAgICAgICAgY29uc3QgcG9pbnRlcnMgPSB0aGlzLnBhcmVudC5nZXRUb3VjaFBvaW50ZXJzKClcclxuICAgICAgICBpZiAocG9pbnRlcnMubGVuZ3RoID49IDIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IHBvaW50ZXJzWzBdXHJcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZCA9IHBvaW50ZXJzWzFdXHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSAoZmlyc3QubGFzdCAmJiBzZWNvbmQubGFzdCkgPyBNYXRoLnNxcnQoTWF0aC5wb3coc2Vjb25kLmxhc3QueCAtIGZpcnN0Lmxhc3QueCwgMikgKyBNYXRoLnBvdyhzZWNvbmQubGFzdC55IC0gZmlyc3QubGFzdC55LCAyKSkgOiBudWxsXHJcbiAgICAgICAgICAgIGlmIChmaXJzdC5wb2ludGVySWQgPT09IGUuZGF0YS5wb2ludGVySWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0Lmxhc3QgPSB7IHgsIHkgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNlY29uZC5wb2ludGVySWQgPT09IGUuZGF0YS5wb2ludGVySWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlY29uZC5sYXN0ID0geyB4LCB5IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobGFzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9sZFBvaW50XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb2ludCA9IHsgeDogZmlyc3QubGFzdC54ICsgKHNlY29uZC5sYXN0LnggLSBmaXJzdC5sYXN0LngpIC8gMiwgeTogZmlyc3QubGFzdC55ICsgKHNlY29uZC5sYXN0LnkgLSBmaXJzdC5sYXN0LnkpIC8gMiB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2VudGVyKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZFBvaW50ID0gdGhpcy5wYXJlbnQudG9Mb2NhbChwb2ludClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnNxcnQoTWF0aC5wb3coc2Vjb25kLmxhc3QueCAtIGZpcnN0Lmxhc3QueCwgMikgKyBNYXRoLnBvdyhzZWNvbmQubGFzdC55IC0gZmlyc3QubGFzdC55LCAyKSlcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5nZSA9ICgoZGlzdCAtIGxhc3QpIC8gdGhpcy5wYXJlbnQuc2NyZWVuV2lkdGgpICogdGhpcy5wYXJlbnQuc2NhbGUueCAqIHRoaXMucGVyY2VudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuc2NhbGUueCArPSBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnNjYWxlLnkgKz0gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5lbWl0KCd6b29tZWQnLCB7IHZpZXdwb3J0OiB0aGlzLnBhcmVudCwgdHlwZTogJ3BpbmNoJyB9KVxyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xhbXAgPSB0aGlzLnBhcmVudC5wbHVnaW5zWydjbGFtcC16b29tJ11cclxuICAgICAgICAgICAgICAgIGlmIChjbGFtcClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFtcC5jbGFtcCgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jZW50ZXIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW92ZUNlbnRlcih0aGlzLmNlbnRlcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQb2ludCA9IHRoaXMucGFyZW50LnRvR2xvYmFsKG9sZFBvaW50KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnggKz0gcG9pbnQueCAtIG5ld1BvaW50LnhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC55ICs9IHBvaW50LnkgLSBuZXdQb2ludC55XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuZW1pdCgnbW92ZWQnLCB7IHZpZXdwb3J0OiB0aGlzLnBhcmVudCwgdHlwZTogJ3BpbmNoJyB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm5vRHJhZyAmJiB0aGlzLmxhc3RDZW50ZXIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQueCArPSBwb2ludC54IC0gdGhpcy5sYXN0Q2VudGVyLnhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC55ICs9IHBvaW50LnkgLSB0aGlzLmxhc3RDZW50ZXIueVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmVtaXQoJ21vdmVkJywgeyB2aWV3cG9ydDogdGhpcy5wYXJlbnQsIHR5cGU6ICdwaW5jaCcgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdENlbnRlciA9IHBvaW50XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmVtaXQoJ3BpbmNoLXN0YXJ0JywgdGhpcy5wYXJlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5kaXJ0eSA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXAoKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnBpbmNoaW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50LnRvdWNoZXMubGVuZ3RoIDw9IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdENlbnRlciA9IG51bGxcclxuICAgICAgICAgICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5lbWl0KCdwaW5jaC1lbmQnLCB0aGlzLnBhcmVudClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==