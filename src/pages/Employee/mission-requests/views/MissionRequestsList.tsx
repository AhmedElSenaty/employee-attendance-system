import { LeaveRequestCardSkeleton } from "../../../../components/ui";
import { MissionRequestCard } from "../../../../components/ui/MissionRequestCard";
import { IMissionRequestData } from "../../../../interfaces";

type Props = {
  missionRequests: IMissionRequestData[] | null;
  isLoading: boolean;
  handleEditPopupOpen: (id: number) => void;
  handleShowPopupOpen: (id: number) => void;
};

const MissionRequestsList = ({
  missionRequests,
  isLoading,
  handleEditPopupOpen,
  handleShowPopupOpen,
}: Props) => {
  return (
    <div className="w-full flex flex-wrap gap-2 items-center justify-center">
      {isLoading || !missionRequests ? (
        // Show 3 skeletons while loading
        <>
          <LeaveRequestCardSkeleton />
          <LeaveRequestCardSkeleton />
          <LeaveRequestCardSkeleton />
        </>
      ) : (
        missionRequests.map((request) => (
          <MissionRequestCard
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

export default MissionRequestsList;
