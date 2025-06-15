import { LeaveRequestCard, LeaveRequestCardSkeleton } from "../../../../components/ui";
import { ILeaveRequestData } from "../../../../interfaces/";

type Props = {
  leaveRequests: ILeaveRequestData[] | null;
  isLoading: boolean;
  handleEditPopupOpen: (id: number) => void;
  handleShowPopupOpen: (id: number) => void;
};

const LeaveRequestsList = ({
  leaveRequests,
  isLoading,
  handleEditPopupOpen,
  handleShowPopupOpen,
}: Props) => {
  return (
    <div className="w-full flex flex-wrap gap-2 items-center justify-center">
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

export default LeaveRequestsList;
