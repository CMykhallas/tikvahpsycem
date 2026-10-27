export const PRELOAD_RELOAD_KEY = "tikvah:preload-reloaded";

export const clearPreloadReloadFlag = () => {
  try {
    sessionStorage.removeItem(PRELOAD_RELOAD_KEY);
  } catch {
    return;
  }
};
