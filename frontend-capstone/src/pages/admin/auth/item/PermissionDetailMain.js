import { useContext, useEffect } from "react";
import { Box, Paper, Typography, Stack, CircularProgress } from "@mui/material";
import { PermissionContext } from "../../../../context/admin/PermissionStore";
import PermissionApi from "../../../../api/AdminApi";
import PermissionDetailDesc from "./PermissionDetailDesc";
import PermissionDetailPdf from "./PermissionDetailPdf"; // Pdf 컴포넌트 예시

const PermissionDetailMain = () => {
	const { setPage, setPermission, permission } = useContext(PermissionContext);
	
	useEffect(() => {
		setPage("auth");
	}, [setPage]);
	
	useEffect(() => {
		const getPermissionDetails = async () => {
			try {
				const rsp = await PermissionApi.getPermissionDetails();
				console.log(rsp);
				setPermission(rsp.data);
			} catch (error) {
				console.error(error);
			}
		};
		getPermissionDetails();
	}, [setPermission]);
	
	// 로딩 중일 경우 CircularProgress 표시
	if (!permission) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}
	
	return (
		<Box sx={{ padding: 3, backgroundColor: "#f5f5f5" }}>
			<Paper elevation={3} sx={{ padding: 3, maxWidth: 1200, margin: "auto" }}>
				<Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
					권한 관리
				</Typography>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					{/* PDF 컴포넌트 */}
					<Paper elevation={2} sx={{ padding: 2 }}>
						<PermissionDetailPdf />
					</Paper>
					
					{/* 권한 정보 */}
					<Paper elevation={2} sx={{ padding: 2 }}>
						<PermissionDetailDesc />
					</Paper>
				</Box>
			</Paper>
		</Box>
	);
};

export default PermissionDetailMain;
