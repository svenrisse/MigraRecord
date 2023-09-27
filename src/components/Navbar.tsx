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
    <div className="btm-nav">
      <button
        className={`${
          focused === "dashboard" && "active border-t-2"
        }  bg-base-100 text-primary`}
      >
        <Link href={"/dashboard"}>
          <MdSpaceDashboard size={"3rem"} />
        </Link>
      </button>
      <button
        className={`${
          focused === "addevent" && "active border-t-2"
        }  bg-base-100 text-primary`}
      >
        <Link href={"/addevent"}>
          <AiFillPlusCircle size={"3rem"} />
        </Link>
      </button>
      <button
        className={`${
          focused === "list" && "active border-t-2"
        }  bg-base-100 text-primary`}
      >
        <Link href={"/list"}>
          <AiOutlineUnorderedList size={"3rem"} />
        </Link>
      </button>
      <button
        className={`${
          focused === "calender" && "active border-t-2"
        }  bg-base-100 text-primary`}
      >
        <Link href={"/calender"}>
          <AiFillCalendar size={"3rem"} />
        </Link>
      </button>
      <button
        className={`${
          focused === "settings" && "active border-t-2"
        }  bg-base-100 text-primary`}
      >
        <Link href={"/settings"}>
          <AiFillSetting size={"3rem"} />
        </Link>
      </button>
    </div>
  );
}
