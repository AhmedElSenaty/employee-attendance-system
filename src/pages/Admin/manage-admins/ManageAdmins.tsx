import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CountCard, Header, ActionCard, Button, Paginator, SectionHeader, InfoPopup } from "../../../components/ui";
import { formatValue } from "../../../utils";
import { NavLink } from "react-router";
import { Shield, ShieldPlus } from "lucide-react";
import { HasPermission } from "../../../components/auth";
import { ADMIN_NS, EMPLOYEE_VIDEO } from "../../../constants";
import { useLanguageStore } from "../../../store";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useDebounce, useDeleteAdmin, useGetAllAdmins, useUnblockAccount } from "../../../hooks";
import { AdminsTable, DeletePopup, TableFilters, UnblockPopup } from "./views";

const ManageAdminsPage = () => {
  const { t } = useTranslation([ADMIN_NS]);
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


  // Fetch admin data based on current filters: page, pageSize, search key, and debounced search query
  const { admins, count, metadata, isAdminsDataLoading } = useGetAllAdmins(
    page, 
    pageSize, 
    searchKey, 
    searchQuery
  );
  
  // Destructure delete function and loading state from custom admin management hook
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

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
        heading={t("manageAdminsPage.header.heading")} 
        subtitle={t("manageAdminsPage.header.subtitle")} 
      />
      
      <div className="w-full flex items-center justify-center">
        <InfoPopup
          title={t("infoPopup.title")}
          description={t("infoPopup.description")}
          videoUrl={EMPLOYEE_VIDEO}
        />
      </div>

      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* CountCard displaying the total number of admins */}
        <CountCard 
          title={t("manageAdminsPage.countCard.title")}
          description={t("manageAdminsPage.countCard.description")}
          count={formatValue(count || 0, language)} // Format the number of admins
          icon={<Shield size={28} />}  // Shield icon
          bgColor="bg-[#b38e19]"  // Background color for the card
        />

        <HasPermission permission="Add Admin">
          {/* ActionCard with the option to add an admin */}
          <ActionCard
            icon={<ShieldPlus />}
            iconBgColor="bg-[#f5e4b2]"
            iconColor="text-[#b38e19]"
            title={t("manageAdminsPage.addActionCard.title")}
            description={t("manageAdminsPage.addActionCard.description")}
          >
            {/* Link to the "Add Admin" page */}
            <NavLink to={"/admin/add-admin"}>
              <Button fullWidth={true} variant="secondary">
                {t("manageAdminsPage.addActionCard.button")}
              </Button>
            </NavLink>
          </ActionCard>
        </HasPermission>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        {/* Section header with dynamic translations for title and description */}
        <SectionHeader 
          title={t("manageAdminsPage.sectionHeader.title")} 
          description={t("manageAdminsPage.sectionHeader.description")} 
        />

        <TableFilters searchBy={metadata?.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />

        {/* Admin table with pagination */}
        <div className="w-full overflow-x-auto">
          <AdminsTable
            admins={admins} // Sorted list of admins
            isLoading={isAdminsDataLoading} // Loading state for the table
            handleDelete={handleDeletePopupOpen} // Function to open delete confirmation popup
            handleUnblock={handleUnblockPopupOpen} // Function to open unblock confirmation popup
          />
        </div>

        {/* Pagination component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isAdminsDataLoading}
          onClickFirst={() => setParam("page", String(1))}
          onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
          onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
        />
      </div>

      {/* Delete admin confirmation popup */}
      <DeletePopup
        isOpen={isDeletePopupOpen} // Popup open state
        handleClose={() => { setIsDeletePopupOpen(false) }} // Close the popup handler
        handleConfirmDelete={handleConfirmDelete} // Confirm delete handler
        isLoading={isDeleting} // Loading state for the delete action
      />

      {/* Unblock admin confirmation popup */}
      <UnblockPopup
        isOpen={isUnblockPopupOpen} // Popup open state
        handleClose={() => { setIsUnblockPopupOpen(false) }} // Close the popup handler
        handleConfirmUnblock={handleConfirmUnblock} // Confirm unblock handler
        isLoading={isUnblockAccountLoading} // Loading state for the unblock action
      />
    </div>
  )
}

export default ManageAdminsPage