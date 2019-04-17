/**
 * Handles generating DMS table mappings from a much simpler logical input.
 */
import { getLogger } from './util';
import { DateTime } from 'luxon';

const logger = getLogger('table-mapping', 'debug');

export interface OrCondition {
  operator: string;
  value?: string;
  start?: string;
  end?: string;
}

export interface AndFilter {
  column: string;
  orConditions: OrCondition[];
}

export interface Table {
  sourceName: string;
  andFilters?: AndFilter[];
  removeColumns?: string[];
}

export interface Options {
  sourceSchema: string;
  destSchema: string;
  tables: Table[];
}

export function generateTableMapping(options: Options): any {
  const config = { rules: [] };

  // first add a transformation rule from source to dest schema name...
  config.rules.push({
    'rule-type': 'transformation',
    'rule-id': '1',
    'rule-name': '1',
    'rule-action': 'rename',
    'rule-target': 'schema',
    'object-locator': {
      'schema-name': options.sourceSchema,
    },
    value: options.destSchema,
  });

  let index = 2; // rule 1 is above
  options.tables.forEach((element: Table) => {
    // then add include selection rules for every table...
    const rule: any = {
      'rule-type': 'selection',
      'rule-id': `${index}`,
      'rule-name': `${index}`,
      'object-locator': {
        'schema-name': options.sourceSchema,
        'table-name': element.sourceName,
      },
      'rule-action': 'include',
    };

    if (element.andFilters) {
      rule['filters'] = [];

      element.andFilters.forEach((andFilter: AndFilter) => {
        const filter: any = {
          'filter-type': 'source',
          'column-name': andFilter.column,
          'filter-conditions': [],
        };

        andFilter.orConditions.forEach((condition: OrCondition) => {
          if (condition.start) {
            // filter with two values
            filter['filter-conditions'].push({
              'filter-operator': condition.operator,
              'start-value': condition.start,
              'end-value': condition.end,
            });
          } else {
            // filter with one value
            filter['filter-conditions'].push({
              'filter-operator': condition.operator,
              value: condition.value,
            });
          }
        });

        rule['filters'].push(filter);
      });
    }

    config.rules.push(rule);
    index += 1;

    if (element.removeColumns) {
      // add rules for each column to remove
      element.removeColumns.forEach((column: string) => {
        const removeRule = {
          'rule-type': 'transformation',
          'rule-id': `${index}`,
          'rule-name': `${index}`,
          'rule-action': 'remove-column',
          'rule-target': 'column',
          'object-locator': {
            'schema-name': options.sourceSchema,
            'table-name': element.sourceName,
            'column-name': column,
          },
        };
        config.rules.push(removeRule);
        index += 1;
      });
    }
  });

  return config;
}

function findFilters(options: Options, tableName: string): AndFilter[] {
  const table: Table = options.tables.find(table => table.sourceName === tableName);
  let andFilters: AndFilter[] = table.andFilters;
  if (!andFilters) {
    andFilters = [];
    table.andFilters = andFilters;
  }
  return andFilters;
}

export function addBetweenFilter(options: Options,
                                 tableName: string,
                                 columnName: string,
                                 start: DateTime,
                                 end: DateTime) {
  const filter = {
    column: columnName,
    orConditions: [{
      operator: 'between',
      start: start.toISODate(),
      end: end.toISODate(),
    }],
  };
  findFilters(options, tableName).push(filter);
  logger.debug('Filtering %s on %s from %s to %s', tableName, columnName, start.toISODate(), end.toISODate());
}

export function addOnOrAfterFilter(options: Options, tableName: string, columnName: string, value: DateTime) {
  const filter = {
    column: columnName,
    orConditions: [{
      operator: 'gte',
      value: value.toISODate(),
    }],
  };
  findFilters(options, tableName).push(filter);
  logger.debug('Filtering %s on %s on or after %s', tableName, columnName, value.toISODate());
}

export function addOnOrBeforeFilter(options: Options, tableName: string, columnName: string, value: DateTime) {
  const filter = {
    column: columnName,
    orConditions: [{
      operator: 'ste',
      value: value.toISO(),
    }],
  };
  findFilters(options, tableName).push(filter);
  logger.debug('Filtering %s on %s on or before %s', tableName, columnName, value.toISO());
}
