import {Link, useParams} from "react-router-dom";
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
    width: 100%; /* 전체 너비를 차지하도록 설정 */
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

const TitleContainer = styled(Link)`
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* 가능한 모든 공간을 차지하도록 설정 */
    align-items: flex-start;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    padding: 0 20px; /* 양옆에 패딩을 줘서 간격을 확실히 설정 */
    
`;

const TitleCell = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: left;
    margin-bottom: 5px;
    width: 100%; /* 제목 영역을 100% 차지하게 설정 */
`;

const SummaryText = styled.p`
    font-size: 16px;
    color: #666;
    margin: 0;
    text-align: left;
    width: 100%; /* 설명 영역을 100% 차지하게 설정 */
`;

const BoardFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 10px; /* 여백을 줄여서 불필요한 공간을 줄입니다 */
    width: auto; /* 너비를 내용에 맞게 자동 조정 */
`;

const AuthorText = styled.p`
    cursor: pointer;
    font-size: 18px;
    color: #333;
    margin-right: 10px; /* 작성자와 날짜 간 간격을 줄임 */
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
	const {category} = useParams();
	
	if (!list || list.length === 0) {
		return <div>데이터가 없습니다.</div>;
	}
	
	
	
	return (
		<Container>
			<TopBorder /> {/* 검은색 상단 가로선 */}
			{list.map((item, index) => (
				<BoardItem key={index}>
					<IndexCell>{index + 1}</IndexCell>
					<TitleContainer to={`/post/detail/${item.boardId}`}>
						<TitleCell>{item.title}</TitleCell>
						{category !== "faq" && <SummaryText>{item.summary}</SummaryText>}
					</TitleContainer>
					{
						category !== "faq" &&
						<BoardFooter>
							<AuthorText onClick={() => onAuthorClick(item.nickName)}>
								{item.nickName}
							</AuthorText>
							<DateText>{Commons.formatDate(item.regDate)}</DateText>
						</BoardFooter>
					}
				</BoardItem>
			))}
		</Container>
	);
};

export default TextListComponent;
