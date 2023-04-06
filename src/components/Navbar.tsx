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
    <div className="fixed bottom-0 flex w-screen justify-evenly">
      <Link href={"/dashboard"}>
        <MdSpaceDashboard
          size={"3rem"}
          className={focused == "dashboard" ? "fill-green-300" : ""}
        />
      </Link>
      <Link href={"/addevent"}>
        <AiFillPlusCircle size={"3rem"} />
      </Link>
      <Link href={"/list"}>
        <AiOutlineUnorderedList size={"3rem"} />
      </Link>
      <Link href={"/calender"}>
        <AiFillCalendar size={"3rem"} />
      </Link>
      <Link href={"/settings"}>
        <AiFillSetting size={"3rem"} />
      </Link>
    </div>
  );
}
