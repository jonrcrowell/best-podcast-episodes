import clsx from "clsx";

const Entry = ({
  isFirst,
  isLast,
  isReleased,
  hasVoted,
  upvote,
  title,
  score,
}) => {
  return (
    <div
      className={clsx(
        "p-6 mx-8 flex items-center border-t border-l border-r",
        isFirst && "rounded-t-md",
        isLast && "border-b rounded-b-md"
      )}
    >
      <button
        className={clsx(
          "ring-1 ring-gray-200 rounded-full w-8 min-w-[2rem] h-8 mr-4 focus:outline-none focus:ring focus:ring-blue-300",
          (isReleased || hasVoted) &&
            "bg-green-100 cursor-not-allowed ring-green-300"
        )}
        disabled={isReleased || hasVoted}
        onClick={upvote}
      >
        {isReleased ? "✅" : "👍"}
      </button>
      <h3 className="text font-semibold w-full text-left">{title}</h3>
      <div className="bg-gray-200 text-gray-700 text-sm rounded-xl px-2 ml-2">
        {score}
      </div>
    </div>
  );
};

export default Entry;
