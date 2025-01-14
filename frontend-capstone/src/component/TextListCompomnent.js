import React from "react";
import styled from "styled-components";
import Commons from "../util/Common";

const Container = styled.div`
    padding: 20px;
    width: 100%;
`;

const TopBorder = styled.div`
    border-top: 2px solid black; /* 검은색 상단 가로선 */
`;

const BoardItem = styled.div`
    display: flex;
    align-items: center; /* 세로 정렬 */
    height: 80px; /* 높이를 고정하거나 적절하게 설정 */
    padding: 0 20px;
    border-bottom: 1px solid #e0e0e0;
		margin: 0;
`;

const IndexCell = styled.div`
    font-size: 22px;
    color: #333;
    width: 50px;
		margin: auto 0;
    text-align: left;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column; /* 제목과 설명을 상하로 배치 */
    flex: 1; /* 나머지 공간 차지 */
    align-items: flex-start; /* 왼쪽 정렬 */
    margin-bottom: 5px; /* 제목과 설명 간의 간격 */
    max-width: 400px; /* 제목 최대 너비 설정 */
`;

const TitleCell = styled.div`
    font-size: 22px;
    font-weight: bold;
    color: #333;
    text-align: left; /* 제목을 왼쪽 정렬 */
    margin-bottom: 5px; /* 제목과 설명 간 간격 */
`;

const SummaryText = styled.p`
    font-size: 16px;
    color: #666;
    margin: 0;
    text-align: left; /* 설명을 왼쪽 정렬 */
`;

const Text = styled.p`
    font-size: 18px;
    color: #333;
`;

const StyledLink = styled.a`
    text-decoration: none; /* 링크 밑줄 제거 */
    color: inherit; /* 링크 색상 상속 */
    display: inline;
`;

const BoardFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    width: 100%;
    align-items: center; /* 상하 정렬 */
`;

const AuthorText = styled.p`
    cursor: pointer;
    font-size: 18px;
    color: #333; /* 링크 색상 제거 후 일반 텍스트 색상 */
    margin-right: 20px;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
`;

const DateText = styled.p`
    font-size: 18px;
    color: #333;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
`;

const TextListComponent = ({ list, onAuthorClick }) => {
	if (!list || list.length === 0) {
		return <div>데이터가 없습니다.</div>;
	}
	
	return (
		<Container>
			<TopBorder /> {/* 검은색 상단 가로선 */}
			{list.map((item, index) => (
				<BoardItem key={index}>
					<IndexCell>{index + 1}</IndexCell>
					<TitleContainer>
						<TitleCell>
							<StyledLink href={`/post/detail/${item.boardId}`}>
								{item.title}
							</StyledLink>
						</TitleCell>
						<SummaryText>{item.summary}</SummaryText>
					</TitleContainer>
					<BoardFooter>
						<AuthorText onClick={() => onAuthorClick(item.nickName)}>
							{item.nickName}
						</AuthorText>
						<DateText>{Commons.formatDate(item.regDate)}</DateText>
					</BoardFooter>
				</BoardItem>
			))}
		</Container>
	);
};

export default TextListComponent;
