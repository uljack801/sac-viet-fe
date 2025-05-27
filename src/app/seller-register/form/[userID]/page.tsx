"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BsCircleFill } from "react-icons/bs";

const FormSchema = z.object({
    nameShop: z.string().min(2, {
        message: "Tên shop phải nhiều hơn 2 ký tự.",
    }).max(50, {
        message: "Tên shop phải ít hơn 50 ký tự.",
    }),
    email: z.string().email(),
    phone: z.string().regex(
        phoneRegex, "Số điện thoại không hợp lệ"
    ),
    type: z.enum(["individual", "business", "company"], {
        required_error: "You need to select a notification type.",
    }),
    emailToReceive: z.string().email(),
    taxNumber: z.string(),
    nameCompany: z.string().optional()
})
import { useAuth } from "@/app/AuthContext"
import { useEffect, useState } from "react"
import { NEXT_PUBLIC_LOCAL, phoneRegex } from "@/app/helper/constant"
import { FormAddressSeller } from "./components/FormAddressSeller"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

export default function FormRegisterSeller() {
    const { dataUser, accessToken } = useAuth();
    const [valueAddress, setValueAddress] = useState<string | undefined>("");
    const [valueAddressBusiness, setValueAddressBusiness] = useState<string | undefined>("");
    const [updateValueAddress, setUpdateValueAddress] = useState(false);
    const [updateValueAddressBusiness, setUpdateValueAddressBusiness] = useState(false);
    const [checkRegisterSeller, setCheckRegisterSeller] = useState(false);
    const [checkTax, setCheckTax] = useState(false);
    const route = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nameShop: "",
            email: "",
            phone: "",
            emailToReceive: "",
            taxNumber: "",
            nameCompany: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/register-seller`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                nameShop: data.nameShop,
                email: data.email,
                phoneNumber: data.phone,
                emailToReceive: data.emailToReceive,
                taxNumber: data.taxNumber,
                nameCompany: data.nameCompany,
                typeBusiness: data.type,
                address: valueAddress,
                addressRegisterBusiness: valueAddressBusiness

            }),
        })

        if (res.status === 200) {
            setCheckRegisterSeller(true)
        }


    }
    useEffect(() => {
        if (dataUser?.data.email) {
            form.setValue('email', dataUser.data.email);
            form.setValue('phone', dataUser.data.phoneNumber);
        }

    }, [dataUser, form]);

    useEffect(() => {
        if (valueAddress) {
            setUpdateValueAddress(true)
        }
    }, [valueAddress])

    useEffect(() => {
        if (valueAddressBusiness) {
            setUpdateValueAddressBusiness(true)
        }
    }, [valueAddressBusiness])

    const valueRadio = form.watch("type")

    return (
        <div className="flex justify-center items-center pt-4 ">
            <div className="flex flex-col justify-center items-center bg-white w-2/3 rounded-sm py-10">
                <div className="w-full  mb-10">
                    <div className="flex justify-around">
                    </div>
                    <div className="flex justify-around ">
                        <div className="flex flex-col items-center">
                        <p><BsCircleFill className={cn("text-orange-500", checkTax && "text-orange-500")} /></p>
                        <p>Thông tin Shop</p>
                        </div>
                        <div className="flex flex-col items-center">
                        <p><BsCircleFill className={cn(checkTax && "text-orange-500")} /></p>
                        <p>Thông tin Thuế</p>
                        </div>
                        <div className="flex flex-col items-center">
                        <p><BsCircleFill className={cn((checkTax && checkRegisterSeller) && "text-orange-500")} /></p>
                        <p>Hoàn tất</p>
                        </div>

                    </div>
                </div>
                {!checkRegisterSeller ?
                    (
                        !checkTax ?
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="relative pb-10 w-2/3 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="nameShop"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-3 items-center  ">
                                                    <FormLabel className="justify-end mr-2">Tên shop:</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nhập tên shop của bạn" {...field} className="col-span-2" />
                                                    </FormControl>
                                                </div>
                                                <FormDescription>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-3 items-center  ">
                                                    <FormLabel className="justify-end mr-2">Email:</FormLabel>
                                                    <FormControl>
                                                        <Input  {...field} className="col-span-2" disabled />
                                                    </FormControl>
                                                </div>
                                                <FormDescription>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-3 items-center  ">
                                                    <FormLabel className="justify-end mr-2">Số điện thoại:</FormLabel>
                                                    <FormControl>
                                                        <Input  {...field} className="col-span-2" />
                                                    </FormControl>
                                                </div>
                                                <FormDescription>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-3 items-center  ">
                                        <FormLabel className="justify-end mr-2">Địa chỉ lấy hàng:</FormLabel>
                                        {(valueAddress) ? (
                                            <div>
                                                <p className="whitespace-pre-line text-sm">{valueAddress}</p>
                                                <Dialog open={!updateValueAddress}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="text-blue-500 text-xs mt-2 cursor-pointer hover:text-blue-400" onClick={() => setUpdateValueAddress(false)}>chỉnh sửa</Button>
                                                    </DialogTrigger>
                                                    <DialogContent >
                                                        <DialogHeader>
                                                            <DialogTitle>Cập nhật địa chỉ</DialogTitle>
                                                        </DialogHeader>
                                                        <FormAddressSeller setValueAddress={setValueAddress} />
                                                        <DialogFooter className="absolute bottom-6 right-24 ">
                                                            <DialogClose asChild>
                                                                <Button type="button" variant="secondary" onClick={() => setUpdateValueAddress(true)}>
                                                                    Close
                                                                </Button>
                                                            </DialogClose>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )
                                            :
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">+ Thêm</Button>
                                                </DialogTrigger>
                                                <DialogContent >
                                                    <DialogHeader>
                                                        <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                                                    </DialogHeader>
                                                    <FormAddressSeller setValueAddress={setValueAddress} />
                                                    <DialogFooter className="absolute bottom-6 right-24 ">
                                                        <DialogClose asChild>
                                                            <Button type="button" variant="secondary">
                                                                Close
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        }

                                    </div>
                                    <Button className="absolute right-0 bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]" type="button" onClick={() => setCheckTax(true)} disabled={!updateValueAddress}>Tiếp theo</Button>
                                </form>
                            </Form> : <div className="relative w-2/3">
                                <div className="flex items-center justify-center ">
                                    <p className="text-xs mb-10 px-6 py-2 bg-blue-200 text-neutral-600 border rounded-sm border-blue-600">Việc thu thập Thông Tin Thuế và Thông Tin Định Danh là bắt buộc theo quy định của Luật an ninh mạng, Thương mại điện tử và Thuế của Việt Nam. Thông Tin Thuế và Thông Tin Định Danh sẽ được bảo vệ theo chính sách bảo mật của Sắc Việt. Người bán hoàn toàn chịu trách nhiệm về tính chính xác của thông tin.</p>
                                </div>
                                <div className=" items-center flex justify-center pb-10">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                                            <FormField
                                                control={form.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem className="flex  items-center justify-end space-y-3">
                                                        <FormLabel className="m-0 mr-12 ">Loại hình kinh doanh:</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                className="flex"
                                                            >
                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="individual" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        Cá nhân
                                                                    </FormLabel>
                                                                </FormItem>
                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="business" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        Hộ kinh doanh                    </FormLabel>
                                                                </FormItem>
                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="company" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">Công ty</FormLabel>
                                                                </FormItem>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {(valueRadio !== "individual") && <div>
                                                <FormField
                                                    control={form.control}
                                                    name="nameCompany"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid grid-cols-3 items-center ">
                                                                <FormLabel className="justify-end mr-2">Tên công ty:</FormLabel>
                                                                <FormControl>
                                                                    <Input  {...field} className="col-span-2" />
                                                                </FormControl>
                                                            </div>
                                                            <FormDescription>
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>}
                                            <div className="flex">
                                                <FormLabel className="justify-end mr-2">Địa chỉ đăng ký kinh doanh:</FormLabel>
                                                {valueAddressBusiness ? (
                                                    <div>
                                                        <p className="whitespace-pre-line text-sm">{valueAddressBusiness}</p>
                                                        <Dialog open={!updateValueAddressBusiness}>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" className="text-blue-500 text-xs mt-2 cursor-pointer hover:text-blue-400" onClick={() => setUpdateValueAddressBusiness(false)}>chỉnh sửa</Button>
                                                            </DialogTrigger>
                                                            <DialogContent >
                                                                <DialogHeader>
                                                                    <DialogTitle>Cập nhật địa chỉ</DialogTitle>
                                                                </DialogHeader>
                                                                <FormAddressSeller setValueAddress={setValueAddressBusiness} />
                                                                <DialogFooter className="absolute bottom-6 right-24 ">
                                                                    <DialogClose asChild>
                                                                        <Button type="button" variant="secondary" onClick={() => setUpdateValueAddressBusiness(true)}>
                                                                            Close
                                                                        </Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                )
                                                    :
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline">+ Thêm</Button>
                                                        </DialogTrigger>
                                                        <DialogContent >
                                                            <DialogHeader>
                                                                <DialogTitle>Thêm địa chỉ</DialogTitle>
                                                            </DialogHeader>
                                                            <FormAddressSeller setValueAddress={setValueAddressBusiness} />
                                                            <DialogFooter className="absolute bottom-6 right-24 ">
                                                                <DialogClose asChild>
                                                                    <Button type="button" variant="secondary">
                                                                        Close
                                                                    </Button>
                                                                </DialogClose>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                }
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="emailToReceive"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="grid grid-cols-3 items-center ">
                                                            <FormLabel className="justify-end mr-2">Email nhận hóa đơn điện tử:</FormLabel>
                                                            <FormControl>
                                                                <Input  {...field} className="col-span-2" />
                                                            </FormControl>
                                                        </div>
                                                        <FormDescription>
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="taxNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="grid grid-cols-3 items-center ">
                                                            <FormLabel className="justify-end mr-2">Mã số thuế:</FormLabel>
                                                            <FormControl>
                                                                <Input  {...field} className="col-span-2" />
                                                            </FormControl>
                                                        </div>
                                                        <FormDescription>
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="absolute bottom-0 right-0  flex">
                                                <Button type="button" className="bg-white hover:bg-neutral-50 text-black border mr-1" onClick={() => setCheckTax(false)} >Quay lại</Button>
                                                <Button type="submit" className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]" disabled={!updateValueAddressBusiness}>Tiếp theo</Button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                    ) :
                    <div className="px-20 flex text-center items-center flex-col">
                        <Button onClick={() => route.push('/')} className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] mb-10">Trang chủ</Button>
                        <h1 className="text-3xl font-bold text-center text-gray-800">Gửi yêu cầu thành công!</h1>
                        <p className="mt-6 text-center text-gray-700">
                            Cảm ơn bạn đã đăng ký trở thành Người bán trên <strong>Sắc Việt</strong>.
                            Hồ sơ của bạn đang được xem xét và chúng tôi sẽ phản hồi trong vòng <strong>1–2 ngày làm việc</strong>.Vui lòng kiểm tra email để cập nhật trạng thái xác minh.
                        </p>
                    </div>
                }

            </div>
        </div>
    )
}