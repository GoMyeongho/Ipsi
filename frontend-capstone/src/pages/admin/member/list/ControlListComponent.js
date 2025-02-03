import React from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom"; // styled-components로 스타일링

const TextListComponent = ({ list }) => {
	const navigate = useNavigate();
	
	const onClickNavigator = (e) => {
		navigate(`/admin/member/detail/${e}`);
	}
	
	return (
		<ListContainer>
			{list && list.length > 0 ? (
				list.map((member) => (
					<Item onClick={ () => onClickNavigator(member.memberId)} key={member.memberId}>
						<ItemDetail>{member.name}</ItemDetail>
						<ItemDetail>{member.authority}</ItemDetail>
						<ItemDetail>{member.univ && member.univ.univName}</ItemDetail>
					</Item>
				))
			) : (
				<NoData>등록된 멤버가 없습니다.</NoData>
			)}
		</ListContainer>
	);
};

// styled-components로 스타일 정의
const ListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    padding: 20px;
`;

const Item = styled.div`
    background-color: #f1f1f1;
    border-radius: 8px;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 250px;
    min-height: 50px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
`;

const ItemDetail = styled.div`
    font-size: 14px;
    color: #333;
    text-align: left;
    flex: 1;
    padding: 0 5px;
`;

const NoData = styled.div`
    text-align: center;
    font-size: 16px;
    color: #999;
    padding: 20px;
`;

export default TextListComponent;
