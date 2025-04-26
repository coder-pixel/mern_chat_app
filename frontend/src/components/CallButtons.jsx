import {
  BsFillCameraVideoFill,
  BsFillTelephoneFill,
  BsFillTelephoneXFill,
} from "react-icons/bs";

const CallButtons = ({
  type = "call",
  callAccepted = undefined,
  onClickHandler,
  title = "",
}) => {
  const _renderBtnType = () => {
    switch (type) {
      case "call": {
        return (
          <button
            onClick={onClickHandler}
            disabled={callAccepted}
            className="p-2 cursor-pointer rounded-full hover:bg-slate-600 transition-colors duration-200"
            title={title || "Start Video Call"}
          >
            <BsFillCameraVideoFill className="text-white text-xl" />
          </button>
        );
      }

      case "disconnectCall": {
        return (
          <button
            onClick={onClickHandler}
            className="p-2 cursor-pointer rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200"
            title={title || "End Call"}
          >
            <BsFillTelephoneXFill className="text-white text-xl" />
          </button>
        );
      }

      case "receivingCall": {
        return (
          <button
            onClick={onClickHandler}
            className="p-2 cursor-pointer rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200"
            title={title || "Answer Call"}
          >
            <BsFillTelephoneFill className="text-white text-xl" />
          </button>
        );
      }

      case "receivingCallPulsating": {
        return (
          <button
            onClick={onClickHandler}
            className="p-2 cursor-pointer rounded-full transition-colors duration-200"
            title={title || "Answer Call"}
          >
            <BsFillTelephoneFill className="text-green-400 text-xl animate-pulse" />
          </button>
        );
      }

      default: {
        return null;
      }
    }
  };

  return <>{_renderBtnType()}</>;
};

export default CallButtons;
