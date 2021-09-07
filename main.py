from flask import Flask, render_template, url_for, request
from dotenv import load_dotenv

from util import json_response
import mimetypes
import queires

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queires.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


@app.route("/api/boards/create", methods=["POST"])
@json_response
def create_boards():
    data = request.get_json()["boardTitle"]
    print(data)
    queires.create_board(data)
    # return data


@app.route('/api/boards/<int:board_id>/update', methods=['POST'])
@json_response
def update_board(board_id):
    board_name = request.get_json()
    queires.update_board_title(board_name, board_id)


if __name__ == '__main__':
    main()
