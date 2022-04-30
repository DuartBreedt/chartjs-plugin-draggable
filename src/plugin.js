'use strict';

import Chart from 'chart.js';
import { drag } from 'd3-drag';
import { select, event } from 'd3-selection';

function getFilter(chart, accessors) {
	return () => {
		let minDistance = Number.POSITIVE_INFINITY;

		chart.draggable.subject = accessors
			// All draggable elements that are enabled
			.map(accessor => accessor.getElements(event, chart))
			// Flatten array of arrays
			.reduce((list, innerList) => list.concat(innerList), [])
			// Pick the element(s) nearest the mouse position
			.reduce((nearestElement, element) => {

				const elementPixelDimension = element.scale.getPixelForValue(element.config.value)
				let elementCenter = element.scale.isHorizontal() ? { x: elementPixelDimension, y: event.y } : { x: event.x, y: elementPixelDimension } 

				let distance = Chart.helpers.distanceBetweenPoints(elementCenter, event);

				if (distance < 20 && distance < minDistance) {
					nearestElement = element;
					minDistance = distance;
				}

				return nearestElement;
			}, undefined)

		return !!chart.draggable.subject;
	};
}

function getSubjectPicker(chartInstance) {
	return () => chartInstance.draggable.subject;
}

function getDispatcher(subjectPicker, type) {
	return () => subjectPicker().dispatch(type, event);
}

export class ChartjsDraggablePlugin {
	constructor(accessors) {
		this.id = "chartjsDraggablePlugin"
		this.accessors = accessors.filter(accessor => accessor.isSupported());
	}

	afterInit(chart) {
		chart.draggable = {};

		let subjectPicker = getSubjectPicker(chart);

		select(chart.canvas).call(
			drag().container(chart.canvas)
				.filter(getFilter(chart, this.accessors))
				.subject(subjectPicker)
				.on('start', getDispatcher(subjectPicker, 'onDragStart'))
				.on('drag', getDispatcher(subjectPicker, 'onDrag'))
				.on('end', getDispatcher(subjectPicker, 'onDragEnd'))
		);
	}
}
