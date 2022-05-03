'use strict';

import { DraggableElement } from '../element';

export class DraggablePointAnnotationElement extends DraggableElement {
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
		this.offset = this._getPixel(event) - this.scale.getPixelForValue(this.getAppropriateValue());
	}

	onDrag(event) {
		const newValue = this._constrainValue(this.scale, this._getValue(event));
		if (newValue != this.getAppropriateValue()) {
			this.setAppropriateValue(newValue)
			this.chart.update();
		}
	}

	onDragEnd(event) {
		this.offset = undefined;
	}

	getAppropriateValue() {
		return this.scale.isHorizontal() ? this.config.xValue : this.config.yValue;
	}

	setAppropriateValue(value) {
		this.scale.isHorizontal() ? this.config.xValue = value : this.config.yValue = value;
		this.config.value = value
	}

	dispatch(type, event) {
		super.dispatch(type, event, this.getAppropriateValue())
	}
}
