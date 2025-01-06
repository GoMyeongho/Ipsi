import os
import csv
from flask import request, jsonify
from models import db, Univ, TextBoard
import requests

UPLOAD_FOLDER = 'csv'

# CSV 파일에서 Univ 데이터를 읽어 DB에 저장하는 함수
def load_univ_from_csv(file_path):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        csvreader = csv.DictReader(csvfile)
        univ_list = []
        for row in csvreader:
            univ = Univ(
                univName=row['univ_name'],
                univDept=row['univ_dept'],
                univImg=row['univ_img']
            )
            univ_list.append(univ)
        return univ_list

# CSV 파일에서 TextBoard 데이터를 읽어 DB에 저장하는 함수
def load_textboard_from_csv(file_path):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        csvreader = csv.DictReader(csvfile)
        textboard_list = []
        for row in csvreader:
            textboard = TextBoard(
                title=row['title'],
                content=row['content'],
                text_category=row['text_category'],
                active=row['active'],
                member_id=row['member_id']
            )
            textboard_list.append(textboard)
        return textboard_list

# '/upload/csv' 경로에서 파일을 받아서 해당 파일의 이름에 맞는 모델에 저장하는 함수
SPRING_BOOT_URL = "http://localhost:8111/flask/univ"
TEXTBOARD_SPRING_BOOT_URL = "http://localhost:8111/flask/textboard"

def upload_csv():
    try:
        # CSV 폴더 경로에 있는 모든 파일 가져오기
        csv_files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith('.csv')]

        if not csv_files:
            return jsonify({"error": "업로드할 CSV 파일이 없습니다."}), 400

        # 각 CSV 파일을 처리
        for file_name in csv_files:
            file_path = os.path.join(UPLOAD_FOLDER, file_name)  # 파일 경로 지정

            # 파일 이름을 기준으로 모델 선택
            if 'univ' in file_name.lower():
                # Univ 데이터 처리
                univ_list = load_univ_from_csv(file_path)
                for univ in univ_list:
                    # Univ 객체를 딕셔너리로 변환
                    univ_data = {
                        "univName": univ.univName,
                        "univDept": univ.univDept,
                        "univImg": univ.univImg
                    }
                    # Spring Boot API에 POST 요청
                    response = requests.post(SPRING_BOOT_URL, json=[univ_data])  # 리스트로 보내기
                    if response.status_code == 200:
                        result = response.json()  # 결과 리스트 받기
                        if all(result):  # 모든 항목이 성공인 경우
                            print(f"Univ 데이터 삽입 성공: {univ_data['univName']} {univ_data['univDept']}")
                        else:
                            print(f"Univ 데이터 삽입 실패: {univ_data['univName']} {univ_data['univDept']}")
                    else:
                        print(f"Univ 데이터 삽입 실패 (HTTP 상태 코드 {response.status_code}): {univ_data}")

            elif 'textboard' in file_name.lower():
                # TextBoard 데이터 처리
                textboard_list = load_textboard_from_csv(file_path)
                for textboard in textboard_list:
                    # TextBoard 객체를 딕셔너리로 변환
                    textboard_data = {
                        "title": textboard.title,
                        "content": textboard.content,
                        "text_category": textboard.text_category,
                        "active": textboard.active,
                        "member_id": textboard.member_id
                    }
                    # Spring Boot API에 POST 요청
                    response = requests.post(TEXTBOARD_SPRING_BOOT_URL, json=[textboard_data])  # 리스트로 보내기
                    if response.status_code == 200:
                        result = response.json()  # 결과 리스트 받기
                        if all(result):  # 모든 항목이 성공인 경우
                            print(f"TextBoard 데이터 삽입 성공: {textboard_data['title']}")
                        else:
                            print(f"TextBoard 데이터 삽입 실패: {textboard_data['title']}")
                    else:
                        print(f"TextBoard 데이터 삽입 실패 (HTTP 상태 코드 {response.status_code}): {textboard_data}")
            else:
                print(f"파일 이름이 올바르지 않습니다: '{file_name}'")

        return jsonify({"message": "모든 CSV 파일이 성공적으로 처리되었습니다."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
