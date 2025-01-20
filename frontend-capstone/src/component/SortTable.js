import { useState } from "react";
import {Box, Link, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from "@mui/material";
import styled from "styled-components";
import {visuallyHidden} from "@mui/utils";
import {priceFormatter} from "../function/priceFormatter";
import { useNavigate } from "react-router-dom";

const Container = styled.div``

const StyledTable = styled(Table)`
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
`
const StyledTableHead = styled(TableHead)``
const StyledTableRow = styled(TableRow)``

const StyledTableBody = styled(TableBody)``


const StyledTableCell = styled(TableCell)`
  position: relative; /* 링크의 z-index가 영향을 받을 수 있으므로 설정 */
  overflow: visible; /* 링크 클릭 방해 방지 */
`;
const Image = styled.img``
const Text = styled.p``


// 비교를 위한 Comparator
const descendingComparator = (a, b, orderBy) => {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
};

// 정렬방향과 정렬기준을 통해 정렬시켜주는 함수
const getComparator = (order, orderBy) => {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
};

// 모든 요소를 정렬시키는 함수
const stableSort = (array, comparator) => {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
};

// sortList : 정렬시킬 조건들
// name 으로 테이블 헤더 이름 설정
// id로 list 에 있는 객체 하나의 요소에 접근
// link 로 이동할 링크 지정(함수형태)
// align 으로 정렬방향 설정
// isSort 로 정렬여부 결정
// type 으로 데이터의 타입 설정
// 밑은 예시
const sampleSortList = [
	{name: "이미지", id: "image", align: "center", isSort: false, type: "image", link: (item) => `/imagePage/${item.image}`},
	{name: "이름", id: "name", align: "left", isSort: true, link: (item) => `/subPage/${item.name}`},
	{name: "가격", id: "price", align: "right", isSort: true, type: "price", link: (item) => `/subPage/${item.name}`},
]
const sampleSortLists = [
	{name: "자소서", id: "ps", },
	{name: "생기부", id: "sr",},
]

// list : 정렬시킬 값
// SortTable 컴포넌트 내부
const SortTable = ({ list, sortList }) => {
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("carName");
	const navigate = useNavigate();  // useNavigate 훅 사용
	
	// 클릭하면 정렬시켜주는 함수
	const handleRequestSort = (event, property) => {
		const isAscending = orderBy === property && order === "asc";
		setOrder(isAscending ? "desc" : "asc");
		setOrderBy(property);
	};
	
	// 해당 cell 의 종류별로 출력을 다르게 해주는 함수
	const cellTypeApplication = (cell, item) => {
		switch (cell.type) {
			case "image":
				return <Image src={item[cell.id]} alt={cell.name}></Image>;
			case "price":
				return <Text>{priceFormatter(item[cell.id])}</Text>;
			default:
				return <Text>{item[cell.id]}</Text>;
		}
	}
	
	// 링크 클릭 시 페이지 이동 처리 함수
	const handleClick = (link) => {
		navigate(link);  // 페이지 이동
	};
	
	if (!list || list.length === 0) {
		return <Paper>데이터가 없습니다.</Paper>; // list가 없거나 비어있으면 메시지 출력
	}
	
	return (
		<Container>
			<StyledTable sx={{ minWidth: 650 }} size="small" aria-label="sort table">
				<StyledTableHead>
					<StyledTableRow>
						{sortList.map((header, index) => (
							<StyledTableCell key={index} align={header.align}>
								{header.isSort ? (
									<TableSortLabel
										active={orderBy === header.id}
										direction={orderBy === header.id ? order : "asc"}
										onClick={(event) => handleRequestSort(event, header.id)}
									>
										{header.name}
										{orderBy === header.id ? (
											<Box component="span" sx={visuallyHidden}></Box>
										) : null}
									</TableSortLabel>
								) : (
									header.name
								)}
							</StyledTableCell>
						))}
					</StyledTableRow>
				</StyledTableHead>
				<StyledTableBody>
					{stableSort(list, getComparator(order, orderBy)).map((item, index) => (
						<TableRow key={index}>
							{sortList.map((cell, index) => (
								<TableCell key={index} align={cell.align}>
									{
										cell.link ? (
											<div onClick={() => handleClick(cell.link(item))} style={{ cursor: "pointer" }}>
												{cellTypeApplication(cell, item)}
											</div>
										) : cellTypeApplication(cell, item)
									}
								</TableCell>
							))}
						</TableRow>
					))}
				</StyledTableBody>
			</StyledTable>
		</Container>
	);
};

export default SortTable;
