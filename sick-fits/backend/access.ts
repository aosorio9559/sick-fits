// Simply put, access control will return a yes or no depending on the user's session

import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}
