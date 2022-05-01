'use strict';

import { drag } from 'd3-drag';
import { select, event } from 'd3-selection';
import { version } from '../package.json';
import { DraggableAnnotationAccessor } from './annotation/accessor';

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

				const mouseAbsolutePosition = { x: event.x, y: event.y }

				const canvasRect = chart.canvas.getBoundingClientRect()
				const canvasPosition = { x: canvasRect.x, y: canvasRect.y }

				const mouseRelativePosition = {x: mouseAbsolutePosition.x - canvasPosition.x, y: mouseAbsolutePosition.y - canvasPosition.y}

				const elementPixelDimension = element.scale.getPixelForValue(element.config.value)
				const elementPosition = element.scale.isHorizontal() ? { x: elementPixelDimension, y: mouseRelativePosition.y } : { x: mouseRelativePosition.x, y: elementPixelDimension }
				
				const distance = distanceBetweenPoints(elementPosition, mouseRelativePosition);

				if (distance < 20 && distance < minDistance) {
					nearestElement = element;
					minDistance = distance;
				}

				return nearestElement;
			}, undefined)

		return !!chart.draggable.subject;
	};
}

function distanceBetweenPoints(point1, point2) {
	return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

function getSubjectPicker(chartInstance) {
	return () => chartInstance.draggable.subject;
}

function getDispatcher(subjectPicker, type) {
	return () => subjectPicker().dispatch(type, event);
}

export default {

	id: "chartjsDraggablePlugin",

	version,

	accessors: [
		DraggableAnnotationAccessor
	].filter(accessor => accessor.isSupported()),


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
