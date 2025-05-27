import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export const ShowPassword = ({showPassword , setShowPassword}: {showPassword: boolean, setShowPassword: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div>
      {showPassword ? (
        <IoEyeOutline
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <IoEyeOffOutline
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setShowPassword(true)}
        />
      )}
    </div>
  );
};
