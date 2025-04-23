import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectPermissions } from "../../context/slices/userSlice";

interface HasPermissionProps {
  permission: string;
  children: ReactNode;
}

const HasPermission = ({ permission, children }: HasPermissionProps) => {
  const permissions = useSelector(selectPermissions);

  const hasPermission = permissions.includes(permission);
  
  return hasPermission ? <>{children}</> : null;
};

export default HasPermission;
