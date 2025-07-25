import { invoke } from "@tauri-apps/api/core";
import { Blotter } from "@/types/types";

export async function insertBlotter(blotter: Blotter) {
  return await invoke("insert_blotter_command", { blotter });
}

export async function fetchAllBlotters(): Promise<Blotter[]> {
  return await invoke("fetch_all_blotters_command");
}
