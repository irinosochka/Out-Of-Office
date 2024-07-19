import React, { useState } from 'react';

import '../../styles/modalStyles.scss'

interface AddCommentModalProps {
    onClose: () => void;
    onSubmit: (comment: string) => void;
}

const AddCommentModal: React.FC<AddCommentModalProps> = ({ onClose, onSubmit }) => {
    const [comment, setComment] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onSubmit(comment.trim());
        } else {
            alert('Please add a comment explaining the rejection.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add comment explaining the rejection</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Comment</label>
                        <input
                            name="Comment"
                            type="text"
                            value={comment}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Submit Comment</button>
                </form>
            </div>
        </div>
    );
};

export default AddCommentModal;
