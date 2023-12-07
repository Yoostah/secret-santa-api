// Path: src/models/group.ts
export interface Group {
  id: string;
  name: string;
  status: GroupStatus;
}

// Path: src/models/group.ts
export enum GroupStatus {
  PREPARATION = "preparation",
  ACTIVE = "active",
  FINISHED = "finished",
  DELETED = "deleted",
}
