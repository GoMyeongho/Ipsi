import axios from "axios";
import Commons from "../util/Common";
const Capstone = "http://localhost:8111";

// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const PsWriteApi = {

    // 자소서 DB 저장
    savePS: async (psWriteId, formData) => {
        const token = localStorage.getItem("accessToken");
        try {
            console.log([...formData])
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
            for (const [key, value] of formData.entries()) {
                if (key.includes("sections")) {
                    console.log(sections);
                    const sectionIndex = key.match(/\d+/)?.[0];
                    if (sectionIndex !== undefined) {
                        if (!sections[sectionIndex]) {
                            sections[sectionIndex] = { psTitle: "", psContent: "", psContentsId: "", sectionsNum: sectionIndex };
                        }
                        if (key.includes("psTitle")) {
                            sections[sectionIndex].psTitle = value;
                        } else if (key.includes("psContent")) {
                            sections[sectionIndex].psContent = value;
                        } else if (key.includes("id")) {
                            sections[sectionIndex].psContentsId = value;
                        }
                    }
                }
            }

            const psContentsReqDtoList = sections.map(section => ({
                psTitle: section.psTitle,
                psContent: section.psContent,
                psContentsId: section.psContentsId,
                sectionsNum: section.sectionsNum,
            }));
            console.log(psContentsReqDtoList);

            const response = await axios.post(Capstone + `/write/save/${psWriteId}`, {
                psWriteReqDto: psWriteReqDto,
                psContentsReqDtoList: psContentsReqDtoList
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error("API_자기소개서 저장 실패:", error);
            throw error;
        }
    },
    loadPsWrite : async (psWriteId) => {
        const token = localStorage.getItem("accessToken");
        return await axios.get(Capstone + `/write/load/${psWriteId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
    },
    newPsWrite : async () => {
        const token = localStorage.getItem("accessToken");
        return await axios.get(Capstone + `/write/make`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
    },

/*    getMyPs: async (memberId) => {
        try {
            const response = await axios.get(Capstone + `/write/myPs/${memberId}`);
            // 성공 시 데이터 반환
            return response.data;
        } catch (error) {
            console.error("Error fetching chat rooms:", error);
            throw new Error("Failed to fetch chat rooms.");
        }
    },*/

    getPsList : async () => {
        const token = localStorage.getItem("accessToken");
        return await axios.get(Capstone + `/write/list/get`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
    },

    delPs: async (psWriteId) => {
        return await axios.delete(Capstone + `/write/del/${psWriteId}`)
    }
};

export default PsWriteApi;