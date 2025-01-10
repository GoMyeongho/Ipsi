import {createContext, useState} from "react";
import App from "../../App";

export const PermissionContext = createContext(null);

const PermissionStore = ({children}) => {
	const [permission, setPermission] =useState({})
	const [permissionList, setPermissionList] = useState([])
	const [permissionCategory, setPermissionCategory] = useState("INACTIVE");
	const [page, setPage] = useState("main");
	
	return (
		<PermissionContext.Provider value={{permission, permissionList, setPermission, setPermissionList
			, permissionCategory, setPermissionCategory, page, setPage}}>
			{children}
		</PermissionContext.Provider>
	)
}
export default PermissionStore;