type Props = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          px-4
          py-3
          rounded-lg
          bg-gray-900
          border
          border-gray-700
          text-white
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-white
          transition
        "
      />
    </div>
  );
}
