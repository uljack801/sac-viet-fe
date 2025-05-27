"use client"
import { IoSearch } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";

const FormSchema = z.object({
    valueSearch: z.string().min(2),
}) 

export function InputSearch() {
    const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      valueSearch: "",
      
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
       router.push(`/search?search=${encodeURIComponent(data.valueSearch)}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">
        <FormField 
          control={form.control}
          name="valueSearch"
          render={({ field }) => (
            <FormItem>
              <FormControl >
                <Input placeholder="Bạn đang tìm kiếm sản phẩm nào ?" {...field} className="2xl:w-80 " />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="absolute top-0 right-0 bg-inherit hover:bg-inherit shadow-none" type="submit" ><IoSearch className="text-[var(--color-text-root)] "/></Button>
      </form>
    </Form>
  )
}
