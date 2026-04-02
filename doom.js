var Module = window.Module || {};

Module.canvas = Module.canvas || document.getElementById("doomCanvas");
Module.arguments = Module.arguments || ["-iwad", "freedoom.wad"];

Module.locateFile = function(path) {
  return path;
};

Module.print = Module.print || function(text) {
  console.log("[DOOM]", text);
};

Module.printErr = Module.printErr || function(text) {
  console.error("[DOOM ERROR]", text);
};

Module.setStatus = Module.setStatus || function(text) {
  console.log("[STATUS]", text);
};

Module.onAbort = function(err) {
  console.error("DOOM aborted:", err);
};

Module.preRun = Module.preRun || [];
Module.preRun.push(function() {
  console.log("Checking Freedoom WAD...");
  return fetch("freedoom.wad", { method: "HEAD" })
    .then(function(res) {
      if (!res.ok) throw new Error("freedoom.wad missing");
      console.log("freedoom.wad OK");
    })
    .catch(function() {
      console.error("freedoom.wad not found in same folder");
    });
});

Module.instantiateWasm = function(imports, successCallback) {
  console.log("Loading WASM...");
  
  fetch("doom.wasm")
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Failed to load doom.wasm");
      }
      
      if (WebAssembly.instantiateStreaming) {
        return WebAssembly.instantiateStreaming(response, imports)
          .then(function(result) {
            console.log("WASM loaded (streaming)");
            successCallback(result.instance);
          })
          .catch(function() {
            return response.arrayBuffer().then(function(bytes) {
              return WebAssembly.instantiate(bytes, imports).then(function(result) {
                console.log("WASM loaded (fallback)");
                successCallback(result.instance);
              });
            });
          });
      } else {
        return response.arrayBuffer().then(function(bytes) {
          return WebAssembly.instantiate(bytes, imports).then(function(result) {
            console.log("WASM loaded (arrayBuffer)");
            successCallback(result.instance);
          });
        });
      }
    })
    .catch(function(err) {
      console.error("WASM load failed:", err);
      Module.onAbort(err);
    });
  
  return {};
};

Module.postRun = Module.postRun || [];
Module.postRun.push(function() {
  console.log("DOOM started successfully");
});

window.Module = Module;
