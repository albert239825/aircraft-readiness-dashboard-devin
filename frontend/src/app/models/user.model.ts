export interface UserToken {
  username: string;
  roles: ('viewer' | 'maintainer' | 'admin')[];
  exp: number;
}
