import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Calendar, FilePlus2, RefreshCcw, ShieldCheck } from "lucide-react";

import { ActionCard, Button, Field, Header, Input, Label, LeaveRequestCard, Paginator, SectionHeader, SelectBox, Tooltip } from "../../../components/ui";
import ConditionsPopup from "./views/ConditionsPopup";

import { ILeaveRequestCredentials, ILeaveRequestData } from "../../../interfaces/leaveRequest.interfaces";
import AddLeaveRequestPopup from "./views/AddLeaveRequestPopup";
import RenderLeaveRequestInputs from "./views/RenderLeaveRequestInputs";
import { useCreateLeaveRequest, useGetLeaveRequestByID, useGetMyLeaveRequests, useUpdateLeaveRequest } from "../../../hooks/leaveRequest.hook";
import { yupResolver } from "@hookform/resolvers/yup";
import { leaveRequestSchema } from "../../../validation/leaveRequestSchema";
import EditLeaveRequestPopup from "./views/EditLeaveRequestPopup";
import ShowLeaveRequestPopup from "./views/ShowLeaveRequestPopup";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { LeaveRequestStatusType } from "../../../enums";

const LeaveRequests = () => {
  const {getParam, setParam, clearParams} = useURLSearchParams();

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

  
  // Now pass only meaningful values to the hook
  const { leaveRequests, metadata, isLeaveRequestsLoading } = useGetMyLeaveRequests();
  
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

        <div className="flex flex-wrap items-end gap-4">
          <Field className="flex flex-col space-y-2 w-fit">
            <Label>Page Size</Label>
            <SelectBox
              value={getParam('pageSize') ?? 5}
              onChange={(e) => setParam("pageSize", String(e.target.value ? parseInt(e.target.value) : 10))}
            >
              {[10, 20, 30, 40, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </SelectBox>
          </Field>

          <Field className="flex flex-col space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              icon={<Calendar />}
              value={getParam('startDate') ?? ""}
              onChange={(e) => setParam("startDate", e.target.value)}
            />
          </Field>

          <Field className="flex flex-col space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              icon={<Calendar />}
              value={getParam('endDate') ?? ""}
              onChange={(e) => setParam("endDate", e.target.value)}
            />
          </Field>

          <Field className="flex flex-col space-y-2">
            <Label>Leave Status</Label>
            <SelectBox
              onChange={(e) => setParam("status", e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select leave status</option>
              {Object.values(LeaveRequestStatusType)
                .filter((v) => typeof v === "number")
                .map((statusValue) => (
                  <option key={statusValue} value={statusValue}>
                    {LeaveRequestStatusType[statusValue as number]}
                  </option>
                ))}
            </SelectBox>
          </Field>
          
          <Tooltip content="Reset All">
            <Button onClick={() => clearParams()} icon={<RefreshCcw />} />
          </Tooltip>
        </div>

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
          onClickFirst={() => setParam("page", String(1))}
          onClickPrev={() => setParam("page", String(Math.max((Number(getParam('endDate')) || 1) - 1, 1)))}
          onClickNext={() => setParam("page", String(Math.min((Number(getParam('endDate')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
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
