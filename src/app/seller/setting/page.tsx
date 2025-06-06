"use client"

import { useAuthSeller } from "../AuthContext"
import { FaUserCircle } from "react-icons/fa";
import { BsExclamationCircleFill } from "react-icons/bs";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { FormAddressSeller } from "@/app/seller-register/form/[userID]/components/FormAddressSeller";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/app/AuthContext";
import { fetchUpdateAddressSeller } from "./components/fetchUpdateAddressSeller";
import { CiEdit } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import { fetchUpdateEmail } from "./components/fetchUpdateEmail";
import { emailRegex, phoneRegex } from "@/app/helper/constant";
import { fetchUpdatePhone } from "./components/fetchUpdatePhone";



export default function Index() {
    const { accessToken } = useAuth()
    const { infoSeller, setInfoSeller } = useAuthSeller()
    const [valueEmail, setValueEmail] = useState('')
    const [valuePhone, setValuePhone] = useState('')
    const [valueAddress, setValueAddress] = useState<string | undefined>();
    const [checkUpdateAdd, setCheckUpdateAdd] = useState<boolean>(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
    useEffect(() => { }, [infoSeller])

    if (checkUpdateAdd) {
        if (accessToken && valueAddress && infoSeller) {
            fetchUpdateAddressSeller(
                accessToken,
                valueAddress,
                infoSeller?.data._id,
                setInfoSeller
            );
            setCheckUpdateAdd(false);
            setIsDialogOpen(false);
        }
    }
    const handleUpdateEmail = () => {
        if (valueEmail && !emailRegex.test(valueEmail)) {
            toast.error("Email không hợp lệ");
            return;
        }
        if (accessToken && valueEmail && infoSeller) {
            fetchUpdateEmail(
                accessToken,
                valueEmail,
                infoSeller?.data._id,
                setInfoSeller
            );
            setIsEmailDialogOpen(false)
        }
    }

    const handleUpdatePhone = () => {
        if (valuePhone && !phoneRegex.test(valuePhone)) {
            toast.error("Số điện thoại không hợp lệ");
            return;
        }
        if (accessToken && valuePhone && infoSeller) {
            fetchUpdatePhone(
                accessToken,
                valuePhone,
                infoSeller?.data._id,
                setInfoSeller
            );
            setIsPhoneDialogOpen(false)
        }
    }
    return (
        <div className="2xl:mx-52 xl:mx-40 lg:mx-32 sm:mx-20 bg-white rounded-2xl mt-10">
            <div className="p-10 flex ">
                <FaUserCircle className="w-60 h-60 text-neutral-400 " />
                <div className=" ml-10 w-full" >
                    <div className="text-xl font-medium  grid grid-cols-3" >
                        <span className=" col-span-1">Tên cửa hàng:</span>
                        <span className="text-3xl col-span-2">{infoSeller?.data.nameShop}</span>
                    </div>
                    <div className=" font-medium  grid grid-cols-3 mt-4" >
                        <span className="col-span-1">Email nhận hóa đơn:</span>
                        <div className="col-span-2 grid grid-cols-3">
                            <span className="col-span-2">{infoSeller?.data.emailToReceive}</span>
                            <Dialog open={isEmailDialogOpen} onOpenChange={(open) => {
                                setIsEmailDialogOpen(open)
                                if (!open) {
                                    toast.dismiss()
                                    setValueEmail('')
                                }
                            }}>
                                <DialogTrigger asChild >
                                    <span className="ml-2 text-2xl"><CiEdit title="chỉnh sửa" /></span>
                                </DialogTrigger>
                                <DialogContent className=" p-10" >
                                    <DialogHeader>
                                        <DialogTitle onClick={() => setIsEmailDialogOpen(true)}>Cập nhật thông tin</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-3">
                                        <span className="col-span-1">Email nhận hóa đơn:</span>
                                        <Input
                                            type="email"
                                            className="mt-0 col-span-2"
                                            value={valueEmail}
                                            onChange={(e) => setValueEmail(e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter className="">
                                        <DialogClose asChild>
                                            <Button type="button" className="bg-white text-black border hover:bg-neutral-100" >
                                                Hủy
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" onClick={handleUpdateEmail} className="ml-2 bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]">
                                            Cập nhật
                                        </Button>
                                    </DialogFooter>

                                </DialogContent>
                            </Dialog>
                        </div>
                        <ToastContainer />
                    </div>
                    <div className=" font-medium  grid grid-cols-3 mt-4" >
                        <span className="col-span-1">Địa chỉ lấy hàng:</span>
                        <div className="col-span-2 grid grid-cols-3">
                            <span className="col-span-2">{infoSeller?.data.address}</span>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild >
                                    <span className="ml-2 text-2xl"><CiEdit title="chỉnh sửa" /></span>
                                </DialogTrigger>
                                <DialogContent >
                                    <DialogHeader>
                                        <DialogTitle onClick={() => setIsDialogOpen(true)}>Cập nhật thông tin</DialogTitle>
                                    </DialogHeader>
                                    <FormAddressSeller setValueAddress={setValueAddress} setCheckUpdateAdd={setCheckUpdateAdd} />
                                    <DialogFooter className="absolute bottom-6 right-24 ">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary" className="bg-white text-black border hover:bg-neutral-100" >
                                                Hủy
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className=" font-medium  grid grid-cols-3 mt-4" >
                        <span className="col-span-1">Số điện thoại:</span>
                        <div className="col-span-2 grid grid-cols-3">
                            <span className="col-span-2">{infoSeller?.data.phoneNumber}</span>
                            <Dialog open={isPhoneDialogOpen} onOpenChange={(open) => {
                                setIsPhoneDialogOpen(open);
                                if (!open) {
                                    toast.dismiss()
                                    setValuePhone("");
                                }
                            }}>
                                <DialogTrigger asChild >
                                    <span className="ml-2 text-2xl"><CiEdit title="chỉnh sửa" /></span>
                                </DialogTrigger>
                                <DialogContent className=" p-10" >
                                    <DialogHeader>
                                        <DialogTitle onClick={() => setIsPhoneDialogOpen(true)}>Cập nhật thông tin</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-3">
                                        <span className="col-span-1">Số điện thoại:</span>
                                        <Input type="number" max={10} className="mt-0 col-span-2" value={valuePhone} onChange={(e) => setValuePhone(e.target.value)} />

                                    </div>
                                    <DialogFooter className="">
                                        <DialogClose asChild>
                                            <Button type="button" className="bg-white text-black border hover:bg-neutral-100" onClick={() => setValuePhone("")} >
                                                Hủy
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" onClick={handleUpdatePhone} className="ml-2 bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]">
                                            Cập nhật
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <ToastContainer />
                    </div>
                    <div className=" font-medium  grid grid-cols-3 mt-4" >
                        <span className="col-span-1">Mô hình kinh doanh:</span>
                        <span className="col-span-2">{infoSeller?.data.typeBusiness}</span>
                    </div>
                    <div className=" font-medium  grid grid-cols-3 mt-4" >
                        <span className="col-span-1">Mã số thuế:</span>
                        <span className="col-span-2 flex items-center">{infoSeller?.data.businessRegistrationCertificate.taxNumber} {!infoSeller?.data.businessRegistrationCertificate.isVerified && <BsExclamationCircleFill className="ml-2 text-red-500" title="Đang xác minh" /> }</span>
                    </div>
                </div>
            </div>
        </div >
    )
}