'use strict';

import { drag } from 'd3-drag';
import { DraggableElement } from './element';

export class DraggableElementAccessor {
	static isSupported() {
		return true;
	}

	static getElements(chartInstance, configs, elementClass) {
		let elementClassFn = (typeof elementClass === 'function') ? elementClass : () => elementClass;

		const draggableElements = configs.map((element, i) => {
			let className = elementClassFn(element) || DraggableElement;
			return new className(chartInstance, configs[i]);
		}).filter((element, i) => !!configs[i].draggable);

		return draggableElements
	}
}
