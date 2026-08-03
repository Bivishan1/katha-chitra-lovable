import { useCmsRealtime } from "@/lib/cms";

/** Keeps public site content in sync with admin edits in real time. */
export function CmsRealtime() {
  useCmsRealtime();
  return null;
}