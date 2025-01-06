from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import ENUM

db = SQLAlchemy()

# Univ 모델 (대학 정보)
class Univ(db.Model):
    __tablename__ = 'university'

    univId = db.Column(db.Integer, primary_key=True)
    univName = db.Column(db.String(120), unique=True, nullable=False)
    univDept = db.Column(db.String(120), unique=True, nullable=False)
    univImg = db.Column(db.String(120), nullable=False)

    def __init__(self, univName, univDept, univImg):
        self.univName = univName
        self.univDept = univDept
        self.univImg = univImg


# TextBoard 모델 (게시판 정보)
class TextBoard(db.Model):
    __tablename__ = 'text_board'

    textId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    textCategory = db.Column(ENUM('FAQ'), nullable=False)
    active = db.Column(ENUM('ACTIVE'), nullable=False)
    regDate = db.Column(db.DateTime, nullable=False)
    member_id = db.Column(db.Integer, nullable=False)

    def __init__(self, title, content, text_category, active, member_id):
        self.title = title
        self.content = content
        self.textCategory = text_category
        self.active = active
        self.member_id = member_id
