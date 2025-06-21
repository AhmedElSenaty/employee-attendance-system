import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Header, CountCard, ActionCard, Button, Paginator, SectionHeader, InfoPopup } from "../../../components/ui/";
import { formatValue } from "../../../utils";
import { BookType, CirclePlus } from "lucide-react";
import { NavLink } from "react-router";
import { HasPermission } from "../../../components/auth";
import { PROFILE_NS, PROFILE_VIDEO } from "../../../constants";
import { useLanguageStore } from "../../../store";
import { useDebounce, useDeleteProfile, useGetProfiles } from "../../../hooks";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { DeletePopup, ProfilesTable, TableFilters } from "./views";

const ManageProfilesPage = () => {
  const { t } = useTranslation([PROFILE_NS]);
  const { language } = useLanguageStore();

  const [selectedID, setSelectedID] = useState<string>("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleDeletePopupOpen = (id: string) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

  const {getParam, setParam, clearParams} = useURLSearchParams();

  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam('page', Number);
  const rawPageSize = getParam('pageSize', Number);
  const rawSearchKey = getParam('searchKey');
  const rawSearchQuery = useDebounce(getParam('searchQuery'), 650);

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;
    
  const debouncedSearchQuery = useDebounce(searchQuery, 650);

  const { profiles, count, metadata, isLoading: isProfilesDataLoading } = useGetProfiles(
    page, 
    pageSize, 
    searchKey, 
    debouncedSearchQuery
  );

  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile();
  
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteProfile(selectedID)
    setIsDeletePopupOpen(false)
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header 
        heading={t("header.heading")} 
        subtitle={t("header.subtitle")} 
      />
      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopup.title")}
            description={t("infoPopup.description")}
            videoUrl={PROFILE_VIDEO}
          />
        </div>
        <CountCard 
          title={t("CountCard.title")}
          description={t("CountCard.description")}
          count={formatValue(count || 0, language)}
          icon={<BookType size={28} />} 
          bgColor="bg-[#b38e19]" 
        />
        <HasPermission permission="Add Profile">
          {/* ActionCard */}
          <ActionCard
            icon={<CirclePlus />}
            iconBgColor="bg-[#f5e4b2]"
            iconColor="text-[#b38e19]"
            title={t("addActionCard.title")}
            description={t("addActionCard.description")}
          >
            <NavLink to={"/admin/add-profile"}>
              <Button fullWidth={true} variant="secondary">
                {t("addActionCard.button")}
              </Button>
            </NavLink>
          </ActionCard>
        </HasPermission>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("sectionHeader.title")} 
          description={t("sectionHeader.description")} 
        />

        <TableFilters searchBy={metadata.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />

        <div className="w-full overflow-x-auto">
          <ProfilesTable
            profiles={profiles}
            isLoading={isProfilesDataLoading}
            handleDelete={handleDeletePopupOpen}
          />
        </div>

        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isProfilesDataLoading}
          onClickFirst={() => setParam("page", String(1))}
          onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
          onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
        />
      </div>

      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ManageProfilesPage