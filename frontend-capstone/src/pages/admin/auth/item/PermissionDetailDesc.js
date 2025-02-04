import React, { useContext, useEffect, useState } from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";
import { PermissionContext } from "../../../../context/admin/PermissionStore";
import styled from "styled-components";
import AdminApi from "../../../../api/AdminApi";
import Commons from "../../../../util/Common";
import {Dropdown} from "../../../../styles/SmallComponents";

const data = [
	{ label: "이름", id: "name" },
	{ label: "이메일", id: "nickname" },
	{ label: "대학교", id: "univName", select: true },
	{ label: "학과", id: "univDept", select: true },
	{ label: "권한", id: "authority" },
	{ label: "상태", id: "active" },
	{ label: "등록 날짜", id: "regDate" },
	{ label: "활성화 날짜", id: "activeDate" },
];

const PermissionDetailDesc = () => {
	const { permission, univNameList, setUnivList , setUniv, univList } = useContext(PermissionContext);
	const [selectedUniv, setSelectedUniv] = useState("");
	
	
	// 대학교 선택 시 학과 목록 가져오기
	useEffect(() => {
		const fetchDeptList = async () => {
			try {
				if (selectedUniv) {
					const rsp = await AdminApi.getDeptList(selectedUniv);
					if (rsp.status === 200) {
						setUnivList(rsp.data); // 컨텍스트 업데이트
						
					}
				} else {
					setUnivList([]); // 대학교 선택 해제 시 학과 목록 초기화
				}
			} catch (error) {
				console.error("학과 목록 가져오기 오류:", error);
			}
		};
		
		fetchDeptList();
	}, [selectedUniv]);
	
	const onChangeUniv = (e) => {
		setSelectedUniv(e.target.value);
		setUniv(""); // 대학교 선택시 학과 초기화
	};
	
	const onChangeDept = (e) => {
		setUniv(e.target.value);
	}
	
	return (
		<Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: "auto" }}>
			<Typography variant="h6" gutterBottom>
				사용자 정보
			</Typography>
			<Stack spacing={2}>
				{data.map((item, index) => {
					const value = permission[item.id] || "정보 없음";
					
					return item.select ? (
						<Box
							key={index}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								borderBottom: index !== data.length - 1 ? "1px solid #ddd" : "none",
								pb: 1,
							}}
						>
							<Typography variant="subtitle1" fontWeight="bold">
								{item.label}
							</Typography>
							{item.id === "univName" ? (
								<Dropdown onChange={onChangeUniv} value={selectedUniv}>
									<option value="">대학교 선택</option>
									{univNameList.map((univ, index) => (
										<option key={index} value={univ}>
											{univ}
										</option>
									))}
								</Dropdown>
							) : (
								<Dropdown onChange={onChangeDept} disabled={!selectedUniv}>
									<option value="">학과 선택</option>
									{univList.map((dept, index) => (
										<option key={index} value={dept.univId}>
											{dept.univDept}
										</option>
									))}
								</Dropdown>
							)}
						</Box>
					) : (
						<Box
							key={index}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								borderBottom: index !== data.length - 1 ? "1px solid #ddd" : "none",
								pb: 1,
							}}
						>
							<Typography variant="subtitle1" fontWeight="bold">
								{item.label}
							</Typography>
							{item.id.includes("Date") ? <Typography variant="body1">{value === "정보 없음" ? "정보 없음" : Commons.formatDate(value)}
							</Typography> : <Typography variant="body1">{value}</Typography>}
						</Box>
					);
				})}
			</Stack>
		</Paper>
	);
};

export default PermissionDetailDesc;


