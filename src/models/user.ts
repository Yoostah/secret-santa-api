// Path: src/models/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
}

// Path: src/models/user.ts
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
