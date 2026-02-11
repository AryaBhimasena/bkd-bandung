// lib/clientBootstrap.ts
import { useBootstrapStore } from "@/stores/bootstrapStore";
import { apiGet } from "@/lib/api";

export async function clientBootstrap() {
  const store = useBootstrapStore.getState();

  if (store.isLoaded || store.loading) {
    console.log("[bootstrap] already loaded");
    return;
  }

  store.setLoading(true);
  store.setError(null);

  try {
    const json = await apiGet("coa.list");

    if (!json?.success) {
      throw new Error(json?.message || "Gagal load COA");
    }

    store.setCoaList(json.data);
    store.setIsLoaded(true);

    console.log("[bootstrap] COA loaded:", json.data.length);

  } catch (err) {
    console.error("[bootstrap] error:", err);
    store.setError(err.message || "Terjadi kesalahan");
  } finally {
    store.setLoading(false);
  }
}
