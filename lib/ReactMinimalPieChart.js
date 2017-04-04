'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactMinimalPieChartPath = require('./ReactMinimalPieChartPath');

var _ReactMinimalPieChartPath2 = _interopRequireDefault(_ReactMinimalPieChartPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VIEWBOX_SIZE = 200;
var VIEWBOX_HALF_SIZE = VIEWBOX_SIZE / 2;

var sumValues = function sumValues(data) {
  return data.reduce(function (acc, dataEntry) {
    return acc + dataEntry.value;
  }, 0);
};

var evaluateDegreesFromValues = function evaluateDegreesFromValues(data, totalAngle, totalValue) {
  var total = totalValue || sumValues(data);
  if (totalAngle > 360) {
    totalAngle = 360;
  };
  if (totalAngle < -360) {
    totalAngle = -360;
  };

  // Append "degrees" property into each data entry
  return data.map(function (dataEntry) {
    return Object.assign({ degrees: dataEntry.value / total * Math.abs(totalAngle) }, dataEntry);
  });
};

var makePathTransitionStyle = function makePathTransitionStyle(duration, easing) {
  return {
    transition: 'stroke-dashoffset ' + duration + 'ms ' + easing
  };
};

var makeSegments = function makeSegments(data, props, hide) {
  // Keep track of how many degrees have already been taken
  var lastPathAngle = props.startAngle;
  var reveal = void 0;
  var style = props.animate ? makePathTransitionStyle(props.animationDuration, props.animationEasing) : undefined;

  // Hide/reveal a path segment?
  if (hide === true) {
    reveal = 0;
  } else if (typeof props.reveal === 'number') {
    reveal = props.reveal;
  } else if (hide === false) {
    reveal = 100;
  }

  return data.map(function (dataEntry, index) {
    var startAngle = lastPathAngle;
    lastPathAngle += dataEntry.degrees;

    return _react2.default.createElement(_ReactMinimalPieChartPath2.default, {
      key: dataEntry.key || index,
      cx: VIEWBOX_HALF_SIZE,
      cy: VIEWBOX_HALF_SIZE,
      startAngle: startAngle,
      lengthAngle: dataEntry.degrees,
      radius: VIEWBOX_HALF_SIZE,
      lineWidth: props.lineWidth,
      paddingAngle: props.paddingAngle,
      reveal: reveal,
      style: style,
      stroke: dataEntry.color,
      strokeLinecap: props.rounded ? 'round' : undefined,
      fill: 'none'
    });
  });
};

var ReactMinimalPieChart = function (_Component) {
  _inherits(ReactMinimalPieChart, _Component);

  function ReactMinimalPieChart(props) {
    _classCallCheck(this, ReactMinimalPieChart);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    if (_this.props.animate === true) {
      _this.hidePaths = true;
    }
    return _this;
  }

  ReactMinimalPieChart.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (this.props.animate === true && requestAnimationFrame) {
      setTimeout(function () {
        return requestAnimationFrame(_this2.startAnimation.bind(_this2));
      });
    }
  };

  ReactMinimalPieChart.prototype.startAnimation = function startAnimation() {
    this.hidePaths = false;
    this.forceUpdate();
  };

  ReactMinimalPieChart.prototype.render = function render() {
    if (this.props.data === undefined) {
      return null;
    }

    var normalizedData = evaluateDegreesFromValues(this.props.data, this.props.lengthAngle, this.props.totalValue);

    return _react2.default.createElement(
      'div',
      {
        className: this.props.className,
        style: this.props.style
      },
      _react2.default.createElement(
        'svg',
        {
          viewBox: '0 0 ' + VIEWBOX_SIZE + ' ' + VIEWBOX_SIZE,
          width: '100%',
          height: '100%'
        },
        makeSegments(normalizedData, this.props, this.hidePaths)
      ),
      this.props.children
    );
  };

  return ReactMinimalPieChart;
}(_react.Component);

exports.default = ReactMinimalPieChart;


ReactMinimalPieChart.displayName = 'ReactMinimalPieChart';

ReactMinimalPieChart.propTypes = {
  data: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    value: _react.PropTypes.number.isRequired,
    key: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    color: _react.PropTypes.string
  })),
  totalValue: _react.PropTypes.number,
  style: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])),
  startAngle: _react.PropTypes.number,
  lengthAngle: _react.PropTypes.number,
  paddingAngle: _react.PropTypes.number,
  lineWidth: _react.PropTypes.number,
  rounded: _react.PropTypes.bool,
  animate: _react.PropTypes.bool,
  animationDuration: _react.PropTypes.number,
  animationEasing: _react.PropTypes.string,
  reveal: _react.PropTypes.number,
  children: _react.PropTypes.node
};

ReactMinimalPieChart.defaultProps = {
  startAngle: 0,
  lengthAngle: 360,
  lineWidth: 100,
  rounded: false,
  animate: false,
  animationDuration: 500,
  animationEasing: 'ease-out'
};