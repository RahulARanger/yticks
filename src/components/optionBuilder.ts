import EChartsReact, { EChartsOption } from "echarts-for-react";

type cssNumber = number | string;

interface grid {
	top?: cssNumber;
	bottom?: cssNumber;
	left?: cssNumber;
	right?: cssNumber;
	containLabel?: boolean;
}

type axisType = "value" | "category";

type axisPointerType = "shadow";

interface axisPointer {
	type: axisPointerType;
}

interface Axis {
	type: axisType;
	data?: Array<any>;
}

type toolTipTrigger = "axis";

interface Tooltip {
	axisPointer: axisPointer;
	trigger: toolTipTrigger;
}

type seriesType = "bar";
interface series {
	type: seriesType;
	label: { show: boolean };
}

interface barSeries extends series {
	type: "bar";
	name: string;
	stacked: boolean;
}

interface Option extends EChartsOption {
	grid?: grid;
	xAXis?: Axis;
	yAxis?: Axis;
	tooltip?: Tooltip;
	series?: Array<barSeries>;
}

export default class OptionBuilder {
	raw: Option;
	constructor() {
		this.raw = {};
	}

	setGrid({ top, bottom, left, right, containLabel }: grid): OptionBuilder {
		this.raw.grid = {
			top,
			left,
			right,
			bottom,
			containLabel: containLabel ?? false,
		};
		return this;
	}

	setAxis(isX: boolean, type: axisType, data?: Array<any>): OptionBuilder {
		const axis = { type, data };
		if (isX) this.raw.xAxis = axis;
		else this.raw.yAxis = axis;
		return this;
	}

	tooltip(trigger: toolTipTrigger, axisPointer: axisPointer): OptionBuilder {
		this.raw.tooltip = { trigger, axisPointer };
		return this;
	}
	barSeries(series: barSeries) {
		series["type"] = "bar";
		if (!this.raw.series) this.raw.series = [];
		this.raw.series.push(series);
	}
}
