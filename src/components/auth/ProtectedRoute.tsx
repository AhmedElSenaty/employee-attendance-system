import { ReactNode } from "react";
import { Navigate } from "react-router";

interface IProps {
  isAllowed: boolean;
  redirectPath: string;
  children: ReactNode;
}

const ProtectedRoute = ({isAllowed, redirectPath, children}: IProps) => {
    if(! isAllowed) return <Navigate to={redirectPath}/>;
    return <>{children}</>
}

export default ProtectedRoute