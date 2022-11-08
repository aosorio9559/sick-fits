import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // Tells Apollo we'll take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // IF there are items
      // AND there aren't enough items to satisfy how many were requested
      // AND we are on the last page
      // THEN just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // We don't have any items, we must go to the network to fetch them
        return false;
      }

      // If there are items, return them from the cache so we don't have to go to the network
      if (items.length) {
        return items;
      }
      return false; // Fallback to network
      // Ask the read function for those items
      // We have two options:
      // 1 - Return the items because they are already in the cache
      // 2 - Return false from here, which will trigger a network request
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the Apollo Client comes back from the network with our products
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // Return the merged items from the cache
      return merged;
    },
  };
}
