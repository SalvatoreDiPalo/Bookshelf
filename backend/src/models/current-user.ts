export interface CurrentUser {
  sub: string;
  roles?: string[];
  username?: string;
  primaryEmail?: string;
  id: string;
  exp: number;
}
