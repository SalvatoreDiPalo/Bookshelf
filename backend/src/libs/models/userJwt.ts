export interface UserJwt {
  id: string;
  sub: string;
  roles?: string[];
  username?: string;
  primaryEmail?: string;
  exp: number;
}
