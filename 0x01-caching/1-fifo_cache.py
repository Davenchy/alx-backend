#!/usr/bin/python3
""" Create FIFO Caching Manager class """

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """ FIFO Caching Manager """
    def put(self, key, item):
        """ Add an item in the cache """
        if key is None or item is None:
            return

        self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            keyToDel = next(iter(self.cache_data))
            del self.cache_data[keyToDel]
            print(f"DISCARD: {keyToDel}")

    def get(self, key):
        """ Get an item by key from cache """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
