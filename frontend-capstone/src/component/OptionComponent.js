import styled, { css } from "styled-components";
import {
	Button,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Alert,
} from "@mui/material";
import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

const OptionContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    border-radius: 8px;
    margin: 10px;
    justify-content: space-evenly;
    align-items: start;
`;

const OptionGroup = styled(ToggleButtonGroup)`
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    width: 90%;
`;

const ToggleOption = styled(ToggleButton)`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100px;
    height: 100px;
`;

const ToggleButtonContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
`;

const ToggleContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid lightgray;
    overflow: hidden;
    padding: 0;
    margin: 10px;
    ${(props) =>
            props.selected &&
            css`
                border-color: #4285f4; // 구글 블루 테두리
                box-shadow: 0 0 6px rgba(66, 133, 244, 0.5); // 포커스 시 강조 효과
            `}
`;

const CloseButton = styled(Button)`
    box-sizing: border-box;
`;

const Image = styled.img`
    box-sizing: border-box;
    max-height: 40px;
    max-width: 70px;
    margin: 0 auto;
`;

const OptionComponent = ({
	                         value,          // 선택된 값 또는 상태 (기본값은 value에 설정된 값)
	                         setter,         // 상태를 변경하는 함수 (setState와 같은 역할)
	                         list,           // 옵션 항목 리스트
	                         visible,        // 각 옵션 요소의 표시 여부를 결정하는 객체
	                         setVisible,     // 각 옵션 요소의 표시 여부를 변경하는 함수
	                         id,             // 옵션의 고유 아이디 (예: "color", "model" 등)
	                         keyName,        // 리스트 항목의 고유 속성 이름 (예: "color", "name")
	                         keyUrl,         // 리스트 항목에 관련된 URL (이미지 URL 등)
	                         isBg,           // 배경 스타일을 적용할지 여부를 결정하는 boolean 값
	                         sx,             // OptionContainer 및 OptionGroup 전체에 적용할 스타일 (sx를 통해 동적으로 스타일링)
	                         optionSx,       // 각 ToggleOption에 적용할 스타일
	                         buttonSx,       // CloseButton에 적용할 스타일
	                         maxSelections,  // 최대 선택 가능한 항목 개수 (숫자 또는 "all")
                         }) => {
	const [formats, setFormats] = useState(() => value || []);
	const [error, setError] = useState(null);  // 오류 메시지를 관리할 상태
	
	const handleFormat = (event, newFormats) => {
		if (maxSelections === "all") {
			// "all"이면 개수 제한 없이 선택
			setFormats(newFormats);
			setter(newFormats);
			setError(null);  // 오류 메시지 초기화
		} else if (maxSelections > 1) {
			// 최대 선택 개수가 여러 개인 경우
			if (newFormats.length > maxSelections) {
				setError(`최대 개수 ${maxSelections}개를 넘었습니다`);
			} else {
				setFormats(newFormats);
				setter(newFormats);
				setError(null);  // 오류 메시지 초기화
			}
		} else {
			// 최대 선택 개수가 1인 경우
			setFormats(newFormats);
			setter(newFormats);
			setError(null);  // 오류 메시지 초기화
		}
	};
	
	const onClickValueOff = () => {
		setter([]);
		setFormats([]);
		setVisible((prev) => ({ ...prev, [id]: false }));
	};
	
	return (
		<OptionContainer sx={sx}>
			<OptionGroup onChange={handleFormat} value={formats} sx={sx}>
				{list?.length > 0 ? (
					list.map((item, index) => (
						<ToggleContainer
							key={index}
							selected={isBg && formats.includes(item[keyName])}
							sx={sx}
						>
							{isBg ? (
								<Tooltip title={item[keyName]}>
									<ToggleOption
										color="primary"
										value={item[keyName]}
										sx={item[keyUrl]?.includes(".txt")
											? {
												border: "none",
												padding: 0,
												position: "relative",
												backgroundColor: `${item[keyUrl].replace(".txt", "")}`,
												"&:hover": { backgroundColor: `${item[keyUrl].replace(".txt", "")}`, boxShadow: "none" },
												'&.Mui-selected': {
													borderColor: '#4285F4',
													boxShadow: '0 0 5px rgba(66, 133, 244, 0.5)',
													backgroundColor: `${item[keyUrl].replace(".txt", "")}`
												}
											}
											: {
												border: "none",
												padding: 0,
												position: "relative",
												background: `url(${item[keyUrl]}) no-repeat center`,
											}}
									/>
								</Tooltip>
							) : (
								<ToggleOption
									color="primary"
									value={item[keyName]}
									sx={optionSx}
								>
									<ToggleButtonContainer>
										<>{item[keyName]}</>
										{item[keyUrl] ? <Image src={item[keyUrl]} alt="" /> : null}
									</ToggleButtonContainer>
								</ToggleOption>
							)}
						</ToggleContainer>
					))
				) : (
					<p>선택 가능한 옵션이 없습니다.</p>
				)}
			</OptionGroup>
			{error && (
				<Alert severity="error" sx={{ width: "100%", marginTop: "10px" }}>
					{error}
				</Alert>
			)}
			<Tooltip title="선택 내용 초기화">
				<CloseButton
					onClick={onClickValueOff}
					variant="outlined"
					sx={buttonSx}
				>
					<ClearIcon />
				</CloseButton>
			</Tooltip>
		</OptionContainer>
	);
};

export default OptionComponent;
