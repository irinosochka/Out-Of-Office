import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {IApprovalRequest} from "../models/IApprovalRequest";
import ApprovalRequestsTable from "../components/ApprovalRequests/ApprovalRequestsTable";

const ApprovalRequestsPage: React.FC = () => {
    const [approvalRequests, setApprovalRequests] = useState<IApprovalRequest[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get<IApprovalRequest[]>('http://localhost:8082/Lists/ApprovalRequests');
                console.log(response.data); // Check the structure and contents
                setApprovalRequests(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);


    return (
        <div>
            <ApprovalRequestsTable approvalRequests={approvalRequests} />
        </div>
    );
};

export default ApprovalRequestsPage;
