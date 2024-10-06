
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import logging
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'admin',
    'password': 'admin',
    'database': 'mytestdbscheme'
}

# Helper function to get database connection
def get_db_connection():
    return mysql.connector.connect(**db_config)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@app.route('/insert_numbers', methods=['POST'])
def insert_numbers():
    try:
        # Получаем данные из JSON-запроса
        data = request.json
        oneOf5 = data.get('col1')
        twoOf5 = data.get('col2')
        threeOf5 = data.get('col3')
        fourOf5 = data.get('col4')
        fiveOf5 = data.get('col5')
        oneOf2 = data.get('col6')
        twoOf2 = data.get('col7')
        paydate = data.get('col8')

        # Подключаемся к базе данных
        connection = mysql.connector.connect(
            host="localhost",
            user="admin",
            password="admin",
            database="mytestdbscheme"
        )

        cursor = connection.cursor()

        # SQL-запрос для вставки данных
        insert_query = '''
        INSERT INTO numberlena (oneOf5, twoOf5, threeOf5, fourOf5, fiveOf5, oneOf2, twoOf2, paydate)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        '''
        

        # Выполняем запрос
        cursor.execute(insert_query, (oneOf5, twoOf5, threeOf5, fourOf5, fiveOf5, oneOf2, twoOf2, paydate))
        
        # Подтверждаем изменения
        connection.commit()

        return jsonify({"message": "Data inserted successfully"}), 201

    except mysql.connector.Error as error:
        print(f"Failed to insert data into MySQL: {error}")
        return jsonify({"error": "Failed to insert data"}), 500

    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/get_numbers', methods=['GET'])
def get_numbers():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = "SELECT oneOf5, twoOf5, threeOf5, fourOf5, fiveOf5, oneOf2, twoOf2, Paydate FROM numberlena ORDER BY Paydate DESC"
        cursor.execute(query)
        result = cursor.fetchall()
        
        # Formatieren Sie das Ergebnis
        formatted_result = []
        for row in result:
            formatted_row = list(row[:])  # Alle Elemente außer dem letzten (Paydate)
            formatted_result.append(formatted_row)
        
        return jsonify({"output": formatted_result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/get_dates', methods=['GET'])
def get_dates():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = "SELECT DISTINCT Paydate FROM numberlena ORDER BY Paydate DESC"
        cursor.execute(query)
        result = cursor.fetchall()
        dates = [row['Paydate'] for row in result]
        return jsonify({"output": dates}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()



@app.route('/get_number/<date>', methods=['GET'])
def get_number(date):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        date = re.sub(r'^undefined-undefined-', '', date)
        datetime.strptime(date, '%Y-%m-%d')
        query = """
        SELECT oneOf5, twoOf5, threeOf5, fourOf5, fiveOf5, oneOf2, twoOf2, Paydate
        FROM numberlena 
        WHERE Paydate = %s
        """
        cursor.execute(query, (date,))
        result = cursor.fetchall()
        
        # Formatieren Sie das Ergebnis
        formatted_result = []
        for row in result:
            formatted_row = list(row[:])  # Alle Elemente außer dem letzten (Paydate)
            formatted_result.append(formatted_row)
        
        return jsonify({"output": formatted_result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

        
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)