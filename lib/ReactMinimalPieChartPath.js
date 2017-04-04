'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = ReactMinimalPieChartPath;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var PI = Math.PI;
var degreesToRadians = function degreesToRadians(degrees) {
  return degrees * PI / 180;
};

function partialCircle(cx, cy, r, start, end) {
  var fromX = cx + r * Math.cos(end);
  var fromY = cy + r * Math.sin(end);
  var toX = cx + r * Math.cos(start);
  var toY = cy + r * Math.sin(start);
  var large = end - start <= Math.PI ? '0' : '1';

  if (end - start === 0) return [];
  return [['M', fromX, fromY], ['A', r, r, 0, large, 0, toX, toY]];
}

var makePathCommands = function makePathCommands(cx, cy, startAngle, lengthAngle, radius, paddingAngle) {
  // Let svg-partial-circle evaluate "d" value
  // Patch: calculating a 360° ring produces a broken path
  var patchedLengthAngle = lengthAngle === 360 ? 359.999 : lengthAngle;

  return partialCircle(cx, cy, // center X and Y
  radius, // radius
  degreesToRadians(startAngle), degreesToRadians(startAngle + patchedLengthAngle - paddingAngle)).map(function (command) {
    return command.join(' ');
  }).join(' ');
};

function ReactMinimalPieChartPath(_ref) {
  var cx = _ref.cx,
      cy = _ref.cy,
      startAngle = _ref.startAngle,
      lengthAngle = _ref.lengthAngle,
      radius = _ref.radius,
      paddingAngle = _ref.paddingAngle,
      lineWidth = _ref.lineWidth,
      reveal = _ref.reveal,
      props = _objectWithoutProperties(_ref, ['cx', 'cy', 'startAngle', 'lengthAngle', 'radius', 'paddingAngle', 'lineWidth', 'reveal']);

  var actualRadio = radius - lineWidth / 2;
  var pathCommands = makePathCommands(cx, cy, startAngle, lengthAngle, actualRadio, paddingAngle);
  var strokeDasharray = void 0;
  var strokeDashoffset = void 0;

  // Animate/hide paths with "stroke-dasharray" + "stroke-dashoffset"
  // https://css-tricks.com/svg-line-animation-works/
  if (typeof reveal === 'number') {
    strokeDasharray = PI * actualRadio / 180 * Math.abs(lengthAngle);
    strokeDashoffset = strokeDasharray + strokeDasharray / 100 * reveal;
  }

  return _react2.default.createElement('path', _extends({
    d: pathCommands,
    strokeWidth: lineWidth,
    strokeDasharray: strokeDasharray,
    strokeDashoffset: strokeDashoffset
  }, props));
}

ReactMinimalPieChartPath.displayName = 'ReactMinimalPieChartPath';

ReactMinimalPieChartPath.propTypes = {
  cx: _react.PropTypes.number.isRequired,
  cy: _react.PropTypes.number.isRequired,
  startAngle: _react.PropTypes.number,
  lengthAngle: _react.PropTypes.number,
  radius: _react.PropTypes.number,
  lineWidth: _react.PropTypes.number,
  paddingAngle: _react.PropTypes.number,
  reveal: _react.PropTypes.number
};

ReactMinimalPieChartPath.defaultProps = {
  startAngle: 0,
  lengthAngle: 0,
  lineWidth: 100,
  paddingAngle: 0,
  radius: 100
};