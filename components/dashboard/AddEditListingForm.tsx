"use client"
import {Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import Image from "next/image";
import Camera from "@/components/icons/Camera";
import React, {useRef, useState} from "react";
import SubmitButton from "@/components/auth/SubmitButton";
import {createListing, deleteListing, updateListing, updateListingImages} from "@/actions/zod/listings";
import {uploadData} from "@aws-amplify/storage";

import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';

const selectionSet = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

interface UploadResult {
    successful: { path: string }[];
    failed: { path: string; error: Error }[];
}

interface AddEditListingProps {
    listing?: Listing,
    onClose: () => void
    setRefresh: (refresh: boolean) => void
}

function AddEditListingForm({listing, onClose, setRefresh}: AddEditListingProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const [invalidInputs, setInvalidInputs] = useState<{
        [key: string]: string | string[]
    }>();

    async function uploadImages(listingId: string, images: File[]): Promise<UploadResult> {
        const results: UploadResult = {successful: [], failed: []};

        const uploadPromises = images.map(async (image, index) => {
            const extension = image.name.split(".").pop();
            const path = `listings/${listingId}/image${index}.${extension}`;

            try {
                uploadData({
                    data: image,
                    path,
                    options: {
                        contentType: image.type,
                    }
                });

                results.successful.push({
                    path
                });
            } catch (error) {
                results.failed.push({
                    path,
                    error: error as Error
                });
            }
        });

        await Promise.all(uploadPromises);
        return results;
    }

    async function formAction(formData: FormData) {
        try {
            const {
                listingId,
                error,
                success
            } = listing ? await updateListing(listing.id, formData) : await createListing(formData);

            if (!listingId || error || !success) {
                console.error("Error creating listing:", error);
                setInvalidInputs(error)
                return;
            }

            if (!images.length) {
                setRefresh(true);
                onClose();
                return;
            }

            const {successful} = await uploadImages(listingId, images);

            const {
                error: uploadError,
                success: uploadSuccess
            } = await updateListingImages(listingId, successful.map(({path}) => path));

            if (uploadError || !uploadSuccess) {
                console.error("Error updating listing images:", uploadError);
            }
            setRefresh(true);
            onClose();
        } catch (error) {
            console.error("Error creating listing:", error);
        }
    }

    return (
        <form
            className={"flex flex-col gap-4 w-full"} action={formAction} noValidate
        >
            <h2 className={"text-md font-bold"}>Property Information</h2>
            <div className={"flex flex-col lg:flex-row gap-4"}>
                <div className={"flex flex-col w-full h-full max-h-full gap-4"}>
                    <Input
                        id={"title"}
                        name={"title"}
                        label={"Title"}
                        placeholder={"Title"}
                        type={"text"}
                        defaultValue={listing ? listing.title : ""}
                        className={"w-full"}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                title: ""
                            });
                        }}
                        isInvalid={!!invalidInputs?.title}
                        errorMessage={invalidInputs?.title ? "Please enter a valid title" : ""}
                        required
                    />
                    <Textarea
                        id={"description"}
                        name={"description"}
                        autoComplete={"description"}
                        label={"Description"}
                        placeholder={"Description"}
                        defaultValue={listing ? listing.description as string : ""}
                        className={"w-full"}
                        classNames={{
                            base: "flex-1",
                            inputWrapper: "flex-1",
                        }}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                description: ""
                            });
                        }}
                        isInvalid={!!invalidInputs?.description}
                        errorMessage={invalidInputs?.description ? "Please enter a description" : ""}
                        required
                    />
                </div>
                <div className={"flex flex-col w-full h-full max-h-full gap-4"}>
                    <Select
                        id={"roofType"}
                        name={"roofType"}
                        label={"Roof Type"}
                        placeholder={"Roof Type"}
                        defaultSelectedKeys={listing ? new Set([listing.roofType]) : undefined}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                roofType: ""
                            });
                        }}
                        isInvalid={!!invalidInputs?.roofType}
                        errorMessage={invalidInputs?.roofType ? "Please enter a valid roof type" : ""}
                        required
                    >
                        <SelectItem key={"flat"} value={"flat"}>Flat</SelectItem>
                        <SelectItem key={"sloped"} value={"sloped"}>Sloped</SelectItem>
                        <SelectItem key={"pitched"} value={"pitched"}>Pitched</SelectItem>
                    </Select>
                    <Select
                        id={"projectType"}
                        name={"projectType"}
                        label={"Project Type"}
                        placeholder={"Project Type"}
                        defaultSelectedKeys={listing ? new Set([listing.projectType]) : undefined}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                projectType: ""
                            });
                        }}
                        isInvalid={!!invalidInputs?.projectType}
                        errorMessage={invalidInputs?.projectType ? "Please enter a valid project type" : ""}
                        required
                    >
                        <SelectItem key={"open"} value={"open"}>Open Space</SelectItem>
                        <SelectItem key={"roof"} value={"roof"}>Roof Space</SelectItem>
                    </Select>
                    <Autocomplete
                        id={"country"}
                        name={"country"}
                        autoComplete={"country"}
                        label={"Country"}
                        placeholder={"Country"}
                        defaultSelectedKey={listing ? listing.country : undefined}
                        type={"text"}
                        onSelectionChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                country: ""
                            });
                        }}
                        isInvalid={!!invalidInputs?.country}
                        errorMessage={invalidInputs?.country ? "Please enter a valid country" : ""}
                        required
                    >
                        <AutocompleteItem
                            key={"Germany"}
                            value={"Germany"}
                        >Germany</AutocompleteItem>
                        <AutocompleteItem
                            key={"France"}
                            value={"France"}
                        >France</AutocompleteItem>
                        <AutocompleteItem
                            key={"Italy"}
                            value={"Italy"}
                        >Italy</AutocompleteItem>
                        <AutocompleteItem
                            key={"Spain"}
                            value={"Spain"}
                        >Spain</AutocompleteItem>
                    </Autocomplete>
                    <Input
                        id={"street"}
                        name={"street"}
                        autoComplete={"street-address"}
                        label={"Street"}
                        placeholder={"Street"}
                        defaultValue={listing ? listing.street : ""}
                        type={"text"}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                street: ""
                            });
                        }}
                        isInvalid={!!invalidInputs?.street}
                        errorMessage={invalidInputs?.street ? "Please enter a valid street" : ""}
                        required
                    />
                    <div className={"flex flex-row gap-4"}>
                        <Input
                            id={"postalCode"}
                            name={"postalCode"}
                            autoComplete={"postal-code"}
                            label={"Zip"}
                            placeholder={"Zip"}
                            defaultValue={listing ? listing.postalCode : ""}
                            type={"text"}
                            onChange={() => {
                                setInvalidInputs({
                                    ...invalidInputs,
                                    postalCode: ""
                                });
                            }}
                            isInvalid={!!invalidInputs?.postalCode}
                            errorMessage={invalidInputs?.postalCode ? "Please enter a valid zip" : ""}
                            required
                        />
                        <Input
                            id={"city"}
                            name={"city"}
                            autoComplete={"address-level2"}
                            label={"City"}
                            placeholder={"City"}
                            defaultValue={listing ? listing.city : ""}
                            type={"text"}
                            className={"w-full"}
                            onChange={() => {
                                setInvalidInputs({
                                    ...invalidInputs,
                                    city: ""
                                });
                            }}
                            isInvalid={!!invalidInputs?.city}
                            errorMessage={invalidInputs?.city ? "Please enter a valid city" : ""}
                            required
                        />
                    </div>
                </div>
            </div>
            <h2 className={"text-md font-bold"}>Images</h2>
            <div className={"flex flex-row w-full gap-4"}>
                <Button
                    onClick={() => fileInput.current?.click()}
                    isIconOnly={true}
                    className={"bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 w-full h-52"}
                    startContent={
                        images[0] ?
                            <Image
                                fill={true}
                                src={URL.createObjectURL(images[0])}
                                alt={"Image"}
                                className={"object-cover w-full h-full"}
                            /> :
                            listing?.images?.[0] ?
                                <Image
                                    fill={true}
                                    src={listing.images[0] as string}
                                    alt={"Image"}
                                    className={"object-cover w-full h-full"}
                                /> :
                                <Camera
                                    className={"fill-zinc-500"} height={24} width={24}/>
                    }
                    color={"primary"}
                />
                <input
                    type={"file"}
                    accept={"image/*"}
                    ref={fileInput}
                    multiple={true}
                    className={"hidden"}
                    onChange={(event) => {
                        const files = event.target.files;
                        if (files) {
                            setImages(Array.from(files));
                        }
                    }}
                />
            </div>
            <div className={"flex flex-row gap-4 w-full"}>
                <SubmitButton className={"w-full"} name={listing ? "Save Changes" : "Add Listing"}/>
                {listing &&
                    <Button
                        className={"w-full font-bold text-danger shadow-sm"}
                        color={"danger"}
                        variant={"flat"}
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this listing?")) {
                                deleteListing(listing.id)
                                    .then(() => {
                                        setRefresh(true);
                                        onClose();
                                    })
                            }
                        }}
                    >
                        Delete Listing
                    </Button>}
            </div>
        </form>
    )
}

export default AddEditListingForm;