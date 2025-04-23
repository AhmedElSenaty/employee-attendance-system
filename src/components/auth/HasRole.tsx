import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "../../context/slices/userSlice";

interface HasRoleProps {
  role: string | string[]; // allows one or many roles
  children: ReactNode;
}

const HasRole = ({ role, children }: HasRoleProps) => {
  const userRole = useSelector(selectRole()); // adjust based on your actual state

  const allowedRoles = Array.isArray(role) ? role : [role];
  const hasAccess = allowedRoles.includes(userRole);

  return hasAccess ? <>{children}</> : null;
};

export default HasRole;
