import React, { useState, useEffect } from "react";
import AuthApi from "../../../api/AuthApi";
import {
  Container,
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";

const MemberEdit = () => {
  const [memberInfo, setMemberInfo] = useState({
    authority : "",
    memberId: "",
    name: "",
    nickName: "",
    pwd: "",
    email: "",
    phone: "",
    univ: "",
    univDept: "",
    bankName: "",
    bankAccount: "",
    newPassword: "",
  });

  const [bankList, setBankList] = useState([]);
  const [inputNickName, setInputNickName] = useState("");
  const [openNewPasswordModal, setOpenNewPasswordModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openNickNameModal, setOpenNickNameModal] = useState(false);
  const [isNickName, setIsNickName] = useState(false);
  const [nickNameMessage, setNickNameMessage] = useState("");

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const memberData = await AuthApi.getMemberDetails();
        if (memberData) {
          setMemberInfo({
            memberId: memberData.memberId,
            name: memberData.name || "",
            authority : memberData.authority ,
            nickName: memberData.nickName || "",
            email: memberData.email || "",
            phone: memberData.phone || "",
            univ: memberData.univ?.univName || "업로드 권한 확인에서 재학증명서를 등록해주세요 ",
            univDept: memberData.univ?.univDept || "업로드 권한 확인에서 재학증명서를 등록해주세요",
            bankName: memberData.bankName || "",
            bankAccount: memberData.bankAccount || "",
          });
        } else {
          throw new Error("회원 정보가 존재하지 않습니다.");
        }
      } catch (error) {
        console.error("회원 정보를 가져오는 데 실패했습니다:", error.message);
      }
    };

    const fetchBankList = async () => {
      try {
        const bankData = await AuthApi.getBankList();
        setBankList(bankData);
      } catch (error) {
        console.error("은행 목록을 가져오는 데 실패했습니다:", error.message);
      }
    };

    fetchMemberInfo();
    fetchBankList();
  }, []);

  const handleBankNameChange = (e) => {
    setMemberInfo({ ...memberInfo, bankName: e.target.value });
  };

  const handleBankAccountChange = (e) => {
    setMemberInfo({ ...memberInfo, bankAccount: e.target.value });
  };

  const handlePasswordEdit = () => {
    setOpenPasswordModal(true);
  };

  const handleCurrentPasswordSubmit = async () => {
    try {
      
      const isValidPassword = await AuthApi.checkCurrentPassword(currentPassword);
      if (isValidPassword) {
        setOpenPasswordModal(false);
        setOpenNewPasswordModal(true);
        setCurrentPassword("");
        alert("현재 비밀번호가 맞습니다. 새로운 비밀번호를 입력하세요.");
      } else {
        alert("현재 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 오류:", error);
    }
  };

  const handleBankAccountEdit = async () => {
    const memberId = memberInfo.memberId;
    const bankName = memberInfo.bankName;
    const bankAccount = memberInfo.bankAccount;

    try {
      const changeBankInfo = await AuthApi.changeBankInfo(memberId, bankName, bankAccount);
      if (changeBankInfo) {
        alert("계좌번호 변경이 완료됐습니다.");
      } else {
        alert("계좌번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNickNameChange = async (e) => {
    const nickNameValue = e.target.value;
    setInputNickName(nickNameValue);
    if (nickNameValue.length < 3 || nickNameValue.length > 10) {
      setNickNameMessage("닉네임은 3자 이상 10자 이하로 입력하세요.");
      setIsNickName(false);
      return;
    }
    try {
      const resp = await AuthApi.nickNameCheck(nickNameValue);
      setNickNameMessage(resp.data ? "중복된 닉네임입니다." : "사용 가능한 닉네임입니다.");
      setIsNickName(!resp.data);
    } catch (error) {
      setNickNameMessage("닉네임 중복 검사에 실패했습니다.");
      setIsNickName(false);
    }
  };

  const handleNickNameSubmit = async () => {
    if (isNickName) {
      try {
        const response = await AuthApi.changeNickName(inputNickName);
        if (response) {
          alert("닉네임이 성공적으로 변경되었습니다.");
          setMemberInfo((prev) => ({ ...prev, nickName: inputNickName }));
          setOpenNickNameModal(false);
        } else {
          alert("닉네임 변경에 실패했습니다.");
        }
      } catch (error) {
        console.error("닉네임 변경 오류:", error);
      }
    }
  };

  const handleNewPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await AuthApi.changePassword(newPassword);
      if (response) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        setOpenNewPasswordModal(false);
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ backgroundColor: "white", p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#5f53d3" }}>
          회원 정보 수정
        </Typography>
  
        {/* 이름 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
            이름
          </Typography>
          <Typography variant="body1" sx={{ color: "#555" }}>
            {memberInfo.name}
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Box>
  
        {/* 닉네임 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
            닉네임
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="body1" sx={{ color: "#555" }}>
                {memberInfo.nickName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                onClick={() => setOpenNickNameModal(true)}
                fullWidth
                sx={{
                  backgroundColor: "#5f53d3",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#4a3fb5" },
                }}
              >
                닉네임 수정
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 1 }} />
        </Box>

        <Modal
          open={openNickNameModal}
          onClose={() => {
            setOpenNickNameModal(false);
            setInputNickName("");
            setNickNameMessage("");
            setIsNickName(false);
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openNickNameModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: 24,
                width: { xs: "90%", sm: "300px" },
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                닉네임 수정
              </Typography>
              <TextField
                label="새 닉네임"
                value={inputNickName}
                onChange={handleNickNameChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography
                variant="body2"
                sx={{ color: isNickName ? "green" : "red", mb: 2 }}
              >
                {nickNameMessage}
              </Typography>
              <Button
                onClick={handleNickNameSubmit}
                variant="contained"
                fullWidth
                disabled={!isNickName}
                sx={{
                  backgroundColor: "#5f53d3",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#4a3fb5" },
                }}
              >
                변경
              </Button>
            </Box>
          </Fade>
        </Modal>

  
        {/* 비밀번호 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
            비밀번호
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                type="password"
                value={"********"}
                InputProps={{ readOnly: true }}
                fullWidth
                sx={{ height: "56px", display: "flex", alignItems: "center" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                onClick={handlePasswordEdit}
                fullWidth
                sx={{
                  height: "56px",
                  backgroundColor: "#5f53d3",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#4a3fb5" },
                }}
              >
                비밀번호 수정
              </Button>
            </Grid>
          </Grid>
         
        </Box>
        <Modal
          open={openPasswordModal}
          onClose={() => setOpenPasswordModal(false)}
          closeAfterTransition
        >
          <Fade in={openPasswordModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: 24,
                width: { xs: "90%", sm: "300px" },
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                현재 비밀번호 입력
              </Typography>
              <TextField
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                onClick={handleCurrentPasswordSubmit}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#5f53d3",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#4a3fb5" },
                }}
              >
                확인
              </Button>
            </Box>
          </Fade>
        </Modal>

        {/* 새로운 비밀번호 입력 모달 */}
        <Modal
          open={openNewPasswordModal}
          onClose={() => {
            setOpenNewPasswordModal(false);
            setNewPassword("");
            setConfirmPassword("");
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openNewPasswordModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: 24,
                width: { xs: "90%", sm: "300px" },
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                새로운 비밀번호 입력
              </Typography>
              <TextField
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                onClick={handleNewPasswordSubmit}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#5f53d3",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#4a3fb5" },
                }}
              >
                변경
              </Button>
            </Box>
          </Fade>
        </Modal>

  
        {/* 대학교, 학과, 은행 정보 (유저가 'ROLE_UNIV'일 경우만 표시) */}
        <Divider sx={{ mt: 1 }} />
        {memberInfo.authority === "ROLE_UNIV" && (
          <>
            {/* 대학교 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
                대학교
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                {memberInfo.univ}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
  
            {/* 학과 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
                학과
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                {memberInfo.univDept}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
  
            {/* 은행 정보 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
                은행 정보
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={{ height: "56px" }}>
                    <InputLabel shrink>은행 선택</InputLabel>
                    <Select
                      value={memberInfo.bankName}
                      onChange={handleBankNameChange}
                      sx={{ height: "56px", display: "flex", alignItems: "center" }}
                    >
                      {bankList.map((bank) => (
                        <MenuItem key={bank.bankId} value={bank.bankName}>
                          {bank.bankName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="계좌번호"
                    value={memberInfo.bankAccount}
                    onChange={handleBankAccountChange}
                    fullWidth
                    sx={{ height: "56px", display: "flex", alignItems: "center" }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={handleBankAccountEdit}
                    fullWidth
                    sx={{
                      height: "56px",
                      backgroundColor: "#5f53d3",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#4a3fb5" },
                    }}
                  >
                    변경
                  </Button>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 1 }} />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default MemberEdit;