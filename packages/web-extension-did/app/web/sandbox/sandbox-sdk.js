/* eslint-disable */
import e from "events"; import *as t from "uuid"; import { aelf as a } from "@portkey/utils"; import { FetchRequest as s } from "@portkey/request"; import { getContractBasic as r } from "@portkey/contracts"; import "antd"; var c, i = ((c = i || {}).getBalances = "@portkey/did-ui-sdk:getBalances", c.callViewMethod = "@portkey/did-ui-sdk:callViewMethod", c.callSendMethod = "@portkey/did-ui-sdk:callSendMethod", c.getTransactionFee = "@portkey/did-ui-sdk:getTransactionFee", c.initViewContract = "@portkey/did-ui-sdk:initViewContract", c), o = (e => (e[e.error = 0] = "error", e[e.success = 1] = "success", e))(o || {}); new e; class n { static dispatch(e, a, s = "sandbox") { const r = document.getElementById(s), c = t.v4().replace(/-/g, ""); return r?.contentWindow.postMessage({ event: e, data: { ...a, sid: c } }, "*"), { event: e, sid: c } } static dispatchToOrigin(e, t) { e?.source?.postMessage({ ...t, eventName: e.data.event }, e.origin) } static listen({ event: e, sid: t }) { return new Promise((a => { window.addEventListener("message", (s => { s.data.eventName === e && s.data.sid === t && a(s.data) })) })) } static async dispatchAndReceive(e, t, a = "sandbox") { const s = n.dispatch(e, t, a); return await n.listen(s) } } const d = (e, t) => (e = (e => e?.error || e)(e)) ? "string" == typeof e ? e : "string" == typeof e.message ? e.message : t : t, l = "f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71"; a.getWallet(l); const p = {}, m = {}; class g { constructor() { this.listener() } static callback(e, t) { n.dispatchToOrigin(e, t) } listener() { window.addEventListener("message", (async function (e) { switch (e.data.event) { case i.callViewMethod: g.callViewMethod(e, g.callback); break; case i.callSendMethod: g.callSendMethod(e, g.callback); break; case i.getTransactionFee: g.getTransactionFee(e, g.callback); break; case i.initViewContract: g.initViewContract(e, g.callback) } })) } static async initViewContract(e, t) { const a = e.data.data ?? {}; try { const { rpcUrl: s, address: r, chainType: c } = a; return "aelf" !== c ? t(e, { code: o.error, message: "Not support", sid: a.sid }) : (await g._getELFViewContract(s, r), t(e, { code: o.error, message: "Not Support", sid: a.sid })) } catch (e) { } } static async _getELFViewContract(e, t, s = l) { let c = p?.[e]?.[t]; return c || (c = await r({ contractAddress: t, account: a.getWallet(s), rpcUrl: e }), p?.[e] || (p[e] = {}), p[e][t] = c), c } static async _getELFSendContract(e, t, s) { let c = m?.[e]?.[s]?.[t]; return c || (c = await r({ contractAddress: t, account: a.getWallet(s), rpcUrl: e }), m?.[e] || (m[e] = {}), m?.[e]?.[s] || (m[e][s] = {}), m[e][s][t] = c), c } static async callViewMethod(e, t) { const a = e.data.data ?? {}; try { const { rpcUrl: s, address: r, methodName: c, paramsOption: i = "", chainType: n } = a; if (!s || !r || !c) return t(e, { code: o.error, message: "Invalid argument", sid: a.sid }); if ("aelf" !== n) return t(e, { code: o.error, message: "Not support", sid: a.sid }); const d = await ((await g._getELFViewContract(s, r))?.callViewMethod(c, i)); if (d.error) return t(e, { code: o.error, error: d.error, sid: a.sid }); t(e, { code: o.success, message: d.data, sid: a.sid }) } catch (s) { t(e, { code: o.error, message: s?.error || s, sid: a.sid }) } } static async callSendMethod(e, t) { const s = e.data.data ?? {}; try { const { rpcUrl: r, address: c, methodName: i, privateKey: n, paramsOption: d, chainType: l, isGetSignTx: p = 0, sendOptions: m } = s, u = (e => { let t; return Object.entries(e).reverse().map((([e, a]) => { a || (t = e) })), t })({ rpcUrl: r, address: c, methodName: i }); if (u) return t(e, { code: o.error, message: `Miss Param: ${u}`, sid: s.sid }); if ("aelf" !== l) return t(e, { code: o.error, message: "Not support", sid: s.sid }); const w = a.getWallet(n), h = await g._getELFSendContract(r, c, n), f = await ((p ? h?.encodedTx : h?.callSendMethod)?.(i, w, d, m)); return t(e, f?.error ? { code: o.error, message: f.error?.message, sid: s.sid, error: f.error } : { code: o.success, message: f?.data, sid: s.sid }) } catch (a) { t(e, { code: o.error, message: d(a), sid: s.sid }) } } static async getTransactionFee(e, t) { const r = e.data.data ?? {}; try { const { rpcUrl: c, address: i, paramsOption: n, chainType: d, methodName: l, privateKey: p } = r; if ("aelf" !== d) throw "Not support"; const m = a.getAelfInstance(c), u = await g._getELFSendContract(c, i, p), w = await a.encodedTx({ instance: m, contract: u, functionName: l, paramsOption: n }); if (w.error) throw w.error; const h = await new s({}).send({ url: `${c}/api/blockChain/calculateTransactionFee`, method: "POST", params: { RawTransaction: w } }); if (!h?.Success) throw "Transaction failed"; t(e, { code: o.success, message: h.TransactionFee, sid: r.sid }) } catch (a) { return t(e, { code: o.error, message: a, sid: r.sid }) } } } new g;
//# sourceMappingURL=index.js.map
