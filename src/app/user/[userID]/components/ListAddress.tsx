import { SelectFormAddress } from "./address/SelectAddress";
import { FormUpdateAddress } from "./FormUpdateAddress";

export function ListAddress() {
  return (
    <div className="max-sm:p-10 max-lg:p-10 max-xl:p-20 max-2xl:p-20 p-20">
      <p className="mb-4 font-medium text-center max-lg:text-xl max-xl:text-3xl text-3xl">Danh sách địa chỉ </p>
        <SelectFormAddress />
        <div className="mt-10 flex justify-end">
        <FormUpdateAddress />
        </div>
    </div>
  );
}
