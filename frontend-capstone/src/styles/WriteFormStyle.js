import styled from "styled-components";
import React, {useCallback, useEffect, useState} from "react";
import PsWriteApi from "../../api/PsWriteApi";
import Commons from "../../util/Common";
import {useNavigate, useParams} from "react-router-dom";
import psWriteApi from "../../api/PsWriteApi";
import {useSelector} from "react-redux";
import ChattingApi from "../../api/ChattingApi";
import {ChatName, ChatRoom, ChatUl} from "../ChatComponent/ChatList";
import RejectModal from "../Modal/RejectModal";
import OptionsModal from "../Modal/OptionsModal";

const WriteFormBg = styled.div`
    /*    width: 70%;
        height: 1000px;*/
    width: 70%;
    @media (max-width:1600px) {
        width: 85%
    }
    @media (max-width:1400px) {
        width: 100%
    }
    @media (max-width:1200px) {
        width: 110%
    }
`;

const FormContainer = styled.div`
    margin: 2vw 0;
    padding: 5%;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
`

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
    border-bottom: 2px solid #777;
    &:focus {
        border-bottom: 2px solid #6154D4;
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
        overflow-y: hidden;
    }
    &:last-of-type {
        min-height: 500px;
        overflow-y: hidden;
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
    margin-top: 2vw;
    button {
        /*        width: 90px;
                height: 35px;*/
        width: 105px;
        aspect-ratio: 21 / 8;
        border-radius: 10px;
        border: none;
        background-color: #FFF;
        padding: 5px 10px;
    }
    .new {
        border: 2px solid #E0CEFF;
    }
    .new:hover {
        background-color: #E0CEFF;
    }
    .import {
        border: 2px solid #E0CEFF;
    }
    .import:hover {
        background-color: #E0CEFF;
    }
    .save, .del {
        border: 2px solid #6154D4;
    }
    .save:hover, .del:hover {
        background-color: #6154D4;
        color: #FFF;
    }
`;


export const SaveBtnBox = styled.div`
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
    .save {
        border: 2px solid #6154D4;
    }
    .save:hover {
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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    width: 60%;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    max-height: 70%;
    overflow-y: scroll;
`;

const ModalHeader = styled.h2`
    margin: 0;
    text-align: center;
`;

const ModalBody = styled.div`
    margin-top: 20px;
    text-align: center;
`;

const CloseButton = styled.button`
    background-color: #6154d4;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #503fba;
    }
`;

const WriteForm = () => {
    const [errorMessage, setErrorMessage] = useState("");

    const [psWrites, setPsWrites] = useState([]);
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
    const [currentPsWriteId, setCurrentPsWriteId] = useState(null); // ✅ 현재 자기소개서 ID

    const [option, setOption] = useState({});

    const createPsWrite = async () => {
        const response = await PsWriteApi.newPsWrite();
        console.log(response);
        navigator(`/PersonalStatementWrite/${response.data}`)

    }

    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLoadPsWrite = () => {
        openModal();
    };

    // 자기소개서 불러오기
    const loadPsWrite = async (psWriteId) => {
        try {
            setOption({})
            if(!id) {
                const response = await PsWriteApi.getPsList();
                console.log(response);
                if(response.data.length > 0){
                    setOption({value: true, options:(response.data.length < 11) ? [...response.data.map((option, index) => ({label: option.psName + Commons.formatDate(option.regDate), value: option.psWriteId, type: 'contained'})),{label: "+" , value: 0 , type: 'outlined'}]
                            : response.data.map((option) => ({label: option.psName + Commons.formatDate(option.regDate), value: option.psWriteId, type: 'contained'}))})
                    return
                } else {
                    await createPsWrite();
                    return
                }
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
            fetchPsForUser(memberId); // memberId로 채팅방 리스트 가져오기
        } catch (e) {
            console.error("Failed to fetch memberId from token:", e);
        }
    };

    // memberId와 관련된 자기소개서 목록 가져오기
    const fetchPsForUser = async (memberId) => {
        try {
            const pswrites = await PsWriteApi.getMyPs(memberId);
            console.log("Fetched Personal Statement for Member:", pswrites);
            setPsWrites(pswrites);
        } catch (error) {
            console.error("Error Fetching Personal Statement for Member:", error);
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

    // 자기소개서 삭제
    const psDel = async (psWriteId) => {
        try {
            await PsWriteApi.delPs(psWriteId);
            setPsWrites(psWrites.filter(ps => ps.id !== psWriteId)); // 리스트에서 삭제
            console.log("자기소개서 삭제 성공")
        } catch (error) {
            setErrorMessage("삭제 중 오류가 발생했습니다.");
            console.error(error);
        }
    }

    return (
        <>
            <WriteFormBg>
                <BtnBox>
                    <button className="new" onClick={loadPsWrite}>새 자기소개서</button>
                    <button className="import" onClick={() => navigator("/PersonalStatementWrite")}>불러오기</button>
                    <button className="del" onClick={() => psDel(id)}>삭제</button>
                    <button className="save" type={"submit"} onClick={psSave}>저장</button>
                </BtnBox>
                {/*<Button onClick={() => navigator("/PersonalStatementWrite")}>자소서 목록 보기</Button>*/}
                <FormContainer>
                    <FormTitle
                        type="text"
                        value={psName}
                        onChange={handlePsNameChange}
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
                        </div>
                    )}
                </FormContainer>
            </WriteFormBg>
            <RejectModal open={reject.value} message={reject.label} onClose={() => navigator("/")}/>
            <OptionsModal open={option.value} onCancel={() => navigator("/")} options={option.options} message= "자기소개서 목록"
                          onOption={(event) => (event > 0) ? navigator(`/PersonalStatementWrite/${event}`) : createPsWrite()}/>
        </>
    );
};

export default WriteForm;