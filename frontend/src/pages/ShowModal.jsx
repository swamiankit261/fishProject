import ReactDOM from 'react-dom'
import { useEffect } from "react";


function ShowModal({ sModal, children, handleCloseButton }) {

    useEffect(() => {
        document.body.style.overflowY = 'hidden';
        return () => { document.body.style.overflowY = 'scroll' }
    }, [])

    return ReactDOM.createPortal(
        <>
            <div className="madal-wrapper fixed top-0 right-0 bottom-0 left-0 bg-[#80808079]" onClick={sModal}></div>
            <div className="modal-container overflow-y-scroll max-h-96 w-full sm:w-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50">
                {children}
                {handleCloseButton}
            </div>
        </>,
        document.getElementById('myPortalModalDiv')
    )
}

export default ShowModal;