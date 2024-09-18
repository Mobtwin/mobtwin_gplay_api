import { Router } from 'express';
import { index, getApps, getAppDetails, errorHandler, searchApps, getDeveloperApps, searchSuggestions, getSimilarApps, getAppReviews, getAppPermissions, getConstants, getAppDatasafety } from '../interactors/gplay.interactor.js';

export const appRouter = Router();

appRouter.get('/', index);
appRouter.get('/apps/', searchApps);
appRouter.get('/apps/', searchSuggestions);
appRouter.get('/apps/', getApps);
appRouter.get('/apps/:appId', getAppDetails);
appRouter.get('/apps/:appId/similar', getSimilarApps);
appRouter.get('/apps/:appId/datasafety', getAppDatasafety);
appRouter.get('/apps/:appId/permissions', getAppPermissions);
appRouter.get('/apps/:appId/reviews', getAppReviews);
appRouter.get('/developers/:devId', getDeveloperApps);
appRouter.get('/constants/', getConstants);

appRouter.use(errorHandler);


