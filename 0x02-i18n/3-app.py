#!/usr/bin/env python3
""" Simple flask app """

from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """ Flask App Config """

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_local():
    """ determine best locale match for the user """
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route('/')
def index():
    """ get / endpoint """
    return render_template('3-index.html')


if __name__ == '__main__':
    app.run()
