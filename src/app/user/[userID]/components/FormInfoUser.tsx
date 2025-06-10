"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NEXT_PUBLIC_LOCAL, phoneRegex } from "@/app/helper/constant";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { ShowAlert } from "@/app/helper/ShowAlert";

const FormSchema = z.object({
  account: z.string(),
  email: z.string(),
  fullname: z.string().max(100, "Tên không hợp lệ!"),
  phoneNumber: z.string().regex(phoneRegex,
    "Số điện thoại không hợp lệ"
  ),
  gender: z.string(),
});

export function InputFormInfoUser() {
  const { dataUser, accessToken, setDataUser } = useAuth();
  const [valueDob, setValueDob] = useState<Dayjs | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [checkUpdate, setCheckUpdate] = useState(true);


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      account: "",
      email: "",
      fullname: "",
      phoneNumber: "",
      gender: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-info-user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fullname: data.fullname,
        phoneNumber: data.phoneNumber,
        dateOfBirth: valueDob,
        gender: data.gender,
      }),
    });
    if (res.status === 200) {
      const updatedUser = await res.json();
      setDataUser(updatedUser);
      setShowAlert(true);
      setCheckUpdate(true)
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  }
  useEffect(() => {
    if (dataUser) {
      const date = new Date(dataUser?.data.date_of_birth);
      if (date) {
        const dateValue: Dayjs = dayjs(date);
        setValueDob(dateValue);
      }
      form.reset({
        account: dataUser.data.account,
        email: dataUser.data.email,
        fullname: dataUser.data.fullname,
        phoneNumber: dataUser.data.phoneNumber,
        gender: dataUser.data.gender,
      });
    }
  }, [dataUser, checkUpdate ,form]);

  return (
    <div className="w-full max-xl:p-0 max-2xl:p-10 p-10">
      <p className="max-sm:text-xl flex justify-center py-4 font-medium max-lg:text-2xl max-xl:text-3xl text-3xl">Chỉnh sửa thông tin</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between max-sm:flex-col max-sm:px-10 gap-2 max-lg:px-6 max-xl:px-10">
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem className="w-1/2  max-sm:w-full">
                  <FormLabel>Tài khoản</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      readOnly
                      className="bg-gray-100 text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-1/2  max-sm:w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      readOnly
                      className="bg-gray-100 text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between mt-4 max-sm:flex-col max-sm:px-10 gap-2 max-lg:px-6 max-xl:px-10">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className="w-1/2  max-sm:w-full">
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập họ và tên"
                      {...field}
                      readOnly={checkUpdate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-1/2  max-sm:w-full">
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số điện thoại"
                      {...field}
                      readOnly={checkUpdate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-8 grid grid-cols-2 max-sm:px-10 gap-2 max-lg:px-6 max-xl:px-10">
            <div className="w-full">
              <div className="mr-2">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="vi"
                >
                  <DatePicker
                    label="Ngày sinh"
                    value={valueDob}
                    onChange={(newValue) => setValueDob(newValue)}
                    views={["year", "month", "day"]}
                    minDate={dayjs("1900-01-01")}
                    maxDate={dayjs()}
                    className="w-full"
                    readOnly={checkUpdate}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={checkUpdate}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={genderChoose(
                              dataUser?.data.gender
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent >
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="Female">Nữ</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end m-10">
           { !checkUpdate && <Button
              type="button"
              className="mr-2 bg-inherit text-black border hover:bg-inherit"
              onClick={() => {
                setCheckUpdate(true);
              }}
            >
              Hủy
            </Button>
          }
            {checkUpdate ? (
              <p
                className="bg-[#C95050] text-white hover:bg-[#c9505098] flex justify-center items-center px-3 py-2 rounded-sm"
                onClick={() => setCheckUpdate(false)}
              >
                Cập nhật
              </p>
            ) : (
              <Button
                className="bg-[#C95050] text-white hover:bg-[#c9505098]"
                type="submit"
              >
                Lưu
              </Button>
            )}
            {showAlert && ShowAlert("Cập nhật thành công!")}
          </div>
        </form>
      </Form>
    </div>
  );
}

export const genderChoose = (value: string | undefined) => {
  if (value === "male") {
    return <p>Nam</p>;
  } else if (value === "Female") {
    return <p>Nữ</p>;
  } else {
    return <p>Khác</p>;
  }
};
