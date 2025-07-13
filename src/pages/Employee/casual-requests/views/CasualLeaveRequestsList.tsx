import {
  CasualLeaveRequestCard,
  CasualLeaveRequestCardSkeleton,
} from "../../../../components/ui";
import { ICasualLeaveRequestData } from "../../../../interfaces";

type Props = {
  casualLeaveRequests: ICasualLeaveRequestData[] | null;
  isLoading: boolean;
  handleEditPopupOpen: (id: number) => void;
  handleShowPopupOpen: (id: number) => void;
};

const CasualLeaveRequestsList = ({
  casualLeaveRequests,
  isLoading,
  handleEditPopupOpen,
  handleShowPopupOpen,
}: Props) => {
  return (
    <div className="w-full flex flex-wrap gap-1 items-center justify-center">
      {isLoading || !casualLeaveRequests ? (
        // Show 3 skeletons while loading
        <>
          <CasualLeaveRequestCardSkeleton />
          <CasualLeaveRequestCardSkeleton />
          <CasualLeaveRequestCardSkeleton />
        </>
      ) : (
        casualLeaveRequests.map((request) => (
          <CasualLeaveRequestCard
            key={request.id}
            data={request}
            handleEdit={handleEditPopupOpen}
            handleShow={handleShowPopupOpen}
          />
        ))
      )}
    </div>
  );
};

export default CasualLeaveRequestsList;
