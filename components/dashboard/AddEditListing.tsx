import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import AddEditListingForm from "@/components/dashboard/AddEditListingForm";

import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';

const selectionSet = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

interface AddEditListingProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    listing?: Listing
    setListing: (listing: Listing | undefined) => void
    setRefresh: (refresh: boolean) => void
}

function AddEditListing({isOpen, onOpenChange, onClose, listing, setListing, setRefresh}: AddEditListingProps) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={() => {
                setListing(undefined);
                onClose();
            }}
            scrollBehavior={"inside"}
            size={"2xl"}
        >
            <ModalContent>
                <ModalHeader className={"font-bold"}>{listing ? "Edit" : "Add"} Listing</ModalHeader>
                <ModalBody className={"pb-6 overflow-y-auto"}>
                    <AddEditListingForm listing={listing} onClose={onClose} setRefresh={setRefresh}/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AddEditListing;