import { HiEmojiHappy } from "react-icons/hi";
import { MdAccessibleForward } from "react-icons/md";
import { MdDirectionsRun } from "react-icons/md";


const Devs = ({ icon }) => {
  return (
    <>
      <div className="devs">
        <MdAccessibleForward  className="devsIcon" />
        <p className="devsTitle">FrontEnd Dev</p>
        <p className="devsDescription">
        FrontEnd был написан Сапаргалиевым Бектасом
        </p>
      </div>
      <div className="devs">
        <MdDirectionsRun className="devsIcon" />
        <p className="devsTitle">BackEnd Dev</p>
        <p className="devsDescription">
          BackEnd был написан Уразовым Диасом.
        </p>
      </div>
      <div className="devs">
        <HiEmojiHappy  className="devsIcon" />
        <p className="devsTitle">Прочее</p>
        <p className="devsDescription">
          Данный сайт был написан при поддержке AIU.
        </p>
      </div>
    </>
  );
};

export default Devs;
