import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useFiltersHook } from "../../../hooks/filter.hook";
import { useDebounce } from "../../../hooks/debounce.hook";
import { CountCard, Header, ActionCard, Button, Paginator, SectionHeader } from "../../../components/ui";
import { formatValue } from "../../../utils";
import { NavLink } from "react-router";
import { DeleteAdminPopup, UnblockAdminPopup, AdminsTable, AdminTableFilters } from "./views";
import { Shield, ShieldPlus } from "lucide-react";
import { useGetAllAdmins, useManageAdmins } from "../../../hooks/useAdminHook";
import { ADMIN_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/language.store";
import { useUnblockAccount } from "../../../hooks/account.hook";

const ManageAdminsPage = () => {
  // Set up translation namespace and retrieve translation function `t`
  // Also extract the current language from the Redux store
  const { t } = useTranslation(["common", ADMIN_TRANSLATION_NAMESPACE]);
    const { language } = useLanguageStore();

  // State to track the selected user ID and control the visibility of modals
  const [selectedID, setSelectedID] = useState<string>("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false);

  // Open delete confirmation popup and set the selected user ID
  const handleDeletePopupOpen = (id: string) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

  // Open unblock confirmation popup and set the selected user ID
  const handleUnblockPopupOpen = (id: string) => {
    setSelectedID(id)
    setIsUnblockPopupOpen(true) 
  }

  // Destructure pagination, sorting, and search values from a custom hook
  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  // Debounce the search input to avoid triggering API calls on every keystroke
  const debouncedSearchQuery = useDebounce(search, 650);
  
  // Fetch admin data based on current filters: page, pageSize, search key, and debounced search query
  const { admins, totalAdmins, metadata, isAdminsDataLoading } = useGetAllAdmins(
    Number(page) || 1, 
    Number(pageSize) || 5, 
    searchKey || "", 
    debouncedSearchQuery || ""
  );
  
  // Destructure delete function and loading state from custom admin management hook
  const {
    deleteAdmin,
    isDeleting,
  } = useManageAdmins();

  // Handle confirmation of admin deletion
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteAdmin(selectedID);               // Trigger delete action
    setIsDeletePopupOpen(false);          // Close the delete confirmation popup
  };

  // Destructure unblock function and loading state from custom account management hook
  const { mutate: unblockAccount, isPending: isUnblockAccountLoading } = useUnblockAccount();

  // Handle confirmation of unblocking a user account
  const handleConfirmUnblock = () => {
    if (!selectedID) return;
    unblockAccount(selectedID);           // Trigger unblock action
    setIsUnblockPopupOpen(false);         // Close the unblock confirmation popup
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      {/* Header component with dynamic translations for heading and subtitle */}
      <Header 
        heading={t("manageAdminsPage.header.heading", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
        subtitle={t("manageAdminsPage.header.subtitle", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
      />
      
      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* CountCard displaying the total number of admins */}
        <CountCard 
          title={t("manageAdminsPage.countCard.title", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          description={t("manageAdminsPage.countCard.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          count={formatValue(totalAdmins || 0, language)} // Format the number of admins
          icon={<Shield size={28} />}  // Shield icon
          bgColor="bg-[#b38e19]"  // Background color for the card
        />

        <HasPermission permission="Add Admin">
          {/* ActionCard with the option to add an admin */}
          <ActionCard
            icon={<ShieldPlus />}
            iconBgColor="bg-[#f5e4b2]"
            iconColor="text-[#b38e19]"
            title={t("manageAdminsPage.actions.add.title", { ns: ADMIN_TRANSLATION_NAMESPACE })}
            description={t("manageAdminsPage.actions.add.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          >
            {/* Link to the "Add Admin" page */}
            <NavLink to={"/admin/add-admin"}>
              <Button fullWidth={true} variant="secondary">
                {t("manageAdminsPage.actions.add.button", { ns: ADMIN_TRANSLATION_NAMESPACE })}
              </Button>
            </NavLink>
          </ActionCard>
        </HasPermission>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        {/* Section header with dynamic translations for title and description */}
        <SectionHeader 
          title={t("manageAdminsPage.sectionHeader.title", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
          description={t("manageAdminsPage.sectionHeader.description", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
        />

        <div className="flex flex-wrap gap-4">
          {/* Admin table filters */}
          <AdminTableFilters searchBy={metadata.searchBy} t={t} />
        </div>

        {/* Admin table with pagination */}
        <div className="w-full overflow-x-auto">
          <AdminsTable
            admins={admins} // Sorted list of admins
            isLoading={isAdminsDataLoading} // Loading state for the table
            handleDeleteAdmin={handleDeletePopupOpen} // Function to open delete confirmation popup
            handleUnblockAdmin={handleUnblockPopupOpen} // Function to open unblock confirmation popup
            t={t} // Translation function
          />
        </div>

        {/* Pagination component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isAdminsDataLoading} // Loading state for pagination
          onClickFirst={() => setFilters({ page: 1 })} // First page click handler
          onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })} // Previous page click handler
          onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })} // Next page click handler
        />
      </div>

      {/* Delete admin confirmation popup */}
      <DeleteAdminPopup
        isOpen={isDeletePopupOpen} // Popup open state
        handleClose={() => { setIsDeletePopupOpen(false) }} // Close the popup handler
        handleConfirmDelete={handleConfirmDelete} // Confirm delete handler
        isLoading={isDeleting} // Loading state for the delete action
        t={t} // Translation function
      />

      {/* Unblock admin confirmation popup */}
      <UnblockAdminPopup
        isOpen={isUnblockPopupOpen} // Popup open state
        handleClose={() => { setIsUnblockPopupOpen(false) }} // Close the popup handler
        handleConfirmUnblock={handleConfirmUnblock} // Confirm unblock handler
        isLoading={isUnblockAccountLoading} // Loading state for the unblock action
        t={t} // Translation function
      />
    </div>
  )
}

export default ManageAdminsPage