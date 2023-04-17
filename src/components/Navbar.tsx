import Link from "next/link";
import {
  AiFillSetting,
  AiFillPlusCircle,
  AiFillCalendar,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { MdSpaceDashboard } from "react-icons/md";

export default function Navbar({ focused }: { focused?: string }) {
  return (
    <div className="fixed bottom-0 flex w-screen justify-evenly rounded-t-lg bg-slate-300 pt-1">
      <Link href={"/dashboard"}>
        <MdSpaceDashboard
          size={"3rem"}
          className={focused == "dashboard" ? "fill-cyan-700" : ""}
        />
      </Link>
      <Link href={"/addevent"}>
        <AiFillPlusCircle
          size={"3rem"}
          className={focused == "addevent" ? "fill-cyan-700" : ""}
        />
      </Link>
      <Link href={"/list"}>
        <AiOutlineUnorderedList
          size={"3rem"}
          className={focused == "list" ? "fill-cyan-700" : ""}
        />
      </Link>
      <Link href={"/calender"}>
        <AiFillCalendar
          size={"3rem"}
          className={focused == "calender" ? "fill-cyan-700" : ""}
        />
      </Link>
      <Link href={"/settings"}>
        <AiFillSetting
          size={"3rem"}
          className={focused == "settings" ? "fill-cyan-700" : ""}
        />
      </Link>
    </div>
  );
}
