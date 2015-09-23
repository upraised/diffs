function applyDiff (val0, diff) {
  if (diff === null) {
    return undefined;
  } else if (typeof diff === 'object' && !Array.isArray(diff)) {
    if (diff._set !== undefined) {
      return diff._set;
    }
    if (val0 === null || typeof val0 !== 'object' || Array.isArray(val0)) {
      val0 = {};
    }
    const val1 = {};
    let key, val;
    for (key in diff) {
      val = applyDiff(val0[key], diff[key]);
      if (val === undefined) continue;
      val1[key] = val;
    }
    for (key in val0) {
      if (key in diff) continue;
      val1[key] = val0[key];
    }
    return val1;
    // if (diffed) {
    //   return val1;
    // } else {
    //   return undefined;
    // }
  } else return diff;
}

exports.applyDiff = applyDiff;

function applyDiffMutate (val0, diff) {
  if (typeof diff === 'object' &&
    diff !== null &&
    !Array.isArray(diff)) {
    if (typeof val0 !== 'object' ||
      val0 === null ||
      Array.isArray(val0)) return;
    let key, val;
    for (key in diff) {
      val = applyDiff(val0[key], diff[key]);
      if (val === undefined) {
        delete val0[key];
      } else {
        val0[key] = val;
      }
    }
  }
  return;
}

exports.applyDiffMutate = applyDiffMutate;

function computeDiff (val0, val1) {
  if (val1 !== null && typeof val1 === 'object' && !Array.isArray(val1)) {
    if (val0 === null || typeof val0 !== 'object' || Array.isArray(val0)) {
      return val1;
    }
    const diff = {};
    let key, subDiff, diffed;
    for (key in val1) {
      subDiff = computeDiff(val0[key], val1[key]);
      if (subDiff !== undefined) {
        diff[key] = subDiff;
        diffed = true;
      }
    }
    for (key in val0) {
      if (key in val1) continue;
      diff[key] = null;
      diffed = true;
    }
    if (diffed) {
      return diff;
    } else {
      return undefined;
    }
  } else if (val1 === val0) {
    return undefined;
  } else if (val1 === undefined || val1 === '') {
    return null;
  } else if (val1 === null) {
    return {_set: null};
  } else {
    return val1;
  }
}

exports.computeDiff = computeDiff;
