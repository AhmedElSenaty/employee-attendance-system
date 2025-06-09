import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FilePlus2, ShieldCheck } from "lucide-react";

import { ActionCard, Button, Header, LeaveRequestCard, Paginator, SectionHeader } from "../../../components/ui";
import ConditionsPopup from "./views/ConditionsPopup";

import { ILeaveRequestCredentials, ILeaveRequestData } from "../../../interfaces/leaveRequest.interfaces";
import AddLeaveRequestPopup from "./views/AddLeaveRequestPopup";
import RenderLeaveRequestInputs from "./views/RenderLeaveRequestInputs";
import { useCreateLeaveRequest, useGetLeaveRequestByID, useGetMyLeaveRequests, useUpdateLeaveRequest } from "../../../hooks/leaveRequest.hook";
import { useFiltersHook } from "../../../hooks/filter.hook";
import { yupResolver } from "@hookform/resolvers/yup";
import { leaveRequestSchema } from "../../../validation/leaveRequestSchema";
import EditLeaveRequestPopup from "./views/EditLeaveRequestPopup";
import ShowLeaveRequestPopup from "./views/ShowLeaveRequestPopup";

const LeaveRequests = () => {

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isConditionsOpen, setIsConditionsOpen] = useState(false);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ILeaveRequestCredentials>({
    resolver: yupResolver(leaveRequestSchema),
    mode: "onChange"
  });  


  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true) 
  }
  const handleAddPopupOpen = () => {
    setSelectedID(0)
    reset({ date: "", description: "", type: 0 })
    setIsAddPopupOpen(true)
  }
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
  }
  const handleEditPopupClose = () => {
    setSelectedID(0)
    reset()
    setIsEditPopupOpen(false)
  }

  const { page, pageSize, startDate, endDate, setFilters } = useFiltersHook()

  const { leaveRequests, metadata, isLeaveRequestsLoading } = useGetMyLeaveRequests(page, pageSize, startDate, endDate)
  console.log(leaveRequests);
  
  const { leaveRequest, isLeaveRequestLoading } = useGetLeaveRequestByID(selectedID, reset);
  const { mutate: createLeaveRequest, isPending: isAdding } = useCreateLeaveRequest()
  const { mutate: updateLeaveRequest, isPending: isUpdating } = useUpdateLeaveRequest()

  const handleConfirmAdd: SubmitHandler<ILeaveRequestCredentials> = (request: ILeaveRequestCredentials) => {
    createLeaveRequest(request);
    setIsAddPopupOpen(false)
  };

  const handleConfirmUpdate: SubmitHandler<ILeaveRequestCredentials> = (request: ILeaveRequestCredentials) => {
    request.requestId = selectedID
    updateLeaveRequest(request)
    setIsEditPopupOpen(false);
  };

  return (
    <div className="sm:p-6 p-4 space-y-5">
      <Header
        heading="Leave Requests Management"
        subtitle="Submit a new leave request or review the conditions for morning/evening permit applications."
      />

      {/* Action Buttons Section */}
      <div className="max-w-[1000px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/2">
            <ActionCard
              icon={<FilePlus2 />}
              iconBgColor="bg-[#e0f7fa]"
              iconColor="text-[#00796b]"
              title="Add New Leave Request"
              description="Submit a request for personal, medical, or emergency leave."
            >
              <Button
                fullWidth
                variant="secondary"
                onClick={handleAddPopupOpen}
              >
                Create Request
              </Button>
            </ActionCard>
          </div>

          <div className="w-full md:w-1/2">
            <ActionCard
              icon={<ShieldCheck />}
              iconBgColor="bg-[#fff3e0]"
              iconColor="text-[#f57c00]"
              title="Permit Conditions"
              description="Read the requirements for applying for a morning or evening permit."
            >
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setIsConditionsOpen(true)}
              >
                View Conditions
              </Button>
            </ActionCard>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title="Employee Leave Requests" 
          description="View submitted leave requests with status, timing, and notes. Edit or manage them as needed." 
        />

          <div className="w-full flex flex-wrap gap-2 justify-self-auto ">
            {leaveRequests.map((request: ILeaveRequestData) => (
              <LeaveRequestCard key={request.id} data={request} handleEdit={handleEditPopupOpen} handleShow={handleShowPopupOpen} />
            ))}
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isLeaveRequestsLoading}
            onClickFirst={() => setFilters({ page: 1 })}
            onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
            onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
          />
        </div>

      {/* Conditions Popup */}
      <ConditionsPopup
        isOpen={isConditionsOpen}
        handleClose={() => setIsConditionsOpen(false)}
      />

      {/* Add Leave Request Popup */}
      <AddLeaveRequestPopup
        isOpen={isAddPopupOpen}
        handleClose={() => {
          setIsAddPopupOpen(false);
        }}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        formInputs={
          <RenderLeaveRequestInputs
            register={register}
            errors={errors}
            isLoading={isAdding}
          />
        }
        isLoading={isAdding}
      />
      <EditLeaveRequestPopup
        isOpen={isEditPopupOpen}
        handleClose={handleEditPopupClose}
        handleSubmit={handleSubmit(handleConfirmUpdate)}
        formInputs={
          <RenderLeaveRequestInputs
            register={register}
            errors={errors}
            isLoading={isUpdating}
          />
        }
        isLoading={isUpdating}
      />
      <ShowLeaveRequestPopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)} 
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID)
          setIsShowPopupOpen(false)
        }}
        leaveRequest={leaveRequest}
        isLoading={isLeaveRequestLoading}
      />
    </div>
  );
};

export default LeaveRequests;
