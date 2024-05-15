#!/usr/bin/env python3
""" Simple flask app """

from typing import Optional
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz
from datetime import datetime

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config:
    """ Flask App Config """

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


def get_user(user_id: Optional[int]) -> Optional[dict]:
    """ get user by its id or None """
    if user_id is None or user_id not in users:
        return None
    return users[user_id]


@babel.localeselector
def get_local() -> str:
    """ determine best locale match for the user """
    supported = app.config["LANGUAGES"]
    locale = request.args.get('locale')
    if locale and locale in supported:
        return locale
    if g.user:
        locale = g.user.get('locale')
        if locale in supported:
            return locale

    return request.accept_languages.best_match(supported)


@app.before_request
def before_request():
    """ Mock user database before any request """
    user_id = request.args.get('login_as', None)
    g.user = get_user(int(user_id) if user_id is not None else None)

    time = pytz.timezone(get_timezone()).localize(datetime.now())
    g.current_time = time.strftime("%b %d, %Y %I:%M:%S %p")


@babel.timezoneselector
def get_timezone() -> str:
    """ get timezone """
    try:
        timezone = request.args.get('timezone')
        if timezone:
            timezone = pytz.timezone(timezone).zone
            if timezone:
                return timezone
    except pytz.exceptions.UnknownTimeZoneError:
        pass

    try:
        if g.user is not None:
            timezone = g.user.get('timezone')
            if timezone is not None:
                timezone = pytz.timezone(timezone).zone
                if timezone:
                    return timezone
    except pytz.exceptions.UnknownTimeZoneError:
        pass

    return app.config['BABEL_DEFAULT_TIMEZONE']


@app.route('/')
def index():
    """ get / endpoint """
    return render_template('7-index.html')


if __name__ == '__main__':
    app.run()
