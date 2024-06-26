#!/usr/bin/env python3
""" Simple helper function for index range """
import csv
import math
from typing import List, Dict, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """ Returns a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list for those
    particular pagination parameters
    first page must be 1
    """
    if page < 1 or page_size < 1:
        raise ValueError('page and page_size must be >= 1')

    return ((page - 1) * page_size, page * page_size)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """ returns the appropriate page of the dataset """
        assert (type(page) == int and page > 0)
        assert (type(page_size) == int and page_size > 0)

        start, end = index_range(page, page_size)
        return self.dataset()[start:end]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict[str, int]:
        """ returns the current page content with its size,
        total pages and next/prev pages """
        data = self.get_page(page, page_size)
        dsLen = len(self.__dataset)  # dataset length
        return {
            "page_size": len(data),
            "page": page,
            "data": data,
            "next_page": page + 1 if (page + 1) * page_size < dsLen else None,
            "prev_page": page - 1 if page > 1 else None,
            "total_pages": math.ceil(dsLen / page_size)
        }
