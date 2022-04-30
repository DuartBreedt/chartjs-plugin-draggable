'use strict';

import Chart from 'chart.js';

import { ChartjsDraggablePlugin } from './plugin';
import { DraggableAnnotationAccessor } from './annotation/accessor';

const plugin = new ChartjsDraggablePlugin([
	DraggableAnnotationAccessor
]);

Chart.register(plugin);

export default plugin;
