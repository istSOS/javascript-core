(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["istsos"] = factory();
	else
		root["istsos"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdateistsos"];
/******/ 	this["webpackHotUpdateistsos"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "66f64b4abc8eaab4fecf"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(18)(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
/**
 * Simple promisified HTTP request API
 * @type {Object}
 */
var HttpAPI = exports.HttpAPI = {
   _request: function _request(config) {
      return new Promise(function (resolve, reject) {
         var xhr = new XMLHttpRequest();

         xhr.open(config.method || "GET", config.url);

         if (config.headers) {
            Object.keys(config.headers).forEach(function (key) {
               xhr.setRequestHeader(key, config.headers[key]);
            });
         }
         xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {

               if (JSON.parse(xhr.response).success) {
                  resolve(JSON.parse(xhr.response));
               } else {
                  reject(JSON.parse(xhr.response).message);
               }
            } else {
               reject(xhr.statusText);
            }
         };
         xhr.onerror = function () {
            return reject(xhr.statusText);
         };
         xhr.send(config.data);
      });
   },
   get: function get(url, opt_config) {
      var config = {};
      config.method = "GET";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }
      return HttpAPI._request(config);
   },
   put: function put(url, opt_config) {
      var config = {};
      config.method = "PUT";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   },
   post: function post(url, opt_config) {
      var config = {};
      config.method = "POST";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   },
   delete: function _delete(url, opt_config) {
      var config = {};
      config.method = "DELETE";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EventEmitter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventTypes = __webpack_require__(6);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class istsos.EventEmitter
 */
var EventEmitter = exports.EventEmitter = function () {
	/**
   * constructor - Instantiates istsos.EventEmitter
   *
   * @constructor
   */
	function EventEmitter() {
		_classCallCheck(this, EventEmitter);

		this.events = {};
	}

	/**
  * @param  {String}
  * @param  {Function}
  * @return {istsos.EventEmitter}
  */


	_createClass(EventEmitter, [{
		key: "on",
		value: function on(event, callback) {
			if (!_EventTypes.EventTypes.hasOwnProperty(event)) {
				throw "EVENT TYPE NOT RECOGNIZED!!!";
			}

			(this.events[event] = this.events[event] || []).push(callback);

			return this;
		}
	}, {
		key: "once",
		value: function once(event, callback) {
			function on() {
				this.off(event, on);
				callback.apply(this, arguments);
			}

			on.callback = callback;

			this.on(event, on);

			return this;
		}
	}, {
		key: "off",
		value: function off(event, callback) {
			if (this.events[event]) {
				this._removeHandler(event, callback);
			}

			return this;
		}
	}, {
		key: "fire",
		value: function fire(event, data) {
			this.events[event] = this.events[event] || [];
			for (var i = 0; i < this.events[event].length; i++) {
				this.events[event][i].apply(this, [data]);
			}
		}
	}, {
		key: "_removeHandler",
		value: function _removeHandler(event, callback) {
			this.events[event] = this.events[event] || [];
			for (var i = 0; i < this.events[event].length; i++) {
				if (this.events[event][i] === callback) {
					this.events[event].splice(i, 1);
					break;
				}
			}
		}
	}, {
		key: "unlistenAll",
		value: function unlistenAll() {
			for (e in this.events.length) {
				delete this.events[e];
			}
		}
	}]);

	return EventEmitter;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.transformGetObservationsResponse = exports.prepareForGetObservations = exports.ConstraintInputs = exports.validateConstraintInput = undefined;

var _Date = __webpack_require__(5);

/**
 * Constraint inputs map for observed property
 * @type {Object}
 */
var ConstraintInputs = {
   "between": "interval",
   "lessThan": "max",
   "greaterThan": "min",
   "valueList": "valueList"
};

var aggregateFunctions = ["SUM", "MAX", "MIN", "AVG"];

/**
 * Constraint input validation
 * @param  {String} constraintType  Type of constraint
 * @param  {int} constraintValue    Constraint value
 * @return {boolean}    Returns validation confirmation - true or false
 */
var validateConstraintInput = function validateConstraintInput(constraintType, constraintValue) {
   switch (constraintType) {
      case 'between':
         if (constraintValue.constructor !== Array) {
            return false;
         } else {
            return true;
         }
      case 'lessThan':
         if (constraintValue !== parseInt(constraintValue, 10)) {
            return false;
         } else {
            return true;
         }
      case 'greaterThan':
         if (constraintValue !== parseInt(constraintValue, 10)) {
            return false;
         } else {
            return true;
         }
      case 'valueList':
         if (constraintValue.constructor !== Array) {
            return false;
         } else {
            return true;
         }
      default:
         throw 'Constraint type must be "between", "lessThan", "greaterThan" or "valueList"';
         return false;
   }
};

/**
 * Prepare input data for getObservation request based on type and config
 * @param  {String} type       One of the observation getter types
 * @param  {Object} options    Required params for get observation request
 * @param  {Object} opt_config Config object for data aggregation or quality index constraint
 * @return {[type]}            [description]
 */
var prepareForGetObservations = function prepareForGetObservations(options, opt_config, opt_type) {
   var config = {};
   if (opt_type && opt_type === 'aggregation') {
      config["aggregationURL"] = prepareDataAggregation(opt_config);
   }
   config['offering'] = options.offering.getOfferingJSON()['name'];
   config['procedureNames'] = prepareProcedureNames(options.procedures);
   config['observedPropertyUrns'] = prepareObservedPropertyUrns(options.observedProperties);
   config['begin'] = options.begin.constructor === _Date.Date ? options.begin.getDateString() : options.begin;
   config['end'] = options.end.constructor === _Date.Date ? options.end.getDateString() : options.end;
   return config;
};

var prepareDataAggregation = function prepareDataAggregation(aggregationConfig) {
   var url = '';
   if (aggregationConfig.aggFunc && aggregationConfig.aggInterval) {
      url += '?';

      if (aggregateFunctions.indexOf(aggregationConfig.aggFunc) > 0) {
         url += "aggregatefunction=" + aggregationConfig.aggFunc + "&aggregateinterval=" + aggregationConfig.aggInterval;
      } else {
         throw "AGGREGATE FUNCTION NOT RECOGNIZED! SHOULD BE 'MAX', 'MIN', 'SUM' OR 'AVG'!";
      }

      if (aggregationConfig.aggNoData && aggregationConfig.aggNoDataQI) {
         url += "&aggregatenodata=" + aggregationConfig.aggNoData.toString() + "&aggregatenodataqi=" + aggregationConfig.aggNoDataQI.toString();
      }
   }
   return url;
};

var prepareProcedureNames = function prepareProcedureNames(procedures) {
   var names = [];
   procedures.forEach(function (p) {
      if (p.systemType === 'virtual') {
         names.push(p.getVirtualProcedureJSON()['system']);
      } else if (p.systemType === 'insitu-fixed-point' || p.systemType === 'insitu-mobile-point') {
         names.push(p.getProcedureJSON()['system']);
      } else {
         throw p + ": WRONG PROCEDURE SYSTEM TYPE!!!";
      }
   });
   return names.toString();
};

var prepareObservedPropertyUrns = function prepareObservedPropertyUrns(observedProperties) {
   var urns = [];
   for (var op = 0; op < observedProperties.length; op++) {
      urns.push(observedProperties[op].definitionUrn);
   }
   return urns.toString();
};

var handleMultiplePropertyValues = function handleMultiplePropertyValues(measurements, type) {
   var list = [];
   switch (type) {
      case 'simple':

         for (var i = 0; i < measurements.length; i++) {
            if (i == 0) {
               list.push(measurements[i]);
            }

            if (i != 0 && i % 2) {
               list.push(measurements[i]);
            }
         }
         return list;
         break;
      case 'constraint':
         // statements_1
         break;
      default:
         // statements_def
         break;
   }
};

var transformGetObservationsResponse = function transformGetObservationsResponse(type, response, constraintFilter) {
   switch (type) {
      case "simple":
         var values = response.data[0].result.DataArray.values;

         var transformed = [];
         for (var i = 0; i < values.length; i++) {
            if (values[i].length > 3) {
               transformed.push(handleMultiplePropertyValues(values[i], 'simple'));
            } else {
               transformed.push({
                  "date": values[i][0],
                  "measurement": values[i][1]
               });
            }
         }
         return transformed;
         break;
      case "constraint":
         var values = response.data[0].result.DataArray.values;

         var transformed = [];
         for (var _i = 0; _i < values.length; _i++) {
            var measurement = filterByConstraint(values[_i], constraintFilter.type, constraintFilter.quality);
            if (measurement != undefined) {
               transformed.push(measurement);
            }
         }
         response.data[0].result.DataArray.values = transformed;
         return response;
         break;
      default:
         throw "OBSERVATION METHOD TYPE NOT RECOGNIZED!";
         break;
   }
};

var filterByConstraint = function filterByConstraint(measurement, type, value) {

   switch (type) {
      case "lessThan":
         if (parseInt(measurement[2]) < parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "lessThanAndEqual":
         if (parseInt(measurement[2]) <= parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "equal":
         if (parseInt(measurement[2]) === parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "greaterThanAndEqual":
         if (parseInt(measurement[2]) >= parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "greaterThan":
         if (parseInt(measurement[2]) > parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "between":
         if (parseInt(measurement[2]) >= parseInt(value)[0] && parseInt(measurement[2]) <= parseInt(value)[1]) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      default:
         throw "WRONG CONSTRAINT TYPE FOR CHECKING QUALITY INDEX!!! SHOULD BE 'lessThan', 'lessThanAndEqual', 'equal', 'greaterThanAndEqual', 'greaterThan' or 'between'";
   }
};

exports.validateConstraintInput = validateConstraintInput;
exports.ConstraintInputs = ConstraintInputs;
exports.prepareForGetObservations = prepareForGetObservations;
exports.transformGetObservationsResponse = transformGetObservationsResponse;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Configuration = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.Configuration
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var Configuration = exports.Configuration = function (_EventEmitter) {
   _inherits(Configuration, _EventEmitter);

   /**
    * constructor - instantiates istsos.Configuration
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function Configuration(options) {
      _classCallCheck(this, Configuration);

      var _this = _possibleConstructorReturn(this, (Configuration.__proto__ || Object.getPrototypeOf(Configuration)).call(this));

      _this.serviceName = options.serviceName ? options.serviceName : "default";
      _this.server = options.server;
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(Configuration, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'fire', this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'on', this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'once', this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'off', this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'unlistenAll', this).call(this);
      }

      /**
       * Get configuration information from the server
       * 
       * @return {Promise} 
       * @fires  istsos.Configuration#CONFIGSECTIONS            
       */

   }, {
      key: 'getConf',
      value: function getConf() {
         var _this2 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('CONFIGSECTIONS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get provider information from the server
       * 
       * @return {Promise} 
       * @fires  istsos.Configuration#PROVIDER            
       */

   }, {
      key: 'getProvider',
      value: function getProvider() {
         var _this3 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/provider';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('PROVIDER', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Update provider information on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.Configuration#UPDATE_PROVIDER            
       */

   }, {
      key: 'updateProvider',
      value: function updateProvider() {
         var _this4 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/provider';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('UPDATE_PROVIDER', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get identification information from the server
       * 
       * @return {Promise} 
       * @fires  istsos.Configuration#IDENTIFICATION            
       */

   }, {
      key: 'getIdentification',
      value: function getIdentification() {
         var _this5 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/identification';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('IDENTIFICATION', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Update identification information on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.Configuration#UPDATE_IDENTIFICATION            
       */

   }, {
      key: 'updateIdentification',
      value: function updateIdentification() {
         var _this6 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/identification';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this6.fireEvent('UPDATE_IDENTIFICATION', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get MQTT information from the server
       * 
       * @return {Promise} 
       * @fires  istsos.Configuration#MQTT            
       */

   }, {
      key: 'getMqtt',
      value: function getMqtt() {
         var _this7 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/mqtt';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this7.fireEvent('MQTT', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Update MQTT information on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.Configuration#UPDATE_MQTT            
       */

   }, {
      key: 'updateMqtt',
      value: function updateMqtt() {
         var _this8 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/mqtt';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this8.fireEvent('UPDATE_MQTT', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get coordinate reference system information from the server
       * 
       * @return {Promise} 
       * @fires  istsos.Configuration#CRS            
       */

   }, {
      key: 'getCrs',
      value: function getCrs() {
         var _this9 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/geo';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this9.fireEvent('CRS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Update CRS information on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.Configuration#UPDATE_CRS            
       */

   }, {
      key: 'updateCrs',
      value: function updateCrs() {
         var _this10 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/geo';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this10.fireEvent('UPDATE_CRS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get observation configuration information from the server
       * 
       * @return {Promise} 
       * @fires  istsos.Configuration#OBSERVATION_CONF            
       */

   }, {
      key: 'getObservationConf',
      value: function getObservationConf() {
         var _this11 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/getobservation';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this11.fireEvent('OBSERVATION_CONF', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Update observation configuration information on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.Configuration#UPDATE_OBSERVATION_CONF            
       */

   }, {
      key: 'updateObservationConf',
      value: function updateObservationConf() {
         var _this12 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/getobservation';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this12.fireEvent('UPDATE_OBSERVATION_CONF', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get proxy information from the server
       * 
       * @return {Promise} 
       * @fires  istsos.Configuration#PROXY            
       */

   }, {
      key: 'getProxy',
      value: function getProxy() {
         var _this13 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/serviceurl';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this13.fireEvent('PROXY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Update proxy information on the server
       *
       * @param {string} newUrl New proxy URL
       * @return {Promise} 
       * @fires  istsos.Configuration#UPDATE_PROXY            
       */

   }, {
      key: 'updateProxy',
      value: function updateProxy() {
         var _this14 = this;

         var newUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

         var data = {
            "url": newUrl || ""
         };
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/serviceurl';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this14.fireEvent('UPDATE_PROXY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get EPSG codes from the server
       * 
       * @return {Promise} 
       * @fires  istsos.Configuration#EPSG_CODES            
       */

   }, {
      key: 'getEpsgCodes',
      value: function getEpsgCodes() {
         var _this15 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/epsgs';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this15.fireEvent('EPSG_CODES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }]);

   return Configuration;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.ProcedureBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.ProcedureBase 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var ProcedureBase = exports.ProcedureBase = function (_EventEmitter) {
   _inherits(ProcedureBase, _EventEmitter);

   /**
    * constructor - instantiates istsos.ProcedureBase
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function ProcedureBase(options) {
      _classCallCheck(this, ProcedureBase);

      var _this = _possibleConstructorReturn(this, (ProcedureBase.__proto__ || Object.getPrototypeOf(ProcedureBase)).call(this));

      _this.name = options.name;
      _this.description = options.description || "";
      _this.keywords = options.keywords || "";
      _this.foi_name = options.foi_name;
      _this.epsg = options.epsg;
      _this.coordinates = [options.x, options.y, options.z];
      _this.outputs = options.outputs || [];
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(ProcedureBase, [{
      key: "fireEvent",
      value: function fireEvent(eventType, response) {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "fire", this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: "on",
      value: function on(event, callback) {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "on", this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: "once",
      value: function once(event, callback) {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "once", this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: "off",
      value: function off(event, callback) {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "off", this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: "unlistenAll",
      value: function unlistenAll() {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "unlistenAll", this).call(this);
      }

      /**
       * @return {Array<istsos.Output>}
       */

   }, {
      key: "getOutputsProperty",
      value: function getOutputsProperty() {
         return this.outputs;
      }

      /**
       * @return {Object}
       */

   }, {
      key: "getProcedureBaseJSON",
      value: function getProcedureBaseJSON() {
         var procedureBaseJSON = {
            "system_id": this.name,
            "system": this.name,
            "description": this.description,
            "keywords": this.keywords,
            "location": {
               "type": "Feature",
               "geometry": {
                  "type": "Point",
                  "coordinates": this.coordinates.toString().split(",")
               },
               "crs": {
                  "type": "name",
                  "properties": {
                     "name": this.epsg.toString()
                  }
               },
               "properties": {
                  "name": this.foi_name
               }
            },
            "outputs": [{
               "name": "Time",
               "definition": "urn:ogc:def:parameter:x-istsos:1.0:time:iso8601",
               "uom": "iso8601",
               "description": "",
               "constraint": {}
            }],
            "inputs": [],
            "history": [],
            "contacts": [],
            "documentation": [],
            "capabilities": []
         };
         this.outputs.forEach(function (out) {
            procedureBaseJSON["outputs"].push(out.getOutputJSON());
         });
         return procedureBaseJSON;
      }

      /**
       * @param {Object} options
       */

   }, {
      key: "createContactForm",
      value: function createContactForm(options) {
         return {
            "individualName": options.individualName || "",
            "voice": options.voice || "",
            "fax": options.fax || "",
            "email": options.email || "",
            "web": options.web || "",
            "deliveryPoint": options.deliveryPoint || "",
            "city": options.city || "",
            "administrativeArea": options.administrativeArea || "",
            "postalCode": options.postalCode || "",
            "country": options.country || ""
         };
      }

      /**
       * @return {Array<String>}
       */

   }, {
      key: "getCapabilitiesUom",
      value: function getCapabilitiesUom() {
         return ["µs", "ms", "s", "min", "h", "d"];
      }

      /**
       * @return {Array<Object>}
       */

   }, {
      key: "getCapabilitiesJson",
      value: function getCapabilitiesJson() {
         return [{
            "name": "Memory Capacity",
            "definition": "urn:x-ogc:def:classifier:x-istsos:1.0:memoryCapacity",
            "uom": "Byte",
            "combo": "Memory Capacity (Byte)"
         }, {
            "name": "Battery Current",
            "definition": "urn:x-ogc:def:phenomenon:x-istsos:1.0:batteryCurrent",
            "uom": "A.h",
            "combo": "Battery Current (A.h)"
         }];
      }

      /**
       * @return {Array<Object>}
       */

   }, {
      key: "getIdentificationNames",
      value: function getIdentificationNames() {
         return [{
            "name": "Short Name",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:shortName"
         }, {
            "name": "Long Name",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:longName"
         }, {
            "name": "Manufacturer Name",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:manufacturerName"
         }, {
            "name": "Model Number",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:modelNumber"
         }, {
            "name": "Serial Number",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:serialNumber"
         }, {
            "name": "Device ID",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:deviceID"
         }];
      }
   }]);

   return ProcedureBase;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * istsos.ServerContainer
 * 
 * @class
 */
var Date = exports.Date = function () {

  /**
   * constructor - Instantiates istsos.Date
   *
   * @param {Object} options Set of key-value pairs
   * @constructor
   */
  function Date(options) {
    _classCallCheck(this, Date);

    this.year = options.year.toString();
    this.month = options.month > 9 ? options.month.toString() : "0" + options.month.toString();
    this.day = options.day > 9 ? options.day.toString() : "0" + options.day.toString();
    this.hours = options.hours > 9 ? options.hours.toString() : "0" + options.hours.toString();
    this.minutes = options.minutes > 9 ? options.minutes.toString() : "0" + options.minutes.toString();
    this.seconds = options.seconds > 9 ? options.seconds.toString() : "0" + options.seconds.toString();
    this.gmt = options.gmt > 9 ? options.gmt.toString() : "0" + options.gmt.toString();
    this.description = options.opt_description || "Class for converting date&time to proper istSOS format";
  }

  /**
   * getDateString - Get date in ISO 8601 format
   *
   * @return {String}  ISO 8601 date
   */


  _createClass(Date, [{
    key: "getDateString",
    value: function getDateString() {
      return this.year + "-" + this.month + "-" + this.day + "T" + this.hours + ":" + this.minutes + ":" + this.seconds + "+" + this.gmt + ":00";
    }

    /**
     * getDescription - Get description
     *
     * @return {String}  Description   
     */

  }, {
    key: "getDescription",
    value: function getDescription() {
      return this.description;
    }
  }]);

  return Date;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});

/**
 * Event types recognized by IstSOS core JavaScript library
 * @type {Object}
 */
var EventTypes = exports.EventTypes = {
   LOGIN: 'loginReceived',
   ABOUT: 'aboutReceived',
   STATUS: 'statusReceived',
   CONFIGSECTIONS: 'configSectionsReceived',
   PROVIDER: 'providerReceived',
   UPDATE_PROVIDER: 'PUT ProviderReceived',
   IDENTIFICATION: 'identificationReceived',
   UPDATE_IDENTIFICATION: 'PUT identificationReceived',
   MQTT: 'mqttReceived',
   UPDATE_MQTT: 'PUT mqttReceived',
   CRS: 'crsReceived',
   UPDATE_CRS: 'PUT crsReceived',
   OBSERVATION_CONF: 'observationConfigurationReceived',
   UPDATE_OBSERVATION_CONF: 'PUT observationConfigurationReceived',
   PROXY: 'proxyReceived',
   UPDATE_PROXY: 'PUT proxyReceived',
   SERVICE: 'serviceReceived',
   SERVICES: 'servicesListReceived',
   NEW_SERVICE: 'POST serviceReceived',
   DELETE_SERVICE: 'DELETE serviceReceived',
   DATABASE: 'databaseReceived',
   UPDATE_DATABASE: 'PUT databaseReceived',
   VALIDATE_DB: 'POST validateDbReceived',
   EPSG_CODES: 'epsgsReceived',
   SYSTEM_TYPES: 'systemTypesReceived',
   NEW_OFFERING: 'POST offeringReceived',
   OFFERING_NAMES: 'offeringNamesReceived',
   OFFERING_LIST: 'offeringListReceived',
   DELETE_OFFERING: 'DELETE offeringReceived',
   UPDATE_OFFERING: 'PUT offeringReceived',
   MEMBERLIST: 'memberlistReceived',
   NONMEMBERLIST: 'nonmemberlistReceived',
   OBSERVED_PROPERTIES: 'observedPropertiesReceived',
   OBSERVED_PROPERTY: 'observedPropertyReceived',
   NEW_OBSERVED_PROPERTY: 'POST observedPropertyReceived',
   UPDATE_OBSERVED_PROPERTY: 'PUT observedPropertyReceived',
   DELETE_OBSERVED_PROPERTY: 'DELETE observedPropertyReceived',
   DATAQUALITIES: 'dataQualitiesReceived',
   DATAQUALITY: 'dataQualityReceived',
   NEW_DATAQUALITY: 'POST dataQualityReceived',
   UPDATE_DATAQUALITY: 'PUT dataQualityReceived',
   DELETE_DATAQUALITY: 'DELETE dataQualityReceived',
   UOM: 'unitOfMeasureReceived',
   UOMS: 'unitsOfMeasureReceived',
   NEW_UOM: 'POST unitOfMeasureReceived',
   UPDATE_UOM: 'PUT unitOfMeasureReceived',
   DELETE_UOM: 'DELETE unitOfMeasureReceived',
   GET_CODE: 'codeReceived',
   NEW_CODE: 'POST codeReceived',
   UPDATE_CODE: 'PUT codeReceived',
   DELETE_CODE: 'DELETE codeReceived',
   RATING_CURVE: 'ratingCurveReceived',
   NEW_RATING_CURVE: 'POST ratingCurveReceived',
   DELETE_RATING_CURVE: 'DELETE ratingCurveReceived',
   NEW_PROCEDURE: 'POST procedureReceived',
   UPDATE_PROCEDURE: 'PUT procedureReceived',
   DELETE_PROCEDURE: 'DELETE procedureReceived',
   ADD_TO_OFFERING: 'POST addToOfferingReceived',
   REMOVE_FROM_OFFERING: 'DELETE removeFromOfferingReceived',
   VIRTUAL_PROCEDURES: 'virtualProceduresReceived',
   VIRTUAL_PROCEDURE: 'virtualProcedureReceived',
   NEW_VIRTUAL_PROCEDURE: 'POST virtualProcedureReceived',
   UPDATE_V_PROCEDURE: 'PUT virtualProcedureReceived',
   DELETE_V_PROCEDURE: 'DELETE virtualProcedureReceived',
   PROCEDURES: 'proceduresReceived',
   PROCEDURE: 'procedureReceived',
   GEOJSON: 'geojsonReceived',
   GETOBSERVATIONS: 'getobservationsReceived',
   GETOBSERVATIONS_AGG: 'getobservationsAggregationReceived',
   GETOBSERVATIONS_SIMPLIFIED: 'getobservationsDataReceived',
   GETOBSERVATIONS_BY_QUALITY: 'getObservationsByQualityIndexReceived'
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Offering = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.Offering
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var Offering = exports.Offering = function (_EventEmitter) {
   _inherits(Offering, _EventEmitter);

   /**
    * constructor - instantiates istsos.Offering
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function Offering(options) {
      _classCallCheck(this, Offering);

      var _this = _possibleConstructorReturn(this, (Offering.__proto__ || Object.getPrototypeOf(Offering)).call(this));

      _this.offeringName = options.offeringName;
      _this.offeringDescription = options.offeringDescription || "";
      _this.active = options.active || false;
      _this.expirationDate = options.expirationDate && options.expirationDate.constructor === istsos.Date ? options.expirationDate.getDateString() : "";
      _this.service = options.service;
      _this.memberProcedures = [];
      options.service.addOffering(_this);
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(Offering, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'fire', this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'on', this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'once', this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'off', this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'unlistenAll', this).call(this);
      }

      /**
       * Add instance of istsos.Procedure or istsos.VirtualProcedure to the list of members
       * 
       * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
       */

   }, {
      key: 'addProcedure',
      value: function addProcedure(procedure) {
         this.memberProcedures.push(procedure);
      }

      /**
       * Update provider information on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.Offering#UPDATE_OFFERING            
       */

   }, {
      key: 'updateOffering',
      value: function updateOffering(options) {
         var _this2 = this;

         var oldOfferingName = this.offeringName;
         this.offeringName = options.newName || this.offeringName;
         this.offeringDescription = options.newDescription || this.offeringDescription;
         this.active = options.newActive || this.active;
         this.expirationDate = options.newExpirationDate || this.expirationDate;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + oldOfferingName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getUomJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('UPDATE_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Delete offering from the server
       *
       * @return {Promise} 
       * @fires istsos.Offering#istsos.events.EventType: DELETE_OFFERING
       */

   }, {
      key: 'deleteOffering',
      value: function deleteOffering() {
         var _this3 = this;

         for (var i = 0; i < this.service.getOfferingsProperty().length; i++) {
            if (this.offeringName === this.service.getOfferingsProperty()[i]["name"]) {
               this.service.getOfferingsProperty().splice(i, 1);
            }
         }
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + this.getOfferingJSON()["name"];

         var data = {
            "name": this.getOfferingJSON()["name"],
            "description": this.getOfferingJSON()["description"]
         };

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('DELETE_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get list of member procedures or/and virtual procedures
       * 
       * @return {Array<istsos.Procedure|istsos.VirtualProcedure>}
       */

   }, {
      key: 'getMemberProceduresProperty',
      value: function getMemberProceduresProperty() {
         return this.memberProcedures;
      }

      /**
       * Get member procedures or/and virtual procedures from the server.
       * 
       * @fires istsos.Offering#istsos.events.EventType: MEMBERLIST
       */

   }, {
      key: 'getMemberProcedures',
      value: function getMemberProcedures() {
         var _this4 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + this.getOfferingJSON()["name"] + '/procedures/operations/memberslist';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('MEMBERLIST', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get non-member procedures or/and virtual procedures from the server.
       * 
       * @fires istsos.Offering#istsos.events.EventType: NONMEMBERLIST
       */

   }, {
      key: 'getNonMemberProcedures',
      value: function getNonMemberProcedures() {
         var _this5 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + this.getOfferingJSON()["name"] + '/procedures/operations/nonmemberslist';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('NONMEMBERLIST', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get JSON configuration prepared for sending as a HTTP request payload
       * 
       * @returns {Object}
       */

   }, {
      key: 'getOfferingJSON',
      value: function getOfferingJSON() {
         var offeringJSON = {
            "name": this.offeringName,
            "description": this.offeringDescription,
            "expiration": this.expirationDate
         };
         if (this.active === true) {
            offeringJSON["active"] = "on";
         }
         return offeringJSON;
      }
   }]);

   return Offering;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.DataQuality = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.DataQuality 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var DataQuality = exports.DataQuality = function (_EventEmitter) {
   _inherits(DataQuality, _EventEmitter);

   /**
    * constructor - instantiates istsos.DataQuality
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function DataQuality(options) {
      _classCallCheck(this, DataQuality);

      var _this = _possibleConstructorReturn(this, (DataQuality.__proto__ || Object.getPrototypeOf(DataQuality)).call(this));

      _this.code = options.codeDQ;
      _this.name = options.nameDQ;
      _this.description = options.descrDQ || "";
      _this.service = options.service;
      options.service.addDataQuality(_this);
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(DataQuality, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'fire', this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'on', this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'once', this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'off', this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'unlistenAll', this).call(this);
      }

      /**
       * @return {Object}
       */

   }, {
      key: 'getDataQualityJSON',
      value: function getDataQualityJSON() {
         var dqJSON = {
            "code": this.code.toString(),
            "name": this.name,
            "description": this.description
         };
         return dqJSON;
      }

      /**
       * Update data quality on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.DataQuality#UPDATE_DATAQUALITY            
       */

   }, {
      key: 'updateDataQuality',
      value: function updateDataQuality(options) {
         var _this2 = this;

         var oldName = this.code;
         this.code = options.newCodeDQ || this.code;
         this.name = options.newNameDQ || this.name;
         this.description = options.newDescrDQ || this.description;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/dataqualities/' + oldName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getDataQualityJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('UPDATE_DATAQUALITY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Delete data quality on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.DataQuality#DELETE_DATAQUALITY            
       */

   }, {
      key: 'deleteDataQuality',
      value: function deleteDataQuality() {
         var _this3 = this;

         var dataQualities = this.service.getDataQualitiesProperty();
         for (var i = 0; i < dataQualities.length; i++) {
            if (this.code === dataQualities[i]["code"]) {
               dataQualities.splice(i, 1);
            }
         }

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/dataqualities/' + this.getDataQualityJSON()["code"];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getDataQualityJSON());

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('DELETE_DATAQUALITY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }]);

   return DataQuality;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Database = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.Database
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var Database = exports.Database = function (_EventEmitter) {
   _inherits(Database, _EventEmitter);

   /**
    * constructor - instantiates istsos.Database
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function Database(options) {
      _classCallCheck(this, Database);

      var _this = _possibleConstructorReturn(this, (Database.__proto__ || Object.getPrototypeOf(Database)).call(this));

      _this.dbname = options.dbname;
      _this.host = options.host;
      _this.user = options.user;
      _this.password = options.password;
      _this.port = options.port;
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(Database, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'fire', this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'on', this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'once', this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'off', this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'unlistenAll', this).call(this);
      }

      /**
       * Get database information from the server
       * 
       * @param  {String} serviceName   Name of the service
       * @param  {istsos.Server} server Instance of istsos.Server class
       * @return {Promise} 
       * @fires  istsos.Database#DATABASE            
       */

   }, {
      key: 'getDb',
      value: function getDb(serviceName, server) {
         var _this2 = this;

         var serviceName = serviceName ? serviceName : "default";
         var url = server.getUrl() + 'wa/istsos/services/' + serviceName + '/configsections/connection';

         var config = {};
         if (server.getLoginConfig()) {
            config['headers'] = server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('DATABASE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Set database connection parameters
       * 
       * @param {istsos.Server} server  istsos.Server instance
       * @param {istsos.Service} service istsos.Service instance
       * @param {Object} options Set of key-value pairs
       * @return {Promise}
       * @fires istsos.Database#UPDATE_DATABASE
       */

   }, {
      key: 'setDb',
      value: function setDb(server, service, options) {
         var _this3 = this;

         this.dbname = options.dbname || this.dbname;
         this.host = options.host || this.host;
         this.password = options.password || this.password;
         this.port = options.port || this.port;
         var serviceName = service ? service.getServiceJSON()["service"] : "default";

         var url = server.getUrl() + 'wa/istsos/services/' + serviceName + '/configsections/connection';

         var config = {};
         if (server.getLoginConfig()) {
            config['headers'] = server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getDbJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('UPDATE_DATABASE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Validate database status
       * 
       * @param  {istsos.Server} server istsos.Server instance
       * @return {Promise}
       * @fires istsos.Database#VALIDATE_DB
       */

   }, {
      key: 'validateDb',
      value: function validateDb(server) {
         var _this4 = this;

         var url = server.getUrl() + 'wa/istsos/operations/validatedb';

         var config = {};
         if (server.getLoginConfig()) {
            config['headers'] = server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getDbJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('VALIDATE_DB', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get JSON configuration prepared for sending via HTTP request payload
       * 
       * @return {Object}
       */

   }, {
      key: 'getDbJSON',
      value: function getDbJSON() {
         return {
            "dbname": this.dbname,
            "host": this.host,
            "user": this.user,
            "password": this.password,
            "port": this.port.toString()
         };
      }
   }]);

   return Database;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservedProperty = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

var _IstsosHelper = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.ObservedProperty
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var ObservedProperty = exports.ObservedProperty = function (_EventEmitter) {
  _inherits(ObservedProperty, _EventEmitter);

  /**
     * constructor - instantiates istsos.ObservedProperty
     * 
     * @param  {Object} options Set of key-value pairs
     * @constructor
     */
  function ObservedProperty(options) {
    _classCallCheck(this, ObservedProperty);

    var _this = _possibleConstructorReturn(this, (ObservedProperty.__proto__ || Object.getPrototypeOf(ObservedProperty)).call(this));

    _this.observedName = options.observedName;
    _this.definitionUrn = options.definitionUrn;
    _this.observedDescr = options.observedDescr || "";
    _this.constraint = null;
    var check = (0, _IstsosHelper.validateConstraintInput)(options.constraintType, options.value);
    if (check === true) {
      _this.constraint = {};
      _this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
      _this.constraint[_IstsosHelper.ConstraintInputs[options.constraintType]] = options.value.constructor === Array ? options.value.toString().split(",") : options.value.toString();
    } else {
      console.log('Input constraintType and constraintValue for property <' + _this.observedName.toUpperCase() + '> are INCORRECT or INTENTIONALLY NULL!!! ');
    }
    _this.service = options.service;
    _this.proceduresIncluded = [];
    _this.updateProceduresIncluded();
    options.service.addObservedProperty(_this);
    return _this;
  }

  /**
   * Fire event with data - event must match one of the supported event types from istsos.EventTypes
   * 
   * @param  {String} eventType Type of event from istsos.EventTypes
   * @param  {Object|*} response  Data to be passed to a handler
   */


  _createClass(ObservedProperty, [{
    key: 'fireEvent',
    value: function fireEvent(eventType, response) {
      _get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'fire', this).call(this, eventType, response);
    }

    /**
     * Add event listener
     * 
     * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
     * @param  {Function} callback Handler function
     */

  }, {
    key: 'on',
    value: function on(event, callback) {
      _get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'on', this).call(this, event, callback);
    }

    /**
     * Add event listener, that will listen only once.
     * 
     * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
     * @param  {Function} callback Handler function
     */

  }, {
    key: 'once',
    value: function once(event, callback) {
      _get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'once', this).call(this, event, callback);
    }

    /**
     * Remove event listener
     * 
     * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
     * @param  {Function} callback Handler function
     */

  }, {
    key: 'off',
    value: function off(event, callback) {
      _get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'off', this).call(this, event, callback);
    }

    /**
     * Remove all event listeners
     */

  }, {
    key: 'unlistenAll',
    value: function unlistenAll() {
      _get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'unlistenAll', this).call(this);
    }

    /**
     * Refresh the list of procedures that use this observed property
     */

  }, {
    key: 'updateProceduresIncluded',
    value: function updateProceduresIncluded() {
      var procedures = this.service.getProceduresProperty();
      var v_procedures = this.service.getVirtualProceduresProperty();
      var all = procedures.concat(v_procedures);
      var name = this.observedName;
      if (all.length !== 0) {
        for (var i = 0; i < all.length; i++) {
          for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
            if (name = all[i].getOutputsProperty()[j]["name"]) {
              this.getProceduresIncluded().push(all[i]);
            }
          }
        }
      }
    }

    /**
     * @return {Array<istsos.Procedure|istsos.VirtualProcedure>}
     */

  }, {
    key: 'getProceduresIncluded',
    value: function getProceduresIncluded() {
      return this.proceduresIncluded;
    }

    /**
     * @returns {Object}
     */

  }, {
    key: 'getObservedPropertyJSON',
    value: function getObservedPropertyJSON() {
      var observedJSON = {
        "name": this.observedName,
        "definition": this.definitionUrn,
        "description": this.observedDescr,
        "constraint": this.constraint
      };
      return observedJSON;
    }

    /**
       * Update observed property on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.ObservedProperty#UPDATE_OBSERVED_PROPERTY            
       */

  }, {
    key: 'updateObservedProperty',
    value: function updateObservedProperty(options) {
      var _this2 = this;

      var oldDefinitionUrn = this.definitionUrn;
      this.observedName = options.newPropertyName || this.observedName;
      this.definitionUrn = options.newDefinitionUrn || this.definitionUrn;
      this.observedDescr = options.newPropertyName || this.observedDescr;
      if ((0, _IstsosHelper.validateConstraintInput)(options.constraintType, options.value) === true) {
        this.constraint = {};
        this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
        this.constraint[_IstsosHelper.ConstraintInputs[options.constraintType]] = options.value.constructor === Array ? options.value.toString().split(",") : options.value.toString();
      } else {
        console.log('Input constraintType and constraintValue for property <' + this.observedName.toUpperCase() + '> are INCORRECT or INTENTIONALLY NULL!!! ');
      }
      var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/observedproperties/' + oldDefinitionUrn;

      var config = {};
      if (this.service.server.getLoginConfig()) {
        config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getObservedPropertyJSON());

      return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
        if (result.success) {
          _this2.fireEvent('UPDATE_OBSERVED_PROPERTY', result);
          return result;
        } else {
          throw result.message;
        }
      }, function (error_message) {
        throw error_message;
      });
    }

    /**
       * Delete observed property from the server
       *
       * @return {Promise} 
       * @fires  istsos.ObservedProperty#DELETE_OBSERVED_PROPERTY            
       */

  }, {
    key: 'deleteObservedProperty',
    value: function deleteObservedProperty() {
      var _this3 = this;

      var procedures = this.service.getProceduresProperty();
      var v_procedures = this.service.getVirtualProceduresProperty();
      var properties_service = this.service.getObservedPropertiesProperty();
      var all = procedures.concat(v_procedures);
      var outputs = [];
      all.forEach(function (p) {
        outputs.concat(p.getOutputsProperty());
      });
      var name = this.observedName;
      var connected = false;
      for (var i = 0; i < outputs.length; i++) {
        if (name === outputs[i].getOutputJSON()["name"]) {
          alert("CONNECTED TO PROCEDURE");
          connected = true;
          break;
        }
      }
      if (connected === false) {
        for (var j = 0; j < properties_service.length; j++) {
          if (this === properties_service[j]) {
            properties_service.splice(j, 1);
          }
        }
      }
      var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/observedproperties/' + this.getObservedPropertyJSON()["definition"];

      var config = {};
      if (this.service.server.getLoginConfig()) {
        config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getObservedPropertyJSON());

      return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
        if (result.success) {
          _this3.fireEvent('DELETE_OBSERVED_PROPERTY', result);
          return result;
        } else {
          throw result.message;
        }
      }, function (error_message) {
        throw error_message;
      });
    }
  }]);

  return ObservedProperty;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Output = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _IstsosHelper = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * istsos.Output
 * 
 * @class
 */
var Output = exports.Output = function () {
   /**
    * constructor - instantiates istsos.Output
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function Output(options) {
      _classCallCheck(this, Output);

      this.observedProperty = options.property;
      this.uom = options.uom;
      this.description = options.description || "";
      this.constraint = {};
      var check = (0, _IstsosHelper.validateConstraintInput)(options.opt_constraintType, options.opt_constraintValue);
      if (check === true) {
         this.constraint["role"] = "urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable";
         this.constraint[istsos.observedProperty.ConstraintInputs[opt_constraintType]] = opt_constraintValue.constructor === Array ? opt_constraintValue.toString().split(",") : opt_constraintValue.toString();
      } else {
         console.log("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ");
      }
   }
   /**
    * @return {JSON}
    */


   _createClass(Output, [{
      key: "getOutputJSON",
      value: function getOutputJSON() {
         var outputJSON = {
            "name": this.observedProperty.getObservedPropertyJSON()["name"],
            "definition": this.observedProperty.getObservedPropertyJSON()["definition"],
            "uom": this.uom.getUomJSON()["name"],
            "description": this.description || "",
            "constraint": this.constraint
         };
         return outputJSON;
      }
   }]);

   return Output;
}();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Procedure = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ProcedureBase2 = __webpack_require__(4);

var _HttpAPI = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.Procedure 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var Procedure = exports.Procedure = function (_ProcedureBase) {
   _inherits(Procedure, _ProcedureBase);

   /**
    * constructor - instantiates istsos.Procedure
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function Procedure(options) {
      _classCallCheck(this, Procedure);

      var _this = _possibleConstructorReturn(this, (Procedure.__proto__ || Object.getPrototypeOf(Procedure)).call(this, {
         name: options.name,
         description: options.description,
         keywords: options.keywords,
         foi_name: options.foi_name,
         epsg: options.epsg,
         x: options.x,
         y: options.y,
         z: options.z,
         outputs: options.outputs
      }));

      _this.systemType = options.systemType === "insitu-fixed-point" || options.systemType === "insitu-mobile-point" ? options.systemType : null;
      _this.sensorType = options.sensorType || "";
      _this.service = options.service;
      _this.service.addProcedure(_this);
      _this.service.getOfferingsProperty()[0].getMemberProceduresProperty().push(_this);
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(Procedure, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'fire', this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'on', this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'once', this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'off', this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'unlistenAll', this).call(this);
      }

      /**
       * @return {Object}
       */

   }, {
      key: 'getProcedureJSON',
      value: function getProcedureJSON() {
         var procedureJSON = _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'getProcedureBaseJSON', this).call(this);
         procedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": this.systemType === "insitu-mobile-point" || this.systemType === "insitu-fixed-point" ? this.systemType : null
         }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
         }];
         return procedureJSON;
      }

      /**
       * Update procedure on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.Procedure#UPDATE_PROCEDURE            
       */

   }, {
      key: 'updateProcedure',
      value: function updateProcedure(options) {
         var _this2 = this;

         var oldName = this.name;
         this.name = options.name || this.name;
         this.description = options.description || this.description;
         this.keywords = options.keywords || this.keywords;
         this.foi_name = options.foi_name || this.foi_name;
         this.epsg = option.sepsg || this.epsg;
         this.coordinates = [options.x, options.y, options.z] || this.coordinates;
         var outputs_array = this.outputs;
         if (options.outputs || options.outputs.length !== 0) {
            outputs_array.splice(1, outputs_array.length - 1);
            options.outputs.forEach(function (out) {
               outputs_array.push(out);
            });
         }
         this.systemType = options.systemType === "insitu-fixed-point" || options.systemType === "insitu-mobile-point" ? options.systemType : null;
         this.sensorType = options.sensorType || "";

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/procedures/' + oldName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getProcedureJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('UPDATE_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Delete procedure on the server
       *
       * @return {Promise} 
       * @fires  istsos.Procedure#DELETE_PROCEDURE            
       */

   }, {
      key: 'deleteProcedure',
      value: function deleteProcedure() {
         var _this3 = this;

         var procedures = this.service.getProceduresProperty();
         var obj = this.getProcedureJSON();
         procedures.forEach(function (p) {
            if (p.getProcedureJSON()["system"] === obj["system"]) {
               procedures.splice(procedures.indexOf(p), 1);
            }
         });

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/procedures/' + this.name;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('DELETE_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Add procedure's membership to offering on the server
       *
       * @param {istsos.Offering} offering istsos.Offering class
       * @return {Promise} 
       * @fires  istsos.Offering#ADD_TO_OFFERING            
       */

   }, {
      key: 'addMembershipToOffering',
      value: function addMembershipToOffering(offering) {
         var _this4 = this;

         offering.getMemberProceduresProperty().push(this);
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + offering.getOfferingJSON()["name"] + '/procedures';

         var data = [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
         }];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('ADD_TO_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Remove procedure's membership from offering on the server
       *
       * @param {istsos.Offering} offering istsos.Offering class
       * @return {Promise} 
       * @fires  istsos.Offering#REMOVE_FROM_OFFERING            
       */

   }, {
      key: 'removeMembershipFromOffering',
      value: function removeMembershipFromOffering(offering) {
         var _this5 = this;

         var procedures = offering.getMemberProceduresProperty();
         var pname = this.name;
         procedures.forEach(function (p) {
            if (p.name === pname) {
               procedures.splice(procedures.indexOf(p), 1);
            }
         });

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + offering.getOfferingJSON()["name"] + '/procedures/' + this.getProcedureJSON()["system"];

         var data = [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
         }];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('REMOVE_FROM_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @return {Array<istsos.Output>}
       */

   }, {
      key: 'getOutputsProperty',
      value: function getOutputsProperty() {
         return _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'getOutputsProperty', this).call(this);
      }
   }]);

   return Procedure;
}(_ProcedureBase2.ProcedureBase);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Server = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Configuration = __webpack_require__(3);

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.Server
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var Server = exports.Server = function (_EventEmitter) {
   _inherits(Server, _EventEmitter);

   /**
      * constructor - instantiates istsos.Server
      * 
      * @param  {Object} options Set of key-value pairs
      * @constructor
      */
   function Server(options) {
      _classCallCheck(this, Server);

      var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

      _this.name = options.name;
      _this.url = options.url.charAt(options.url.length - 1) === "/" ? options.url : options.url + "/";
      _this.defaultDb = options.defaultDb;
      _this.config = options.opt_config || new _Configuration.Configuration({
         serviceName: null,
         server: _this
      });
      _this.loginConfig = null;
      _this.services = [];
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(Server, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'fire', this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'on', this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'once', this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'off', this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'unlistenAll', this).call(this);
      }

      /**
       * Set login connection parameters
       * 
       * @param {String} username Username
       * @param {String} password Password
       */

   }, {
      key: 'setLoginConfig',
      value: function setLoginConfig(username, password) {
         var loginStr = username + ':' + password;
         var base64 = new Buffer(loginStr).toString('base64');
         this.loginConfig = {
            Authorization: 'Basic ' + base64
         };
      }

      /**
       * Remove login configuration
       */

   }, {
      key: 'removeLoginConfig',
      value: function removeLoginConfig() {
         this.loginConfig = null;
      }

      /**
       * Get login configuration object
       * 
       * @return {Object}
       */

   }, {
      key: 'getLoginConfig',
      value: function getLoginConfig() {
         return this.loginConfig;
      }

      /**
       *	Get service information from the server
       * 
       * @param {String} serviceName Name of the service
       * @return {Promise}
       * @fires istsos.Server#SERVICE
       */

   }, {
      key: 'getService',
      value: function getService(serviceName) {
         var _this2 = this;

         var url = this.url + 'wa/istsos/services/' + serviceName;

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('SERVICE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Add istsos.Service instance to the list of services
       * 
       * @param {istsos.Service} service istsos.Service instance
       */

   }, {
      key: 'addService',
      value: function addService(service) {
         this.services.push(service);
      }

      /**
       * Register new service on the server
       * 
       * @param {istsos.Service} service istsos.Service instance
       * @return {Promise}
       * @fires istsos.Server#NEW_SERVICE
       */

   }, {
      key: 'registerService',
      value: function registerService(service) {
         var _this3 = this;

         var url = this.getUrl() + 'wa/istsos/services';

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }
         config['data'] = JSON.stringify(service.getServiceJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('NEW_SERVICE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Remove service from the server
       * 
       * @param {istsos.Service} service istsos.Service instance
       * @return {Promise}
       * @fires istsos.Server#DELETE_SERVICE
       */

   }, {
      key: 'deleteService',
      value: function deleteService(service) {
         var _this4 = this;

         for (var i = 0; i < this.services.length; i++) {
            if (this.services[i].getServiceJSON()["service"] === service.getServiceJSON()["service"]) {
               this.services.splice(i, 1);
            }
         }
         var url = this.url + 'wa/istsos/services/' + service.name;

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }
         config['data'] = JSON.stringify({ 'name': service.name });

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('DELETE_SERVICE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get server status
       * 
       * @return {Promise}
       * @fires istsos.Server#STATUS
       */

   }, {
      key: 'getStatus',
      value: function getStatus() {
         var _this5 = this;

         var url = this.url + 'wa/istsos/operations/status';

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('STATUS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get information about the server
       * 
       * @return {Promise}
       * @fires istsos.Server#ABOUT
       */

   }, {
      key: 'getAboutInfo',
      value: function getAboutInfo() {
         var _this6 = this;

         var url = this.url + 'wa/istsos/operations/about';

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this6.fireEvent('ABOUT', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get configuration information from the server
       * 
       * @return {Promise}
       * @fires istsos.Configuration#CONFIGURATION
       */

   }, {
      key: 'getConfig',
      value: function getConfig() {
         return this.config.getConf();
      }

      /**
       * Get configuration property
       * 
       * @return {istsos.Configuration}
       */

   }, {
      key: 'getConfigProperty',
      value: function getConfigProperty() {
         return this.config;
      }

      /**
       *	Get list of services
       * 
       * @return{Array<istsos.Service>}
       */

   }, {
      key: 'getServicesProperty',
      value: function getServicesProperty() {
         return this.services;
      }

      /**
       * Get services from the server
       * 
       * @return {Promise}
       * @fires istsos.Server#SERVICES
       */

   }, {
      key: 'getServices',
      value: function getServices() {
         var _this7 = this;

         var url = this.url + 'wa/istsos/services';

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this7.fireEvent('SERVICES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Get default database information from the server
       * 
       * @return {Promise}
       * @fires istsos.Database#DATABASE
       */

   }, {
      key: 'getDefaultDb',
      value: function getDefaultDb() {
         return this.defaultDb.getDb("default", this);
      }

      /**
       *	Get default database property
       * 
       * @return {istsos.Database}
       */

   }, {
      key: 'getDefaultDbProperty',
      value: function getDefaultDbProperty() {
         return this.defaultDb;
      }

      /**
       *	Get URL of the server
       * 
       * @return {String}
       */

   }, {
      key: 'getUrl',
      value: function getUrl() {
         return this.url;
      }
   }]);

   return Server;
}(_EventEmitter2.EventEmitter);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * istsos.ServerContainer
 * 
 * @class
 */
var ServerContainer = exports.ServerContainer = function () {

   /**
    * constructor - Instantiates istsos.ServerContainer
    *
    * @constructor
    */
   function ServerContainer() {
      _classCallCheck(this, ServerContainer);

      this.servers = [];
   }

   /**
    * getServer - Get the istsos.Server instance from the list by providing the name of the server
    *
    * @param  {String} name     Name of the server
    * @return {istsos.Server}   istsos.Server instance
    */


   _createClass(ServerContainer, [{
      key: "getServer",
      value: function getServer(name) {
         if (!name || typeof name != "string") {
            throw "Parameter must be a string representing the name of the server!";
         }

         var _iteratorNormalCompletion = true;
         var _didIteratorError = false;
         var _iteratorError = undefined;

         try {
            for (var _iterator = this.servers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
               var s = _step.value;

               if (s.name === name) {
                  return s;
               }
            }
         } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
               }
            } finally {
               if (_didIteratorError) {
                  throw _iteratorError;
               }
            }
         }
      }

      /**
       * getServers - Get the list of created servers
       *
       * @return {Array<istsos.Server>}  List of istsos.Server instances
       */

   }, {
      key: "getServers",
      value: function getServers() {
         return this.servers;
      }

      /**
       * addServer - Add istsos.Server instance to the servers list
       *
       * @param  {istsos.Server} server istsos.Server instance
       */

   }, {
      key: "addServer",
      value: function addServer(server) {
         if (!server || server.constructor != istsos.Server) {
            throw "Parameter must be an instance of istsos.Server class!";
         }
         this.servers.push(server);
      }

      /**
       * removeServer - Remove istsos.Server instance from the list by providing name of the server or istsos.Server instance
       *
       * @param  {istsos.Server|String} server istsos.Server instance or name of the server
       */

   }, {
      key: "removeServer",
      value: function removeServer(server) {
         if (typeof server == "string") {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
               for (var _iterator2 = this.servers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var s = _step2.value;

                  if (s.name === server) {
                     this.servers.splice(this.servers.indexOf(s), 1);
                     break;
                  }
               }
            } catch (err) {
               _didIteratorError2 = true;
               _iteratorError2 = err;
            } finally {
               try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                     _iterator2.return();
                  }
               } finally {
                  if (_didIteratorError2) {
                     throw _iteratorError2;
                  }
               }
            }
         } else if (server.constructor == istsos.Server) {
            this.servers.splice(this.servers.indexOf(server), 1);
         } else {
            throw "Parameter must be a string representing the name of the server or an instance of istsos.Server class!";
         }
      }
   }]);

   return ServerContainer;
}();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Service = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _EventEmitter2 = __webpack_require__(1);

var _HttpAPI = __webpack_require__(0);

var _Configuration = __webpack_require__(3);

var _Offering = __webpack_require__(7);

var _IstsosHelper = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.Service
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var Service = exports.Service = function (_EventEmitter) {
	_inherits(Service, _EventEmitter);

	/**
  * constructor - instantiates istsos.Service
  * 
  * @param  {Object} options Set of key-value pairs
  * @constructor
  */
	function Service(options) {
		_classCallCheck(this, Service);

		var _this = _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).call(this));

		_this.name = options.name;
		_this.db = options.opt_db || options.server.getDefaultDbProperty();
		_this.epsg = options.opt_epsg || null;
		_this.config = options.opt_config || new _Configuration.Configuration({
			serviceName: options.name,
			server: options.server
		});
		_this.server = options.server;
		_this.offerings = [];
		_this.procedures = [];
		_this.virtualProcedures = [];
		_this.observedProperties = [];
		_this.uoms = [];
		_this.dataQualities = [];
		options.server.addService(_this);

		var offering_config = {
			offeringName: "temporary",
			offeringDescription: "temporary offering to hold self-registered procedures/sensors waiting for service adimistration acceptance",
			active: true,
			expirationDate: "",
			service: _this
		};

		var temporary_offering = new _Offering.Offering(offering_config);
		return _this;
	}

	/**
  * Fire event with data - event must match one of the supported event types from istsos.EventTypes
  * 
  * @param  {String} eventType Type of event from istsos.EventTypes
  * @param  {Object|*} response  Data to be passed to a handler
  */


	_createClass(Service, [{
		key: 'fireEvent',
		value: function fireEvent(eventType, response) {
			_get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'fire', this).call(this, eventType, response);
		}

		/**
   * Add event listener
   * 
   * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
   * @param  {Function} callback Handler function
   */

	}, {
		key: 'on',
		value: function on(event, callback) {
			_get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'on', this).call(this, event, callback);
		}

		/**
   * Add event listener, that will listen only once.
   * 
   * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
   * @param  {Function} callback Handler function
   */

	}, {
		key: 'once',
		value: function once(event, callback) {
			_get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'once', this).call(this, event, callback);
		}

		/**
   * Remove event listener
   * 
   * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
   * @param  {Function} callback Handler function
   */

	}, {
		key: 'off',
		value: function off(event, callback) {
			_get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'off', this).call(this, event, callback);
		}

		/**
   * Remove all event listeners
   */

	}, {
		key: 'unlistenAll',
		value: function unlistenAll() {
			_get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'unlistenAll', this).call(this);
		}

		/**
     * Get JSON configuration prepared for sending as a HTTP request payload
     * 
     * @return {Object}
     */

	}, {
		key: 'getServiceJSON',
		value: function getServiceJSON() {
			var serviceJSON = {
				"service": this.name
			};
			if (this.epsg) {
				serviceJSON["epsg"] = this.epsg.toString();
			}
			if (this.db !== this.server.getDefaultDbProperty()) {
				serviceJSON["dbname"] = this.db["dbname"];
				serviceJSON["host"] = this.db["host"];
				serviceJSON["user"] = this.db["user"];
				serviceJSON["password"] = this.db["password"];
				serviceJSON["port"] = this.db["port"].toString();
			}
			return serviceJSON;
		}

		/**
   * Return list of istsos.Offering instances, that belong to this service
   * 
   * @return {Array<istsos.Offering>}
   */

	}, {
		key: 'getOfferingsProperty',
		value: function getOfferingsProperty() {
			return this.offerings;
		}

		/**
   *	Return list of istsos.Procedure instances, that belong to this service
   * 
   * @returns {Array<istsos.Procedure>}
   */

	}, {
		key: 'getProceduresProperty',
		value: function getProceduresProperty() {
			return this.procedures;
		}

		/**
   * Return list of istsos.VirtualProcedure instances, that belong to this service
   * 
   * @returns {Array<istsos.VirtualProcedure>}
   */

	}, {
		key: 'getVirtualProceduresProperty',
		value: function getVirtualProceduresProperty() {
			return this.virtualProcedures;
		}

		/**
   *	Return list of istsos.ObservedProperty instances, that belong to this service
   * 
   * @returns {Array<istsos.ObservedProperty>}
   */

	}, {
		key: 'getObservedPropertiesProperty',
		value: function getObservedPropertiesProperty() {
			return this.observedProperties;
		}

		/**
   *	Return list of istsos.UnitOfMeasure instances, that belong to this service
   * 
   * @returns {Array<istsos.UnitOfMeasure>}
   */

	}, {
		key: 'getUomsProperty',
		value: function getUomsProperty() {
			return this.uoms;
		}

		/**
   *	Return list of istsos.DataQuality instances, that belong to this service
   * 
   * @returns {Array<istsos.DataQuality>}
   */

	}, {
		key: 'getDataQualitiesProperty',
		value: function getDataQualitiesProperty() {
			return this.dataQualities;
		}

		/**
   * Add offering to the offering list
   * 
   * @param {istsos.Offering} offering
   */

	}, {
		key: 'addOffering',
		value: function addOffering(offering) {
			this.getOfferingsProperty().push(offering);
		}

		/**
     * Register new offering on the server
     * 
     * @param  {istsos.Server} server istsos.Server instance
     * @return {Promise}
     * @fires istsos.Service#NEW_OFFERING
     */

	}, {
		key: 'registerOffering',
		value: function registerOffering(offering) {
			var _this2 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/offerings';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}
			config['data'] = JSON.stringify(offering.getOfferingJSON());

			return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
				if (result.success) {
					_this2.fireEvent('NEW_OFFERING', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get offering names from the server
     * 
     * @return {Promise}
     * @fires istsos.Service#OFFERING_NAMES
     */

	}, {
		key: 'getOfferingNames',
		value: function getOfferingNames() {
			var _this3 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/offerings/operations/getlist';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this3.fireEvent('OFFERING_NAMES', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get list of offerings from the server
     * 
     * @return {Promise}
     * @fires istsos.Service#OFFERING_LIST
     */

	}, {
		key: 'getOfferings',
		value: function getOfferings() {
			var _this4 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/offerings';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this4.fireEvent('OFFERING_LIST', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
   * Add istsos.Procedure instance to procedure list
   * 
   * @param {istsos.Procedure} procedure
   */

	}, {
		key: 'addProcedure',
		value: function addProcedure(procedure) {
			this.getProceduresProperty().push(procedure);
		}

		/**
     * Register new procedure on the server.
     *
     * @param {istsos.Procedure} procedure istsos.Procedure instance
     * @return {Promise}
     * @fires istsos.Service#NEW_PROCEDURE
     */

	}, {
		key: 'registerProcedure',
		value: function registerProcedure(procedure) {
			var _this5 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/procedures';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}
			config['data'] = JSON.stringify(procedure.getProcedureJSON());

			return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
				if (result.success) {
					_this5.fireEvent('NEW_PROCEDURE', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get procedure from the server.
     *
     * @param {istsos.Procedure} procedure istsos.Procedure instance
     * @return {Promise}
     * @fires istsos.Service#PROCEDURE
     */

	}, {
		key: 'getProcedure',
		value: function getProcedure(procedure) {
			var _this6 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/procedures/' + procedure.getProcedureJSON()["system"];

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this6.fireEvent('PROCEDURE', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get procedures from the server.
     *
     * @return {Promise}
     * @fires istsos.Service#PROCEDURES
     */

	}, {
		key: 'getProcedures',
		value: function getProcedures() {
			var _this7 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/procedures/operations/getlist';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this7.fireEvent('PROCEDURES', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
   * Add istsos.VirtualProcedure instance to virtual procedure list
   * 
   * @param {istsos.VirtualProcedure} procedure
   */

	}, {
		key: 'addVirtualProcedure',
		value: function addVirtualProcedure(v_procedure) {
			this.getVirtualProceduresProperty().push(v_procedure);
		}

		/**
     * Register virtual procedure on the server.
     *
     * @return {Promise}
     * @fires istsos.Service#NEW_VIRTUAL_PROCEDURE
     */

	}, {
		key: 'registerVirtualProcedure',
		value: function registerVirtualProcedure(v_procedure) {
			var _this8 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/procedures';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}
			config['data'] = JSON.stringify(v_procedure.getVirtualProcedureJSON());

			return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
				if (result.success) {
					_this8.fireEvent('NEW_VIRTUAL_PROCEDURE', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get virtual procedure from the server.
     *
     * @param {istsos.VirtualProcedure} v_procedure istsos.VirtualProcedure instance
     * @return {Promise}
     * @fires istsos.Service#VIRTUAL_PROCEDURE;
      */

	}, {
		key: 'getVirtualProcedure',
		value: function getVirtualProcedure(v_procedure) {
			var _this9 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/virtualprocedures';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this9.fireEvent('VIRTUAL_PROCEDURE', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get virtual procedures from the server.
     *
     * @return {Promise}
     * @fires istsos.Service#VIRTUAL_PROCEDURES
     */

	}, {
		key: 'getVirtualProcedures',
		value: function getVirtualProcedures() {
			var _this10 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/virtualprocedures/operations/getlist';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this10.fireEvent('VIRTUAL_PROCEDURES', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
   * Add istsos.ObservedProperty to the list of observed properties
   * 
   * @param {istsos.ObservedProperty} property
   */

	}, {
		key: 'addObservedProperty',
		value: function addObservedProperty(property) {
			this.getObservedPropertiesProperty().push(property);
		}

		/**
     * Register observed property on the server.
     *
     * @return {Promise}
     * @fires istsos.Service#NEW_OBSERVED_PROPERTY
     */

	}, {
		key: 'registerObservedProperty',
		value: function registerObservedProperty(property) {
			var _this11 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/observedproperties';
			this.executeRequest(url, istsos.events.EventType.NEW_OBSERVED_PROPERTY, "POST", JSON.stringify(property.getObservedPropertyJSON()));

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}
			config['data'] = JSON.stringify(property.getObservedPropertyJSON());

			return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
				if (result.success) {
					_this11.fireEvent('NEW_OBSERVED_PROPERTY', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get observed properties from the server.
     *
     * @return {Promise}
     * @fires istsos.Service#OBSERVED_PROPERTIES
     */

	}, {
		key: 'getObservedProperties',
		value: function getObservedProperties() {
			var _this12 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/observedproperties';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this12.fireEvent('OBSERVED_PROPERTIES', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get observed property from the server
     * 
     * @param {istsos.ObservedProperty} property istsos.ObservedProperty instance
     * @return {Promise}
     * @fires istsos.Service#OBSERVED_PROPERTIES
     */

	}, {
		key: 'getObservedProperty',
		value: function getObservedProperty(property) {
			var _this13 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/observedproperties/' + property.getObservedPropertyJSON()["definition"];

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this13.fireEvent('OBSERVED_PROPERTY', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
   * Add instance of istsos.UnitOfMeasure to the unit of measure list
   * 
   * @param {istsos.UnitOfMeasure} uom
   */

	}, {
		key: 'addUom',
		value: function addUom(uom) {
			this.getUomsProperty().push(uom);
		}

		/**
     * Register unit of measure on the server.
     *
     * @return {Promise}
     * @fires istsos.Service#NEW_UOM
     */

	}, {
		key: 'registerUom',
		value: function registerUom(uom) {
			var _this14 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/uoms';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}
			config['data'] = JSON.stringify(property.getUomJSON());

			return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
				if (result.success) {
					_this14.fireEvent('NEW_UOM', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get units of measure from the server.
     *
     * @return {Promise}
     * @fires istsos.Service#UOMS
     */

	}, {
		key: 'getUoms',
		value: function getUoms() {
			var _this15 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/uoms';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this15.fireEvent('UOMS', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get unit of measure from the server.
     *
     * @param {istsos.UnitOfMeasure} uom istsos.UnitOfMeasure instance
     * @return {Promise}
     * @fires istsos.Service#UOM
     */

	}, {
		key: 'getUom',
		value: function getUom(uom) {
			var _this16 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/uoms/' + uom.getUomJSON()["name"];

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this16.fireEvent('UOM', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
   * Add istsos.DataQuality instance to the dataqualities list
   * 
   * @param {istsos.DataQuality} dataQuality
   */

	}, {
		key: 'addDataQuality',
		value: function addDataQuality(dataQuality) {
			this.getDataQualitiesProperty().push(dataQuality);
		}

		/**
     * Register data quality on the server.
     *
     * @return {Promise}
     * @fires istsos.Service#NEW_DATAQUALITY
     */

	}, {
		key: 'registerDataQuality',
		value: function registerDataQuality(dataQuality) {
			var _this17 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/dataqualities';
			this.executeRequest(url, istsos.events.EventType.NEW_DATAQUALITY, "POST", JSON.stringify(dataQuality.getDataQualityJSON()));

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}
			config['data'] = JSON.stringify(property.getDataQualityJSON());

			return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
				if (result.success) {
					_this17.fireEvent('NEW_DATAQUALITY', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get data qualities from the server.
     *
     * @return {Promise}
     * @fires istsos.Service#DATAQUALITIES
     */

	}, {
		key: 'getDataQualities',
		value: function getDataQualities() {
			var _this18 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/dataqualities';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this18.fireEvent('DATAQUALITIES', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get data quality from the server.
     *
     * @param {istsos.DataQuality} dataQuality istsos.DataQuality instance
     * @return {Promise}
     * @fires istsos.Service#DATAQUALITY
     */

	}, {
		key: 'getDataQuality',
		value: function getDataQuality(dataQuality) {
			var _this19 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/dataqualities/' + dataQuality.getDataQualityJSON()["code"];

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this19.fireEvent('DATAQUALITY', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get system types from the server
     *
     * @return {Promise}
     * @fires istsos.Service#DATAQUALITIES
     */

	}, {
		key: 'getSystemTypes',
		value: function getSystemTypes() {
			var _this20 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/systemtypes';

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this20.fireEvent('SYSTEM_TYPES', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
   *	Returns istsos.Database instance
   * 
   * @return {istsos.Database}
   */

	}, {
		key: 'getDatabaseProperty',
		value: function getDatabaseProperty() {
			return this.db;
		}

		/**
     * Get service database
     *
     * @return {Promise}
     * @fires istsos.Database#DATABASE
     */

	}, {
		key: 'getDatabase',
		value: function getDatabase() {
			return this.db.getDb(this.getServiceJSON()["service"], this.server);
		}

		/**
     * Get observations from the server.
     *
     * @param {Object} options Set of key-value pairs
     * @return {Promise}
     * @fires istsos.Service#GETOBSERVATIONS
     */

	}, {
		key: 'getObservations',
		value: function getObservations(options) {
			var _this21 = this;

			var urlConfig = (0, _IstsosHelper.prepareForGetObservations)(options);
			var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/operations/getobservation/offerings/' + urlConfig.offering + '/procedures/' + urlConfig.procedureNames + '/observedproperties/' + urlConfig.observedPropertyUrns + '/eventtime/' + urlConfig.begin + '/' + urlConfig.end;

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this21.fireEvent('GETOBSERVATIONS', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get observations with data aggregation from the server.
     *
     * @param {Object} options Set of key-value pairs
     * @param {Object} aggregationConfig Set of key-value pairs
     * @return {Promise}
     * @fires istsos.Service#GETOBSERVATIONS_AGG
     */

	}, {
		key: 'getObservationsWithAggregation',
		value: function getObservationsWithAggregation(options, aggregationConfig) {
			var _this22 = this;

			var urlConfig = (0, _IstsosHelper.prepareForGetObservations)(options, aggregationConfig, 'aggregation');
			var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/operations/getobservation/offerings/' + urlConfig.offering + '/procedures/' + urlConfig.procedureNames + '/observedproperties/' + urlConfig.observedPropertyUrns + '/eventtime/' + urlConfig.begin + '/' + urlConfig.end + '/' + urlConfig.aggregationURL;

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this22.fireEvent('GETOBSERVATIONS_AGG', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get observations from the server, with simplified response
     *
     * @param {Object} options Set of key-value pairs
     * @return {Promise}
     * @fires istsos.Service#GETOBSERVATIONS_SIMPLIFIED
     */

	}, {
		key: 'getObservationsSimplified',
		value: function getObservationsSimplified(options) {
			var _this23 = this;

			var urlConfig = (0, _IstsosHelper.prepareForGetObservations)(options);
			var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/operations/getobservation/offerings/' + urlConfig.offering + '/procedures/' + urlConfig.procedureNames + '/observedproperties/' + urlConfig.observedPropertyUrns + '/eventtime/' + urlConfig.begin + '/' + urlConfig.end;

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					var transformed = (0, _IstsosHelper.transformGetObservationsResponse)('simple', result);
					_this23.fireEvent('GETOBSERVATIONS_SIMPLIFIED', transformed);
					return transformed;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get observations from the server filtered by QI constraint.
     *
     * @param {Object} options Set of key-value pairs
     * @param {Object} aggregationConfig Set of key-value pairs
     * @return {Promise}
     * @fires istsos.Service#GETOBSERVATIONS_BY_QUALITY
     */

	}, {
		key: 'getObservationsByQualityIndexConstraint',
		value: function getObservationsByQualityIndexConstraint(options, constraintConfig) {
			var _this24 = this;

			var urlConfig = (0, _IstsosHelper.prepareForGetObservations)(options);
			var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/operations/getobservation/offerings/' + urlConfig.offering + '/procedures/' + urlConfig.procedureNames + '/observedproperties/' + urlConfig.observedPropertyUrns + '/eventtime/' + urlConfig.begin + '/' + urlConfig.end;

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					var transformed = (0, _IstsosHelper.transformGetObservationsResponse)('constraint', result, constraintConfig);
					_this24.fireEvent('GETOBSERVATIONS_BY_QUALITY', transformed);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
     * Get feature collection from the server.
     *
     * @param {Object} opt_options Set of key-value pairs
     * @return {Promise}
     * @fires istsos.Service#GEOJSON
     */

	}, {
		key: 'getFeatureCollection',
		value: function getFeatureCollection(opt_options) {
			var _this25 = this;

			var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/procedures/operations/geojson';
			if (opt_options.opt_epsg) {
				url += "?epsg=" + opt_options.opt_epsg.toString();
				if (opt_options.opt_offering || opt_options.opt_procedure) {
					if (opt_options.opt_offering) {
						url += "&offering=" + opt_options.opt_offering.getOfferingJSON()["name"];
					}
					if (opt_options.opt_procedure && opt_options.opt_procedure instanceof istsos.Procedure) {
						url += "&procedure=" + opt_options.opt_procedure.getProcedureJSON()["system"];
					} else if (opt_options.opt_procedure && opt_options.opt_procedure instanceof istsos.VirtualProcedure) {
						url += "&procedure=" + opt_options.opt_procedure.getVirtualProcedureJSON()["system"];
					}
				}
			}

			var config = {};
			if (this.server.getLoginConfig()) {
				config['headers'] = this.server.getLoginConfig();
			}

			return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
				if (result.success) {
					_this25.fireEvent('GEOJSON', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}
	}]);

	return Service;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.UnitOfMeasure = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.UnitOfMeasure 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var UnitOfMeasure = exports.UnitOfMeasure = function (_EventEmitter) {
   _inherits(UnitOfMeasure, _EventEmitter);

   /**
    * constructor - instantiates istsos.UnitOfMeasure
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function UnitOfMeasure(options) {
      _classCallCheck(this, UnitOfMeasure);

      var _this = _possibleConstructorReturn(this, (UnitOfMeasure.__proto__ || Object.getPrototypeOf(UnitOfMeasure)).call(this));

      _this.name = options.name;
      _this.description = options.description || "";
      _this.proceduresIncluded = [];
      _this.service = options.service;
      options.service.addUom(_this);
      _this.updateProceduresIncluded();
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(UnitOfMeasure, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'fire', this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'on', this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'once', this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'off', this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'unlistenAll', this).call(this);
      }

      /**
       * Update procedures and virtual procedures included
       */

   }, {
      key: 'updateProceduresIncluded',
      value: function updateProceduresIncluded() {
         var procedures = this.service.getProceduresProperty();
         var v_procedures = this.service.getVirtualProceduresProperty();
         var all = procedures.concat(v_procedures);
         var code = this.name;
         if (all.length !== 0) {
            for (var i = 0; i < all.length; i++) {
               for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
                  if (code === all[i].getOutputsProperty()[j]["uom"]) {
                     this.proceduresIncluded.push(all[i]);
                  }
               }
            }
         }
      }

      /**
       * @return {Object}
       */

   }, {
      key: 'getUomJSON',
      value: function getUomJSON() {
         var uomJSON = {
            "name": this.name,
            "description": this.description
         };
         return uomJSON;
      }

      /**
       * Update unit of measure on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.UnitOfMeasure#UPDATE_UOM            
       */

   }, {
      key: 'updateUom',
      value: function updateUom(options) {
         var _this2 = this;

         var oldName = this.name;
         this.name = options.newName || this.name;
         this.description = options.newDescr || this.description;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/uoms/' + oldName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getUomJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('UPDATE_UOM', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Delete unit of measure on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.UnitOfMeasure#DELETE_UOM            
       */

   }, {
      key: 'deleteUom',
      value: function deleteUom() {
         var _this3 = this;

         var procedures = this.service.getProceduresProperty();
         var v_procedures = this.service.getVirtualProceduresProperty();
         var uoms_service = this.service.getUomsProperty();
         var all = procedures.concat(v_procedures);
         var outputs = [];
         all.forEach(function (p) {
            outputs.concat(p.getOutputsProperty());
         });
         var code = this.name;
         var connected = false;
         for (var i = 0; i < outputs.length; i++) {
            if (code === outputs[i].getOutputJSON()["uom"]) {
               alert("CONNECTED TO PROCEDURE");
               connected = true;
               break;
            }
         }
         if (connected === false) {
            for (var j = 0; j < uoms_service.length; j++) {
               if (this === uoms_service[j]) {
                  uoms_service.splice(j, 1);
               }
            }
         }

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/uoms/' + this.getUomJSON()["name"];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getUomJSON());

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('DELETE_UOM', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }]);

   return UnitOfMeasure;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.VirtualProcedure = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ProcedureBase2 = __webpack_require__(4);

var _HttpAPI = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * istsos.VirtualProcedure 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
var VirtualProcedure = exports.VirtualProcedure = function (_ProcedureBase) {
   _inherits(VirtualProcedure, _ProcedureBase);

   /**
    * constructor - instantiates istsos.VirtualProcedure
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   function VirtualProcedure(options) {
      _classCallCheck(this, VirtualProcedure);

      var _this = _possibleConstructorReturn(this, (VirtualProcedure.__proto__ || Object.getPrototypeOf(VirtualProcedure)).call(this, {
         name: options.name,
         description: options.description,
         keywords: options.keywords,
         foi_name: options.foi_name,
         epsg: options.epsg,
         x: options.x,
         y: options.y,
         z: options.z,
         outputs: options.outputs
      }));

      _this.systemType = options.systemType === "virtual" ? options.systemType : null;
      _this.sensorType = options.sensorType || "";
      _this.service = options.service;
      _this.code = {
         "code": options.code
      } || {};
      _this.ratingCurve = options.ratingCurve || {};
      options.service.addVirtualProcedure(_this);
      options.service.getOfferingsProperty()[0].getMemberProceduresProperty().push(_this);
      return _this;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */


   _createClass(VirtualProcedure, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'fire', this).call(this, eventType, response);
      }

      /**
       * Add event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'on', this).call(this, event, callback);
      }

      /**
       * Add event listener, that will listen only once.
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'once', this).call(this, event, callback);
      }

      /**
       * Remove event listener
       * 
       * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
       * @param  {Function} callback Handler function
       */

   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'off', this).call(this, event, callback);
      }

      /**
       * Remove all event listeners
       */

   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'unlistenAll', this).call(this);
      }

      /**
       * @return {Object}
       */

   }, {
      key: 'getVirtualProcedureJSON',
      value: function getVirtualProcedureJSON() {
         var vProcedureJSON = _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'getProcedureBaseJSON', this).call(this);
         vProcedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": this.systemType === "virtual" ? this.systemType : null
         }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
         }];
         return vProcedureJSON;
      }

      /**
       * Get virtual procedure code
       *
       * @return {Promise} 
       * @fires  istsos.VirtualProcedure#GET_CODE            
       */

   }, {
      key: 'getCode',
      value: function getCode() {
         var _this2 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/code';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('GET_CODE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Post new virtual procedure code
       *
       * @return {Promise} 
       * @fires  istsos.VirtualProcedure#NEW_CODE            
       */

   }, {
      key: 'registerCode',
      value: function registerCode() {
         var _this3 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/code';
         this.executeRequest(url, istsos.events.EventType.NEW_CODE, "POST", JSON.stringify(this.getCodeProperty()));

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getCodeProperty());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('NEW_CODE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Update virtual procedure code
       *
       * @return {Promise} 
       * @fires  istsos.VirtualProcedure#UPDATE_CODE            
       */

   }, {
      key: 'updateCode',
      value: function updateCode(newCode) {
         var _this4 = this;

         this.code = {
            "code": newCode
         } || this.code;
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/code';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getCodeProperty());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('UPDATE_CODE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Delete virtual procedure code
       *
       * @return {Promise} 
       * @fires  istsos.VirtualProcedure#DELETE_CODE            
       */

   }, {
      key: 'deleteCode',
      value: function deleteCode() {
         var _this5 = this;

         this.code = "";
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/code';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('DELETE_CODE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @return {Object}
       */

   }, {
      key: 'getCodeProperty',
      value: function getCodeProperty() {
         return this.code;
      }

      /**
       * Get virtual procedure rating curve
       *
       * @return {Promise} 
       * @fires  istsos.VirtualProcedure#RATING_CURVE            
       */

   }, {
      key: 'getRatingCurve',
      value: function getRatingCurve() {
         var _this6 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/ratingcurve';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this6.fireEvent('RATING_CURVE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Post virtual procedure rating curve
       *
       * @return {Promise} 
       * @fires  istsos.VirtualProcedure#NEW_RATING_CURVE            
       */

   }, {
      key: 'registerRatingCurve',
      value: function registerRatingCurve() {
         var _this7 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/ratingcurve';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getRatingCurveProperty());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this7.fireEvent('NEW_RATING_CURVE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Delete virtual procedure's rating curve
       *
       * @return {Promise} 
       * @fires  istsos.VirtualProcedure#DELETE_RATING_CURVE            
       */

   }, {
      key: 'deleteRatingCurve',
      value: function deleteRatingCurve() {
         var _this8 = this;

         this.ratingCurve = {};
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/ratingcurve';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this8.fireEvent('DELETE_RATING_CURVE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @return {Object}
       */

   }, {
      key: 'getRatingCurveProperty',
      value: function getRatingCurveProperty() {
         return this.ratingCurve;
      }

      /**
       * Update virtual procedure on the server
       *
       * @param {object} options Set of key-value pairs
       * @return {Promise} 
       * @fires  istsos.VirtualProcedure#UPDATE_V_PROCEDURE            
       */

   }, {
      key: 'updateVirtualProcedure',
      value: function updateVirtualProcedure(options) {
         var _this9 = this;

         var oldName = this.name;
         this.name = options.name || this.name;
         this.description = options.description || this.description;
         this.keywords = options.keywords || this.keywords;
         this.foi_name = options.foi_name || this.foi_name;
         this.epsg = option.sepsg || this.epsg;
         this.coordinates = [options.x, options.y, options.z] || this.coordinates;
         var outputs_array = this.outputs;
         if (options.outputs || options.outputs.length !== 0) {
            outputs_array.splice(1, outputs_array.length - 1);
            options.outputs.forEach(function (out) {
               outputs_array.push(out);
            });
         }
         this.systemType = options.systemType === "virtual" ? options.systemType : null;
         this.sensorType = options.sensorType || "";

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + oldName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getVirtualProcedureJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this9.fireEvent('UPDATE_V_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Delete virtual procedure on the server
       *
       * @return {Promise} 
       * @fires  istsos.Procedure#DELETE_PROCEDURE            
       */

   }, {
      key: 'deleteVirtualProcedure',
      value: function deleteVirtualProcedure() {
         var _this10 = this;

         var v_procedures = this.service.getVirtualProceduresProperty();
         var obj = this.getVirtualProcedureJSON();
         v_procedures.forEach(function (p) {
            if (p.getVirtualProcedureJSON()["system"] === obj["system"]) {
               v_procedures.splice(v_procedures.indexOf(p), 1);
            }
         });

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.name;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this10.fireEvent('DELETE_V_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Add virtual procedure's membership to offering on the server
       *
       * @param {istsos.Offering} offering istsos.Offering class
       * @return {Promise} 
       * @fires  istsos.Offering#ADD_TO_OFFERING            
       */

   }, {
      key: 'addMembershipToOffering',
      value: function addMembershipToOffering(offering) {
         var _this11 = this;

         offering.getMemberProceduresProperty().push(this);
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + offering.getOfferingJSON()["name"] + '/procedures';

         var data = [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getVirtualProcedureJSON()["system"]
         }];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this11.fireEvent('ADD_TO_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * Remove virtual procedure's membership from offering on the server
       *
       * @param {istsos.Offering} offering istsos.Offering class
       * @return {Promise} 
       * @fires  istsos.Offering#REMOVE_FROM_OFFERING            
       */

   }, {
      key: 'removeMembershipFromOffering',
      value: function removeMembershipFromOffering(offering) {
         var _this12 = this;

         var procedures = offering.getMemberProceduresProperty();
         var vp_name = this.name;
         procedures.forEach(function (p) {
            if (p.name === vp_name) {
               procedures.splice(procedures.indexOf(p), 1);
            }
         });
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + offering.getOfferingJSON()["name"] + '/procedures/' + this.getVirtualProcedureJSON()["system"];

         var data = [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getVirtualProcedureJSON()["system"]
         }];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this12.fireEvent('REMOVE_FROM_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @return {Array<istsos.Output>}
       */

   }, {
      key: 'getOutputsProperty',
      value: function getOutputsProperty() {
         return _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'getOutputsProperty', this).call(this);
      }
   }]);

   return VirtualProcedure;
}(_ProcedureBase2.ProcedureBase);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ServerContainer = __webpack_require__(14);

var _Date = __webpack_require__(5);

var _Database = __webpack_require__(9);

var _Configuration = __webpack_require__(3);

var _Server = __webpack_require__(13);

var _HttpAPI = __webpack_require__(0);

var _EventTypes = __webpack_require__(6);

var _EventEmitter = __webpack_require__(1);

var _DataQuality = __webpack_require__(8);

var _UnitOfMeasure = __webpack_require__(16);

var _Service = __webpack_require__(15);

var _ObservedProperty = __webpack_require__(10);

var _Output = __webpack_require__(11);

var _ProcedureBase = __webpack_require__(4);

var _Procedure = __webpack_require__(12);

var _VirtualProcedure = __webpack_require__(17);

var _Offering = __webpack_require__(7);

var _IstsosHelper = __webpack_require__(2);

module.exports = {
	ServerContainer: _ServerContainer.ServerContainer,
	Date: _Date.Date,
	Database: _Database.Database,
	Server: _Server.Server,
	EventEmitter: _EventEmitter.EventEmitter,
	EventTypes: _EventTypes.EventTypes,
	Configuration: _Configuration.Configuration,
	HttpAPI: _HttpAPI.HttpAPI,
	DataQuality: _DataQuality.DataQuality,
	UnitOfMeasure: _UnitOfMeasure.UnitOfMeasure,
	IstsosHelper: {
		validateConstraintInput: _IstsosHelper.validateConstraintInput,
		ConstraintInputs: _IstsosHelper.ConstraintInputs,
		prepareForGetObservations: _IstsosHelper.prepareForGetObservations,
		transformGetObservationsResponse: _IstsosHelper.transformGetObservationsResponse
	},
	Service: _Service.Service,
	ObservedProperty: _ObservedProperty.ObservedProperty,
	Output: _Output.Output,
	ProcedureBase: _ProcedureBase.ProcedureBase,
	Procedure: _Procedure.Procedure,
	VirtualProcedure: _VirtualProcedure.VirtualProcedure,
	Offering: _Offering.Offering
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(19)
var ieee754 = __webpack_require__(21)
var isArray = __webpack_require__(22)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(23)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
});