import { SelectFormAddress } from "./address/SelectAddress";
import { FormUpdateAddress } from "./FormUpdateAddress";

export function ListAddress() {
  return (
    <div className="2xl:min-h-96 xl:min-h-80">
      <p className="text-2xl mb-4 font-medium">Danh sách địa chỉ </p>
        <SelectFormAddress />
        <div className="h-32 mt-10">
        <FormUpdateAddress />
        </div>
    </div>
  );
}
