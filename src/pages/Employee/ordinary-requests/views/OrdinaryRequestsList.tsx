import { LeaveRequestCardSkeleton } from "../../../../components/ui";
import OrdinaryRequestCard from "../../../../components/ui/OrdinaryRequestCard/OrdinaryRequestCard";
import { IOrdinaryRequestData } from "../../../../interfaces";

type Props = {
  ordinaryRequests: IOrdinaryRequestData[] | null;
  isLoading: boolean;
  handleEditPopupOpen: (id: number) => void;
  handleShowPopupOpen: (id: number) => void;
};

const OrdinaryRequestsList = ({
  ordinaryRequests,
  isLoading,
  handleEditPopupOpen,
  handleShowPopupOpen,
}: Props) => {
  return (
    <div className="w-full flex flex-wrap gap-2 items-center justify-center">
      {isLoading || !ordinaryRequests ? (
        // Show 3 skeletons while loading
        <>
          <LeaveRequestCardSkeleton />
          <LeaveRequestCardSkeleton />
          <LeaveRequestCardSkeleton />
        </>
      ) : (
        ordinaryRequests.map((request) => (
          <OrdinaryRequestCard
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

export default OrdinaryRequestsList;
