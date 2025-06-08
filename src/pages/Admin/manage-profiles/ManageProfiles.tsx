import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useFiltersHook } from "../../../hooks/filter.hook";
import { useDebounce } from "../../../hooks/debounce.hook";
import { Header, CountCard, ActionCard, Button, Paginator, SectionHeader } from "../../../components/ui/";
import { formatValue } from "../../../utils";
import { BookType, CirclePlus } from "lucide-react";
import { NavLink } from "react-router";
import { DeleteProfilePopup, ProfilesTable, ProfileTableFilters } from "./views";
import { PROFILE_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/language.store";
import { useDeleteProfile, useGetProfiles } from "../../../hooks/profile.hooks";

const ManageProfilesPage = () => {
  const { t } = useTranslation(["common", PROFILE_TRANSLATION_NAMESPACE]);
    const { language } = useLanguageStore();

  const [selectedID, setSelectedID] = useState<string>("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleDeletePopupOpen = (id: string) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { profiles, totalProfiles, metadata, isProfilesDataLoading } = useGetProfiles(
    Number(page) || 1, 
    Number(pageSize) || 5, 
    searchKey || "", 
    debouncedSearchQuery || ""
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
        heading={t("manageProfilesPage.header.heading", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
        subtitle={t("manageProfilesPage.header.subtitle", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
      />
      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CountCard 
          title={t("manageProfilesPage.CountCard.title", { ns: PROFILE_TRANSLATION_NAMESPACE })}
          description={t("manageProfilesPage.CountCard.description", { ns: PROFILE_TRANSLATION_NAMESPACE })}
          count={formatValue(totalProfiles || 0, language)}
          icon={<BookType size={28} />} 
          bgColor="bg-[#b38e19]" 
        />
        <HasPermission permission="Add Profile">
          {/* ActionCard */}
          <ActionCard
            icon={<CirclePlus />}
            iconBgColor="bg-[#f5e4b2]"
            iconColor="text-[#b38e19]"
            title={t("manageProfilesPage.profileActions.add.title", { ns: PROFILE_TRANSLATION_NAMESPACE })}
            description={t("manageProfilesPage.profileActions.add.description", { ns: PROFILE_TRANSLATION_NAMESPACE })}
          >
            <NavLink to={"/admin/add-profile"}>
              <Button fullWidth={true} variant="secondary">
                {t("manageProfilesPage.profileActions.add.button", { ns: PROFILE_TRANSLATION_NAMESPACE })}
              </Button>
            </NavLink>
          </ActionCard>
        </HasPermission>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("manageProfilesPage.sectionHeader.title", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
          description={t("manageProfilesPage.sectionHeader.description", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
        />

        <div className="flex flex-wrap gap-4">
          <ProfileTableFilters searchBy={metadata.searchBy} t={t} />
        </div>
        <div className="w-full overflow-x-auto">
          <ProfilesTable
            profiles={profiles}
            isLoading={isProfilesDataLoading}
            handleDeleteProfile={handleDeletePopupOpen}
            t={t}
          />
        </div>

        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isProfilesDataLoading}
          onClickFirst={() => setFilters({ page: 1 })}
          onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
          onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
        />
      </div>

      <DeleteProfilePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
    </div>
  )
}

export default ManageProfilesPage