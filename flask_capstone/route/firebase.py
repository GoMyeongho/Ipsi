import os
from flask import request, jsonify
from google.cloud import storage
import mimetypes

# Firebase Admin SDK 인증 파일
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "ipsi-firebase-adminsdk.json"

# Firebase Storage 클라이언트
client = storage.Client()
bucket_name = "ipsi-f2028.firebasestorage.app"  # Firebase Storage의 버킷 이름

# Firebase 버킷 객체
bucket = client.bucket(bucket_name)

# 로컬에서 Firebase로 파일을 업로드할 폴더 지정
local_folder = 'firebase'  # 로컬 폴더 이름 (예: 'firebase' 폴더)
firebase_folder = 'firebase'  # Firebase Storage에서 해당 폴더 경로

def upload_firebase():
    try:
        uploaded_files = []

        # 로컬 폴더 내의 파일들을 순회
        for root, dirs, files in os.walk(local_folder):
            for file in files:
                # 로컬 파일 경로
                local_file_path = os.path.join(root, file)

                # Firebase에 업로드할 파일 경로 (디렉토리 경로 포함)
                relative_path = os.path.relpath(local_file_path, local_folder)

                # Firebase에서 사용할 경로 구분자로 백슬래시를 슬래시로 변경
                firebase_file_path = os.path.join(firebase_folder, relative_path).replace("\\", "/")

                # 업로드할 파일 Blob 생성
                blob = bucket.blob(firebase_file_path)

                # 파일을 Firebase Storage에 업로드
                blob.upload_from_filename(local_file_path)
                uploaded_files.append(blob.public_url)  # 업로드된 파일의 URL을 리스트에 추가

        if uploaded_files:
            return jsonify({"message": "Files uploaded successfully", "urls": uploaded_files}), 200
        else:
            return jsonify({"message": "No files to upload"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def upload_file():
    try:
        # 파일 받기
        file = request.files["file"]
        folder_path = request.form["folderPath"]
        file_name = request.form["fileName"]

        if file_name != "":
            file.filename = file_name

        # Firebase Storage 경로 설정
        firebase_file_path = f"{folder_path}/{file.filename}".replace("\\", "/")

        # Firebase Storage에 업로드할 Blob 생성
        blob = bucket.blob(firebase_file_path)

        # MIME 타입 자동 감지 후 설정
        content_type = mimetypes.guess_type(file.filename)[0] or "application/octet-stream"
        blob.upload_from_file(file, content_type=content_type)



        # 🔥 `Content-Disposition: inline` 설정 (브라우저에서 바로 보기 가능하도록)
        blob.content_disposition = "attachment"
        blob.patch()
        blob.make_public()

        # 🌐 웹에서 바로 보이는 URL
        display_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{firebase_file_path.replace('/', '%2F')}?alt=media"
        # 리턴 값 : 다운로드 url, 보여주기 url 나눠서 반환
        return jsonify({
            "message": "File uploaded successfully",
            "url": display_url  # 웹에서 직접 보기 링크
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




