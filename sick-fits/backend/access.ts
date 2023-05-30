// Simply put, access control will return a yes or no depending on the user's session

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Check if a user meets a criteria
export const permissions = {
  ...generatedPermissions,
};

// Rule based function
// Rules can return a boolean or a filter which limits which products they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. Do they have the permission of canManageProducts?
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    // This will bind as a WHERE clause in the graphQL API
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true; // They can read all products
    }
    // They should only see available products (based on the status field)
    return { status: 'AVAILABLE' };
  },
};
