'use strict'
function array_wrap(value) {
  if (value instanceof Array) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }

  return [value];
}


export {
  array_wrap
}
