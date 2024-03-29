import { Observable } from 'observable-fns';

export const parseCircuitUIResponseValue = data => {
	const { value, listContentSeperator, objValueSeperator, blockID } = data;

	return new Observable(observer => {
		try {
			const joernMethodKeysArr = [
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

      const ocularMethodKeysArr = [
				'id',
				'astParentFullName',
				'astParentType',
        'binarySignature',
				'code',
				'columnNumber',
				'columnNumberEnd',
        'depthFirstOrder',
				'filename',
				'fullName',
        'hasMapping',
				'hash',
        'internalFlags',
				'isExternal',
        'lineNumber',
        'lineNumberEnd',
        'name',
        'order',
        'signature',
        'varargParameter'
      ]

			let res = value.split('List[Method] = List(')[1];
			res = res.replaceAll(/"?\)\)/gi, ''); // replace '"))' or '))'
			res = res.replaceAll(
				/"?\n? *\)?,?\n? *Method\(\n? *= /gi,
				listContentSeperator,
			); // replace '"), Method( = '  or '), Method( = '  or 'Method( = ' or '"\n ),\n Method(\n = ' or '\n ),\n Method(\n = ' or '\n Method(\n = '
			res = res.replaceAll(/"?,\n? {0,5}= "?/gi, objValueSeperator); // replace '",  = "' or ',  = "' or '",  = ' or ',  = ' or '",\n  = "' or ',\n  = "' or '",\n  = ' or ',\n  = '
			res = res
				.split(listContentSeperator)
				.filter(str => !!str && str !== '\n ');

			res.forEach(str => {
				// this creates a nested loop. Any better way to do this?
				str = str.split(objValueSeperator);

        if(str.length === 15){

          const methodObj = {};
          str.forEach((value, index) => {
            methodObj[joernMethodKeysArr[index]] = value;
          });
          observer.next({ value: methodObj, blockID });

        }else if(str.length === 20){

          const methodObj = {};
          str.forEach((value, index) => {
            methodObj[ocularMethodKeysArr[index]] = value;
          });
          observer.next({ value: methodObj, blockID });

        }else {
          throw {};// eslint-disable-line no-throw-literal
        }

			});
		} catch (e) {
			observer.next({ value, blockID });
			observer.complete();
		}
	});
};
