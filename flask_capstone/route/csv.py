import os
import csv
import aiohttp
import asyncio
from flask import request, jsonify
from models import db, Univ, TextBoard
import requests

UPLOAD_FOLDER = 'csv'

def process_univ_file(file_path):
    data_to_send = []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            data = {
                "univName": row['univ_name'],
                "univDept": row['univ_dept'],
                "univImg": row['univ_img']
            }
            data_to_send.append(data)
    return data_to_send  # 데이터를 반환

# TextBoard CSV 파일 처리 함수
def process_textboard_file(file_path):
    data_to_send = []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            data = {
                "title": row['title'],
                "content": row['content'],
                "text_category": row['text_category'],
                "active": row['active']
            }
            data_to_send.append(data)
    return data_to_send  # 데이터를 반환

# Univ CSV 파일 업로드 처리 및 데이터 반환
def upload_univ_csv():
    try:
        # 파일이 포함되어 있는지 확인
        if 'file' not in request.files:
            return jsonify({"error": "파일이 첨부되지 않았습니다."}), 400

        file = request.files['file']

        # 파일이 비어 있으면 오류 반환
        if file.filename == '':
            return jsonify({"error": "파일명이 비어 있습니다."}), 400

        if file and file.filename.endswith('.csv'):
            # 파일 저장 후, 파일 내용 읽기
            file_path = os.path.join('csv', file.filename)
            file.save(file_path)

            # Univ 파일 처리
            univ_data = process_univ_file(file_path)
            return jsonify({"univData": univ_data}), 200
        else:
            return jsonify({"error": "CSV 파일만 업로드할 수 있습니다."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TextBoard CSV 파일 업로드 처리 및 데이터 반환
def upload_textboard_csv():
    try:
        # 파일이 포함되어 있는지 확인
        if 'file' not in request.files:
            return jsonify({"error": "파일이 첨부되지 않았습니다."}), 400

        file = request.files['file']

        # 파일이 비어 있으면 오류 반환
        if file.filename == '':
            return jsonify({"error": "파일명이 비어 있습니다."}), 400

        if file and file.filename.endswith('.csv'):
            # 파일 저장 후, 파일 내용 읽기
            file_path = os.path.join('csv', file.filename)
            file.save(file_path)

            # TextBoard 파일 처리
            textboard_data = process_textboard_file(file_path)
            return jsonify({"textboardData": textboard_data}), 200
        else:
            return jsonify({"error": "CSV 파일만 업로드할 수 있습니다."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
