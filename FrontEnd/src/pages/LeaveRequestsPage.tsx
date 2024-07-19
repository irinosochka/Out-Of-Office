// import React, { useEffect, useState } from 'react';
// import {ILeaveRequest} from "../models/ILeaveRequest";
// import LeaveRequestsTable from "../components/LeaveRequests/LeaveRequestsTable";
// import AddLeaveRequestForm from "../components/LeaveRequests/AddLeaveRequestForm";
// import LeaveRequestModal from "../components/LeaveRequests/LeaveRequestModal";
// import {useRole} from "../context/RoleContext";
// import moment from "moment";
// import {deleteLeaveRequest, getLeaveRequests, updateLeaveRequest} from "../api/LeaveRequestApi";
// import UpdateLeaveRequestForm from "../components/LeaveRequests/UpdateLeaveRequestForm";
// import {IApprovalRequest} from "../models/IApprovalRequest";
// import {addApprovalRequest} from "../api/ApprovalRequestApi";
// import {getEmployeeById} from "../api/EmployeeApi";
//
// const LeaveRequestsPage: React.FC = () => {
//     const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
//     const [showAddingForm, setShowAddingForm] = useState<boolean>(false);
//     const [editingLeaveRequest, setEditingLeaveRequest] = useState<ILeaveRequest | null>(null);
//     const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<ILeaveRequest | null>(null);
//
//     const {selectedRole} = useRole();
//
//     const isEmp = () => selectedRole === 'Employee';
//
//     useEffect(() => {
//         const fetchLeaveRequests = async () => {
//             try {
//                 const response = await getLeaveRequests();
//                 setLeaveRequests(response.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//
//         fetchLeaveRequests();
//     }, []);
//
//     const handleCloseAdding = () => {
//         setShowAddingForm(false);
//     };
//
//     const handleAddLeaveRequest = async () => {
//         try {
//             const response = await getLeaveRequests();
//             setLeaveRequests(response.data);
//         } catch (error) {
//             console.error('Error fetching updated leave requests list:', error);
//         }
//     };
//
//     const handleDeleteLeaveRequest = async (deletedRequest: ILeaveRequest) => {
//         if(deletedRequest.Status != 'Approved') {
//             try {
//                 const deleteResponse = await deleteLeaveRequest(deletedRequest.ID);
//                 if (deleteResponse.status === 200) {
//                     setLeaveRequests((prevRequests) =>
//                         prevRequests.filter((req) => req.ID !== deletedRequest.ID)
//                     );
//                 } else {
//                     console.error("Failed to delete leave request, status:", deleteResponse.status);
//                 }
//             } catch (error) {
//                 console.error("Failed to delete leave request:", error);
//             }
//         }else {
//             alert('You cannot delete approved request.')
//         }
//     };
//
//     const handleEditLeaveRequest = (request: ILeaveRequest) => {
//         setEditingLeaveRequest(request);
//     };
//
//     const handleUpdateLeaveRequest = async (updatedRequest: ILeaveRequest) => {
//         const formattedRequest = {
//             ...updatedRequest,
//             StartDate: moment(updatedRequest.StartDate).format('YYYY-MM-DD'),
//             EndDate: moment(updatedRequest.EndDate).format('YYYY-MM-DD'),
//         };
//
//         try {
//             const response = await updateLeaveRequest(formattedRequest);
//             if (response.status === 200) {
//                 setLeaveRequests((prevRequests) =>
//                     prevRequests.map((req) => (req.ID === updatedRequest.ID ? response.data : req))
//                 );
//             } else {
//                 console.error("Failed to update leave request, status:", response.status);
//             }
//         } catch (error) {
//             console.error("Failed to update leave request:", error);
//         }
//         setEditingLeaveRequest(null);
//     };
//
//     const handleStatusChange = async (request: ILeaveRequest, updatedStatus : 'Submitted' | 'Canceled') => {
//         const updatedProject: ILeaveRequest = { ...request, Status: updatedStatus };
//         await handleUpdateLeaveRequest(updatedProject);
//         if(updatedStatus === 'Submitted')
//             await createApprovalRequest(request);
//     };
//
//     const createApprovalRequest = async (request: ILeaveRequest) => {
//         try {
//             const response = await getEmployeeById(request.EmployeeID);
//             const employee = response.data;
//             const HRManagerID = employee.PeoplePartner;
//
//             try {
//                 const approvalRequest : Omit<IApprovalRequest, 'ID'> = {
//                     Approver: HRManagerID,
//                     LeaveRequestID: request.ID,
//                     Status: 'New'
//                 }
//                 await addApprovalRequest(approvalRequest);
//                 console.log('Approval Request created successfully')
//             } catch (error) {
//                 console.error('Error adding data:', error);
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };
//
//
//     return (
//         <>
//             <LeaveRequestsTable
//                 leaveRequests={leaveRequests}
//                 isEmp={isEmp()}
//                 setShowAddingForm={setShowAddingForm}
//                 setSelectedRequest={setSelectedLeaveRequest}
//                 handleEditRequest={handleEditLeaveRequest}
//                 handleStatusChange={handleStatusChange}
//                 handleDeleteRequest={handleDeleteLeaveRequest}
//             />
//             {showAddingForm && (
//                 <AddLeaveRequestForm
//                     onSubmit={handleAddLeaveRequest}
//                     onClose={() => handleCloseAdding()}
//                 />
//             )}
//             {selectedLeaveRequest && (
//                 <LeaveRequestModal
//                     onClose={() => setSelectedLeaveRequest(null)}
//                     leaveRequest={selectedLeaveRequest}
//                 />
//             )}
//             {editingLeaveRequest && (
//                 <UpdateLeaveRequestForm
//                     leaveRequest={editingLeaveRequest}
//                     onSubmit={handleUpdateLeaveRequest}
//                     onClose={() => setEditingLeaveRequest(null)}
//                 />
//             )}
//         </>
//     );
// };
//
// export default LeaveRequestsPage;
import React, { useEffect, useState } from 'react';
import { ILeaveRequest } from "../models/ILeaveRequest";
import LeaveRequestsTable from "../components/LeaveRequests/LeaveRequestsTable";
import AddLeaveRequestForm from "../components/LeaveRequests/AddLeaveRequestForm";
import LeaveRequestModal from "../components/LeaveRequests/LeaveRequestModal";
import { useRole } from "../context/RoleContext";
import moment from "moment";
import { deleteLeaveRequest, getLeaveRequests, updateLeaveRequest } from "../api/LeaveRequestApi";
import UpdateLeaveRequestForm from "../components/LeaveRequests/UpdateLeaveRequestForm";
import { IApprovalRequest } from "../models/IApprovalRequest";
import { addApprovalRequest, updateApprovalRequest, getApprovalRequests } from "../api/ApprovalRequestApi";
import { getEmployeeById } from "../api/EmployeeApi";

const LeaveRequestsPage: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
    const [showAddingForm, setShowAddingForm] = useState<boolean>(false);
    const [editingLeaveRequest, setEditingLeaveRequest] = useState<ILeaveRequest | null>(null);
    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<ILeaveRequest | null>(null);

    const { selectedRole } = useRole();

    const isEmp = () => selectedRole === 'Employee';

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await getLeaveRequests();
                setLeaveRequests(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchLeaveRequests();
    }, []);

    const handleCloseAdding = () => {
        setShowAddingForm(false);
    };

    const handleAddLeaveRequest = async () => {
        try {
            const response = await getLeaveRequests();
            setLeaveRequests(response.data);
        } catch (error) {
            console.error('Error fetching updated leave requests list:', error);
        }
    };

    const handleDeleteLeaveRequest = async (deletedRequest: ILeaveRequest) => {
        if (deletedRequest.Status !== 'Approved') {
            try {
                const deleteResponse = await deleteLeaveRequest(deletedRequest.ID);
                if (deleteResponse.status === 200) {
                    setLeaveRequests((prevRequests) =>
                        prevRequests.filter((req) => req.ID !== deletedRequest.ID)
                    );
                } else {
                    console.error("Failed to delete leave request, status:", deleteResponse.status);
                }
            } catch (error) {
                console.error("Failed to delete leave request:", error);
            }
        } else {
            alert('You cannot delete approved request.');
        }
    };

    const handleEditLeaveRequest = (request: ILeaveRequest) => {
        setEditingLeaveRequest(request);
    };

    const handleUpdateLeaveRequest = async (updatedRequest: ILeaveRequest) => {
        const formattedRequest = {
            ...updatedRequest,
            StartDate: moment(updatedRequest.StartDate).format('YYYY-MM-DD'),
            EndDate: moment(updatedRequest.EndDate).format('YYYY-MM-DD'),
        };

        try {
            const response = await updateLeaveRequest(formattedRequest);
            if (response.status === 200) {
                setLeaveRequests((prevRequests) =>
                    prevRequests.map((req) => (req.ID === updatedRequest.ID ? response.data : req))
                );
            } else {
                console.error("Failed to update leave request, status:", response.status);
            }
        } catch (error) {
            console.error("Failed to update leave request:", error);
        }
        setEditingLeaveRequest(null);
    };

    const handleStatusChange = async (request: ILeaveRequest, updatedStatus: 'Submitted' | 'Canceled') => {
        const updatedRequest: ILeaveRequest = { ...request, Status: updatedStatus };
        await handleUpdateLeaveRequest(updatedRequest);
        if (updatedStatus === 'Submitted') {
            await createApprovalRequest(request);
        } else if (updatedStatus === 'Canceled' && request.Status === 'Submitted') {
            await updateApprovalRequestStatus(request.ID, 'Canceled');
        }
    };

    const createApprovalRequest = async (request: ILeaveRequest) => {
        try {
            const response = await getEmployeeById(request.EmployeeID);
            const employee = response.data;
            const HRManagerID = employee.PeoplePartner;

            try {
                const approvalRequest: Omit<IApprovalRequest, 'ID'> = {
                    Approver: HRManagerID,
                    LeaveRequestID: request.ID,
                    Status: 'New',
                };
                await addApprovalRequest(approvalRequest);
                console.log('Approval Request created successfully');
            } catch (error) {
                console.error('Error adding data:', error);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updateApprovalRequestStatus = async (leaveRequestID: number, newStatus: 'Canceled') => {
        try {
            const response = await getApprovalRequests();
            const approvalRequests = response.data;

            const approvalRequest = approvalRequests.find(req => req.LeaveRequestID === leaveRequestID);

            if (approvalRequest) {
                const updatedApprovalRequest: IApprovalRequest = {
                    ...approvalRequest,
                    Status: newStatus,
                };

                try {
                    await updateApprovalRequest(updatedApprovalRequest);
                    console.log('Approval request status updated successfully');
                } catch (error) {
                    console.error('Error updating approval request status:', error);
                }
            } else {
                console.error('No approval requests found for the given leave request ID');
            }
        } catch (error) {
            console.error('Error fetching approval requests:', error);
        }
    };

    return (
        <>
            <LeaveRequestsTable
                leaveRequests={leaveRequests}
                isEmp={isEmp()}
                setShowAddingForm={setShowAddingForm}
                setSelectedRequest={setSelectedLeaveRequest}
                handleEditRequest={handleEditLeaveRequest}
                handleStatusChange={handleStatusChange}
                handleDeleteRequest={handleDeleteLeaveRequest}
            />
            {showAddingForm && (
                <AddLeaveRequestForm
                    onSubmit={handleAddLeaveRequest}
                    onClose={() => handleCloseAdding()}
                />
            )}
            {selectedLeaveRequest && (
                <LeaveRequestModal
                    onClose={() => setSelectedLeaveRequest(null)}
                    leaveRequest={selectedLeaveRequest}
                />
            )}
            {editingLeaveRequest && (
                <UpdateLeaveRequestForm
                    leaveRequest={editingLeaveRequest}
                    onSubmit={handleUpdateLeaveRequest}
                    onClose={() => setEditingLeaveRequest(null)}
                />
            )}
        </>
    );
};

export default LeaveRequestsPage;
