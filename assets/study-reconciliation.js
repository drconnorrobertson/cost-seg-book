(function () {
  'use strict';
  const fields = ['source', 'land', 'excluded', 'reported', 'a', 'b', 'c'];
  function cents(value) {
    const text = String(value).trim();
    if (!/^\d{1,12}(?:\.\d{1,2})?$/.test(text)) throw new Error('Enter every amount as a nonnegative number with up to two decimal places, without commas or currency symbols. Enter 0 only when it is confirmed.');
    const parts = text.split('.');
    return Number(parts[0]) * 100 + Number((parts[1] || '').padEnd(2, '0'));
  }
  function calculate(values) {
    const n = Object.fromEntries(fields.map(key => [key, cents(values[key])]));
    const expected = n.source - n.land - n.excluded;
    if (expected < 0) throw new Error('Land and other exclusions exceed the source total. Review those inputs before comparing the report.');
    const grouped = n.a + n.b + n.c;
    return {expected, grouped, reported: n.reported, sourceDifference: n.reported - expected, groupedDifference: grouped - n.reported};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {cents, calculate};
  if (typeof document === 'undefined') return;
  const form = document.getElementById('study-reconciliation-form');
  if (!form) return;
  const result = document.getElementById('study-reconciliation-result');
  const format = amount => (amount / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const read = () => Object.fromEntries(fields.map(key => [key, form.elements.namedItem(key).value]));
  function render() {
    try {
      const r = calculate(read());
      result.className = 'study-reconciliation-result';
      const rows = [
        ['Expected analyzed pool from your source inputs', r.expected],
        ['Report stated analyzed pool', r.reported],
        ['Report pool minus expected source pool', r.sourceDifference],
        ['Total of report groups A, B and C', r.grouped],
        ['Grouped total minus report stated pool', r.groupedDifference]
      ];
      result.replaceChildren();
      const heading = document.createElement('p');
      heading.textContent = r.sourceDifference === 0 && r.groupedDifference === 0 ? 'The entered totals reconcile arithmetically. This does not validate the inputs or tax treatment.' : 'There is an unexplained arithmetic difference. Ask the preparer to reconcile it; do not use land or another amount as a balancing entry.';
      result.append(heading);
      const list = document.createElement('dl');
      rows.forEach(([label, amount]) => {
        const term = document.createElement('dt'); term.textContent = label;
        const value = document.createElement('dd'); value.textContent = format(amount);
        list.append(term, value);
      });
      result.append(list);
      return r;
    } catch (error) {
      result.className = 'study-reconciliation-result study-reconciliation-error';
      result.textContent = error.message;
      return null;
    }
  }
  form.addEventListener('submit', event => {event.preventDefault(); render();});
  document.getElementById('study-reconciliation-example').addEventListener('click', () => {
    const example = {source:'800000', land:'100000', excluded:'0', reported:'700000', a:'100000', b:'50000', c:'550000'};
    fields.forEach(key => {form.elements.namedItem(key).value = example[key];});
    render();
  });
  document.getElementById('study-reconciliation-clear').addEventListener('click', () => {
    form.reset(); result.className = 'study-reconciliation-result';
    result.textContent = 'Entries cleared. Complete every field before checking the totals.';
  });
  // Keep outputs synchronized with the visible inputs; do not leave an old result beside edited figures.
  form.addEventListener('input', () => {result.textContent = 'Inputs changed. Check totals again to refresh the result.'; result.className = 'study-reconciliation-result';});
  document.getElementById('study-reconciliation-export').addEventListener('click', () => {
    const r = render(); if (!r) return;
    const values = read();
    const rows = [['Item','Amount in entered currency units'], ...fields.map(key => [key, format(cents(values[key])).replace(/,/g,'')]), ...Object.entries(r).map(([key,value]) => [key,format(value).replace(/,/g,'')]), ['Scope','Arithmetic only; input support and tax treatment require professional review']];
    const csv = rows.map(row => row.map(value => '"' + String(value).replace(/"/g,'""') + '"').join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'study-reconciliation.csv';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
