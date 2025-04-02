import g_play from "g-scraper";
import qs from "querystring";
import { buildUrl, cleanUrls, isObject, toList } from "../utils/app.utils.js";
import { Proxy } from "../utils/proxy.utils.js";

const THROTTLE = undefined;

// proxies storage
const proxyStorage = new Proxy();

//const { memoized } = g_play;

// memoized functions
//const gplay = memoized({ maxAge: 1000 * 60 * 60, max: 10 });

const gplay = g_play;

// available url's
export const index = async (req, res) => res.json({
  apps: buildUrl(req, "apps"),
  developers: buildUrl(req, "developers"),
  categories: buildUrl(req, "categories"),
});

// app search
export const searchApps = async (req, res, next) => {
  if (!req.query.q || !isObject(req.query)) {
    return next();
  }
  const num = parseInt(req.query.num || "25");
  const start = parseInt(req.query.start || "0");

  function paginate(apps) {
    if (start - num >= 0) {
      req.query.start = (start - num).toString();
      apps.prev = buildUrl(req, "apps/") + "?" + qs.stringify(req.query);
    }
    if (start + num <= apps.data.length) {
      req.query.start = (start + num).toString();
      apps.next = buildUrl(req, "apps/") + "?" + qs.stringify(req.query);
    }
    return apps;
  }
  const proxy = proxyStorage.getNextProxy();
  if (proxy) {
    gplay
      .search({
        throttle: THROTTLE,
        term: req.query.q,
        lang: req.query.lang,
        country: req.query.country,
        price: req.query.price,
        proxy,
      })
      .then((apps) => apps.slice(start, start + num).map(cleanUrls(req)))
      .then(toList)
      .then(paginate)
      .then(res.json.bind(res))
      .catch((err) => {
        if (
          err.message ===
          "Error requesting Google Play:timeout of 5000ms exceeded"
        ) {
          proxyStorage.checkActiveOne(proxy);
          searchApps(req, res, next);
        } else {
          next(err);
        }
      });
  } else {
    res.json({ message: "no proxy available" });
  }
};

// search suggestions
export const searchSuggestions = async (req, res, next) => {
  if (!req.query.suggest) {
    return next();
  }

  const toJSON = (term) => ({
    term,
    url: buildUrl(req, "apps/") + "?" + qs.stringify({ q: term }),
  });
  const proxy = proxyStorage.getNextProxy();
  if (proxy) {
    gplay
      .suggest({
        throttle: THROTTLE,
        term: req.query.suggest,
        lang: req.query.lang,
        country: req.query.country,
        proxy,
      })
      .then((terms) => terms.map(toJSON))
      .then(toList)
      .then(res.json.bind(res))
      .catch((err) => {
        if (
          err.message ===
          "Error requesting Google Play:timeout of 5000ms exceeded"
        ) {
          proxyStorage.checkActiveOne(proxy);
          searchSuggestions(req, res, next);
        } else {
          next(err);
        }
      });
  } else {
    res.json({ message: "no proxy available" });
  }
};

// list apps
export const getApps = async (req, res, next) => {
  if (isObject(req.query)) {
    const num = parseInt(req.query.num || "25");
    const start = parseInt(req.query.start || "0");

    function paginate(apps) {
      if (start - num >= 0) {
        req.query.start = (start - num).toString();
        apps.prev = buildUrl(req, "apps/") + "?" + qs.stringify(req.query);
      }
      if (start + num <= apps.data.length) {
        req.query.start = (start + num).toString();
        apps.next = buildUrl(req, "apps/") + "?" + qs.stringify(req.query);
      }
      return apps;
    }
    const opt = req.query;
    const proxy = proxyStorage.getNextProxy();
    if (proxy) {
      gplay
        .list({
          ...opt,
          proxy,
        })
        .then((apps) => apps.slice(start, start + num).map(cleanUrls(req)))
        .then(toList)
        .then(paginate)
        .then(res.json.bind(res))
        .catch((err) => {
          if (
            err.message ===
            "Error requesting Google Play:timeout of 5000ms exceeded"
          ) {
            proxyStorage.checkActiveOne(proxy);
            getApps(req, res, next);
          } else {
            next(err);
          }
        });
    } else {
      res.json({ message: "no proxy available" });
    }
  }
};

// app details
export const getAppDetails = async (req, res, next) => {
  const appId = req.params.appId;
  const opt = req.query;
  const proxy = proxyStorage.getNextProxy();
  if (proxy) {
    gplay
      .app({ appId, proxy, ...opt })
      //.then((app) => cleanUrls(req)(app))
      .then(res.json.bind(res))
      .catch((err) => {
        if (
          err.message ===
          "Error requesting Google Play:timeout of 5000ms exceeded"
        ) {
          proxyStorage.checkActiveOne(proxy);
          getAppDetails(req, res, next);
        } else {
          next(err);
        }
      });
  } else {
    res.json({ message: "no proxy available" });
  }
};

//similar apps
export const getSimilarApps = async (req, res, next) => {
  const proxy = proxyStorage.getNextProxy();
  if (proxy) {
    gplay
      .similar({
        throttle: THROTTLE,
        appId: req.params.appId,
        country: req.query.country,
        lang: req.query.lang,
        proxy,
      })
      .then((apps) => apps.map(cleanUrls(req)))
      .then(toList)
      .then(res.json.bind(res))
      .catch((err) => {
        if (
          err.message ===
          "Error requesting Google Play:timeout of 5000ms exceeded"
        ) {
          proxyStorage.checkActiveOne(proxy);
          getSimilarApps(req, res, next);
        } else {
          next(err);
        }
      });
  } else {
    res.json({ message: "no proxy available" });
  }
};

// app data safety
export const getAppDatasafety = async (req, res, next) => {
  const proxy = proxyStorage.getNextProxy();
  const opts = Object.assign({ appId: req.params.appId, proxy }, req.query);
  if (proxy) {
    gplay
      .datasafety(opts)
      .then(toList)
      .then(res.json.bind(res))
      .catch((err) => {
        if (
          err.message ===
          "Error requesting Google Play:timeout of 5000ms exceeded"
        ) {
          proxyStorage.checkActiveOne(proxy);
          getAppDatasafety(req, res, next);
        } else {
          next(err);
        }
      });
  } else {
    res.json({ message: "no proxy available" });
  }
};

// app permissions
export const getAppPermissions = async (req, res, next) => {
  const proxy = proxyStorage.getNextProxy();
  if (proxy) {
    gplay
      .permissions({
        ...req.query,
        throttle: THROTTLE,
        appId: req.params.appId,
        proxy,
      })
      .then(toList)
      .then(res.json.bind(res))
      .catch((err) => {
        if (
          err.message ===
          "Error requesting Google Play:timeout of 5000ms exceeded"
        ) {
          proxyStorage.checkActiveOne(proxy);
          getAppPermissions(req, res, next);
        } else {
          next(err);
        }
      });
  } else {
    res.json({ message: "no proxy available" });
  }
};

// app reviews
export const getAppReviews = async (req, res, next) => {
  const correctTheResult = (reviews) => {
    if (!reviews.nextPaginationToken) return { data: reviews.data };
    req.query.nextPaginationToken = reviews.nextPaginationToken;
    const next =
      buildUrl(req, "apps/") +
      `${req.params.appId}/reviews/?` +
      qs.stringify(req.query);
    return {
      data: reviews.data,
      next,
    };
  };
  const proxy = proxyStorage.getNextProxy();
  const opts = req.query;
  if (proxy) {
    gplay
      .reviews({
        ...opts,
        throttle: THROTTLE,
        appId: req.params.appId,
        num: 10,
        proxy,
      })
      .then(correctTheResult)
      .then(res.json.bind(res))
      .catch((err) => {
        if (
          err.message ===
          "Error requesting Google Play:timeout of 5000ms exceeded"
        ) {
          proxyStorage.checkActiveOne(proxy);
          getAppReviews(req, res, next);
        } else {
          next(err);
        }
      });
  } else {
    res.json({ message: "no proxy available" });
  }
};

// developer apps
export const getDeveloperApps = async (req, res, next) => {
  const proxy = proxyStorage.getNextProxy();
  const opts = { devId: req.params.devId, ...req.query, proxy };
  if (proxy) {
    gplay
      .developer(opts)
      .then((apps) => apps.map(cleanUrls(req)))
      .then((apps) => ({
        devId: req.params.devId,
        apps,
        proxy: proxyStorage.getNextProxy(),
      }))
      .then(res.json.bind(res))
      .catch((err) => {
        if (
          err.message ===
          "Error requesting Google Play:timeout of 5000ms exceeded"
        ) {
          proxyStorage.checkActiveOne(proxy);
          getDeveloperApps(req, res, next);
        } else {
          next(err);
        }
      });
  } else {
    res.json({ message: "no proxy available" });
  }
};

// categories
export const getConstants = async (req, res, next) => {
  try {
    res.json.bind(res)(
      toList({
        categories: gplay.category,
        collections: gplay.collection,
        age: gplay.age,
        sort: gplay.sort,
      })
    );
  } catch (e) {
    next(e);
  }
};

// error handler
export const errorHandler = async (err, req, res, next) => {
  res.status(400).json({ message: err.message });
  next();
};

/* proxy */

export const proxy_add = async (req, res) => {
  if (req.body?.proxies) {
    await proxyStorage.addProxies([...req.body.proxies?.v6, ...req.body.proxies?.v6]);
    res.json({
      message: "proxies successfully received",
    });
  } else {
    res.json({
      message: "need to provide proxies list",
    });
  }
};

export const proxy_status = async (req, res) => {
  res.json({
    activeProxies: proxyStorage.activeProxies,
    inactiveProxies: proxyStorage.inActiveProxies,
  });
};

export const proxy_check = async (req, res) => {
  if (req.body.proxy) {
    const result = await proxyStorage.checkProxy(
      await proxyStorage.toProxyObject(req.body.proxy)
    );
    res.json({
      isWork: result,
    });
  } else {
    res.json({
      message: "need to provide a proxy to check",
    });
  }
};

export const checkInactiveProxiesHealth = async (req, res) => {
  proxyStorage.checkInactiveProxiesHealth();
  res.json({
    message: "checking inactive proxies health",
  });
};

export const clearInactiveProxies = async (req, res) => {
  proxyStorage.removeInActiveProxies();
  res.json({
    message: "clearing inactive proxies",
  });
};

