#!/usr/bin/env python3
""" Simple helper function for index range """
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """ Returns a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list for those
    particular pagination parameters
    first page must be 1
    """
    if page < 1 or page_size < 1:
        raise ValueError('page and page_size must be >= 1')

    return ((page - 1) * page_size, page * page_size)


if __name__ == "__main__":
    for i in range(3):
        print(index_range(i + 1, 10))
