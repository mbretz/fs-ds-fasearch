export interface SessionContextValue {
  signedIn: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  signIn: () => void;
  signOut: () => void;
}
