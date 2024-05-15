#!/usr/bin/env python3
""" Simple flask app """

from flask import Flask

app = Flask(__name__)


@app.route('/')
def index():
    """ get / endpoint """
    return "Hello, World"


if __name__ == '__main__':
    app.run()