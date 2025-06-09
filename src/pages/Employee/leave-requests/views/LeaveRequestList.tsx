import { LeaveRequestCard, LeaveRequestCardSkeleton } from "../../../../components/ui";
import { ILeaveRequestData } from "../../../../interfaces/leaveRequest.interfaces";

type Props = {
  leaveRequests: ILeaveRequestData[] | null;
  isLoading: boolean;
  handleEditPopupOpen: (id: number) => void;
  handleShowPopupOpen: (id: number) => void;
};

const LeaveRequestList = ({
  leaveRequests,
  isLoading,
  handleEditPopupOpen,
  handleShowPopupOpen,
}: Props) => {
  return (
    <div className="w-full flex flex-wrap gap-2 justify-self-auto">
      {isLoading || !leaveRequests ? (
        // Show 3 skeletons while loading
        <>
          <LeaveRequestCardSkeleton />
          <LeaveRequestCardSkeleton />
          <LeaveRequestCardSkeleton />
        </>
      ) : (
        leaveRequests.map((request) => (
          <LeaveRequestCard
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

export default LeaveRequestList;
