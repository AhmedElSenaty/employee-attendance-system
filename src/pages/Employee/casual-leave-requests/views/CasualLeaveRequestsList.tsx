import { LeaveRequestCardSkeleton } from "../../../../components/ui";
import CasualLeaveRequestCard from "../../../../components/ui/CasualLeaveRequestCard/OrdinaryRequestCard";
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
    <div className="w-full flex flex-wrap gap-2 items-center justify-center">
      {isLoading || !casualLeaveRequests ? (
        // Show 3 skeletons while loading
        <>
          <LeaveRequestCardSkeleton />
          <LeaveRequestCardSkeleton />
          <LeaveRequestCardSkeleton />
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
