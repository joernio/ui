export const parseCircuitUIResponseValue = data => {
  const { callerID } = data;
  const end = true;
  let [value, listContentSeperator, objValueSeperator] =
    data[Object.keys(data)[0]];

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

    res = res.split(listContentSeperator).filter(str => !!str && str !== '\n ');

    res.forEach((str, index) => {
      //this creates a nested loop. Any better way to do this?
      str = str.split(objValueSeperator);
      const end = index === res.length - 1 ? true : false;

      if (str.length !== 15) throw 'error';
      const methodObj = {};
      str.forEach((value, index) => {
        methodObj[keysArr[index]] = value;
      });
      postMessage({ parseCircuitUIResponseValue: methodObj, callerID, end });
    });
  } catch (e) {
    postMessage({ parseCircuitUIResponseValue: value, callerID, end });
  }
};
