'use strict';

import { DraggableElementAccessor } from '../accessor';
import { DraggableLineAnnotationElement } from './line-element';
import { DraggablePointAnnotationElement } from './point-element';

/*
annotation: {
	annotations: [
		{
			draggable: true,
			onDragStart: function() {
				
			},
			onDrag: function() {
				
			},
			onDragEnd: function() {
				
			}
		}
	]
}
*/

export class DraggableAnnotationAccessor extends DraggableElementAccessor {
	static isSupported() {
		return true
	}

	static getElements(event, chartInstance) {
		return DraggableElementAccessor.getElements(
			chartInstance,
			Object.keys(chartInstance.config.options.plugins.annotation.annotations).map(id => chartInstance.config.options.plugins.annotation.annotations[id]),
			(config) => {
				switch (config.type) {
					case 'line':
						return DraggableLineAnnotationElement;
					case 'point':
						return DraggablePointAnnotationElement;
				}
			}
		);
	}
}
