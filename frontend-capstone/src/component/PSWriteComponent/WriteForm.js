import styled from "styled-components";
import React, {useCallback, useEffect, useState} from "react";
import PsWriteApi from "../../api/PsWriteApi";
import Commons from "../../util/Common";
import {useNavigate, useParams} from "react-router-dom";
import psWriteApi from "../../api/PsWriteApi";
import {useSelector} from "react-redux";
import RejectModal from "../RejectModal";

const WriteFormBg = styled.div`
    width: 70%;
    height: 1000px;
`;

const FormTitle = styled.input`
    width: 100%;
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    padding: 1vw 0;
    margin: 2vw 0;
    outline: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:focus {
        border-bottom: 1px solid #6154D4;
    }
`;

const PsTextArea = styled.textarea`
    padding: 15px;
    width: 100%;
    outline-style: none;
    border: 1px solid #AAA;
    border-radius: 5px;
    font-size: 1em;
    resize: none;
    min-height: 70px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        height: 30%;
        background: #9f8fe4;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
        background: #FFF;
        border-radius: 10px;
    }
    &:first-of-type {
        max-height: 120px;
        margin-bottom: 2vw;
    }
    &:last-of-type {
        min-height: 500px;
    }
`;

const CharacterCount = styled.span`
    font-size: 0.9em;
    color: #888;
    display: block;
    text-align: right;
    margin: 1vw;
`;

const NumBox = styled.div`
    display: flex;
    gap: 1vw;
`

export const BtnBox = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 2vw;
    button {
        width: 60px;
        height: 35px;
        border-radius: 10px;
        border: none;
        background-color: #FFF;
    }
    .cancel {
        border: 2px solid #E0CEFF;
    }
    .cancel:hover {
        background-color: #E0CEFF;
    }
    .submit {
        border: 2px solid #6154D4;
    }
    .submit:hover {
        background-color: #6154D4;
        color: #FFF;
    }
`;

const Pagination = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2vw;
    button {
        width: 40px;
        height: 40px;
        border: 1px solid #AAA;
        border-radius: 5px;
        background-color: #FFF;
        font-size: 1em;
        cursor: pointer;
    }
    .active {
        background-color: #6154D4;
        color: #FFF;
        font-weight: bold;
    }
`;

const WriteForm = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [sections, setSections] = useState([{ id: 1, title: "", content: "" },]);
    const [activeSection, setActiveSection] = useState(1);
    const [psName, setPsName] = useState("새 자기소개서");
    const [initialSections, setInitialSections] = useState([]);
    const [initialPsName, setInitialPsName] = useState("새 자기소개서"); // 초기 psName
    const {id} = useParams();
    const navigator = useNavigate();
    const role = useSelector((state) => state.persistent.role)
    const [reject, setReject] = useState({});

    // 자기소개서 불러오기
    const loadPsWrite = async (psWriteId) => {
        try {
            if(!id) {
                const response = await psWriteApi.newPsWrite(loggedInUser)
                console.log(response)
                navigator(`/PersonalStatementWrite/${response.data}`)
                return
            }
            const response = await PsWriteApi.loadPsWrite(psWriteId);
            if(response) {
                console.log(response)
                setPsName(response.data.psName)
                setInitialPsName(response.data.psName)
                if (response.data.psContents.length > 0)
                {
                    setSections(response.data.psContents.map((section, index) => ({
                        id: index + 1,
                        psTitle: section.psTitle,
                        psContent: section.psContent,
                        psContentsId: section.psContentsId,
                    })));
                    setInitialSections(response.data.psContents.map((section, index) => ({
                        id: index + 1,
                        psTitle: section.psTitle,
                        psContent: section.psContent,
                        psContentsId: section.psContentsId,
                    })));
                }
            }
        } catch (e) {
            setReject({value : true, label : "권한이 없거나 해당 자소서의 작성자가 아닙니다."})
            console.error("자기소개서 불러오기 실패:", e);
        }
    };
    
    useEffect(() => {
        loadPsWrite(id);
    }, [id, role]);
    // 상태 변경 확인 (렌더링 문제 디버깅)
    useEffect(() => {
        if (sections.length > 0 && !sections.find(sec => sec.id === activeSection)) {
            setActiveSection(sections[0].id); // 첫 번째 항목을 활성화
        }
    }, [sections]);

    // 토큰에서 memberId를 가져오는 로직
    const fetchMemberIdFromToken = async () => {
        try {
            const response = await Commons.getTokenByMemberId();
            const memberId = response.data; // 서버에서 반환한 memberId
            console.log("로그인 한 memberId:", memberId);
            setLoggedInUser(memberId);
        } catch (e) {
            console.error("Failed to fetch memberId from token:", e);
        }
    };

    // 컴포넌트 마운트 시 memberId 가져오기
    useEffect(() => {
        fetchMemberIdFromToken();
    }, []);

    // 항목 추가
    const handleAddSection = () => {
        setSections((prev) => [
            ...prev,
            { id: prev.length + 1, psTitle: "", psContent: "" },
        ]);
        setActiveSection(sections.length + 1); // 새 섹션으로 이동
    };

    // 항목 삭제
    const handleRemoveSection = () => {
        if (sections.length > 1) {
            setSections((prev) => prev.slice(0, -1));
            setActiveSection((prev) => (prev > sections.length - 1 ? prev - 1 : prev)); // 이전 섹션으로 이동
        }
    };

    // 문항 입력
    const handleTitleChange = (id, value) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id ? { ...section, psTitle: value } : section
            )
        );
    };

    // 내용 입력
    const handleContentChange = (id, value) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id ? { ...section, psContent: value } : section
            )
        );
    };

    // 자기소개서 이름 변경
    const handlePsNameChange = (e) => {
        setPsName(e.target.value);
    };

    // 바이트 계산
    const calculateBytes = (text) => {
        const encoder = new TextEncoder(); // UTF-8 기반
        return encoder.encode(text).length;
    };

    const handleResizeHeight = useCallback((ref) => {
        ref.style.height = "auto";
        ref.style.height = ref.scrollHeight + "px";
    }, []);
    
    const currentSection = sections.find((section) => section.id === activeSection) || { title: "", content: "" };
    // 기존 상태를 유지하는 useEffect
    useEffect(() => {
        setInitialSections(sections);
    }, []);

    // 자기소개서 불러오기 버튼 클릭 시 호출
    const handleLoadPsWrite = async () => {
        const psWriteId = prompt("불러올 자기소개서 ID를 입력하세요:");
        navigator(`/PersonalStatementWrite/${psWriteId}`)
    };

    // 변경 감지 로직
    const getUpdatedSections = () => {
        return sections.filter((section, index) => {
            const initialSection = initialSections[index];
            return !initialSection ||
                section.psTitle !== initialSection.psTitle ||
                section.psContent !== initialSection.psContent;
        });
    };

    // 데이터 저장 요청
    const psSave = async () => {
        if (!loggedInUser) {
            alert("로그인이 필요합니다.");
            return;
        }
        const formData = new FormData();
        formData.append("memberId", loggedInUser);
        formData.append("ps_name", psName);
        sections.forEach((section, index) => {
            formData.append(`sections[${index}].psTitle`, section.psTitle);
            formData.append(`sections[${index}].psContent`, section.psContent);
            formData.append(`sections[${index}].id`, section.psContentsId || 0);
        });
        console.log("저장할 데이터 : ", [...formData])
        try {
            const updatedSections = getUpdatedSections();
            if (updatedSections.length === 0 && psName === initialPsName) {
                alert("변경된 내용이 없습니다.");
                return;
            }
            const response = await PsWriteApi.savePS(id, formData);
            alert("자기소개서가 저장되었습니다!");
            console.log(response);
        } catch (error) {
            alert("저장에 실패했습니다.");
            console.error("저장 실패:", error);
        }
    };

    return (
        <>
            <WriteFormBg>
                <button>새 자기소개서</button>
                <button onClick={handleLoadPsWrite}>불러오기</button>
                <FormTitle
                    type="text"
                    value={psName}
                    // onChange={(e) => setPsName(e.target.value)}
                    onChange={handlePsNameChange}  // 이름 변경 핸들러
                    placeholder="자기소개서 이름을 입력하세요"
                />
                <Pagination>
                    <NumBox>
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                className={section.id === activeSection ? "active" : ""}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {section.id}
                            </button>
                        ))}
                    </NumBox>
                    <BtnBox>
                        <button onClick={handleAddSection}>+</button>
                        <button onClick={handleRemoveSection}>﹣</button>
                    </BtnBox>
                </Pagination>
                {currentSection && (
                    <div>
                        <PsTextArea
                            placeholder="문항을 입력하세요."
                            value={currentSection.psTitle || ""}
                            onInput={(e) => handleResizeHeight(e.target)}
                            onChange={(e) =>
                                handleTitleChange(currentSection.id, e.target.value)
                            }
                        />
                        <PsTextArea
                            placeholder="내용을 입력하세요."
                            value={currentSection.psContent || ""}
                            onInput={(e) => handleResizeHeight(e.target)}
                            onChange={(e) =>
                                handleContentChange(currentSection.id, e.target.value)
                            }
                        />
                        <CharacterCount>
                            글자 수: {currentSection?.psContent?.length || 0}자 (공백 제외:{" "}
                            {currentSection?.psContent?.replace(/\s+/g, "").length || 0}자), 바이트:{" "}
                            {calculateBytes(currentSection?.psContent || "")} bytes)
                        </CharacterCount>
{/*                        <button onClick={handleSpellCheck}>맞춤법 검사</button>
                        {correctedText && <p>수정된 텍스트: {correctedText}</p>}*/}
                    </div>
                )}
                <BtnBox>
                    <button className="cancel">불러오기</button>
                    <button className="submit" type={"submit"} onClick={psSave}>저장</button>
                </BtnBox>
            </WriteFormBg>
            <RejectModal open={reject.value} message={reject.label} onClose={() => navigator("/")}></RejectModal>
        </>
    );
};

export default WriteForm;