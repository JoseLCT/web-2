import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

function ToastComponent() {
    const [showToast, setShowToast] = useState(false);

    const toggleShowToast = () => setShowToast(!showToast);

    return (
        <Toast show={showToast} onClose={toggleShowToast}>
            <Toast.Header>
                <strong className="mr-auto">Bootstrap</strong>
            </Toast.Header>
            <Toast.Body>See? Just like this.</Toast.Body>
        </Toast>
    );
}

export default ToastComponent;
