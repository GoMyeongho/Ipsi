import axios from "axios";
import Commons from "../util/Common";
const Capstone = "http://localhost:8111";

// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const PsWriteApi = {
/*    // 맞춤법 검사
    checkSpelling: async (content) => {
        try {
            const response = await axios.post(
                'https://api.bareun.ai/v1/spellcheck',
                {
                    text: content,
                },
                {
                    headers: {
                        'Authorization': 'koba-HQ4EBCQ-KT5UGPA-VITQTEY-OQPOIOQ', // 여기에 발급받은 API 키를 넣습니다
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.result) {
                return response.data.result.content || "맞춤법 검사 결과를 가져올 수 없습니다.";
            } else {
                return "맞춤법 검사 중 오류가 발생했습니다.";
            }
        } catch (error) {
            console.error('맞춤법 검사 중 오류 발생:', error);
            return "맞춤법 검사 중 오류가 발생했습니다222.";
        }
    },*/




    // 자소서 DB 저장
    savePS: async (formData) => {
        try {
            const memberId = formData.get("memberId");
            if (!memberId) {
                console.error("memberId가 없습니다.");
                alert("로그인이 필요합니다.");
                return;
            }

            const psWriteReqDto = {
                memberId: memberId,
                psName: formData.get("ps_name"),
            };

/*            const sections = [];
            for (let i = 0; i < formData.entries().length; i++) {
                const [key, value] = formData.entries().next().value;
                if (key.includes("sections")) {
                    const sectionIndex = key.match(/\d+/)[0];
                    if (!sections[sectionIndex]) {
                        sections[sectionIndex] = { title: "", content: "" };
                    }
                    if (key.includes("psTitle")) {
                        sections[sectionIndex].title = value;
                    } else if (key.includes("psContent")) {
                        sections[sectionIndex].content = value;
                    }
                }
            }*/
            const sections = [];
            for (const [key, value] of formData.entries()) {
                if (key.includes("sections")) {
                    const sectionIndex = key.match(/\d+/)?.[0]; // 숫자 추출
                    if (sectionIndex !== undefined) {
                        if (!sections[sectionIndex]) {
                            sections[sectionIndex] = { psTitle: "", psContent: "" };
                        }
                        if (key.includes("psTitle")) {
                            sections[sectionIndex].psTitle = value;
                        } else if (key.includes("psContent")) {
                            sections[sectionIndex].psContent = value;
                        }
                    }
                }
            }

            const psContentsReqDtoList = sections.map(section => ({
                psTitle: section.psTitle,
                psContent: section.psContent
            }));

            const response = await axios.post(Capstone + `/write/save/${memberId}`, {
                psWriteReqDto: psWriteReqDto,
                psContentsReqDtoList: psContentsReqDtoList
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            console.error("API_자기소개서 저장 실패:", error);
            throw error;
        }
    },
};

export default PsWriteApi;