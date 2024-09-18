import qs from 'querystring'

export const cleanUrls = (req) => (app) => ({
    ...app,
    playstoreUrl: app.url,
    url: buildUrl(req, 'apps/' + app.appId),
    permissions: buildUrl(req, 'apps/' + app.appId + '/permissions'),
    similar: buildUrl(req, 'apps/' + app.appId + '/similar'),
    reviews: buildUrl(req, 'apps/' + app.appId + '/reviews'),
    datasafety: buildUrl(req, 'apps/' + app.appId + '/datasafety'),
    devUrl : buildUrl(req, 'developers/' + qs.escape(app.developer))
  });
  
export const buildUrl = (req , subpath ) =>
    req.protocol + '://' + req.get('host') + req.baseUrl + '/' + subpath;
  
export const toList = (data) => ({ data: data });

export function isObject(value) {
  return typeof value === 'object' && value !== null;
}
