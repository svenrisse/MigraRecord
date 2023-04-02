import Link from "next/link";
import {
  AiFillSetting,
  AiFillPlusCircle,
  AiFillCalendar,
  AiOutlineUnorderedList,
} from "react-icons/ai";

export default function Navbar() {
  return (
    <div className="fixed bottom-0 flex w-screen justify-evenly">
      <AiFillPlusCircle size={"3rem"} />
      <AiOutlineUnorderedList size={"3rem"} />
      <AiFillCalendar size={"3rem"} />
      <Link href={"/settings"}>
        <AiFillSetting size={"3rem"} />
      </Link>
    </div>
  );
}
