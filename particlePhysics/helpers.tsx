export function pickRandomItemsFromArray<Type>(
  array: Type[],
  num: number
): Type | Type[] {
  let copy = [...array];
  if (num == 1) {
    return copy[Math.floor(Math.random() * copy.length)];
  } else {
    let randomList = [];
    for (let i = 0; i < num; i++) {
      let index = Math.floor(Math.random() * copy.length);
      let newItem = copy.splice(index, 1);
      randomList.push(...newItem);
    }
    return randomList;
  }
}

export function lerpStretchClamp(
  value: number,
  fromMin: number,
  fromMax: number,
  min: number,
  max: number
): number {
  if (value < fromMin) {
    return min;
  }
  if (value > fromMax) {
    return max;
  }
  return ((max - min) / (fromMax - fromMin)) * (value - fromMin) + min;
}

// export function executeFunctionByName(functionName: string, context: any /*, args */) {
//   var args = Array.prototype.slice.call(arguments, 2);
//   var namespaces = functionName.split(".");
//   var func = namespaces.pop();

//   //get deeper into nested contexts
//   for (var i = 0; i < namespaces.length; i++) {
//     context = context[namespaces[i]];
//   }
//   return context[func].apply(context, args);
// }
