import { Observable } from 'observable-fns';

export const parseCircuitUIResponseValue = data => {
  let { value, listContentSeperator, objValueSeperator } = data;

  return new Observable(observer => {
    try {
      const keysArr = [
        'id',
        'astParentFullName',
        'astParentType',
        'code',
        'columnNumber',
        'columnNumberEnd',
        'filename',
        'fullName',
        'hash',
        'isExternal',
        'lineNumber',
        'lineNumberEnd',
        'name',
        'order',
        'signature',
      ];

      let res = value.split('List[Method] = List(')[1];
      res = res.replaceAll(/"?\)\)/gi, ''); // replace '"))' or '))'
      res = res.replaceAll(/"?\)?,? ?Method\( = /gi, listContentSeperator); // replace '"), Method( = '  or '), Method( = '  or 'Method( = '
      res = res.replaceAll(/"?,  = "?/gi, objValueSeperator); // replace '",  = "' or ',  = "' or '",  = ' or ',  = '

      res = res
        .split(listContentSeperator)
        .filter(str => !!str && str !== '\n ');

      res.forEach((str, index) => {
        //this creates a nested loop. Any better way to do this?
        str = str.split(objValueSeperator);
        if (str.length !== 15) throw 'error';
        const methodObj = {};

        str.forEach((value, index) => {
          methodObj[keysArr[index]] = value;
        });
        observer.next(methodObj);
      });
    } catch (e) {
      observer.next(value);
      observer.complete();
    }
  });
};
