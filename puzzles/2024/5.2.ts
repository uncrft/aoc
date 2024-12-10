import { load } from "lib/load";

const data = await load({ parse: Number, separator: /\||,/ });
const emptyLineIndex = data.findIndex((line) => line.length === 0);
const rules = data.slice(0, emptyLineIndex);
const updates = data.slice(emptyLineIndex + 1);

let sum = 0;
for (const update of updates) {
  let isSorted = true;
  for (const [pageIndex, page] of update.entries()) {
    const pageRules = rules.filter(
      ([f, s]) => page === f && update.includes(s),
    );
    for (const [_, after] of pageRules) {
      const afterPageIndex = update.findIndex((p) => p === after);
      isSorted &&= pageIndex < afterPageIndex;
      if (!isSorted) break;
    }
    if (!isSorted) break;
  }
  if (!isSorted) {
    const sorted = update.toSorted((a, b) =>
      rules.find(([before, after]) => a === after && b === before) ? 1 : -1,
    );
    sum += sorted[(sorted.length - 1) / 2];
  }
}

console.log(`The sum of the sorted invalid updates middle pages is ${sum}`);