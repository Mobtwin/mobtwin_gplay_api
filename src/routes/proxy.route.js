import { Router } from "express";
import { checkInactiveProxiesHealth, proxy_add, proxy_check, proxy_status, clearInactiveProxies } from "../interactors/gplay.interactor.js";

export const proxyRouter = Router();


proxyRouter.get('/', proxy_status);
proxyRouter.post('/add', proxy_add);
proxyRouter.post('/check', proxy_check);
proxyRouter.post('/status', proxy_status);
proxyRouter.post('/inactive/check', checkInactiveProxiesHealth);
proxyRouter.post('/inactive/clear', clearInactiveProxies);
