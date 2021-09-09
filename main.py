from flask import Flask, render_template, url_for, request, flash, redirect, session
from dotenv import load_dotenv
import data_manager


from util import json_response
import mimetypes
import queires

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/statuses/<board_id>")
@json_response
def get_statuses(board_id):
    get_board_id = int(board_id)
    return queires.get_statuses(get_board_id)


@app.route("/api/statuses/<int:board_id>/create", methods=["POST"])
@json_response
def add_new_status(board_id):
    status_title = request.get_json()
    queires.add_status(board_id, status_title)


@app.route("/registration", methods=["POST"])
def registration():
    user_name = request.form.get('user_name')
    users_data = queires.list_users()
    for user_data in users_data:
        if user_data['user_name'] == user_name:
            flash('This User Name is already exists!')
            return redirect('/')
    password = request.form.get('password')
    hashed_password = data_manager.hash_password(password)
    queires.new_user(user_name, hashed_password)
    return redirect('/')


@app.route("/login", methods=["POST"])
def validate_login():
    user_login = request.form.get("user_name")
    user_password = request.form.get("password")
    users = queires.list_users()
    username = [user["user_name"] for user in users]
    if user_login in username:
        stored_pw = queires.get_password_by_username(user_login)[0]['password']
        print(stored_pw)
        if data_manager.verify_password(user_password, stored_pw):
            session['user'] = user_login
            return redirect('/')
        flash("Invalid username or password!")
        return redirect('/')
    flash("Invalid username or password!")
    return redirect('/')


@app.route("/logout")
def logout():
    session.clear()
    return redirect('/')


@app.route("/api/boards")
@json_response
def get_boards():
    if session:
        user_name = session['user']
        return queires.get_boards(user_name)
    return queires.get_boards()


@app.route("/api/boards/create", methods=["POST"])
@json_response
def create_boards():
    if session:
        user_name = session['user']
    else:
        user_name = 'public'
    data = request.get_json()["boardTitle"]
    queires.create_board(data, user_name)
    # return data


@app.route('/api/boards/<int:board_id>/update', methods=['POST'])
@json_response
def update_board(board_id):
    board_name = request.get_json()
    queires.update_board_title(board_name, board_id)


@app.route('/api/cards/<int:card_id>/update', methods=["POST"])
@json_response
def update_card(card_id):
    card_name = request.get_json()
    queires.update_card_title(card_name, card_id)


@app.route('/api/boards/<int:board_id>/delete')
@json_response
def delete_board(board_id):
    queires.delete_cards_by_board(board_id)
    queires.delete_board(board_id)


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


@app.route('/api/boards/<int:board_id>/cards/create', methods=['POST'])
@json_response
def create_cards(board_id):
    card_name = request.get_json()["cardTitle"]
    queires.create_card(card_name, board_id)


@app.route('/api/cards')
@json_response
def get_cards():
    return queires.get_cards()


@app.route('/api/cards/<card_id>/delete')
@json_response
def delete_card(card_id):
    queires.delete_card(card_id)


@app.route('/api/cards/<card_id>/update')
@json_response
def update_card_position(card_id):
    card_status = request.get_json()['cardStatusId']
    card_order = request.get_json()['cardOrder']


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
