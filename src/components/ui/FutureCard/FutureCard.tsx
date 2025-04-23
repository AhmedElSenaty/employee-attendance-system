import { memo, ReactNode } from "react";

interface IProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FutureCard = ({ icon, title, description }: IProps) => {
  return (
    <div className="feature bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="icon mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default memo(FutureCard);
