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


def get_boards(user_name='public'):
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE user_name = %(user_name)s OR user_name = 'public'
        ORDER BY id
        ;
        """,
        variables={'user_name': user_name}
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY cards.card_order;
        """
        , {"board_id": board_id})

    return matching_cards


def create_board(board_name, user_name):
    return data_manager.execute_insert("""
    INSERT INTO boards
    (title, user_name)
    VALUES (%(board_name)s, %(user_name)s)""", {"board_name": board_name,
                                                "user_name": user_name})


def update_board_title(board_name, board_id):
    data_manager.execute_insert("""
        UPDATE boards
        SET title = %(board_name)s
        WHERE id = %(board_id)s;
    """, {"board_name": board_name, "board_id": board_id})


def delete_board(board_id):
    return data_manager.execute_insert(
        """DELETE FROM boards
        WHERE id = %(board_id)s""",
        variables={'board_id': board_id}
    )


def create_card(card_name, board_id):
    status_id = 1
    card_order = 1
    return data_manager.execute_insert("""
    INSERT INTO cards
    (title, board_id, status_id, card_order)
    VALUES (%(card_name)s, %(board_id)s, %(status_id)s, %(card_order)s)""", {"card_name": card_name,
                                                                             "board_id": board_id,
                                                                             "status_id": status_id,
                                                                             "card_order": card_order})


def update_card_title(card_name, card_id):
    data_manager.execute_insert("""
    UPDATE cards
    SET title = %(new_title)s
    WHERE id = %(id)s;
    """, {"new_title": card_name,
          "id": card_id})


# def get_cards_for_board(board_id):
#     # remove this code once you implement the database
#
#     matching_cards = data_manager.execute_select(
#         """
#         SELECT * FROM cards
#         WHERE cards.board_id = %(board_id)s
#         ;
#         """
#         , {"board_id": board_id})
#
#     return matching_cards


def delete_cards_by_board(board_id):
    return data_manager.execute_insert(
        """DELETE FROM cards 
        WHERE board_id = %(board_id)s""",
        variables={"board_id": board_id}
    )


def get_cards():
    return data_manager.execute_select(
        """SELECT *
        FROM cards"""
    )


def delete_card(card_id):
    return data_manager.execute_insert(
        """DELETE FROM cards
            WHERE id = %(card_id)s
        """,
        variables={"card_id": card_id}
    )


def list_users():
    users = data_manager.execute_select(
        """SELECT *
        FROM users"""
    )
    return users


def get_password_by_username(name):
    password = data_manager.execute_select(
        """SELECT password
        FROM users
        WHERE user_name = %(name)s
        """,
        variables={'name': name}
    )
    return password


def new_user(user_name, password):
    registration_time = datetime.datetime.now()
    data_manager.execute_insert(
        """INSERT INTO users (registration_time, user_name, password)
        VALUES (%(registration_time)s, %(user_name)s, %(password)s)""",
        variables={'registration_time': registration_time,
                   'user_name': user_name,
                   'password': password}
    )


def get_statuses(board_id):
    statuses = data_manager.execute_select(
        """SELECT * 
        FROM statuses
        WHERE boards_id = %(board_id)s OR boards_id = 0
        """, variables={'board_id': board_id})
    return statuses


def add_status(board_id, status_title):
    return data_manager.execute_insert(
        """INSERT INTO statuses
        (title, boards_id)
        VALUES (%(title)s, %(board_id)s)
        """,
        variables={"title": status_title,
                   "board_id": board_id}
    )


def delete_status_by_board_id(board_id):
    return data_manager.execute_insert(
        """DELETE FROM statuses
        WHERE boards_id = %(board_id)s
        """,
        variables={"board_id": board_id}
    )


def delete_status(status_id):
    return data_manager.execute_insert(
        """DELETE FROM statuses
        WHERE id = %(status_id)s""",
        variables={"status_id": status_id}
    )


def update_card_position(card_id, card_status, card_order):
    return data_manager.execute_insert(
        """UPDATE cards
    SET status_id = %(status)s, card_order = %(order)s
    WHERE id = %(id)s;
    """, {"status": card_status,
          "id": card_id,
          "order": card_order})
