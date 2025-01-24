import styled from "styled-components";
import {Title} from "../../pages/categoryEnumPS/PersonalStatementWrite";
import {useCallback, useRef, useState} from "react";
import {BtnBox} from "../ChatComponent/OpenChatSearch";

const Bg = styled.div`
    width: 70%;
    height: 1000px;
    //background-color: palegoldenrod;
`
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
    &:last-of-type { min-height: 500px; }
`

/*const BtnBox = styled.div`
    display: flex;
    justify-content: flex-end;
`*/

const WriteForm = () => {
    const [inputTitle, setInputTitle] = useState("");   // 입력 메시지
    const [inputContent, setInputContent] = useState("");   // 입력 메시지

    const onChangeTitle = e => {
        setInputTitle(e.target.value);
    };
    const onChangeContent = e => {
        setInputContent(e.target.value);
    };

    const textRef = useRef();
    const handleResizeHeight = useCallback(() => {
        textRef.current.style.height = "auto";
        textRef.current.style.height = textRef.current.scrollHeight + "px";
    }, []);

    return(
        <>
            <Bg>
                <Title>새 자기소개서</Title>
                <PsTextArea
                    type="text"
                    ref={textRef}
                    placeholder="문항을 입력하세요."
                    value={inputTitle}
                    onInput={handleResizeHeight}
                    onChange={onChangeTitle}
                />
                <PsTextArea
                    type="text"
                    ref={textRef}
                    placeholder="내용을 입력하세요."
                    value={inputContent}
                    onInput={handleResizeHeight}
                    onChange={onChangeContent}
                />
                <BtnBox>
                    <button className="cancel">불러오기</button>
                    <button className="submit" type={"submit"}>저장</button>
                </BtnBox>
            </Bg>
        </>
    );
};
export default WriteForm;