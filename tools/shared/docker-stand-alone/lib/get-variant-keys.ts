import { Manifest } from "./models";

export function getVariantKeys(manifest: Manifest): string [] {
  // Always build default last if building all (for latest tag).
  return [...Object.keys(manifest.variants || {}), 'default'];
}
