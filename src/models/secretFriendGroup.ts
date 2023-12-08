// Path: src/models/secretFriendGroup.ts
export interface SecretFriendGroup {
  groupId: string;
  participants: string[];
  combinations?: SecretFriendGroupCombination[];
}

type Participant = {
  id: string;
  name: string;
};

// Path: src/models/secretFriendGroup.ts
export interface SecretFriendGroupCombination {
  giver: Participant;
  receiver: Participant;
}
