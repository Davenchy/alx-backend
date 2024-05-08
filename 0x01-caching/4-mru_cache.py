#!/usr/bin/env python3
""" Create MRU based caching manager """

from base_caching import BaseCaching
from typing import Optional, Any


class MRUCache(BaseCaching):
    """ MRU Based Caching Manager """

    def put(self, key: str, item: Any):
        """ Add an item in the cache """
        if key is None or item is None:
            return

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            keyToDel = list(self.cache_data.keys())[-2]
            del self.cache_data[keyToDel]
            print(f"DISCARD: {keyToDel}")

    def get(self, key: str) -> Optional[Any]:
        """ Get an item by key from cache """
        if key is None or key not in self.cache_data:
            return None
        # get value
        value = self.cache_data[key]
        # move key to front
        del self.cache_data[key]
        self.cache_data[key] = value
        # return value
        return value
