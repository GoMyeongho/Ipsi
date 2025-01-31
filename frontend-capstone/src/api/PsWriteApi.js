import axios from "axios";
import Commons from "../util/Common";
const Capstone = "http://localhost:8111";

// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const PsWriteApi = {
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

            const sections = [];
            const psContentsIdList = [];

            for (const [key, value] of formData.entries()) {
                if (key.includes("sections")) {
                    const sectionIndex = key.match(/\d+/)?.[0];
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