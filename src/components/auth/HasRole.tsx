import { ReactNode } from "react";
import { useUserStore } from "../../store/user.store";

interface HasRoleProps {
  role: string | string[]; // allows one or many roles
  children: ReactNode;
}

const HasRole = ({ role, children }: HasRoleProps) => {
  const userRole = useUserStore((state) => state.role);

  const allowedRoles = Array.isArray(role) ? role : [role];
  const hasAccess = allowedRoles.includes(userRole);

  return hasAccess ? <>{children}</> : null;
};

export default HasRole;
