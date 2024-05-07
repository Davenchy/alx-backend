""" Create LIFO Caching Manager class """

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """ LIFO Caching Manager """
    def put(self, key, item):
        """ Add an item in the cache """
        if key is None or item is None:
            return

        if key in self.cache_data:
            del self.cache_data[key]
        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            keyToDel = list(self.cache_data)[-2]
            del self.cache_data[keyToDel]
            print(f"DISCARD: {keyToDel}")

    def get(self, key):
        """ Get an item by key from cache """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
