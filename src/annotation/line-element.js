'use strict';

import { DraggableElement } from '../element';

export class DraggableLineAnnotationElement extends DraggableElement {
	constructor(chartInstance, elementConfig) {
		super(chartInstance, elementConfig);
		this.scale = this.chart.scales[elementConfig.scaleID];
	}

	_getPixel(event) {
		return this.scale.isHorizontal() ? event.x : event.y;
	}

	_getValue(event) {
		let offset = this.offset || 0;
		return this.scale.getValueForPixel(this._getPixel(event) - offset);
	}

	onDragStart(event) {
		this.offset = this._getPixel(event) - this.scale.getPixelForValue(this.config.value);
	}

	onDrag(event) {
		this.config.value = this._constrainValue(this.scale, this._getValue(event));
		this.chart.update(0);
	}

	onDragEnd(event) {
		this.offset = undefined;
	}

	getAppropriateValue() {
		return this.config.value
	}

	setAppropriateValue(value) {
		this.config.value = value
	}

	dispatch(type, event) {
		super.dispatch(type, event, this.config.value)
	}
}
