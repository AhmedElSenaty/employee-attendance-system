import { SickRequestCard, SickRequestCardSkeleton } from "../../../../components/ui";
import { ISickRequestData } from "../../../../interfaces/";

type Props = {
  sickRequests: ISickRequestData[] | null;
  isLoading: boolean;
  handleEditPopupOpen: (id: number) => void;
  handleShowPopupOpen: (id: number) => void;
};

const LeaveRequestsList = ({
  sickRequests,
  isLoading,
  handleEditPopupOpen,
  handleShowPopupOpen,
}: Props) => {
  return (
    <div className="w-full flex flex-wrap gap-2 items-center justify-center">
      {isLoading || !sickRequests ? (
        // Show 3 skeletons while loading
        <>
          <SickRequestCardSkeleton />
          <SickRequestCardSkeleton />
          <SickRequestCardSkeleton />
        </>
      ) : (
        sickRequests.map((request) => (
          <SickRequestCard
            key={request.requestId}
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
