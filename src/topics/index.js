// ─── Topic registry ───
// Adding a new topic = create a file exporting { meta, Module } and add it here.
// The home page and the dynamic topic route are driven entirely by this list,
// so there is no central switch statement to edit.

import * as fractions from "./fractions";
import * as decimals from "./decimals";
import * as ratios from "./ratios";
import * as dilations from "./dilations";

export const TOPICS = [fractions, decimals, ratios, dilations].map((m) => ({
  ...m.meta,
  Module: m.Module,
}));

export function getTopic(id) {
  return TOPICS.find((t) => t.id === id);
}
