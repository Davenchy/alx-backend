#!/usr/bin/python3
""" Create Basic Caching Manager class """

from base_caching import BaseCaching
from typing import Any, Optional


class BasicCache(BaseCaching):
    """ Basic Caching Manager """
    def put(self, key, item):
        """ Add an item in the cache """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key) -> Optional[Any]:
        """ Get an item by key from cache """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
