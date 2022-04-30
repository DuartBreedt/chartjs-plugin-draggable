'use strict';

/*
{
	draggable: true,
	onDragStart: function(event) {
		
	},
	onDrag: function(event) {
		
	},
	onDragEnd: function(event) {
		
	}
}
*/

export class DraggableElement {
	constructor(chartInstance, elementConfig) {
		this.chart = chartInstance;
		this.config = elementConfig;
	}

	_constrainValue(scale, value) {
		if (typeof scale.min !== 'undefined' && value < scale.min) {
			return scale.min;
		} else if (typeof scale.max !== 'undefined' && value > scale.max) {
			return scale.max;
		} else {
			return value;
		}
	}

	dispatch(type, event, value) {
		// Invoke plugin callback
		if (typeof this[type] === 'function') {
			this[type](event);
		}

		// Invoke user callback
		if (typeof this.config[type] === 'function') {
			const args = [event, this.config.value]
			this.config[type](...args);
		}
	}
}
