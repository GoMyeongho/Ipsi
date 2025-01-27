import styled from "styled-components";
import {Title} from "../../pages/categoryEnumPS/PersonalStatementWrite";
import {useCallback, useRef, useState} from "react";

const WriteFormBg = styled.div`
    width: 70%;
    height: 1000px;
`;

const FormTitle = styled.input`
    width: 100%;
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    //border-bottom: 1px solid #aaa;
    padding: 1vw 0;
    margin: 2vw 0;
    outline: none;
    white-space: ;
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
    gap: 10px;
    margin-bottom: 20px;
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
    const [sections, setSections] = useState([{ id: 1, title: "", content: "" },]);
    const [activeSection, setActiveSection] = useState(1);
    const [formTitle, setFormTitle] = useState("새 자기소개서");

    const handleAddSection = () => {
        setSections((prev) => [
            ...prev,
            { id: prev.length + 1, title: "", content: "" },
        ]);
        setActiveSection(sections.length + 1); // 새 섹션으로 이동
    };

    const handleRemoveSection = () => {
        if (sections.length > 1) {
            setSections((prev) => prev.slice(0, -1));
            setActiveSection((prev) => (prev > sections.length - 1 ? prev - 1 : prev)); // 이전 섹션으로 이동
        }
    };

    const handleTitleChange = (id, value) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id ? { ...section, title: value } : section
            )
        );
    };

    const handleContentChange = (id, value) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id ? { ...section, content: value } : section
            )
        );
    };

    const calculateBytes = (text) => {
        const encoder = new TextEncoder(); // UTF-8 기반
        return encoder.encode(text).length;
    };

    const handleResizeHeight = useCallback((ref) => {
        ref.style.height = "auto";
        ref.style.height = ref.scrollHeight + "px";
    }, []);

    const currentSection = sections.find((section) => section.id === activeSection);

    return (
        <>
            <WriteFormBg>
                <FormTitle
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="자기소개서 이름을 입력하세요"
                />
                <Pagination>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            className={section.id === activeSection ? "active" : ""}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.id}
                        </button>
                    ))}
                    <BtnBox>
                        <button onClick={handleAddSection}>+</button>
                        <button onClick={handleRemoveSection}>﹣</button>
                    </BtnBox>
                </Pagination>
                {currentSection && (
                    <div>
                        <PsTextArea
                            placeholder="문항을 입력하세요."
                            value={currentSection.title}
                            onInput={(e) => handleResizeHeight(e.target)}
                            onChange={(e) =>
                                handleTitleChange(currentSection.id, e.target.value)
                            }
                        />
                        <PsTextArea
                            placeholder="내용을 입력하세요."
                            value={currentSection.content}
                            onInput={(e) => handleResizeHeight(e.target)}
                            onChange={(e) =>
                                handleContentChange(currentSection.id, e.target.value)
                            }
                        />
                        <CharacterCount>
                            글자 수: {currentSection.content.length}자 (공백 제외:{" "}
                            {currentSection.content.replace(/\s+/g, "").length}자), 바이트:{" "}
                            {calculateBytes(currentSection.content)} bytes)
                        </CharacterCount>
                    </div>
                )}

                <BtnBox>
                    <button className="cancel">불러오기</button>
                    <button className="submit" type={"submit"}>저장</button>
                </BtnBox>
            </WriteFormBg>
        </>
    );
};

export default WriteForm;