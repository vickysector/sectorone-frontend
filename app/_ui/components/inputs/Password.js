import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import clsx from "clsx";

export default function Password({
  showPassword,
  password,
  toggleShowPasswordVisibility,
  isPasswordFocused,
  passwordRequirement,
  onBlur,
  onFocus,
  onChange,
  hasTooltip,
}) {
  return (
    <>
      <input
        type={showPassword ? "text" : "password"}
        className=" w-full bg-input-container py-1.5 px-3 border-input-border border-2 rounded-lg text-Base-normal"
        placeholder="Password"
        value={password}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {hasTooltip && (
        <span
          className={clsx(
            " z-10  bg-white absolute top-[100%] left-0 shadow-lg w-[60%] p-3 rounded-md",
            isPasswordFocused ? "block" : "hidden",
            !passwordRequirement ? "block" : "hidden"
          )}
        >
          <h1 className="text-Base-strong text-black mb-2.5">
            Password requirements
          </h1>
          <p className="text-Base-normal text-black">
            Password must have 8 character or longer. At least one number or
            symbol (like !@#$%^)
          </p>
        </span>
      )}
      <EyeOutlined
        className={clsx(
          "absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer",
          !showPassword ? "hidden" : "block"
        )}
        style={{ color: "#00000040" }}
        onClick={toggleShowPasswordVisibility}
      />
      <EyeInvisibleOutlined
        className={clsx(
          "absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer",
          showPassword ? "hidden" : "block"
        )}
        style={{ color: "#00000040" }}
        onClick={toggleShowPasswordVisibility}
      />
    </>
  );
}
