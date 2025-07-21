import { HomeVisitCard, HomeVisitCardSkeleton } from "../../../../components/ui/HomeVisitCard";
import { HomeVisitDetails } from "../../../../interfaces/HomeVisit.interfaces";

type Props = {
  requests: HomeVisitDetails[] | null;
  isLoading: boolean;
  handleEditPopupOpen: (id: number) => void;
  handleShowPopupOpen: (id: number) => void;
  handleChangePopupOpen: (id: number) => void;
};

const List = ({
  requests,
  isLoading,
  handleEditPopupOpen,
  handleShowPopupOpen,
  handleChangePopupOpen,
}: Props) => {
  return (
    <div className="w-full flex flex-wrap gap-2 items-center justify-center">
      {isLoading || !requests ? (
        // Show 3 skeletons while loading
        <>
          <HomeVisitCardSkeleton />
          <HomeVisitCardSkeleton />
          <HomeVisitCardSkeleton />
        </>
      ) : (
        requests.map((request) => (
          <HomeVisitCard
            key={request.id}
            data={request}
            handleEdit={handleEditPopupOpen}
            handleShow={handleShowPopupOpen}
            handleChange={handleChangePopupOpen}
          />
        ))
      )}
    </div>
  );
};

export default List;
