// AI-assisted: see AI-ATTRIBUTION.md
import { DataPage } from "./DataPage";

// A status as stored: the author is kept as an alias, not a full user.
export interface StoredStatus {
  readonly post: string;
  readonly authorAlias: string;
  readonly timestamp: number;
}

// Used for both stories and feeds. The owner is the story's author,
// or the user whose feed it is.
export interface StatusDAO {
  // Returns a page of statuses, newest first.
  getPage(
    ownerAlias: string,
    pageSize: number,
    lastTimestamp: number | null,
  ): Promise<DataPage<StoredStatus>>;

  put(ownerAlias: string, status: StoredStatus): Promise<void>;

  // Stores the same status under every given owner.
  batchPut(ownerAliases: string[], status: StoredStatus): Promise<void>;
}
