/**
 *
 * Retrieve a given Variant from the data source.
 *
 * @param globalId
 *   GFH Global ID of the Variant to retrieve.
 *
 * @return {Object}
 *   The object representing the Variant.
 */
export default async (globalId) => {
  let apiPath = process.env.NODE_ENV === 'production' ? 'customiser-api' : 'http://local.godfreyhirst.com/customiser-api';

  let response = await fetch(`${apiPath}/variant/${globalId}`);
  response = await response.json();

  return response.variant;
}