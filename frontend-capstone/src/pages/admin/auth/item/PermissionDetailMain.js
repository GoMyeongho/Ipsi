import {useContext, useEffect, useState} from "react";
import {Box, Paper, Typography, Stack, CircularProgress, Button, Tooltip} from "@mui/material";
import { PermissionContext } from "../../../../context/admin/PermissionStore";
import PermissionApi from "../../../../api/AdminApi";
import PermissionDetailDesc from "./PermissionDetailDesc";
import PermissionDetailPdf from "./PermissionDetailPdf";
import {useParams} from "react-router-dom";
import RejectModal from "../../../../component/Modal/RejectModal";
import AdminApi from "../../../../api/AdminApi"; // Pdf 컴포넌트 예시

const PermissionDetailMain = () => {
	const { setPage, setPermission, permission, univ, setUnivNameList} = useContext(PermissionContext);
	const [rejectModal, setRejectModal] = useState(false);
	const [message, setMessage] = useState("");
	const {permissionId} = useParams()
	
	const onClickPermission = async (isUniv) => {
		try{
			if(univ) {
				const rsp = await PermissionApi.activePermission(permissionId, univ, isUniv)
				console.log(rsp)
				return
			}
			setMessage("대학이 설정되지 않았습니다.")
			setRejectModal(true);
		} catch (error) {
			setMessage("권한 부여 도중 오류가 발생 했습니다.")
			console.log(error);
			setRejectModal(true);
		}
	}
	
	useEffect(() => {
		const fetchUniv = async () => {
			try{
				const rsp = await AdminApi.getUnivList();
				if(rsp.status === 200) {
					console.log(rsp);
					setUnivNameList(rsp.data);
				}
			} catch (e) {
				console.error(e)
			}
		}
		fetchUniv();
	}, []);
	
	useEffect(() => {
		setPage("auth");
	}, [setPage]);
	
	useEffect(() => {
		const getPermissionDetails = async () => {
			try {
				const rsp = await PermissionApi.getPermissionDetails(permissionId);
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
		<Box sx={{ padding: 3, backgroundColor: "#f5f5f5", width: "100%"}}>
			<Paper elevation={3} sx={{ padding: 3, width: "100%", margin: "auto" }}>
				<Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
					권한 관리
				</Typography>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					{/* PDF 컴포넌트 */}
					<Paper elevation={2} sx={{ padding: 2, width: "100%", margin: "auto" }}>
						{/*<PermissionDetailPdf />*/}
						<Button href={permission.permissionUrl}>파일보기</Button>
					</Paper>
					
					{/* 권한 정보 */}
					<Paper elevation={2} sx={{ padding: 2, width: "100%", margin: "auto" }}>
						<PermissionDetailDesc />
					</Paper>
					{/* 권한 버튼 */}
					<Paper elevation={2} sx={{ padding: 2,  width: "100%", margin: "auto", display: "flex", justifyContent: "space-evenly" }}>
						<Tooltip title="해당 대학에 합격했음만 인증합니다.">
							<Button variant="outlined" onClick={() => onClickPermission(false)}>합격</Button>
						</Tooltip>
						<Tooltip title="해당 대학에 재학중임을 인증합니다.">
							<Button variant="outlined" onClick={() => onClickPermission(true)}>대학</Button>
						</Tooltip>
					</Paper>
				</Box>
			</Paper>
			<RejectModal message={message} open={rejectModal} onClose={() => setRejectModal(false)} />
		</Box>
	);
};

export default PermissionDetailMain;
