'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import assert from 'assert';
import marked from 'marked';

export default function () {

  $.utils.checkNotEmpty = (v, n) => assert(!!v, `parameter ${n} is empty`);

  $.utils.fillData = async function (getData, list, sourceProp, targetProp, ...args) {
    $.utils.checkNotEmpty(list);
    $.utils.checkNotEmpty(sourceProp);
    $.utils.checkNotEmpty(targetProp);

    if (Array.isArray(list)) {

      const map = new Map();
      for (const item of list) {
        const id = item[sourceProp];
        let value = null;
        if (map.has(id)) {
          value = map.get(id);
        } else {
          try {
            value = await getData(id, ...args);
            map.set(id, value);
          } catch (err) {
            map.set(id, {$error: err});
          }
        }
        item[targetProp] = value;
      }
      map.clear();

    } else {

      list[targetProp] = await getData(list[sourceProp], ...args);

    }
    return list;
  };

  $.utils.fillDataFunction = function (getData) {
    $.utils.checkNotEmpty(getData);
    return function (list, sourceProp, targetProp, ...args) {
      return $.utils.fillData(getData, list, sourceProp, targetProp, ...args);
    }
  };

  $.utils.renderMarkdownFromDataItem = function (item, sourceProp = 'content', targetProp = 'html') {
    item[targetProp] = $.utils.renderMarkdownSafe(item[sourceProp]);
    return item;
  };

  $.utils.renderMarkdownFromDataList = function (list, sourceProp = 'content', targetProp = 'html') {
    return list.map(item => $.utils.renderMarkdownFromDataItem(item, sourceProp, targetProp));
  };

  $.utils.parseOrderBy = function (str, columns) {
    return str.split(',')
      .map(v => v.trim().split(':'))
      .filter(v => v.length === 2)
      .map(v => {
        return {column: v[0].trim(), direction: v[1].trim().toLowerCase() === 'asc' ? 'asc' : 'desc'};
      })
      .filter(v => v.column && v.direction && columns.indexOf(v.column) !== -1);
  };

};
