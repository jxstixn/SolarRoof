import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import AddListingForm from "@/components/dashboard/AddListingForm";

interface AddListingProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}

function AddListing({isOpen, onOpenChange, onClose}: AddListingProps) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"2xl"}
        >
            <ModalContent>
                <ModalHeader className={"font-bold"}>Add Listing</ModalHeader>
                <ModalBody className={"pb-6 overflow-y-auto"}>
                    <AddListingForm/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AddListing;