import {DateTime} from './datetime';
import {Guide, GuideEncodingEntry, VlOnlyGuideConfig} from './guide';
import {VgLegend, VgLegendBase, VgLegendConfig} from './vega.schema';


export interface LegendConfig extends VgLegendConfig, VlOnlyGuideConfig {}

/**
 * Properties of a legend or boolean flag for determining whether to show it.
 */
export interface Legend extends VgLegendBase, Guide {
  /**
   * Optional mark definitions for custom legend encoding.
   *
   * @hide
   */
  encoding?: LegendEncoding;

  /**
   * The desired number of tick values for quantitative legends.
   */
  tickCount?: number;

  /**
   * Explicitly set the visible legend values.
   */
  values?: number[] | string[] | DateTime[];

  /**
   * The type of the legend. Use `"symbol"` to create a discrete legend and `"gradient"` for a continuous color gradient.
   *
   * __Default value:__ `"gradient"` for non-binned quantitative fields and temporal fields; `"symbol"` otherwise.
   */
  type?: 'symbol' | 'gradient';

  /**
   * A non-positive integer indicating z-index of the legend.
   * If zindex is 0, legend should be drawn behind all chart elements.
   * To put them in front, use zindex = 1.
   * @TJS-type integer
   * @minimum 0
   */
  zindex?: number;
}

export type LegendEncoding = {
  /**
   * Custom encoding for the legend container.
   * This can be useful for creating legend with custom x, y position.
   */
  legend?: GuideEncodingEntry;

  /**
   * Custom encoding for the legend title text mark.
   */
  title?: GuideEncodingEntry;

  /**
   * Custom encoding for legend label text marks.
   */
  labels?: GuideEncodingEntry;

  /**
   * Custom encoding for legend symbol marks.
   */
  symbols?: GuideEncodingEntry;

  /**
   * Custom encoding for legend gradient filled rect marks.
   */
  gradient?: GuideEncodingEntry;
};

export const defaultLegendConfig: LegendConfig = {};

export const LEGEND_PROPERTIES:(keyof (VgLegend | Legend))[] = ['entryPadding', 'format', 'offset', 'orient', 'tickCount', 'title', 'type', 'values' ,'zindex'];

export const VG_LEGEND_PROPERTIES:(keyof VgLegend)[] = [].concat(
  ['fill', 'stroke', 'shape', 'size', 'opacity', 'encode'],
  LEGEND_PROPERTIES
);
