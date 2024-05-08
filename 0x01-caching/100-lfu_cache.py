#!/usr/bin/env python3
""" Create LFU based caching manager """

from base_caching import BaseCaching
from typing import Optional, Any


class LFUCache(BaseCaching):
    """ LFU Based Caching Manager """

    def __get_key_LFU(self) -> Optional[str]:
        """ Use LFU algorithm to get least frequently used key
        if many keys have the same frequency, get the least recently used one
        """
        selection = None
        it = enumerate(self.cache_data.items())
        length = len(self.cache_data)
        for index, (key, (value, counter)) in it:
            if index + 1 == length:
                break
            # small index, small counter
            score = counter * counter + index / length
            if selection is None or score < selection[1]:
                selection = (key, score)
            # if sKey is None:
            #     sKey, sCounter = key, counter
            #     continue

            # if sCounter > counter:
            #     sKey, sCounter = key, counter
        # return sKey
        return None if selection is None else selection[0]

    def put(self, key: str, item: Any):
        """ Add an item in the cache """
        if key is None or item is None:
            return

        counter = 0
        if key in self.cache_data:
            counter = self.cache_data[key][1] + 1
        self.cache_data[key] = (item, counter)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            keyToDel = self.__get_key_LFU()
            if not keyToDel:
                return
            del self.cache_data[keyToDel]
            print(f"DISCARD: {keyToDel}")

    def get(self, key: str) -> Optional[Any]:
        """ Get an item by key from cache """
        if key is None or key not in self.cache_data:
            return None
        # get value
        value, counter = self.cache_data[key]
        # move key to front
        del self.cache_data[key]
        self.cache_data[key] = (value, counter + 1)
        # return value
        return value

    def print_cache(self):
        """ Print the cache """
        print("Current cache:")
        for key, (value, _) in sorted(self.cache_data.items()):
            print("{}: {}".format(key, value))
