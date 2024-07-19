import React, { useState } from 'react';
import {IApprovalRequest} from "../../models/IApprovalRequest";

interface UpdateLeaveRequestFormProps {
    approvalRequest: IApprovalRequest;
    onClose: () => void;
    handleUpdateApprovalRequest: (updatedRequest: IApprovalRequest) => void;
}

const AddCommentModal: React.FC<UpdateLeaveRequestFormProps> = ({
                                                                    approvalRequest,
                                                                    onClose,
                                                                    handleUpdateApprovalRequest
                                                                }) => {
    const [formState, setFormState] = useState<IApprovalRequest>(approvalRequest);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formState.Comment != '') {
                const updatedProject: IApprovalRequest = {...formState, Status: 'Rejected' };
                await handleUpdateApprovalRequest(updatedProject);
            }
            else {
                alert('Add comment explaining that rejection should be possible.');
                return;
            }
        } catch (error) {
            console.error('Error updating approval request:', error);
        }
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add comment explaining about rejection</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Comment</label>
                        <input
                            name="Comment"
                            value={formState.Comment}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Add Comment</button>
                </form>
            </div>
        </div>
    );
};

export default AddCommentModal;
