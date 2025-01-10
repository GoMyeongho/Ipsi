import React, { useContext } from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";
import { PermissionContext } from "../../../../context/admin/PermissionStore";

const data = [
	{ label: "이름", id: "name" },
	{ label: "이메일", id: "nickname" },
	{ label: "대학교", id: "univName" },
	{ label: "학과", id: "univDept" },
	{ label: "권한", id: "authority" },
	{ label: "상태", id: "active" },
	{ label: "등록 날짜", id: "regDate" },
	{ label: "활성화 날짜", id: "activeDate" }
];

const PermissionDetailDesc = () => {
	const { permission } = useContext(PermissionContext);
	
	return (
		<Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: "auto" }}>
			<Typography variant="h6" gutterBottom>
				사용자 정보
			</Typography>
			<Stack spacing={2}>
				{data.map((item, index) => {
					// id만 사용하여 value를 가져오고, 값이 없으면 "정보 없음"을 표시
					const value = permission[item.id] || "정보 없음";
					
					return (
						<Box
							key={index}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								borderBottom: index !== data.length - 1 ? "1px solid #ddd" : "none",
								pb: 1
							}}
						>
							<Typography variant="subtitle1" fontWeight="bold">
								{item.label}
							</Typography>
							<Typography variant="body1">{value}</Typography>
						</Box>
					);
				})}
			</Stack>
		</Paper>
	);
};

export default PermissionDetailDesc;
