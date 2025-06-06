import { ReactNode } from "react";
import { useUserStore } from "../../store/user.store";

interface HasPermissionProps {
  permission: string;
  children: ReactNode;
}

const HasPermission = ({ permission, children }: HasPermissionProps) => {
  const permissions = useUserStore((state) => state.permissions);

  const hasPermission = permissions.includes(permission);
  
  return hasPermission ? <>{children}</> : null;
};

export default HasPermission;
