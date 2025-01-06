import requests
import json
from static import constant

def generate_rsp(prompt):
    generate_url = constant.url + "/api/generate"
    data = {"model": "llama3:latest", "prompt": prompt, "stream":False}
    rsp = requests.post(generate_url, json=data)

    # 응답이 성공적이면 response 값을 반환
    if rsp.status_code == 200:
        return json.loads(rsp.text)['response']
    else:
        return "Error: " + str(rsp.status_code)

if __name__ == '__main__':
    prompt = "이순신에 대해서 간단하게 알려줘 ( 한국어로 )"
    rsp = generate_rsp(prompt)
    print(rsp)
