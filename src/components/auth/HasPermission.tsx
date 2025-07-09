import { ReactNode } from "react";
import { useUserStore } from "../../store/user.store";

interface HasPermissionProps {
  permission: string | string[];
  children: ReactNode;
}

const HasPermission = ({ permission, children }: HasPermissionProps) => {
  const permissions = useUserStore((state) => state.permissions);

  const hasPermission = Array.isArray(permission)
    ? permission.some((p) => permissions.includes(p))
    : permissions.includes(permission);

  return hasPermission ? <>{children}</> : null;
};

export default HasPermission;
