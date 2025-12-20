import { VscVscodeInsiders } from "react-icons/vsc";
import { HiOutlineCurrencyEuro } from "react-icons/hi";

export default function AppHeader() {
  return (
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold text-white"> <HiOutlineCurrencyEuro className="inline-block text-3xl text-amber-300 align-middle"  /> Get money Administration</div>
          <div className="text-4xl text-red-600"><VscVscodeInsiders /></div>
        </div>
      </header>  )
}
