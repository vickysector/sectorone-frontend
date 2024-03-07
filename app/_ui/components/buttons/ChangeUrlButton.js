export default function ChangeUrlButton({ children }) {
  return (
    <button className="py-2 px-4 bg-input-container border-input-border border-2 rounded-lg text-LG-normal text-primary-base cursor-pointer">
      {children}
    </button>
  );
}
