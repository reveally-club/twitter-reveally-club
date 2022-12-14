import { SetStateAction, useState } from "react";
import { Identify, track } from "@amplitude/analytics-browser";
import Layout from "../components/layout";
import SliceCard from "../components/slice-card";

export default function Home() {
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState("");
  const [slice, setSlice] = useState<string[]>([]);

  const handleMessageChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setMessage(event.target.value);
  };

  const sliceContent = () => {
    const result: string[] = [];
    const len = message.split("").length / 140;
    for (let i = 0; i <= len; i++) {
      const content = message.substring(i * 140, i === 0 ? 140 : (i + 1) * 140);
      result.push(content);
    }

    const eventProperties = {
      "Content Length": message.length,
      "Sliced Thread Count": len,
    };

    setUserCount(userCount + 1);
    new Identify().set("Slice Count", userCount)
    track("Click Project Information", eventProperties);

    setSlice(result);
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-1">Slice Twitter Content</h2>
      <p className="text-sm mb-4">
        It is a utility that cuts long sentences into 140 characters to fit
        Twitter.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <button
            className="w-full mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={sliceContent}
          >
            Slice
          </button>
          <textarea
            id="message"
            rows={4}
            name="message"
            value={message}
            onChange={handleMessageChange}
            className="w-full min-h-screen block p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your content..."
          />
        </div>
        <div className="flex flex-col gap-4 w-full overflow-scroll ">
          {slice.map((data, index) => {
            return <SliceCard key={index} index={index} text={data} />;
          })}
        </div>
      </div>
    </Layout>
  );
}
