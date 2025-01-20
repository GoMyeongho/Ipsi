import {BackGround} from "../../../../styles/GlobalStyle";
import { Document, Page } from 'react-pdf';
import {useContext, useState} from "react";
import {PermissionContext} from "../../../../context/admin/PermissionStore";
import {IconButton, Skeleton, Tooltip} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const PermissionDetailPdf = () => {
	const [pageNumber, setPageNumber] = useState(1);
	const [numPages, setNumPages] = useState(null);
	const {permission} = useContext(PermissionContext)
	
	
	
	
	return(
		<BackGround>
			{permission ? (
				<>
					<Document
						file={permission.permissionUrl}
						onLoadSuccess={({ numPages }) => setNumPages(numPages)}
					>
						<Page pageNumber={pageNumber} />
					</Document>
					<div>
						<Tooltip title="이전 페이지">
							<IconButton
								disabled={pageNumber <= 1}
								onClick={() => setPageNumber(pageNumber - 1)}
							>
							<ArrowBackIosNewIcon/>
							</IconButton>
						</Tooltip>
						<span>
              {pageNumber} / {numPages}
            </span>
						<Tooltip title="다음 페이지">
							<IconButton
								disabled={pageNumber <= 1}
								onClick={() => setPageNumber(pageNumber - 1)}
							>
								<ArrowForwardIosIcon/>
							</IconButton>
						</Tooltip>
					</div>
				</>
			) : (
				<Skeleton/>
			)}
		</BackGround>
	)
}
export default PermissionDetailPdf;