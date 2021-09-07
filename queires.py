import data_manager
import datetime


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def list_users():
    users = data_manager.execute_select(
        """SELECT *
        FROM users"""
    )
    return users


def new_user(user_name, password):
    registration_time = datetime.datetime.now()
    data_manager.execute_insert(
        """INSERT INTO users (registration_time, user_name, password)
        VALUES (%(registration_time)s, %(user_name)s, %(password)s)""",
        variables={'registration_time': registration_time,
                   'user_name': user_name,
                   'password': password}
    )
