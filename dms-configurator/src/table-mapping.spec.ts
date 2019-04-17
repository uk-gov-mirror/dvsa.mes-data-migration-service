/**
 * Tests for the table mapping functionality.
 */
import { generateTableMapping, Options } from './table-mapping';
import { loadJSON } from './util';

describe('generateTableMapping', () => {

  it('handles a single table', () => {
    const input: Options = loadTestJSON('input-single-table');
    expect(generateTableMapping(input)).toEqual(loadTestJSON('output-single-table'));
  });

  it('handles multiple tables', () => {
    const input: Options = loadTestJSON('input-multiple-tables');
    expect(generateTableMapping(input)).toEqual(loadTestJSON('output-multiple-tables'));
  });

  it('handles a single table with filter', () => {
    const input: Options = loadTestJSON('input-single-table-with-filter');
    expect(generateTableMapping(input)).toEqual(loadTestJSON('output-single-table-with-filter'));
  });

  it('handles a single table with or filter', () => {
    const input: Options = loadTestJSON('input-single-table-with-or-filter');
    expect(generateTableMapping(input)).toEqual(loadTestJSON('output-single-table-with-or-filter'));
  });

  it('handles a single table with and filter', () => {
    const input: Options = loadTestJSON('input-single-table-with-and-filter');
    expect(generateTableMapping(input)).toEqual(loadTestJSON('output-single-table-with-and-filter'));
  });

  it('handles a single table with between filter', () => {
    const input: Options = loadTestJSON('input-single-table-with-between');
    expect(generateTableMapping(input)).toEqual(loadTestJSON('output-single-table-with-between'));
  });

  it('handles a single table removing columns', () => {
    const input: Options = loadTestJSON('input-single-table-remove-columns');
    expect(generateTableMapping(input)).toEqual(loadTestJSON('output-single-table-remove-columns'));
  });
});

function loadTestJSON(name: string): any {
  return loadJSON(`src/test-data/${name}.json`);
}
