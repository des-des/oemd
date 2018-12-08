import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import datasetModule from "snabbdom/modules/dataset";
import eventlistenersModule from "snabbdom/modules/eventlisteners";
import h from "snabbdom/h";
import toVNode from "snabbdom/tovnode";

const snabbdom = require("snabbdom");

const patch = snabbdom.init([
  classModule,
  propsModule,
  styleModule,
  datasetModule,
  eventlistenersModule
]);

export { patch, h, toVNode };
