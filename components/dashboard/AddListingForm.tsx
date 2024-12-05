"use client"
import {Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import Image from "next/image";
import Camera from "@/components/icons/Camera";
import React, {useRef, useState} from "react";
import SubmitButton from "@/components/auth/SubmitButton";
import {createListing, updateListingImages} from "@/actions/zod/listings";
import {uploadData} from "@aws-amplify/storage";

interface UploadResult {
    successful: { path: string }[];
    failed: { path: string; error: Error }[];
}

function AddListingForm() {
    const fileInput = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const [invalidInputs, setInvalidInputs] = useState<{
        [key: string]: boolean
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
            const {listingId, error, success} = await createListing(formData);

            if (!listingId || error || !success) {
                console.error("Error creating listing:", error);
                return;
            }

            if (!images.length) {
                return;
            }

            const {successful} = await uploadImages(listingId, images);

            const {error: uploadError, success: uploadSuccess} = await updateListingImages(listingId, successful.map(({path}) => path));

            if (uploadError || !uploadSuccess) {
                console.error("Error updating listing images:", uploadError);
            }
        } catch (error) {
            console.error("Error creating listing:", error);
        }
    }

    return (
        <form
            className={"flex flex-col gap-4 w-full"} action={formAction}
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
                        className={"w-full"}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                name: false
                            });
                        }}
                        isInvalid={invalidInputs?.name}
                        errorMessage={invalidInputs?.name ? "Please enter a valid name" : ""}
                        required
                    />
                    <Textarea
                        id={"description"}
                        name={"description"}
                        autoComplete={"description"}
                        label={"Description"}
                        placeholder={"Description"}
                        className={"w-full"}
                        classNames={{
                            base: "flex-1",
                            inputWrapper: "flex-1",
                        }}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                description: false
                            });
                        }}
                        isInvalid={invalidInputs?.description}
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
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                roofType: false
                            });
                        }}
                        isInvalid={invalidInputs?.roofType}
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
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                projectType: false
                            });
                        }}
                        isInvalid={invalidInputs?.projectType}
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
                        type={"text"}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                country: false
                            });
                        }}
                        isInvalid={invalidInputs?.country}
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
                        type={"text"}
                        onChange={() => {
                            setInvalidInputs({
                                ...invalidInputs,
                                street: false
                            });
                        }}
                        isInvalid={invalidInputs?.street}
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
                            type={"text"}
                            onChange={() => {
                                setInvalidInputs({
                                    ...invalidInputs,
                                    postalCode: false
                                });
                            }}
                            isInvalid={invalidInputs?.postalCode}
                            errorMessage={invalidInputs?.postalCode ? "Please enter a valid zip" : ""}
                            required
                        />
                        <Input
                            id={"city"}
                            name={"city"}
                            autoComplete={"address-level2"}
                            label={"City"}
                            placeholder={"City"}
                            type={"text"}
                            className={"w-full"}
                            onChange={() => {
                                setInvalidInputs({
                                    ...invalidInputs,
                                    city: false
                                });
                            }}
                            isInvalid={invalidInputs?.city}
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
            <SubmitButton name={"Add Listing"}/>
        </form>
    )
}

export default AddListingForm;