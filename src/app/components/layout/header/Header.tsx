"use client"
import { RiFacebookFill } from "react-icons/ri";
import { RiTiktokFill } from "react-icons/ri";
import { FiInstagram } from "react-icons/fi";
import { InfoUser } from "./InfoUser";
import { SidebarHeader } from "./SidebarHeader";


export const Header = () => {
  return (
    <div className="fixed w-full z-999 bg-[var(--color-background-main)] ">
      <div className="lg:mx-20 sm:mx-10 xl:mx-40">
        <div className="flex justify-between items-center text-[var(--color-text-root)]">
          <div className="flex ml-2 text-sm">
            <RiFacebookFill />
            <RiTiktokFill className="mx-2" />
            <FiInstagram />
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-root)]">
              Giao hàng toàn quốc, Freeship cho đơn hàng có giá trị trên
              3.000.000 VNĐ
            </p>
          </div>
          <InfoUser />
        </div>
      </div>
      <SidebarHeader />
      <hr />
    </div>
  );
};
