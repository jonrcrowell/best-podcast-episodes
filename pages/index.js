import { useState, useRef } from "react";
import Head from "next/head";
import clsx from "clsx";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import redis from "../lib/redis";
import { ImHeadphones } from "react-icons/im";
import Entry from "../components/Entry";

const fetcher = (url) => fetch(url).then((res) => res.json());

function LoadingSpinner({ invert }) {
  return (
    <svg
      className={clsx(
        "animate-spin h-5 w-5 text-gray-900 dark:text-gray-100",
        invert && "text-gray-100 dark:text-gray-900"
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function Item({ isFirst, isLast, isReleased, hasVoted, entry }) {
  const upvote = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/vote", {
      body: JSON.stringify({
        id: entry.id,
        title: entry.title,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    if (error) {
      return toast.error(error);
    }

    mutate("/api/features");
  };

  return (
    <Entry
      isFirst={isFirst}
      isLast={isLast}
      isReleased={isReleased}
      hasVoted={hasVoted}
      upvote={upvote}
      podcast={entry.podcast}
      title={entry.title}
      description={entry.description}
      score={entry.score}
    ></Entry>
  );
}

export default function Roadmap({ episodes, ip }) {
  const [isCreateLoading, setCreateLoading] = useState(false);
  const [isEmailLoading, setEmailLoading] = useState(false);
  const episodeInputRef = useRef(null);
  const podcastInputRef = useRef(null);
  const episodeDescriptionInputRef = useRef(null);
  const subscribeInputRef = useRef(null);

  const { data, error } = useSWR("/api/features", fetcher, {
    initialData: { episodes },
  });

  if (error) {
    toast.error(error);
  }

  const addEpisode = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    const res = await fetch("/api/create", {
      body: JSON.stringify({
        type: "episode",
        title: episodeInputRef.current.value,
        podcast: podcastInputRef.current.value,
        link: "link to this",
        description: episodeDescriptionInputRef.current.value,
        rating: 5,
        genre: "genre",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    setCreateLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    mutate("/api/features");
    episodeInputRef.current.value = "";
    podcastInputRef.current.value = "";
    episodeDescriptionInputRef.current.value = "";
  };

  const subscribe = async (e) => {
    e.preventDefault();
    setEmailLoading(true);

    const res = await fetch("/api/subscribe", {
      body: JSON.stringify({
        email: subscribeInputRef.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    setEmailLoading(false);

    if (error) {
      return toast.error(error);
    }

    toast.success(
      "You are subscribed. We will periodically send out a list of new episodes. Periodically = once a month max."
    );
    subscribeInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Best Podcast Episodes</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <div className="flex justify-center items-center w-16 sm:w-24 h-16 sm:h-24 my-8">
          <h3>
            <ImHeadphones color="tomato" size="8rem" />
          </h3>
        </div>
        <div className="max-w-4xl p-8">
          <h1 className="text-lg sm:text-2xl font-bold mb-2">
            My favorite podcast episodes
          </h1>
          <h2 className="text-md sm:text-xl mx-4">
            Add your favorite episodes and vote. I'm always looking for good
            suggestions. I mostly listen to these on 2x to enjoyably get through
            as many as I can.
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
          <div className="mx-8 w-full">
            <form
              className="flex flex-col relative my-8 p-8 border border-gray-200 rounded-md"
              onSubmit={addEpisode}
            >
              <input
                ref={episodeInputRef}
                aria-label="Episode"
                placeholder="Favorite podcast name and episode number..."
                type="text"
                maxLength={150}
                required
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                ref={podcastInputRef}
                aria-label="Podcast"
                placeholder="What podcast was the episode on?"
                type="text"
                maxLength={150}
                required
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                ref={episodeDescriptionInputRef}
                aria-label="What made this so good?"
                placeholder="Tell me why you recommend this, Twitter-style"
                type="text"
                maxLength={150}
                required
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                className="mt-2 self-end flex items-center justify-center px-4 h-10 text-lg border bg-black text-white rounded-md w-24 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800"
                type="submit"
              >
                {isCreateLoading ? <LoadingSpinner invert /> : "Add"}
              </button>
            </form>
          </div>
          <div className="w-full">
            {data.episodes.map((episode, index) => (
              <Item
                key={index}
                isFirst={index === 0}
                isLast={index === data.episodes.length - 1}
                isReleased={false}
                hasVoted={episode.ip === ip}
                entry={episode}
              />
            ))}
          </div>
          <hr className="border-1 border-gray-200 my-8 mx-8 w-full" />
          <div className="mx-8 w-full">
            <p className="flex text-gray-500">
              Leave your email address here to be notified of new favorite
              episodes.
            </p>
            <form className="relative my-4" onSubmit={subscribe}>
              <input
                ref={subscribeInputRef}
                aria-label="Email for new episodes"
                placeholder="Email Address"
                type="email"
                autoComplete="email"
                maxLength={60}
                required
                className="px-3 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                className="flex items-center justify-center absolute right-2 top-2 px-4 h-10 border border-gray-200 text-gray-900 rounded-md w-14 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-100"
                type="submit"
              >
                {isEmailLoading ? <LoadingSpinner /> : "OK"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const ip =
    req.headers["x-forwarded-for"] || req.headers["Remote_Addr"] || "NA";
  const episodes = (await redis.hvals("episode"))
    .map((entry) => JSON.parse(entry))
    .sort((a, b) => {
      // Primary sort is score
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;

      // Secondary sort is title
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;

      return 1;
    });

  return { props: { episodes, ip } };
}
