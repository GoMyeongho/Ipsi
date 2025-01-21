from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from route.firebase import upload_firebase, upload_file
from route.csv import upload_csv  # 외부 함수로 분리된 CSV 업로드 함수

# Flask 애플리케이션 설정
app = Flask(__name__)

# 데이터베이스 URI 및 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost:3306/capstone?charset=utf8&timezone=Asia/Seoul'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# SQLAlchemy 객체 생성
db = SQLAlchemy(app)

# URL 라우팅 설정
app.add_url_rule("/upload/firebase", 'upload_firebase', upload_firebase, methods=['POST'])
app.add_url_rule("/upload/csv", 'upload_csv', upload_csv, methods=['POST'])
app.add_url_rule("/spring/upload/firebase", 'upload_file', upload_file, methods=['POST'])
if __name__ == '__main__':
    app.run(debug=True)
