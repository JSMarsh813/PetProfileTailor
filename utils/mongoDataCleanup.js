function deepTransform(obj) {
  //walks the data and stringifies all _ids + strips __v
  if (Array.isArray(obj)) {
    return obj.map(deepTransform);
  } else if (obj && typeof obj === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip unwanted fields
      if (key === "__v") continue;

      // Convert ObjectId -> string
      if (key === "_id" && value?.toString) {
        newObj[key] = value.toString();
      } else {
        newObj[key] = deepTransform(value);
      }
    }

    return newObj;
  }
  return obj;
}

export async function leanWithStrings(query) {
  const docs = await query.lean().exec();
  //.lean() gives raw JS objects without Mongoose wrappers.
  // .exec() actually runs the query, to get the query results instead of the query object itself
  return deepTransform(docs);
}
